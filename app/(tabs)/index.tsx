// app/(tabs)/index.tsx - UPDATED WITH LOCATION SUGGESTIONS & REAL LOCATION
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  useWindowDimensions,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../src/navigation/types';
import { AuthContext } from '../../src/context/AuthContext';
import { TrackingContext } from '../../src/context/TrackingContext';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

type HomeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Home'>;

// Mock city data - In real app, this would come from an API
const CITIES = [
  'Chennai', 'Chennai Central', 'Chennai Egmore', 'Chennai Airport',
  'Bangalore', 'Mumbai', 'Delhi', 'Kolkata', 'Hyderabad', 'Pune',
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi'
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useContext(AuthContext);
  const { currentBus, nearbyBuses, isLoading } = useContext(TrackingContext);
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

  // Mock data for schedules
  const schedules = [
    { id: '1', route: 'Route 101', time: '08:30 AM', from: 'Downtown', to: 'University', status: 'On Time' },
    { id: '2', route: 'Route 202', time: '09:15 AM', from: 'Mall', to: 'Airport', status: 'Delayed' },
    { id: '3', route: 'Route 303', time: '10:00 AM', from: 'Station', to: 'Hospital', status: 'On Time' },
  ];

  const features = [
    {
      icon: 'location',
      title: 'Live Tracking',
      action: 'tracking',
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
      action: 'offline',
      color: '#6E473B',
      description: 'No internet needed'
    },
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
      color: '#EF4444' // Changed to red for SOS
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

      let location = await Location.getCurrentPositionAsync({});
      
      // Reverse geocoding to get address
      let address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (address.length > 0) {
        const { city, district, region } = address[0];
        setCurrentLocation(city || district || region || 'Your Location');
      } else {
        setCurrentLocation('Your Current Location');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setCurrentLocation('Unable to get location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Filter suggestions based on input
  const filterSuggestions = (text: string, field: 'from' | 'to') => {
    if (text.length > 0) {
      const filtered = CITIES.filter(city => 
        city.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(prev => ({ ...prev, [field]: filtered }));
    } else {
      setSuggestions(prev => ({ ...prev, [field]: [] }));
    }
  };

  const handleInputChange = (text: string, field: 'from' | 'to') => {
    setSearchData(prev => ({ ...prev, [field]: text }));
    filterSuggestions(text, field);
  };

  const handleSuggestionSelect = (suggestion: string, field: 'from' | 'to') => {
    setSearchData(prev => ({ ...prev, [field]: suggestion }));
    setSuggestions(prev => ({ ...prev, [field]: [] }));
    setActiveInput(null);
  };

  const handleInputFocus = (field: 'from' | 'to') => {
    setActiveInput(field);
    if (searchData[field].length > 0) {
      filterSuggestions(searchData[field], field);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for selection
    setTimeout(() => {
      setActiveInput(null);
      setSuggestions({ from: [], to: [] });
    }, 200);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'qr':
        navigation.navigate('QRScan');
        break;
      case 'schedule':
        setActiveTab('schedule');
        break;
      case 'tracking':
        setActiveTab('tracking');
        break;
      case 'sos':
        navigation.navigate('SOS');
        break;
      case 'child':
        navigation.navigate('ChildMode');
        break;
      case 'offline':
        navigation.navigate('OfflineMap');
        break;
      case 'alerts':
        navigation.navigate('Notifications');
        break;
      case 'favorites':
        Alert.alert('Favorites', 'Your favorite routes will appear here');
        break;
      default:
        break;
    }
  };

  const handleSearch = () => {
    if (!searchData.from || !searchData.to) {
      Alert.alert('Error', 'Please enter both from and to locations');
      return;
    }

    // Navigate to search results page with the search data
    navigation.navigate('SearchResults', {
      from: searchData.from,
      to: searchData.to
    });
  };

  const handleSetAlert = (schedule: any) => {
    Alert.alert('Alert Set', `You will be notified 10 minutes before ${schedule.time} for ${schedule.route}`);
  };

  const handleCurrentBusPress = () => {
    if (currentBus) {
      navigation.navigate('BusDetails', { 
        bus: currentBus,
        currentLocation: currentLocation
      });
    }
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
        <Ionicons name={icon} size={22} color="#E1D4C2" />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
      {description && <Text style={styles.quickActionDescription}>{description}</Text>}
    </TouchableOpacity>
  );

  const renderSuggestionItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionSelect(item, activeInput!)}
    >
      <Ionicons name="location-outline" size={16} color="#6E473B" />
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#291C0E" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}! 👋</Text>
            <Text style={styles.subtitle}>Welcome to SmartBus</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={22} color="#E1D4C2" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Find Your Bus</Text>
          <View style={styles.searchContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputGroup}>
                <Ionicons name="location-outline" size={20} color="#6E473B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="From location"
                  placeholderTextColor="#6E473B"
                  value={searchData.from}
                  onChangeText={(text) => handleInputChange(text, 'from')}
                  onFocus={() => handleInputFocus('from')}
                  onBlur={handleInputBlur}
                />
              </View>
              {activeInput === 'from' && suggestions.from.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <FlatList
                    data={suggestions.from}
                    renderItem={renderSuggestionItem}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                  />
                </View>
              )}
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputGroup}>
                <Ionicons name="navigate-outline" size={20} color="#6E473B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="To location"
                  placeholderTextColor="#6E473B"
                  value={searchData.to}
                  onChangeText={(text) => handleInputChange(text, 'to')}
                  onFocus={() => handleInputFocus('to')}
                  onBlur={handleInputBlur}
                />
              </View>
              {activeInput === 'to' && suggestions.to.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <FlatList
                    data={suggestions.to}
                    renderItem={renderSuggestionItem}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                  />
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Ionicons name="search" size={20} color="#291C0E" />
              <Text style={styles.searchButtonText}>Find Bus</Text>
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
                <TouchableOpacity style={styles.recentSearchItem}>
                  <Ionicons name="time-outline" size={16} color="#6E473B" />
                  <Text style={styles.recentSearchText}>Downtown to University</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.recentSearchItem}>
                  <Ionicons name="time-outline" size={16} color="#6E473B" />
                  <Text style={styles.recentSearchText}>Mall to Airport</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.recentSearchItem}>
                  <Ionicons name="time-outline" size={16} color="#6E473B" />
                  <Text style={styles.recentSearchText}>Station to Hospital</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activeTab === 'schedule' && (
            <View style={styles.tabContent}>
              <Text style={styles.tabContentTitle}>Today's Schedule</Text>
              {schedules.map((schedule) => (
                <View key={schedule.id} style={styles.scheduleItem}>
                  <View style={styles.scheduleInfo}>
                    <Text style={styles.scheduleRoute}>{schedule.route}</Text>
                    <Text style={styles.scheduleTime}>{schedule.time}</Text>
                    <Text style={styles.scheduleLocation}>{schedule.from} → {schedule.to}</Text>
                  </View>
                  <View style={styles.scheduleActions}>
                    <View style={[
                      styles.statusBadge,
                      schedule.status === 'Delayed' ? styles.statusDelayed : styles.statusOnTime
                    ]}>
                      <Text style={styles.statusText}>{schedule.status}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.alertButton}
                      onPress={() => handleSetAlert(schedule)}
                    >
                      <Ionicons name="notifications-outline" size={16} color="#6E473B" />
                      <Text style={styles.alertButtonText}>Alert</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'tracking' && (
            <View style={styles.tabContent}>
              <Text style={styles.tabContentTitle}>Nearby Buses</Text>
              {nearbyBuses.length > 0 ? (
                nearbyBuses.slice(0, 3).map((bus) => (
                  <View key={bus.id} style={styles.busItem}>
                    <View style={styles.busInfo}>
                      <Text style={styles.busRoute}>{bus.route}</Text>
                      <Text style={styles.busLocation}>Near {bus.currentLocation}</Text>
                      <Text style={styles.busTime}>Arriving in {bus.arrivalTime} min</Text>
                    </View>
                    <View style={styles.busStatus}>
                      <View style={[
                        styles.busIndicator,
                        bus.passengerLoad > 80 ? styles.busCrowded : 
                        bus.passengerLoad > 50 ? styles.busModerate : styles.busEmpty
                      ]}>
                        <Text style={styles.busLoadText}>
                          {bus.passengerLoad > 80 ? 'Crowded' : 
                           bus.passengerLoad > 50 ? 'Moderate' : 'Empty'}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noBusesText}>No nearby buses found</Text>
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
              <Text style={styles.busNextStop}>Next Stop: {currentBus.nextStop} • {currentBus.arrivalTime} min</Text>
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
            colors={['#EF4444', '#DC2626']} // Red gradient for SOS
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
                onPress={() => handleQuickAction('sos')}
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
    zIndex: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#291C0E',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.3)',
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: -8,
    zIndex: 1000,
    elevation: 8,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 141, 120, 0.1)',
    gap: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#291C0E',
    fontWeight: '400',
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
  recentSearchText: {
    fontSize: 14,
    color: '#6E473B',
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
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertButtonText: {
    fontSize: 12,
    color: '#6E473B',
    fontWeight: '600',
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
  busEmpty: {
    backgroundColor: '#E1D4C2',
  },
  busModerate: {
    backgroundColor: '#F8E9C2',
  },
  busCrowded: {
    backgroundColor: '#F8D7C2',
  },
  busLoadText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#291C0E',
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
});

export default HomeScreen;