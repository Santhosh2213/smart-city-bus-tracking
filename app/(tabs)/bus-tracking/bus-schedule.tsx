// app/(tabs)/bus-tracking/bus-schedule.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
  Modal,
  Share,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALL_BUS_SCHEDULES, TAMILNADU_CITIES, getBusesByRoute, BusSchedule } from '../../../src/services/tamilnaduBusData';

const BusScheduleScreen: React.FC = () => {
  const params = useLocalSearchParams<{ from?: string; to?: string }>();
  
  const [searchData, setSearchData] = useState({
    from: params.from || '',
    to: params.to || '',
    time: ''
  });
  
  const [filteredSchedules, setFilteredSchedules] = useState<BusSchedule[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'express' | 'ac' | 'cheapest'>('all');
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState<BusSchedule | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);
  const [modalInputType, setModalInputType] = useState<'from' | 'to'>('from');
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    console.log('Params received:', params);
    console.log('Search data:', searchData);
    
    if (params.from && params.to) {
      console.log('Auto-searching with:', params.from, '->', params.to);
      handleRouteSearch(params.from, params.to);
    }
  }, [params]);

  const handleRouteSearch = (from: string, to: string) => {
    console.log('Searching route:', from, '->', to);
    
    if (!from || !to) {
      Alert.alert('Error', 'Please enter both from and to locations');
      setDebugInfo(`Error: Missing ${!from ? 'From' : 'To'} location`);
      return;
    }

    const normalizedFrom = from.trim();
    const normalizedTo = to.trim();

    const fromValid = TAMILNADU_CITIES.some(city => 
      city.toLowerCase() === normalizedFrom.toLowerCase()
    );
    
    const toValid = TAMILNADU_CITIES.some(city => 
      city.toLowerCase() === normalizedTo.toLowerCase()
    );

    if (!fromValid) {
      Alert.alert('Invalid City', `${from} is not in Tamil Nadu`);
      setDebugInfo(`Invalid from city: ${from}`);
      return;
    }

    if (!toValid) {
      Alert.alert('Invalid City', `${to} is not in Tamil Nadu`);
      setDebugInfo(`Invalid to city: ${to}`);
      return;
    }

    if (normalizedFrom === normalizedTo) {
      Alert.alert('Error', 'From and To locations cannot be same');
      setDebugInfo(`Same cities: ${from} = ${to}`);
      return;
    }

    const filtered = getBusesByRoute(normalizedFrom, normalizedTo);
    
    console.log('Filtered buses found:', filtered.length);
    console.log('Available buses:', filtered);
    
    setFilteredSchedules(filtered);
    setSearchData({ from: normalizedFrom, to: normalizedTo, time: '' });
    
    setDebugInfo(`Searched: ${normalizedFrom} → ${normalizedTo}, Found: ${filtered.length} buses`);
    
    if (filtered.length === 0) {
      Alert.alert('No Buses Found', 
        `Sorry, no buses found for ${normalizedFrom} → ${normalizedTo}.\nTry different cities or check back later.`
      );
    }
  };

  const handleSearch = () => {
    console.log('Manual search triggered');
    handleRouteSearch(searchData.from, searchData.to);
  };

  const handleFilter = (filter: 'all' | 'express' | 'ac' | 'cheapest') => {
    setActiveFilter(filter);
    
    let filtered = [...filteredSchedules];
    
    console.log('Applying filter:', filter, 'on', filtered.length, 'buses');
    
    switch (filter) {
      case 'express':
        filtered = filtered.filter(schedule => schedule.busType === 'Express');
        break;
      case 'ac':
        filtered = filtered.filter(schedule => 
          schedule.busType === 'AC' || schedule.busType === 'Deluxe' || schedule.busType === 'Sleeper'
        );
        break;
      case 'cheapest':
        filtered = filtered.sort((a, b) => {
          const priceA = parseInt(a.ticketPrice.replace('₹', '').replace(',', ''));
          const priceB = parseInt(b.ticketPrice.replace('₹', '').replace(',', ''));
          return priceA - priceB;
        });
        break;
      default:
        if (searchData.from && searchData.to) {
          filtered = getBusesByRoute(searchData.from, searchData.to);
        }
    }
    
    console.log('After filter:', filtered.length, 'buses');
    setFilteredSchedules(filtered);
  };

  const showAvailableRoutes = () => {
    const routes = new Set<string>();
    ALL_BUS_SCHEDULES.forEach(bus => {
      routes.add(`${bus.source} → ${bus.destination}`);
    });
    
    const routesArray = Array.from(routes);
    Alert.alert(
      'Available Routes',
      routesArray.join('\n'),
      [{ text: 'OK' }]
    );
  };

  const testSearch = () => {
    handleRouteSearch('Chennai', 'Ooty');
  };

  // Working Set Reminder Function
  const handleSetReminder = async (schedule: BusSchedule) => {
    try {
      // Store reminder in AsyncStorage
      const reminderKey = `bus_reminder_${schedule.id}_${Date.now()}`;
      const reminderData = {
        id: schedule.id,
        route: schedule.route,
        from: schedule.source,
        to: schedule.destination,
        departureTime: schedule.departureTime,
        busNumber: schedule.busNumber,
        setTime: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(reminderKey, JSON.stringify(reminderData));
      
      // Calculate reminder time (15 minutes before departure)
      const [hours, minutes] = schedule.departureTime.split(':').map(Number);
      const departureDate = new Date();
      departureDate.setHours(hours, minutes, 0, 0);
      const reminderTime = new Date(departureDate.getTime() - 15 * 60 * 1000);
      
      Alert.alert(
        '✅ Reminder Set Successfully',
        `You will be reminded at ${reminderTime.getHours()}:${reminderTime.getMinutes().toString().padStart(2, '0')} for:\n\n` +
        `🚌 ${schedule.route}\n` +
        `📍 ${schedule.source} → ${schedule.destination}\n` +
        `🕐 Departure: ${schedule.departureTime}\n\n` +
        `Reminder set for 15 minutes before departure.`,
        [
          { 
            text: 'View All Reminders', 
            onPress: async () => {
              try {
                const keys = await AsyncStorage.getAllKeys();
                const reminderKeys = keys.filter(key => key.startsWith('bus_reminder_'));
                const reminders = await AsyncStorage.multiGet(reminderKeys);
                
                if (reminders.length === 0) {
                  Alert.alert('Your Reminders', 'No reminders set yet.');
                  return;
                }
                
                const reminderList = reminders.map(([key, value]) => {
                  const data = JSON.parse(value || '{}');
                  return `• ${data.route} (${data.departureTime})`;
                }).join('\n');
                
                Alert.alert('Your Reminders', reminderList);
              } catch (error) {
                Alert.alert('Error', 'Failed to load reminders.');
              }
            }
          },
          { text: 'OK', style: 'default' }
        ]
      );
      
      console.log('Reminder set for:', schedule.route);
    } catch (error) {
      console.error('Error setting reminder:', error);
      Alert.alert('Error', 'Failed to set reminder. Please try again.');
    }
  };

  const handleBookTicket = (schedule: BusSchedule) => {
    Alert.alert(
      'Book Ticket',
      `Proceed to book ${schedule.route}?\n${schedule.source} → ${schedule.destination}\nDeparture: ${schedule.departureTime}\nPrice: ${schedule.ticketPrice}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: async () => {
            // Simulate booking process
            const bookingId = `BOOK${Date.now()}`.slice(0, 10);
            Alert.alert(
              '🎉 Booking Confirmed!',
              `Booking ID: ${bookingId}\n\n` +
              `🚌 ${schedule.route}\n` +
              `📍 ${schedule.source} → ${schedule.destination}\n` +
              `🕐 ${schedule.departureTime}\n` +
              `💰 ${schedule.ticketPrice}\n\n` +
              `Seat: ${schedule.seatAvailability}/${schedule.totalSeats}\n\n` +
              `A confirmation will be sent to your email.`,
              [
                {
                  text: 'View Ticket QR',
                  onPress: () => {
                    setSelectedBus(schedule);
                    setShowQRModal(true);
                  }
                },
                { text: 'OK', style: 'default' }
              ]
            );
          }
        },
      ]
    );
  };

  // Working View Details Function
  const handleViewDetails = (schedule: BusSchedule) => {
    Alert.alert(
      '🚌 Bus Details',
      `Route: ${schedule.route}\n\n` +
      `Bus Number: ${schedule.busNumber}\n` +
      `Type: ${schedule.busType}\n` +
      `Status: ${schedule.status}\n\n` +
      `📍 ${schedule.source} → ${schedule.destination}\n` +
      `🕐 ${schedule.departureTime} - ${schedule.arrivalTime}\n` +
      `⏱️ Travel Time: ${schedule.travelTime}\n` +
      `📏 Distance: ${schedule.totalDistance}\n\n` +
      `💰 Ticket Price: ${schedule.ticketPrice}\n` +
      `🎟️ Seats Available: ${schedule.seatAvailability}/${schedule.totalSeats}\n` +
      `🔄 Next Departure: ${schedule.nextDeparture}\n` +
      `📊 Popularity: ${schedule.popularity}\n\n` +
      `Amenities:\n${schedule.amenities.map(a => `• ${a}`).join('\n')}`,
      [
        {
          text: 'Book This Bus',
          style: 'default',
          onPress: () => handleBookTicket(schedule)
        },
        {
          text: 'Set Reminder',
          onPress: () => handleSetReminder(schedule)
        },
        {
          text: 'View Ticket QR',
          onPress: () => {
            setSelectedBus(schedule);
            setShowQRModal(true);
          }
        },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  // Working QR Function
  const handleShowQR = (schedule: BusSchedule) => {
    setSelectedBus(schedule);
    setShowQRModal(true);
  };

  const handleShareQR = async () => {
    if (selectedBus) {
      try {
        const shareText = 
          `🚌 Bus Ticket Details\n\n` +
          `Route: ${selectedBus.route}\n` +
          `Bus No: ${selectedBus.busNumber}\n` +
          `From: ${selectedBus.source}\n` +
          `To: ${selectedBus.destination}\n` +
          `Time: ${selectedBus.departureTime}\n` +
          `Price: ${selectedBus.ticketPrice}\n` +
          `Seats: ${selectedBus.seatAvailability}/${selectedBus.totalSeats}\n\n` +
          `Ticket ID: TKT${Date.now().toString().slice(-8)}`;
        
        // Use React Native's Share API instead of Clipboard
        await Share.share({
          message: shareText,
          title: 'Bus Ticket Details'
        });
        
      } catch (error) {
        console.error('Error sharing:', error);
        Alert.alert('Error', 'Failed to share details');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return '#4CAF50';
      case 'delayed': return '#FF9800';
      case 'cancelled': return '#F44336';
      default: return '#2196F3';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-time': return 'On Time';
      case 'delayed': return 'Delayed';
      case 'cancelled': return 'Cancelled';
      default: return 'Scheduled';
    }
  };

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case 'High': return '#FF5252';
      case 'Medium': return '#FF9800';
      case 'Low': return '#4CAF50';
      default: return '#757575';
    }
  };

  const openCityModal = (inputType: 'from' | 'to') => {
    setModalInputType(inputType);
    setShowCityModal(true);
  };

  const handleCitySelect = (city: string) => {
    setSearchData(prev => ({ ...prev, [modalInputType]: city }));
    setShowCityModal(false);
  };

  const CityModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showCityModal}
      onRequestClose={() => setShowCityModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Tamil Nadu City</Text>
            <TouchableOpacity 
              onPress={() => setShowCityModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#291C0E" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.cityList}>
            {TAMILNADU_CITIES.map((city, index) => (
              <TouchableOpacity
                key={index}
                style={styles.cityItem}
                onPress={() => handleCitySelect(city)}
              >
                <Ionicons name="location-outline" size={20} color="#6E473B" />
                <Text style={styles.cityText}>{city}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const QRModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showQRModal}
      onRequestClose={() => setShowQRModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.qrModalContainer}>
          <View style={styles.qrModalHeader}>
            <Text style={styles.qrModalTitle}>🎫 Digital Bus Ticket</Text>
            <TouchableOpacity 
              onPress={() => setShowQRModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#291C0E" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.qrContent}>
            {selectedBus && (
              <>
                <View style={styles.qrCodeBox}>
                  <Text style={styles.qrCodeTitle}>BUS TICKET QR CODE</Text>
                  <View style={styles.qrPatternContainer}>
                    {/* QR Pattern */}
                    <View style={styles.qrPattern}>
                      <View style={styles.qrRow}>
                        <View style={[styles.qrCell, styles.qrCellFilled]} />
                        <View style={[styles.qrCell, styles.qrCellFilled]} />
                        <View style={[styles.qrCell, styles.qrCellFilled]} />
                        <View style={[styles.qrCell, styles.qrCellFilled]} />
                        <View style={[styles.qrCell, styles.qrCellFilled]} />
                      </View>
                      <View style={styles.qrRow}>
                        <View style={[styles.qrCell, styles.qrCellFilled]} />
                        <View style={styles.qrCell} />
                        <View style={styles.qrCell} />
                        <View style={styles.qrCell} />
                        <View style={[styles.qrCell, styles.qrCellFilled]} />
                      </View>
                      <View style={styles.qrRow}>
                        <View style={[styles.qrCell, styles.qrCellFilled]} />
                        <View style={styles.qrCell} />
                        <View style={[styles.qrCell, styles.qrCellFilled]} />
                        <View style={styles.qrCell} />
                        <View style={[styles.qrCell, styles.qrCellFilled]} />
                      </View>
                      <View style={styles.qrRow}>
                        <View style={[styles.qrCell, styles.qrCellFilled]} />
                        <View style={styles.qrCell} />
                        <View style={styles.qrCell} />
                        <View style={styles.qrCell} />
                        <View style={[styles.qrCell, styles.qrCellFilled]} />
                      </View>
                      <View style={styles.qrRow}>
                        <View style={[styles.qrCell, styles.qrCellFilled]} />
                        <View style={[styles.qrCell, styles.qrCellFilled]} />
                        <View style={[styles.qrCell, styles.qrCellFilled]} />
                        <View style={[styles.qrCell, styles.qrCellFilled]} />
                        <View style={[styles.qrCell, styles.qrCellFilled]} />
                      </View>
                    </View>
                  </View>
                  <Text style={styles.qrTicketId}>
                    TICKET ID: TKT{Date.now().toString().slice(-8)}
                  </Text>
                </View>
                
                <View style={styles.busInfoQR}>
                  <View style={styles.infoRow}>
                    <Ionicons name="bus" size={20} color="#6E473B" />
                    <Text style={styles.infoLabel}>Route:</Text>
                    <Text style={styles.infoValue}>{selectedBus.route}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Ionicons name="document-text" size={20} color="#6E473B" />
                    <Text style={styles.infoLabel}>Bus No:</Text>
                    <Text style={styles.infoValue}>{selectedBus.busNumber}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Ionicons name="location" size={20} color="#6E473B" />
                    <Text style={styles.infoLabel}>From:</Text>
                    <Text style={styles.infoValue}>{selectedBus.source}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Ionicons name="navigate" size={20} color="#6E473B" />
                    <Text style={styles.infoLabel}>To:</Text>
                    <Text style={styles.infoValue}>{selectedBus.destination}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Ionicons name="time" size={20} color="#6E473B" />
                    <Text style={styles.infoLabel}>Departure:</Text>
                    <Text style={styles.infoValue}>{selectedBus.departureTime}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Ionicons name="people" size={20} color="#6E473B" />
                    <Text style={styles.infoLabel}>Seat:</Text>
                    <Text style={styles.infoValue}>{selectedBus.seatAvailability}/{selectedBus.totalSeats}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Ionicons name="cash" size={20} color="#6E473B" />
                    <Text style={styles.infoLabel}>Price:</Text>
                    <Text style={[styles.infoValue, styles.priceHighlight]}>{selectedBus.ticketPrice}</Text>
                  </View>
                </View>
                
                <Text style={styles.qrInstructions}>
                  📱 Show this digital ticket to the conductor for boarding\n
                  🎫 Valid for travel on selected date\n
                  ⚠️ Please arrive at least 15 minutes before departure
                </Text>
                
                <View style={styles.qrActions}>
                  <TouchableOpacity 
                    style={styles.qrSaveButton}
                    onPress={handleShareQR}
                  >
                    <Ionicons name="share-outline" size={20} color="#E1D4C2" />
                    <Text style={styles.qrSaveText}>Share Ticket</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.qrCloseButton}
                    onPress={() => setShowQRModal(false)}
                  >
                    <Text style={styles.qrCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const BusScheduleCard: React.FC<{ schedule: BusSchedule }> = ({ schedule }) => {
    const seatPercentage = (schedule.seatAvailability / schedule.totalSeats) * 100;
    const seatColor = seatPercentage > 50 ? '#10B981' : seatPercentage > 20 ? '#F59E0B' : '#EF4444';

    return (
      <View style={styles.scheduleCard}>
        <View style={styles.cardHeader}>
          <View style={styles.routeInfo}>
            <Text style={styles.routeName}>{schedule.route}</Text>
            <Text style={styles.busNumber}>{schedule.busNumber}</Text>
            <View style={[styles.busTypeBadge, { backgroundColor: getStatusColor(schedule.status) }]}>
              <Text style={styles.busTypeText}>{schedule.busType}</Text>
            </View>
          </View>
          <View style={styles.statusSection}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(schedule.status) }]}>
              <Text style={styles.statusText}>{getStatusText(schedule.status)}</Text>
            </View>
            <View style={[styles.popularityBadge, { backgroundColor: getPopularityColor(schedule.popularity) }]}>
              <Text style={styles.popularityText}>{schedule.popularity}</Text>
            </View>
          </View>
        </View>

        <View style={styles.routeTimeline}>
          <View style={styles.timelineSegment}>
            <Text style={styles.timelineTime}>{schedule.departureTime}</Text>
            <Text style={styles.timelinePlace}>{schedule.source}</Text>
          </View>
          
          <View style={styles.timelineMiddle}>
            <View style={styles.timelineLine} />
            <View style={styles.travelInfo}>
              <Text style={styles.travelTime}>{schedule.travelTime}</Text>
              <Text style={styles.travelDistance}>{schedule.totalDistance}</Text>
            </View>
            <View style={styles.timelineLine} />
          </View>
          
          <View style={styles.timelineSegment}>
            <Text style={styles.timelineTime}>{schedule.arrivalTime}</Text>
            <Text style={styles.timelinePlace}>{schedule.destination}</Text>
          </View>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#6E473B" />
            <Text style={styles.detailLabel}>Next Bus</Text>
            <Text style={styles.detailValue}>{schedule.nextDeparture}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="repeat-outline" size={16} color="#6E473B" />
            <Text style={styles.detailLabel}>Frequency</Text>
            <Text style={styles.detailValue}>{schedule.frequency}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={16} color="#6E473B" />
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>{schedule.ticketPrice}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={16} color="#6E473B" />
            <Text style={styles.detailLabel}>Seats</Text>
            <Text style={[styles.detailValue, { color: seatColor }]}>
              {schedule.seatAvailability}/{schedule.totalSeats}
            </Text>
          </View>
        </View>

        <View style={styles.amenitiesSection}>
          <Text style={styles.amenitiesLabel}>Amenities:</Text>
          <View style={styles.amenitiesList}>
            {schedule.amenities.map((amenity: string, index: number) => (
              <View key={index} style={styles.amenityBadge}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={styles.qrButton}
            onPress={() => handleShowQR(schedule)}
          >
            <Ionicons name="qr-code-outline" size={18} color="#6E473B" />
            <Text style={styles.qrButtonText}>View Ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.reminderButton}
            onPress={() => handleSetReminder(schedule)}
          >
            <Ionicons name="notifications-outline" size={18} color="#6E473B" />
            <Text style={styles.reminderButtonText}>Remind</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => handleViewDetails(schedule)}
          >
            <Ionicons name="information-circle-outline" size={18} color="#6E473B" />
            <Text style={styles.detailsButtonText}>Details</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => handleBookTicket(schedule)}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#291C0E" />
      <CityModal />
      <QRModal />

      {__DEV__ && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>{debugInfo || 'No search yet'}</Text>
          <TouchableOpacity onPress={testSearch} style={styles.debugButton}>
            <Text style={styles.debugButtonText}>Test: Chennai → Ooty</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={showAvailableRoutes} style={styles.debugButton}>
            <Text style={styles.debugButtonText}>Show All Routes</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <LinearGradient
        colors={['#291C0E', '#6E473B']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#E1D4C2" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Bus Schedule</Text>
            <Text style={styles.headerSubtitle}>
              {searchData.from && searchData.to ? 
                `${searchData.from} → ${searchData.to}` : 
                'Find your perfect route'}
            </Text>
          </View>
          <View style={styles.headerPlaceholder} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Plan Your Journey</Text>
          
          <View style={styles.searchContainer}>
            <TouchableOpacity 
              style={styles.inputWrapper}
              onPress={() => openCityModal('from')}
            >
              <View style={styles.inputGroup}>
                <Ionicons name="location-outline" size={20} color="#6E473B" style={styles.inputIcon} />
                <Text style={[styles.input, !searchData.from && styles.inputPlaceholder]}>
                  {searchData.from || 'From location'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.inputWrapper}
              onPress={() => openCityModal('to')}
            >
              <View style={styles.inputGroup}>
                <Ionicons name="navigate-outline" size={20} color="#6E473B" style={styles.inputIcon} />
                <Text style={[styles.input, !searchData.to && styles.inputPlaceholder]}>
                  {searchData.to || 'To location'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Ionicons name="search" size={20} color="#291C0E" />
              <Text style={styles.searchButtonText}>Find Buses</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>Quick Filters</Text>
          <View style={styles.filtersContainer}>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === 'all' && styles.filterButtonActive]}
              onPress={() => handleFilter('all')}
            >
              <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
                All Buses
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === 'express' && styles.filterButtonActive]}
              onPress={() => handleFilter('express')}
            >
              <Text style={[styles.filterText, activeFilter === 'express' && styles.filterTextActive]}>
                Express
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === 'ac' && styles.filterButtonActive]}
              onPress={() => handleFilter('ac')}
            >
              <Text style={[styles.filterText, activeFilter === 'ac' && styles.filterTextActive]}>
                AC Only
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === 'cheapest' && styles.filterButtonActive]}
              onPress={() => handleFilter('cheapest')}
            >
              <Text style={[styles.filterText, activeFilter === 'cheapest' && styles.filterTextActive]}>
                Cheapest
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.schedulesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Schedules</Text>
            <Text style={styles.sectionSubtitle}>
              {filteredSchedules.length} buses found for {searchData.from} → {searchData.to}
            </Text>
          </View>
          
          <View style={styles.schedulesList}>
            {filteredSchedules.map((schedule) => (
              <BusScheduleCard key={schedule.id} schedule={schedule} />
            ))}
            
            {filteredSchedules.length === 0 && searchData.from && searchData.to && (
              <View style={styles.noResults}>
                <Ionicons name="search-outline" size={48} color="#BEB5A9" />
                <Text style={styles.noResultsText}>No buses found</Text>
                <Text style={styles.noResultsSubtext}>
                  No buses available for {searchData.from} → {searchData.to}
                </Text>
                <Text style={styles.noResultsSubtext}>
                  Try different cities or check back later
                </Text>
              </View>
            )}

            {!searchData.from || !searchData.to ? (
              <View style={styles.noResults}>
                <Ionicons name="location-outline" size={48} color="#BEB5A9" />
                <Text style={styles.noResultsText}>Select Cities</Text>
                <Text style={styles.noResultsSubtext}>
                  Please select From and To cities to see bus schedules
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F0',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(110, 71, 59, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E1D4C2',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(225, 212, 194, 0.9)',
    marginTop: 4,
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  searchSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginTop: -10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#291C0E',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6E473B',
    fontWeight: '400',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  searchContainer: {
    gap: 16,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F8F5F0',
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#291C0E',
    height: 56,
    lineHeight: 56,
    paddingVertical: 0,
  },
  inputPlaceholder: {
    color: '#6E473B',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1D4C2',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    elevation: 4,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginTop: 8,
  },
  searchButtonText: {
    color: '#291C0E',
    fontSize: 16,
    fontWeight: '600',
  },
  filtersSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8F5F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  filterButtonActive: {
    backgroundColor: '#E1D4C2',
    borderColor: '#6E473B',
  },
  filterText: {
    fontSize: 14,
    color: '#6E473B',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#291C0E',
    fontWeight: '600',
  },
  schedulesSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  schedulesList: {
    gap: 16,
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
    elevation: 2,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#291C0E',
    marginBottom: 4,
  },
  busNumber: {
    fontSize: 14,
    color: '#6E473B',
    marginBottom: 8,
  },
  busTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  busTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#291C0E',
  },
  statusSection: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#291C0E',
  },
  popularityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  popularityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#291C0E',
  },
  routeTimeline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timelineSegment: {
    flex: 1,
  },
  timelineTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#291C0E',
    marginBottom: 4,
  },
  timelinePlace: {
    fontSize: 14,
    color: '#6E473B',
  },
  timelineMiddle: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  timelineLine: {
    width: 2,
    height: 10,
    backgroundColor: '#E1D4C2',
  },
  travelInfo: {
    alignItems: 'center',
    marginVertical: 4,
  },
  travelTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6E473B',
    marginBottom: 2,
  },
  travelDistance: {
    fontSize: 10,
    color: '#6E473B',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6E473B',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#291C0E',
  },
  amenitiesSection: {
    marginBottom: 16,
  },
  amenitiesLabel: {
    fontSize: 14,
    color: '#6E473B',
    fontWeight: '600',
    marginBottom: 8,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityBadge: {
    backgroundColor: '#F8F5F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  amenityText: {
    fontSize: 10,
    color: '#6E473B',
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  qrButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
    backgroundColor: '#F8F5F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  qrButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6E473B',
  },
  reminderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
    backgroundColor: '#F8F5F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  reminderButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6E473B',
  },
  detailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
    backgroundColor: '#F8F5F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6E473B',
  },
  bookButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#6E473B',
    borderRadius: 8,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E1D4C2',
  },
  noResults: {
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6E473B',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#6E473B',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(41, 28, 14, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 141, 120, 0.2)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#291C0E',
  },
  modalCloseButton: {
    padding: 4,
  },
  cityList: {
    maxHeight: 400,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 141, 120, 0.1)',
    gap: 12,
  },
  cityText: {
    fontSize: 16,
    color: '#291C0E',
    fontWeight: '400',
  },
  qrModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  qrModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 141, 120, 0.2)',
  },
  qrModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#291C0E',
  },
  qrContent: {
    padding: 24,
  },
  qrCodeBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6E473B',
    alignItems: 'center',
    marginBottom: 20,
  },
  qrCodeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#291C0E',
    marginBottom: 16,
    letterSpacing: 1,
  },
  qrPatternContainer: {
    marginBottom: 16,
  },
  qrPattern: {
    alignItems: 'center',
  },
  qrRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  qrCell: {
    width: 12,
    height: 12,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#6E473B',
  },
  qrCellFilled: {
    backgroundColor: '#291C0E',
  },
  qrTicketId: {
    fontSize: 12,
    color: '#6E473B',
    fontWeight: '600',
    marginTop: 12,
  },
  busInfoQR: {
    backgroundColor: '#F8F5F0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6E473B',
    fontWeight: '600',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#291C0E',
    fontWeight: '500',
    flex: 1,
  },
  priceHighlight: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  qrInstructions: {
    fontSize: 14,
    color: '#6E473B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    backgroundColor: '#F8F5F0',
    padding: 16,
    borderRadius: 8,
  },
  qrActions: {
    gap: 12,
  },
  qrSaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#6E473B',
    borderRadius: 12,
  },
  qrSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E1D4C2',
  },
  qrCloseButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F8F5F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  qrCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6E473B',
  },
  debugInfo: {
    backgroundColor: '#FFE4C4',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FFB347',
  },
  debugText: {
    fontSize: 12,
    color: '#8B4513',
    fontFamily: 'monospace',
  },
  debugButton: {
    backgroundColor: '#6E473B',
    padding: 6,
    borderRadius: 4,
    marginTop: 4,
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default BusScheduleScreen;