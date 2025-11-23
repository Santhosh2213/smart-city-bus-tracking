// src/screens/Home/HomeScreen.tsx
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { AuthContext } from '../../context/AuthContext';
import { TrackingContext } from '../../context/TrackingContext';
import MapViewComponent from '../../components/Map/MapViewComponent';
import PassengerLoadIndicator from '../../components/Map/PassengerLoadIndicator';
import SOSButton from '../../components/Buttons/SOSButton';
import BusCard from '../../components/Cards/BusCard';
import NotificationCard from '../../components/Cards/NotificationCard';
import Loader from '../../components/Loader';
import { Bus, Notification } from '../../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Home'>;

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useContext(AuthContext);
  const { currentBus, nearbyBuses, isLoading } = useContext(TrackingContext);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'map' | 'schedule' | 'tracking'>('map');

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate loading notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Route 101 Delayed',
        message: 'Route 101 is experiencing 10-minute delays due to traffic',
        type: 'warning',
        timestamp: new Date(),
        isRead: false,
      },
      {
        id: '2',
        title: 'New Feature Available',
        message: 'Offline maps are now available for download',
        type: 'info',
        timestamp: new Date(Date.now() - 3600000),
        isRead: true,
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'qr':
        navigation.navigate('QRScan');
        break;
      case 'schedule':
        navigation.navigate('BusSchedule');
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
      default:
        break;
    }
  };

  const QuickActionButton: React.FC<{
    icon: string;
    label: string;
    action: string;
    color: string;
  }> = ({ icon, label, action, color }) => (
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
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <Loader message="Loading bus information..." />;
  }

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
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
            <Text style={styles.subtitle}>Welcome to SmartBus</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Bus Status */}
        {currentBus && (
          <View style={styles.currentBusSection}>
            <Text style={styles.sectionTitle}>Current Bus</Text>
            <BusCard 
              bus={currentBus}
              onPress={() => navigation.navigate('BusDetails', { bus: currentBus })}
            />
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionButton 
              icon="📷" 
              label="QR Scan" 
              action="qr"
              color="#34A853"
            />
            <QuickActionButton 
              icon="📅" 
              label="Schedule" 
              action="schedule"
              color="#FBBC05"
            />
            <QuickActionButton 
              icon="🚨" 
              label="SOS Alert" 
              action="sos"
              color="#EA4335"
            />
            <QuickActionButton 
              icon="👶" 
              label="Child Mode" 
              action="child"
              color="#4285F4"
            />
            <QuickActionButton 
              icon="🗺️" 
              label="Offline Map" 
              action="offline"
              color="#9C27B0"
            />
            <QuickActionButton 
              icon="🔔" 
              label="Notifications" 
              action="notifications"
              color="#FF6D00"
            />
          </View>
        </View>

        {/* Interactive Map */}
        <View style={styles.mapSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Tracking</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LiveTracking')}>
              <Text style={styles.seeAllText}>View Full Map</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mapContainer}>
            <MapViewComponent
              buses={nearbyBuses}
              currentLocation={null} // Will be provided by context
              style={styles.map}
              interactive={true}
            />
          </View>
        </View>

        {/* Nearby Buses */}
        {nearbyBuses.length > 0 && (
          <View style={styles.nearbyBusesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby Buses</Text>
              <TouchableOpacity onPress={() => navigation.navigate('RouteFinder')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {nearbyBuses.slice(0, 5).map((bus) => (
                <View key={bus.id} style={styles.busCardWrapper}>
                  <BusCard 
                    bus={bus}
                    compact={true}
                    onPress={() => navigation.navigate('BusDetails', { bus })}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Notifications */}
        <View style={styles.notificationsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {notifications.slice(0, 3).map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onPress={() => {/* Handle notification press */}}
            />
          ))}
        </View>

        {/* SOS Emergency Button */}
        <View style={styles.sosSection}>
          <SOSButton 
            onPress={() => handleQuickAction('sos')}
            style={styles.sosButton}
          />
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
  profileIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    color: '#1a73e8',
    fontWeight: '600',
  },
  currentBusSection: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  },
  quickActionButton: {
    width: (width - 60) / 3, // 3 items per row with padding
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
  quickActionLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    fontWeight: '500',
  },
  mapSection: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 8,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  nearbyBusesSection: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 8,
  },
  horizontalScroll: {
    marginHorizontal: -20,
  },
  busCardWrapper: {
    marginRight: 12,
    width: width * 0.7,
  },
  notificationsSection: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 8,
  },
  sosSection: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  sosButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default HomeScreen;