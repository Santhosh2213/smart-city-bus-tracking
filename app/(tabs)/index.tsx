// app/(tabs)/index.tsx - FIXED VERSION
import { Ionicons } from '@expo/vector-icons';
import { Link, router, useNavigation } from 'expo-router'; // Changed import
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { TrackingContext } from '../../src/context/TrackingContext';
import { BusService } from '../../src/services/busService';
// Add these imports at the top of index.tsx
import { database } from '../../src/services/firebase'; // Adjust path as needed
import { ref, push, set } from 'firebase/database';

const HomeScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { currentBus, nearbyBuses, isLoading, refreshTracking } = useContext(TrackingContext);
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;
  
  const [searchData, setSearchData] = useState({
    from: '',
    to: ''
  });
  const [activeTab, setActiveTab] = useState<'search' | 'schedule' | 'tracking'>('search');
  const [suggestions, setSuggestions] = useState<{from: string[], to: string[]}>({ from: [], to: [] });
  const [activeInput, setActiveInput] = useState<'from' | 'to' | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [liveBuses, setLiveBuses] = useState<any[]>([]);
  const [isLoadingBuses, setIsLoadingBuses] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [modalInputType, setModalInputType] = useState<'from' | 'to'>('from');

  // Get all Tamil Nadu cities for search
  const CITIES = BusService.getCityNames();

  const features = [
    {
      icon: 'location',
      title: 'Live Tracking',
      action: 'live-tracking',
      color: '#6E473B',
      description: 'Real-time bus locations'
    },
    {
      icon: 'calendar',
      title: 'Schedule',
      action: 'schedule',
      color: '#6E473B',
      description: 'Bus timings & alerts'
    },
    {
      icon: 'heart',
      title: 'Child Mode',
      action: 'child',
      color: '#6E473B',
      description: 'Track your child'
    },
    {
      icon: 'cloud-offline',
      title: 'Offline Map',
      action: 'offline-map',
      color: '#6E473B',
      description: 'No internet needed'
    }
  ];

  const quickActions = [
    {
      icon: 'qr-code',
      title: 'QR Scan',
      action: 'qr',
      color: '#6E473B'
    },
    {
      icon: 'warning',
      title: 'SOS',
      action: 'sos',
      color: '#6E473B' 
    },
    {
      icon: 'notifications',
      title: 'Alerts',
      action: 'alerts',
      color: '#6E473B'
    },
    {
      icon: 'star',
      title: 'Favorites',
      action: 'favorites',
      color: '#6E473B'
    },
  ];

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
    loadRecentSearches();
    setupRealTimeBuses();
  }, []);

  const setupRealTimeBuses = useCallback(() => {
    setIsLoadingBuses(true);
    
    const updateBuses = async () => {
      try {
        const buses = await BusService.getAllBuses();
        setLiveBuses(buses);
        setIsLoadingBuses(false);
      } catch (error) {
        console.error('Error fetching buses:', error);
        setIsLoadingBuses(false);
      }
    };

    // Initial fetch
    updateBuses();

    // Set up interval for updates (every 30 seconds)
    const interval = setInterval(updateBuses, 30000);

    return () => clearInterval(interval);
  }, []);

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for better experience');
        setCurrentLocation('Location access denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      
      // Find nearest city from Tamil Nadu cities
      const nearestCity = findNearestCity(location.coords.latitude, location.coords.longitude);
      setCurrentLocation(nearestCity);
      
      // Auto-fill "From" field with current location
      setSearchData(prev => ({ ...prev, from: nearestCity }));

    } catch (error) {
      console.error('Error getting location:', error);
      setCurrentLocation('Unable to get location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const findNearestCity = (lat: number, lng: number): string => {
    // Mock city coordinates - in a real app, you'd have actual coordinates
    const cities = {
      'Chennai': { lat: 13.0827, lng: 80.2707 },
      'Coimbatore': { lat: 11.0168, lng: 76.9558 },
      'Madurai': { lat: 9.9252, lng: 78.1198 },
      'Trichy': { lat: 10.7905, lng: 78.7047 },
      'Salem': { lat: 11.6643, lng: 78.1460 },
      'Tirunelveli': { lat: 8.7139, lng: 77.7567 },
      'Vellore': { lat: 12.9165, lng: 79.1325 },
      'Erode': { lat: 11.3410, lng: 77.7172 },
      'Kanyakumari': { lat: 8.0883, lng: 77.5385 },
      'Ooty': { lat: 11.4102, lng: 76.6950 }
    };
    
    let nearestCity = 'Chennai';
    let minDistance = Infinity;

    Object.entries(cities).forEach(([city, coords]) => {
      const distance = calculateDistance(lat, lng, coords.lat, coords.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    });

    return nearestCity;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Load recent searches
  const loadRecentSearches = async () => {
    // Mock recent searches
    const mockSearches = [
      { id: '1', from: 'Chennai', to: 'Coimbatore', timestamp: 'Today' },
      { id: '2', from: 'Madurai', to: 'Trichy', timestamp: 'Yesterday' },
      { id: '3', from: 'Salem', to: 'Erode', timestamp: '2 days ago' },
    ];
    setRecentSearches(mockSearches);
  };

  // Open city modal
  const openCityModal = (inputType: 'from' | 'to') => {
    setModalInputType(inputType);
    setShowCityModal(true);
  };

  // Handle city selection from modal
  const handleCitySelect = (city: string) => {
    setSearchData(prev => ({ ...prev, [modalInputType]: city }));
    setShowCityModal(false);
  };

  const handleInputChange = (text: string, field: 'from' | 'to') => {
    setSearchData(prev => ({ ...prev, [field]: text }));
  };

// Replace the existing handleQuickAction function with this:

const handleQuickAction = (action: string) => {
  switch (action) {
    case 'qr':
      // Navigate to QR scanner screen
      router.push('/QRBoardingScreen');
      break;
    case 'sos':
      // Navigate to SOS screen
      router.push('/sos');
      break;
    case 'alerts':
      // Navigate to notification screen
      router.push('/notification');
      break;
    case 'live-tracking':
      router.push('/(tabs)/bus-tracking/live-tracking');
      break;
    case 'schedule':
      router.push('/(tabs)/bus-tracking/bus-schedule');
      break;
    case 'offline-map':
      router.push('/(tabs)/bus-tracking/offline-map');
      break;
    case 'child':
      Alert.alert('Child Mode', 'Child safety mode activated');
      break;
    case 'favorites':
      Alert.alert('Favorites', 'Your favorite routes will appear here');
      break;
    default:
      console.log('Unknown action:', action);
      break;
  }
};

  const handleSearch = async () => {
    if (!searchData.from || !searchData.to) {
      Alert.alert('Error', 'Please enter both from and to locations');
      return;
    }

    // Validate city names
    if (!CITIES.some(city => city.toLowerCase().includes(searchData.from.toLowerCase()))) {
      Alert.alert('Invalid City', `${searchData.from} is not in Tamil Nadu`);
      return;
    }

    if (!CITIES.some(city => city.toLowerCase().includes(searchData.to.toLowerCase()))) {
      Alert.alert('Invalid City', `${searchData.to} is not in Tamil Nadu`);
      return;
    }

    if (searchData.from === searchData.to) {
      Alert.alert('Error', 'From and To locations cannot be same');
      return;
    }

    try {
      // Navigate to bus schedule with search parameters
      router.push({
        pathname: '/(tabs)/bus-tracking/bus-schedule',
        params: { 
          from: searchData.from, 
          to: searchData.to 
        }
      });
      
      // Save to recent searches
      const newSearch = {
        id: Date.now().toString(),
        from: searchData.from,
        to: searchData.to,
        timestamp: 'Just now'
      };
      setRecentSearches(prev => [newSearch, ...prev.slice(0, 4)]);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to search. Please try again.');
      console.error('Error searching:', error);
    }
  };

  const handleRecentSearchPress = (search: any) => {
    setSearchData({ from: search.from, to: search.to });
    // Navigate to schedule with the recent search
    setTimeout(() => {
      router.push({
        pathname: '/(tabs)/bus-tracking/bus-schedule',
        params: { 
          from: search.from, 
          to: search.to 
        }
      });
    }, 100);
  };

  const handleSetAlert = async (schedule: any) => {
    try {
      alert(`Alert set! You will be notified 10 minutes before ${schedule.time} for ${schedule.route}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to set alert');
    }
  };

  const handleCurrentBusPress = () => {
    if (currentBus) {
      router.push({
        pathname: '/(tabs)/bus-tracking/bus-details',
        params: { 
          buses: JSON.stringify([currentBus]),
          searchFrom: currentLocation,
          searchTo: currentBus.destination
        }
      });
    }
  };

  const handleRefresh = () => {
    refreshTracking();
    getCurrentLocation();
  };

  const QuickActionButton: React.FC<{
    icon: string;
    title: string;
    action: string;
    color: string;
    description?: string;
  }> = ({ icon, title, action, color, description }) => (
    <TouchableOpacity
      style={styles.quickActionButton}
      onPress={() => handleQuickAction(action)}
    >
      <View style={[styles.quickActionIconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={22} color="#E1D4C2" />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
      {description && <Text style={styles.quickActionDescription}>{description}</Text>}
    </TouchableOpacity>
  );

  const getPassengerLoadColor = (load: number) => {
    if (load > 80) return '#EF4444';
    if (load > 50) return '#F59E0B';
    return '#10B981';
  };

  const getPassengerLoadText = (load: number) => {
    if (load > 80) return 'Crowded';
    if (load > 50) return 'Moderate';
    return 'Empty';
  };

  // Add this function in the index.tsx component

const handleEmergencySOS = async () => {
  Alert.alert(
    'Emergency SOS',
    'Do you want to send an emergency alert?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Send Alert',
        style: 'destructive',
        onPress: async () => {
          try {
            // Create emergency notification
            const emergencyAlert = {
              id: `emergency_${Date.now()}`,
              title: '🚨 Emergency SOS Alert',
              message: `${user?.name || 'User'} has triggered an emergency SOS from ${currentLocation || 'their location'}`,
              type: 'alert' as const,
              timestamp: Date.now(),
              isRead: false,
              priority: 'high' as const,
              location: currentLocation || 'Unknown location',
            };

            // Save to Firebase (you'll need to import your firebase functions)
            const notificationsRef = ref(database, 'notifications');
            const newNotificationRef = push(notificationsRef);
            await set(newNotificationRef, emergencyAlert);

            // Navigate to SOS page
            router.push('/sos');
            
            Alert.alert(
              'Emergency Alert Sent!',
              'Authorities have been notified. Help is on the way.',
              [{ text: 'OK' }]
            );
          } catch (error) {
            console.error('Error sending emergency alert:', error);
            Alert.alert('Error', 'Failed to send emergency alert');
          }
        },
      },
    ]
  );
};

  // City Modal Component
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
          
          <FlatList
            data={CITIES}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.cityItem}
                onPress={() => handleCitySelect(item)}
              >
                <Ionicons name="location-outline" size={20} color="#6E473B" />
                <Text style={styles.cityText}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.cityList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#291C0E" />
      <CityModal />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}! 👋</Text>
            <Text style={styles.subtitle}>Welcome to SmartBus</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={handleRefresh}
              disabled={isLoading}
            >
              <Ionicons name="refresh" size={20} color="#E1D4C2" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Ionicons name="person-outline" size={22} color="#E1D4C2" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={undefined}
      >
        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Find Your Bus</Text>
          <View style={styles.searchContainer}>
            {/* From Input */}
            <TouchableOpacity 
              style={styles.inputWrapper}
              onPress={() => openCityModal('from')}
            >
              <View style={styles.inputGroup}>
                <Ionicons name="location-outline" size={20} color="#6E473B" style={styles.inputIcon} />
                <Text style={[styles.input, !searchData.from && styles.inputPlaceholder]}>
                  {searchData.from || 'From location'}
                </Text>
                {isLoadingLocation && searchData.from === currentLocation && (
                  <ActivityIndicator size="small" color="#6E473B" style={styles.loadingIndicator} />
                )}
              </View>
            </TouchableOpacity>

            {/* To Input */}
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

            <TouchableOpacity 
              style={styles.searchButton} 
              onPress={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#291C0E" />
              ) : (
                <>
                  <Ionicons name="search" size={20} color="#291C0E" />
                  <Text style={styles.searchButtonText}>Find Bus</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.sectionSubtitle}>Get where you need to go</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            {features.map((feature, index) => (
              <QuickActionButton 
                key={index}
                icon={feature.icon}
                title={feature.title}
                action={feature.action}
                color={feature.color}
                description={feature.description}
              />
            ))}
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabSection}>
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'search' && styles.activeTab]}
              onPress={() => setActiveTab('search')}
            >
              <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
                Search
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'schedule' && styles.activeTab]}
              onPress={() => setActiveTab('schedule')}
            >
              <Text style={[styles.tabText, activeTab === 'schedule' && styles.activeTabText]}>
                Schedule
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'tracking' && styles.activeTab]}
              onPress={() => setActiveTab('tracking')}
            >
              <Text style={[styles.tabText, activeTab === 'tracking' && styles.activeTabText]}>
                Live Tracking
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'search' && (
            <View style={styles.tabContent}>
              <Text style={styles.tabContentTitle}>Recent Searches</Text>
              <View style={styles.recentSearches}>
                {recentSearches.map((search) => (
                  <TouchableOpacity 
                    key={search.id} 
                    style={styles.recentSearchItem}
                    onPress={() => handleRecentSearchPress(search)}
                  >
                    <Ionicons name="time-outline" size={16} color="#6E473B" />
                    <View style={styles.recentSearchTextContainer}>
                      <Text style={styles.recentSearchText}>{search.from} → {search.to}</Text>
                      <Text style={styles.recentSearchTime}>{search.timestamp}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#6E473B" />
                  </TouchableOpacity>
                ))}
                {recentSearches.length === 0 && (
                  <Text style={styles.noRecentText}>No recent searches</Text>
                )}
              </View>
            </View>
          )}

          {activeTab === 'schedule' && (
            <View style={styles.tabContent}>
              <Text style={styles.tabContentTitle}>Today's Popular Routes</Text>
              {liveBuses.slice(0, 3).map((bus) => (
                <TouchableOpacity 
                  key={bus.id} 
                  style={styles.scheduleItem}
                  onPress={() => router.push({
                    pathname: '/(tabs)/bus-tracking/bus-details',
                    params: { buses: JSON.stringify([bus]) }
                  })}
                >
                  <View style={styles.scheduleInfo}>
                    <Text style={styles.scheduleRoute}>{bus.route || 'Unknown Route'}</Text>
                    <Text style={styles.scheduleTime}>{bus.departureTime || 'N/A'}</Text>
                    <Text style={styles.scheduleLocation}>
                      {bus.source || 'Unknown'} → {bus.destination || 'Unknown'}
                    </Text>
                  </View>
                  <View style={styles.scheduleActions}>
                    <View style={[
                      styles.statusBadge,
                      bus.status === 'delayed' ? styles.statusDelayed : styles.statusOnTime
                    ]}>
                      <Text style={styles.statusText}>
                        {bus.status === 'delayed' ? 'Delayed' : 'On Time'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'tracking' && (
            <View style={styles.tabContent}>
              <Text style={styles.tabContentTitle}>Live Buses Near You</Text>
              {isLoadingBuses ? (
                <ActivityIndicator size="large" color="#6E473B" style={styles.loadingBuses} />
              ) : liveBuses.length > 0 ? (
                liveBuses.slice(0, 3).map((bus) => (
                  <TouchableOpacity 
                    key={bus.id} 
                    style={styles.busItem}
                    onPress={() => router.push({
                      pathname: '/(tabs)/bus-tracking/bus-details',
                      params: { buses: JSON.stringify([bus]) }
                    })}
                  >
                    <View style={styles.busInfo}>
                      <Text style={styles.busRoute}>{bus.route || 'Unknown Route'}</Text>
                      <Text style={styles.busLocation}>
                        Near {bus.currentLocation || currentLocation || 'Your Location'}
                      </Text>
                      <Text style={styles.busTime}>
                        Arriving in {bus.eta || 'Unknown'} min
                      </Text>
                    </View>
                    <View style={styles.busStatus}>
                      <View style={[
                        styles.busIndicator,
                        { backgroundColor: getPassengerLoadColor(bus.passengerLoad || 50) }
                      ]}>
                        <Text style={styles.busLoadText}>
                          {getPassengerLoadText(bus.passengerLoad || 50)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noBusesText}>No live buses available</Text>
              )}
            </View>
          )}
        </View>

        {/* Additional Quick Actions */}
        <View style={styles.additionalActionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>More Features</Text>
            <Text style={styles.sectionSubtitle}>Everything you need</Text>
          </View>
          <View style={styles.additionalActionsGrid}>
            {quickActions.map((action, index) => (
              <QuickActionButton 
                key={index}
                icon={action.icon}
                title={action.title}
                action={action.action}
                color={action.color}
              />
            ))}
          </View>
        </View>

        {/* Current Bus Status */}
        {currentBus && (
          <View style={styles.currentBusSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Current Bus</Text>
              <TouchableOpacity onPress={handleCurrentBusPress}>
                <Text style={styles.seeAllText}>Details</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.currentBusCard} onPress={handleCurrentBusPress}>
              <View style={styles.busHeader}>
                <Text style={styles.busRouteLarge}>{currentBus.route}</Text>
                <View style={[
                  styles.busStatusBadge,
                  currentBus.status === 'moving' ? styles.busMoving : styles.busStopped
                ]}>
                  <Text style={styles.busStatusText}>
                    {currentBus.status === 'moving' ? 'Moving' : 'Stopped'}
                  </Text>
                </View>
              </View>
              <Text style={styles.busLocationLarge}>
                Current: {isLoadingLocation ? 'Getting location...' : currentLocation}
              </Text>
              <Text style={styles.busNextStop}>
                Next Stop: {currentBus.nextStop} • {currentBus.eta} min
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${currentBus.progress || 50}%` }
                  ]} 
                />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Emergency Section */}
<View style={styles.emergencySection}>
  <LinearGradient
    colors={['#EF4444', '#DC2626']}
    style={styles.emergencyCard}
  >
    <View style={styles.emergencyContent}>
      <Ionicons name="warning-outline" size={32} color="#fff" />
      <View style={styles.emergencyText}>
        <Text style={styles.emergencyTitle}>Emergency SOS</Text>
        <Text style={styles.emergencyDescription}>
          Immediate help with location sharing
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.sosButton}
        onPress={handleEmergencySOS}
      >
        <Text style={styles.sosButtonText}>SOS</Text>
      </TouchableOpacity>
    </View>
  </LinearGradient>
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
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#291C0E',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E1D4C2',
  },
  subtitle: {
    fontSize: 16,
    color: '#BEB5A9',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(110, 71, 59, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(110, 71, 59, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
  seeAllText: {
    color: '#6E473B',
    fontWeight: '600',
    fontSize: 14,
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
  },
  inputPlaceholder: {
    color: '#6E473B',
  },
  loadingIndicator: {
    marginLeft: 8,
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
  quickActionsSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  quickActionButton: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#291C0E',
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  quickActionDescription: {
    fontSize: 12,
    textAlign: 'center',
    color: '#6E473B',
    lineHeight: 16,
    fontWeight: '400',
  },
  tabSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F5F0',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6E473B',
  },
  activeTabText: {
    color: '#291C0E',
  },
  tabContent: {
    gap: 16,
  },
  tabContentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#291C0E',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  recentSearches: {
    gap: 8,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F5F0',
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  recentSearchTextContainer: {
    flex: 1,
  },
  recentSearchText: {
    fontSize: 14,
    color: '#291C0E',
    fontWeight: '600',
    marginBottom: 2,
  },
  recentSearchTime: {
    fontSize: 12,
    color: '#6E473B',
  },
  noRecentText: {
    textAlign: 'center',
    color: '#6E473B',
    fontSize: 14,
    padding: 20,
    fontWeight: '400',
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F5F0',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleRoute: {
    fontSize: 16,
    fontWeight: '700',
    color: '#291C0E',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  scheduleTime: {
    fontSize: 14,
    color: '#6E473B',
    fontWeight: '600',
    marginBottom: 4,
  },
  scheduleLocation: {
    fontSize: 12,
    color: '#6E473B',
    fontWeight: '400',
  },
  scheduleActions: {
    alignItems: 'flex-end',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusOnTime: {
    backgroundColor: '#E1D4C2',
  },
  statusDelayed: {
    backgroundColor: '#F8D7C2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#291C0E',
  },
  busItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F5F0',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  busInfo: {
    flex: 1,
  },
  busRoute: {
    fontSize: 16,
    fontWeight: '700',
    color: '#291C0E',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  busLocation: {
    fontSize: 14,
    color: '#6E473B',
    marginBottom: 4,
    fontWeight: '400',
  },
  busTime: {
    fontSize: 12,
    color: '#6E473B',
    fontWeight: '600',
  },
  busStatus: {
    alignItems: 'flex-end',
  },
  busIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  busLoadText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingBuses: {
    padding: 40,
  },
  noBusesText: {
    textAlign: 'center',
    color: '#6E473B',
    fontSize: 14,
    padding: 20,
    fontWeight: '400',
  },
  additionalActionsSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  additionalActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  currentBusSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  currentBusCard: {
    backgroundColor: '#F8F5F0',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
    elevation: 2,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  busRouteLarge: {
    fontSize: 18,
    fontWeight: '700',
    color: '#291C0E',
    letterSpacing: -0.5,
  },
  busStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  busMoving: {
    backgroundColor: '#E1D4C2',
  },
  busStopped: {
    backgroundColor: '#F8E9C2',
  },
  busStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#291C0E',
  },
  busLocationLarge: {
    fontSize: 14,
    color: '#6E473B',
    marginBottom: 6,
    fontWeight: '400',
  },
  busNextStop: {
    fontSize: 12,
    color: '#6E473B',
    fontWeight: '600',
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(167, 141, 120, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6E473B',
    borderRadius: 3,
  },
  emergencySection: {
    padding: 24,
  },
  emergencyCard: {
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emergencyText: {
    flex: 1,
    marginLeft: 16,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E1D4C2',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  emergencyDescription: {
    fontSize: 12,
    color: 'rgba(225, 212, 194, 0.8)',
    fontWeight: '400',
  },
  sosButton: {
    backgroundColor: '#E1D4C2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sosButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal Styles
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
});

export default HomeScreen;