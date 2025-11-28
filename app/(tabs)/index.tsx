// app/(tabs)/index.tsx - FIXED VERSION
import React, { useState, useContext } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../src/navigation/types';
import { AuthContext } from '../../src/context/AuthContext';
import { TrackingContext } from '../../src/context/TrackingContext';
import { Ionicons } from '@expo/vector-icons';

type HomeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Home'>;

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

  // Mock data for schedules
  const schedules = [
    { id: '1', route: 'Route 101', time: '08:30 AM', from: 'Downtown', to: 'University', status: 'On Time' },
    { id: '2', route: 'Route 202', time: '09:15 AM', from: 'Mall', to: 'Airport', status: 'Delayed' },
    { id: '3', route: 'Route 303', time: '10:00 AM', from: 'Station', to: 'Hospital', status: 'On Time' },
  ];

  const features = [
    {
      icon: '🚌',
      title: 'Live Tracking',
      action: 'tracking',
      color: '#4F46E5',
      description: 'Real-time bus locations'
    },
    {
      icon: '📅',
      title: 'Schedule',
      action: 'schedule',
      color: '#10B981',
      description: 'Bus timings & alerts'
    },
    {
      icon: '👶',
      title: 'Child Mode',
      action: 'child',
      color: '#F59E0B',
      description: 'Track your child'
    },
    {
      icon: '🗺️',
      title: 'Offline Map',
      action: 'offline',
      color: '#8B5CF6',
      description: 'No internet needed'
    },
  ];

  const quickActions = [
    {
      icon: '📷',
      title: 'QR Scan',
      action: 'qr',
      color: '#EC4899'
    },
    {
      icon: '🚨',
      title: 'SOS',
      action: 'sos',
      color: '#EF4444'
    },
    {
      icon: '🔔',
      title: 'Alerts',
      action: 'alerts',
      color: '#06B6D4'
    },
    {
      icon: '⭐',
      title: 'Favorites',
      action: 'favorites',
      color: '#F59E0B'
    },
  ];

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
    Alert.alert('Search', `Finding buses from ${searchData.from} to ${searchData.to}`);
    // Implement actual search logic here
  };

  const handleSetAlert = (schedule: any) => {
    Alert.alert('Alert Set', `You will be notified 10 minutes before ${schedule.time} for ${schedule.route}`);
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
      <LinearGradient
        colors={[color, `${color}DD`]}
        style={styles.quickActionGradient}
      >
        <Text style={styles.quickActionIcon}>{icon}</Text>
      </LinearGradient>
      <Text style={styles.quickActionTitle}>{title}</Text>
      {description && <Text style={styles.quickActionDescription}>{description}</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a73e8" />
      
      {/* Header */}
      <LinearGradient
        colors={['#1a73e8', '#4285f4']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}! 👋</Text>
            <Text style={styles.subtitle}>Welcome to SmartBus</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Find Your Bus</Text>
          <View style={styles.searchContainer}>
            <View style={styles.inputGroup}>
              <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="From location"
                value={searchData.from}
                onChangeText={(text) => setSearchData({...searchData, from: text})}
              />
            </View>
            <View style={styles.inputGroup}>
              <Ionicons name="navigate-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="To location"
                value={searchData.to}
                onChangeText={(text) => setSearchData({...searchData, to: text})}
              />
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Ionicons name="search" size={20} color="#fff" />
              <Text style={styles.searchButtonText}>Find Bus</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
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
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.recentSearchText}>Downtown to University</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.recentSearchItem}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.recentSearchText}>Mall to Airport</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.recentSearchItem}>
                  <Ionicons name="time-outline" size={16} color="#666" />
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
                      <Ionicons name="notifications-outline" size={16} color="#1a73e8" />
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
          <Text style={styles.sectionTitle}>More Features</Text>
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
              <TouchableOpacity onPress={() => navigation.navigate('BusDetails', { bus: currentBus })}>
                <Text style={styles.seeAllText}>Details</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.currentBusCard}>
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
              <Text style={styles.busLocationLarge}>Current: {currentBus.currentLocation}</Text>
              <Text style={styles.busNextStop}>Next Stop: {currentBus.nextStop} • {currentBus.arrivalTime} min</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${currentBus.progress || 50}%` }
                  ]} 
                />
              </View>
            </View>
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#1a73e8',
    fontWeight: '600',
    fontSize: 14,
  },
  searchSection: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  searchContainer: {
    gap: 12,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a73e8',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActionsSection: {
    padding: 20,
    backgroundColor: '#ffffff',
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
  quickActionGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionIcon: {
    fontSize: 24,
  },
  quickActionTitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  tabSection: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#1a73e8',
  },
  tabContent: {
    gap: 16,
  },
  tabContentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  recentSearches: {
    gap: 8,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    gap: 8,
  },
  recentSearchText: {
    fontSize: 14,
    color: '#666',
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleRoute: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: '600',
    marginBottom: 2,
  },
  scheduleLocation: {
    fontSize: 12,
    color: '#666',
  },
  scheduleActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusOnTime: {
    backgroundColor: '#DCFCE7',
  },
  statusDelayed: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#166534',
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertButtonText: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '600',
  },
  busItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
  },
  busInfo: {
    flex: 1,
  },
  busRoute: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  busLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  busTime: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '600',
  },
  busStatus: {
    alignItems: 'flex-end',
  },
  busIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  busEmpty: {
    backgroundColor: '#DCFCE7',
  },
  busModerate: {
    backgroundColor: '#FEF9C3',
  },
  busCrowded: {
    backgroundColor: '#FEE2E2',
  },
  busLoadText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#166534',
  },
  noBusesText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    padding: 20,
  },
  additionalActionsSection: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 8,
  },
  additionalActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  currentBusSection: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 8,
  },
  currentBusCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  busRouteLarge: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  busStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  busMoving: {
    backgroundColor: '#DCFCE7',
  },
  busStopped: {
    backgroundColor: '#FEF9C3',
  },
  busStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#166534',
  },
  busLocationLarge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  busNextStop: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '600',
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  emergencySection: {
    padding: 20,
  },
  emergencyCard: {
    borderRadius: 16,
    padding: 20,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emergencyText: {
    flex: 1,
    marginLeft: 12,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  emergencyDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sosButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sosButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;