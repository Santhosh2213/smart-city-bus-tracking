// app/(tabs)/bus-tracking/bus-details.tsx - CLEAN VERSION
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
  Share,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  ALL_BUS_SCHEDULES, 
  getBusByQRCode,
  type BusSchedule 
} from '../../../src/services/tamilnaduBusData';

const BusDetailsScreen: React.FC = () => {
  const params = useLocalSearchParams<{ busId?: string; qrData?: string; from?: string; to?: string }>();
  
  const [bus, setBus] = useState<BusSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertSet, setAlertSet] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);

  useEffect(() => {
    loadBusData();
  }, [params]);

  const loadBusData = () => {
    setLoading(true);
    
    try {
      let foundBus: BusSchedule | undefined;
      
      // Check if QR data is provided
      if (params.qrData) {
        foundBus = getBusByQRCode(params.qrData);
      }
      
      // If no bus found by QR, try by ID
      if (!foundBus && params.busId) {
        foundBus = ALL_BUS_SCHEDULES.find(b => b.id === params.busId);
      }
      
      // If still no bus found, use the first bus as fallback
      if (!foundBus) {
        foundBus = ALL_BUS_SCHEDULES[0];
      }
      
      setBus(foundBus);
    } catch (error) {
      console.error('Error loading bus data:', error);
      Alert.alert('Error', 'Failed to load bus details');
    } finally {
      setLoading(false);
    }
  };

  const handleSetAlert = () => {
    if (!bus) return;
    
    setAlertSet(true);
    Alert.alert(
      'Alert Set',
      `You will be notified when ${bus.route} is 10 minutes away`
    );
  };

  const handleShareBus = async () => {
    if (!bus) return;
    
    try {
      await Share.share({
        message: `Check out ${bus.route} bus! ${bus.source} to ${bus.destination}. Departure: ${bus.departureTime}, Arrival: ${bus.arrivalTime}. Ticket: ${bus.ticketPrice}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share bus information');
    }
  };

  const handleToggleFavorite = () => {
    if (!bus) return;
    
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      `${bus.route} ${isFavorite ? 'removed from' : 'added to'} your favorites`
    );
  };

  const handleBookNow = () => {
    if (!bus) return;
    
    Alert.alert(
      'Book Ticket',
      `Proceed to book ${bus.route}?\n${bus.source} → ${bus.destination}\nDeparture: ${bus.departureTime}\nPrice: ${bus.ticketPrice}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => {
          Alert.alert('Success', `Booking confirmed for ${bus.route}`);
        }},
      ]
    );
  };

  const handleShowTicket = () => {
    setShowTicketModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return '#E1D4C2';
      case 'delayed': return '#F8D7C2';
      case 'cancelled': return '#F8C2C2';
      default: return '#BEB5A9';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-time': return 'On Time';
      case 'delayed': return 'Delayed (15 min)';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getSeatAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return '#10B981'; // Green
    if (percentage > 20) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#291C0E" />
        <View style={styles.loadingContainer}>
          <Ionicons name="bus" size={48} color="#6E473B" />
          <Text style={styles.loadingText}>Loading bus details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!bus) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#291C0E" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#6E473B" />
          <Text style={styles.errorText}>Bus not found</Text>
          <TouchableOpacity 
            style={styles.backButtonError}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Ticket Modal Component
  const TicketModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showTicketModal}
      onRequestClose={() => setShowTicketModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.ticketModalContainer}>
          <View style={styles.ticketModalHeader}>
            <Text style={styles.ticketModalTitle}>Digital Ticket</Text>
            <TouchableOpacity 
              onPress={() => setShowTicketModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#291C0E" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.ticketContent}>
            {/* Ticket Design */}
            <View style={styles.ticketDesign}>
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketRoute}>{bus.route}</Text>
                <Text style={styles.ticketBusNumber}>{bus.busNumber}</Text>
              </View>
              
              <View style={styles.ticketRouteInfo}>
                <View style={styles.ticketLocation}>
                  <Text style={styles.ticketLocationName}>{bus.source}</Text>
                  <Text style={styles.ticketLocationTime}>{bus.departureTime}</Text>
                </View>
                
                <View style={styles.ticketJourneyLine}>
                  <View style={styles.ticketLine} />
                  <Ionicons name="arrow-forward" size={20} color="#6E473B" />
                  <View style={styles.ticketLine} />
                </View>
                
                <View style={styles.ticketLocation}>
                  <Text style={styles.ticketLocationName}>{bus.destination}</Text>
                  <Text style={styles.ticketLocationTime}>{bus.arrivalTime}</Text>
                </View>
              </View>
              
              <View style={styles.ticketDetails}>
                <View style={styles.ticketDetailRow}>
                  <Text style={styles.ticketDetailLabel}>Date:</Text>
                  <Text style={styles.ticketDetailValue}>Today</Text>
                </View>
                <View style={styles.ticketDetailRow}>
                  <Text style={styles.ticketDetailLabel}>Seat:</Text>
                  <Text style={styles.ticketDetailValue}>Any Available</Text>
                </View>
                <View style={styles.ticketDetailRow}>
                  <Text style={styles.ticketDetailLabel}>Price:</Text>
                  <Text style={styles.ticketDetailValue}>{bus.ticketPrice}</Text>
                </View>
                <View style={styles.ticketDetailRow}>
                  <Text style={styles.ticketDetailLabel}>Booking ID:</Text>
                  <Text style={styles.ticketDetailValue}>BUS-{bus.id}-TODAY</Text>
                </View>
              </View>
              
              {/* QR Code Placeholder */}
              <View style={styles.ticketQRPlaceholder}>
                <Text style={styles.ticketQRTitle}>SCAN FOR BOARDING</Text>
                <View style={styles.qrPattern}>
                  <View style={styles.qrRow}>
                    <View style={[styles.qrCell, styles.qrCellFilled]} />
                    <View style={styles.qrCell} />
                    <View style={[styles.qrCell, styles.qrCellFilled]} />
                    <View style={styles.qrCell} />
                  </View>
                  <View style={styles.qrRow}>
                    <View style={styles.qrCell} />
                    <View style={[styles.qrCell, styles.qrCellFilled]} />
                    <View style={styles.qrCell} />
                    <View style={[styles.qrCell, styles.qrCellFilled]} />
                  </View>
                  <View style={styles.qrRow}>
                    <View style={[styles.qrCell, styles.qrCellFilled]} />
                    <View style={styles.qrCell} />
                    <View style={[styles.qrCell, styles.qrCellFilled]} />
                    <View style={styles.qrCell} />
                  </View>
                  <View style={styles.qrRow}>
                    <View style={styles.qrCell} />
                    <View style={[styles.qrCell, styles.qrCellFilled]} />
                    <View style={styles.qrCell} />
                    <View style={[styles.qrCell, styles.qrCellFilled]} />
                  </View>
                </View>
              </View>
            </View>
            
            <Text style={styles.ticketInstructions}>
              Show this ticket to the conductor for boarding
            </Text>
            
            <TouchableOpacity 
              style={styles.ticketSaveButton}
              onPress={() => Alert.alert('Saved', 'Ticket saved to gallery')}
            >
              <Ionicons name="download-outline" size={20} color="#E1D4C2" />
              <Text style={styles.ticketSaveText}>Save Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#291C0E" />
      <TicketModal />
      
      {/* Header */}
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
            <Text style={styles.headerTitle}>Bus Details</Text>
            <Text style={styles.headerSubtitle}>{bus.route}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerActionButton}
              onPress={handleToggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={22} 
                color="#E1D4C2" 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerActionButton}
              onPress={handleShareBus}
            >
              <Ionicons name="share-outline" size={22} color="#E1D4C2" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Bus Information Card */}
        <View style={styles.busCard}>
          {/* Bus Header */}
          <View style={styles.busHeader}>
            <View>
              <Text style={styles.busRoute}>{bus.route}</Text>
              <Text style={styles.busNumber}>{bus.busNumber}</Text>
            </View>
            <View style={styles.busTypeContainer}>
              <View style={[styles.busTypeBadge, { backgroundColor: getStatusColor(bus.status) }]}>
                <Text style={styles.busTypeText}>{bus.busType}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bus.status) }]}>
                <Text style={styles.statusText}>{getStatusText(bus.status)}</Text>
              </View>
            </View>
          </View>

          {/* Route Information */}
          <View style={styles.routeSection}>
            <View style={styles.routeRow}>
              <View style={styles.routePoint}>
                <View style={styles.routeDotStart} />
                <View>
                  <Text style={styles.routeTime}>{bus.departureTime}</Text>
                  <Text style={styles.routePlace}>{bus.source}</Text>
                </View>
              </View>
              
              <View style={styles.routeLineContainer}>
                <View style={styles.routeLine} />
                <View style={styles.routeInfoCenter}>
                  <Text style={styles.travelTime}>{bus.travelTime}</Text>
                  <Text style={styles.travelDistance}>{bus.totalDistance}</Text>
                </View>
              </View>
              
              <View style={styles.routePoint}>
                <View style={styles.routeDotEnd} />
                <View>
                  <Text style={styles.routeTime}>{bus.arrivalTime}</Text>
                  <Text style={styles.routePlace}>{bus.destination}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color="#6E473B" />
              <Text style={styles.infoLabel}>Next Bus</Text>
              <Text style={styles.infoValue}>{bus.nextDeparture}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="repeat-outline" size={20} color="#6E473B" />
              <Text style={styles.infoLabel}>Frequency</Text>
              <Text style={styles.infoValue}>{bus.frequency}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="cash-outline" size={20} color="#6E473B" />
              <Text style={styles.infoLabel}>Price</Text>
              <Text style={styles.infoValue}>{bus.ticketPrice}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={20} color="#6E473B" />
              <Text style={styles.infoLabel}>Seats</Text>
              <Text style={[styles.infoValue, { color: getSeatAvailabilityColor(bus.seatAvailability, bus.totalSeats) }]}>
                {bus.seatAvailability}/{bus.totalSeats}
              </Text>
            </View>
          </View>

          {/* Ticket Preview */}
          <TouchableOpacity 
            style={styles.ticketPreview}
            onPress={handleShowTicket}
          >
            <View style={styles.ticketPreviewContent}>
              <Ionicons name="ticket-outline" size={32} color="#6E473B" />
              <View style={styles.ticketPreviewText}>
                <Text style={styles.ticketPreviewTitle}>Digital Ticket Available</Text>
                <Text style={styles.ticketPreviewSubtitle}>Tap to view your ticket</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6E473B" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Amenities Section */}
        <View style={styles.amenitiesSection}>
          <Text style={styles.sectionTitle}>Amenities & Facilities</Text>
          <View style={styles.amenitiesGrid}>
            {bus.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <View style={styles.amenityIcon}>
                  <Ionicons 
                    name={
                      amenity === 'WiFi' ? 'wifi-outline' :
                      amenity === 'AC' ? 'snow-outline' :
                      amenity === 'Charging Ports' ? 'battery-charging-outline' :
                      amenity === 'Water Bottle' ? 'water-outline' :
                      amenity === 'Snacks' ? 'fast-food-outline' :
                      amenity === 'Premium Seats' ? 'star-outline' :
                      amenity === 'Blanket' ? 'bed-outline' :
                      amenity === 'Meal' ? 'restaurant-outline' :
                      amenity === 'Sleeper' ? 'moon-outline' :
                      amenity === 'Pillow' ? 'bed-outline' :
                      amenity === 'Newspaper' ? 'newspaper-outline' :
                      'checkmark-circle-outline'
                    } 
                    size={20} 
                    color="#6E473B" 
                  />
                </View>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.alertButton, alertSet && styles.alertButtonActive]}
            onPress={handleSetAlert}
          >
            <Ionicons 
              name={alertSet ? "notifications" : "notifications-outline"} 
              size={20} 
              color={alertSet ? "#6E473B" : "#BEB5A9"} 
            />
            <Text style={[styles.alertButtonText, alertSet && styles.alertButtonTextActive]}>
              {alertSet ? 'Alert Set' : 'Set Alert'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.bookButton}
            onPress={handleBookNow}
          >
            <Text style={styles.bookButtonText}>Book Now • {bus.ticketPrice}</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Information */}
        <View style={styles.additionalInfo}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle-outline" size={20} color="#6E473B" />
              <Text style={styles.infoText}>
                Boarding starts 30 minutes before departure
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#6E473B" />
              <Text style={styles.infoText}>
                All buses are regularly sanitized and maintained
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#6E473B" />
              <Text style={styles.infoText}>
                Customer Support: 1800-123-4567
              </Text>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6E473B',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#6E473B',
    marginTop: 16,
    marginBottom: 24,
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
  backButtonError: {
    backgroundColor: '#6E473B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(110, 71, 59, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  busCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  busRoute: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#291C0E',
    marginBottom: 4,
  },
  busNumber: {
    fontSize: 14,
    color: '#6E473B',
  },
  busTypeContainer: {
    alignItems: 'flex-end',
    gap: 6,
  },
  busTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  busTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#291C0E',
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
  routeSection: {
    marginBottom: 20,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routePoint: {
    flex: 1,
  },
  routeDotStart: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6E473B',
    marginBottom: 8,
  },
  routeDotEnd: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6E473B',
    marginBottom: 8,
    alignSelf: 'flex-end',
  },
  routeTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#291C0E',
    marginBottom: 2,
  },
  routePlace: {
    fontSize: 14,
    color: '#6E473B',
  },
  routeLineContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  routeLine: {
    width: 2,
    height: 40,
    backgroundColor: '#E1D4C2',
  },
  routeInfoCenter: {
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
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  infoItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6E473B',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#291C0E',
  },
  ticketPreview: {
    backgroundColor: '#F8F5F0',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
    marginTop: 8,
  },
  ticketPreviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ticketPreviewText: {
    flex: 1,
  },
  ticketPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#291C0E',
    marginBottom: 2,
  },
  ticketPreviewSubtitle: {
    fontSize: 12,
    color: '#6E473B',
  },
  amenitiesSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#291C0E',
    marginBottom: 16,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  amenityIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F8F5F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amenityText: {
    fontSize: 12,
    color: '#6E473B',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  alertButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#F8F5F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(110, 71, 59, 0.2)',
  },
  alertButtonActive: {
    borderColor: '#6E473B',
    backgroundColor: '#F8F5F0',
  },
  alertButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6E473B',
  },
  alertButtonTextActive: {
    color: '#6E473B',
  },
  bookButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#6E473B',
    borderRadius: 12,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E1D4C2',
  },
  additionalInfo: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(110, 71, 59, 0.2)',
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6E473B',
    flex: 1,
  },
  backButtonText: {
    color: '#E1D4C2',
    fontSize: 16,
    fontWeight: '600',
  },
  // Ticket Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(41, 28, 14, 0.5)',
    justifyContent: 'flex-end',
  },
  ticketModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  ticketModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 141, 120, 0.2)',
  },
  ticketModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#291C0E',
  },
  modalCloseButton: {
    padding: 4,
  },
  ticketContent: {
    padding: 24,
    alignItems: 'center',
  },
  ticketDesign: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#6E473B',
    borderStyle: 'dashed',
    width: '100%',
    marginBottom: 20,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E1D4C2',
    paddingBottom: 12,
  },
  ticketRoute: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#291C0E',
  },
  ticketBusNumber: {
    fontSize: 14,
    color: '#6E473B',
    fontWeight: '600',
  },
  ticketRouteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  ticketLocation: {
    alignItems: 'center',
    flex: 1,
  },
  ticketLocationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#291C0E',
    marginBottom: 4,
  },
  ticketLocationTime: {
    fontSize: 14,
    color: '#6E473B',
  },
  ticketJourneyLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  ticketLine: {
    width: 20,
    height: 2,
    backgroundColor: '#E1D4C2',
  },
  ticketDetails: {
    marginBottom: 20,
  },
  ticketDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ticketDetailLabel: {
    fontSize: 14,
    color: '#6E473B',
  },
  ticketDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#291C0E',
  },
  ticketQRPlaceholder: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F5F0',
    borderRadius: 8,
  },
  ticketQRTitle: {
    fontSize: 12,
    color: '#6E473B',
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 1,
  },
  qrPattern: {
    alignItems: 'center',
  },
  qrRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  qrCell: {
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#E1D4C2',
  },
  qrCellFilled: {
    backgroundColor: '#291C0E',
  },
  ticketInstructions: {
    fontSize: 14,
    color: '#6E473B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  ticketSaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#6E473B',
    borderRadius: 8,
    width: '100%',
  },
  ticketSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E1D4C2',
  },
});

export default BusDetailsScreen;