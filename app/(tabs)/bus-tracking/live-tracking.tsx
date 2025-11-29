// app/(tabs)/bus-tracking/live-tracking.tsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TrackingContext } from '../../../src/context/TrackingContext';
import { AuthContext } from '../../../src/context/AuthContext';

type BusTrackingStackParamList = {
  LiveTracking: undefined;
  BusDetails: { bus: any };
  OfflineMap: undefined;
};

type LiveTrackingScreenNavigationProp = NativeStackNavigationProp<
  BusTrackingStackParamList,
  'LiveTracking'
>;

const { width, height } = Dimensions.get('window');

// Mock data for buses
const mockBuses = [
  {
    id: '1',
    route: 'Route 101',
    currentLocation: 'Downtown Station',
    destination: 'University Campus',
    arrivalTime: 8,
    speed: 35,
    passengerLoad: 65,
    latitude: 12.9716,
    longitude: 77.5946,
    status: 'moving',
    nextStop: 'City Center',
    progress: 65
  },
  {
    id: '2',
    route: 'Route 202',
    currentLocation: 'City Mall',
    destination: 'Airport Terminal',
    arrivalTime: 12,
    speed: 42,
    passengerLoad: 85,
    latitude: 12.9352,
    longitude: 77.6245,
    status: 'moving',
    nextStop: 'Business District',
    progress: 45
  },
  {
    id: '3',
    route: 'Route 303',
    currentLocation: 'Central Station',
    destination: 'Hospital Complex',
    arrivalTime: 5,
    speed: 28,
    passengerLoad: 45,
    latitude: 12.9279,
    longitude: 77.6271,
    status: 'stopped',
    nextStop: 'Medical Center',
    progress: 75
  }
];

const LiveTrackingScreen: React.FC = () => {
  const navigation = useNavigation<LiveTrackingScreenNavigationProp>();
  const { user } = useContext(AuthContext);
  const { currentBus, nearbyBuses, isLoading, refreshTracking } = useContext(TrackingContext);
  
  const [selectedBus, setSelectedBus] = useState<any>(null);
  const [buses, setBuses] = useState(mockBuses);

  const handleBusSelect = (bus: any) => {
    setSelectedBus(bus);
  };

  const handleRefresh = () => {
    // Simulate refresh
    setBuses([...mockBuses]);
    Alert.alert('Refreshed', 'Bus locations updated');
  };

  const handleNavigateToBusDetails = (bus: any) => {
    navigation.navigate('BusDetails', { bus });
  };

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

  const BusCard: React.FC<{ bus: any; isSelected: boolean }> = ({ bus, isSelected }) => (
    <TouchableOpacity
      style={[
        styles.busCard,
        isSelected && styles.selectedBusCard
      ]}
      onPress={() => handleBusSelect(bus)}
    >
      <View style={styles.busHeader}>
        <View style={styles.busRouteInfo}>
          <Text style={styles.busRoute}>{bus.route}</Text>
          <Text style={styles.busDestination}>To: {bus.destination}</Text>
        </View>
        <View style={[
          styles.passengerLoad,
          { backgroundColor: getPassengerLoadColor(bus.passengerLoad) }
        ]}>
          <Text style={styles.passengerLoadText}>
            {getPassengerLoadText(bus.passengerLoad)}
          </Text>
        </View>
      </View>
      
      <View style={styles.busDetails}>
        <View style={styles.busDetailRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.busLocation}>{bus.currentLocation}</Text>
        </View>
        
        <View style={styles.busStats}>
          <View style={styles.busStat}>
            <Ionicons name="time-outline" size={14} color="#1a73e8" />
            <Text style={styles.busStatText}>{bus.arrivalTime} min</Text>
          </View>
          <View style={styles.busStat}>
            <Ionicons name="speedometer-outline" size={14} color="#1a73e8" />
            <Text style={styles.busStatText}>{bus.speed} km/h</Text>
          </View>
          <View style={styles.busStat}>
            <Ionicons name="people-outline" size={14} color="#1a73e8" />
            <Text style={styles.busStatText}>{bus.passengerLoad}%</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.busActions}>
        <TouchableOpacity 
          style={styles.trackButton}
          onPress={() => handleNavigateToBusDetails(bus)}
        >
          <Ionicons name="navigate-outline" size={16} color="#1a73e8" />
          <Text style={styles.trackButtonText}>Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text style={styles.loadingText}>Loading bus locations...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <LinearGradient
        colors={['#1a73e8', '#4285f4']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Live Bus Tracking</Text>
            <Text style={styles.headerSubtitle}>
              {buses.length} buses nearby • Real-time updates
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.offlineButton}
            onPress={() => navigation.navigate('OfflineMap')}
          >
            <Ionicons name="download-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Map Placeholder Section */}
        <View style={styles.mapContainer}>
          <LinearGradient
            colors={['#4F46E5', '#7C73E6']}
            style={styles.mapPlaceholder}
          >
            <Ionicons name="map-outline" size={48} color="#fff" />
            <Text style={styles.mapPlaceholderTitle}>Live Bus Map</Text>
            <Text style={styles.mapPlaceholderText}>
              Real-time bus locations and routes
            </Text>
            <View style={styles.mapStats}>
              <View style={styles.mapStat}>
                <Text style={styles.mapStatNumber}>{buses.length}</Text>
                <Text style={styles.mapStatLabel}>Active Buses</Text>
              </View>
              <View style={styles.mapStat}>
                <Text style={styles.mapStatNumber}>12</Text>
                <Text style={styles.mapStatLabel}>Routes</Text>
              </View>
              <View style={styles.mapStat}>
                <Text style={styles.mapStatNumber}>98%</Text>
                <Text style={styles.mapStatLabel}>On Time</Text>
              </View>
            </View>
          </LinearGradient>
          
          {/* Map Controls */}
          <View style={styles.mapControls}>
            <TouchableOpacity style={styles.mapControlButton} onPress={handleRefresh}>
              <Ionicons name="refresh" size={20} color="#1a73e8" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapControlButton}>
              <Ionicons name="locate" size={20} color="#1a73e8" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapControlButton}>
              <Ionicons name="layers" size={20} color="#1a73e8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bus List Section */}
        <View style={styles.busListContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Buses</Text>
            <TouchableOpacity onPress={handleRefresh}>
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.busList}
            showsVerticalScrollIndicator={false}
          >
            {buses.map((bus) => (
              <BusCard
                key={bus.id}
                bus={bus}
                isSelected={selectedBus?.id === bus.id}
              />
            ))}
          </ScrollView>
        </View>

        {/* Selected Bus Details */}
        {selectedBus && (
          <View style={styles.selectedBusPanel}>
            <View style={styles.selectedBusHeader}>
              <Text style={styles.selectedBusTitle}>{selectedBus.route}</Text>
              <TouchableOpacity onPress={() => setSelectedBus(null)}>
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.selectedBusDetails}>
              <View style={styles.selectedBusDetail}>
                <Text style={styles.selectedBusLabel}>Current Location</Text>
                <Text style={styles.selectedBusValue}>{selectedBus.currentLocation}</Text>
              </View>
              <View style={styles.selectedBusDetail}>
                <Text style={styles.selectedBusLabel}>Arrival Time</Text>
                <Text style={styles.selectedBusValue}>{selectedBus.arrivalTime} minutes</Text>
              </View>
              <View style={styles.selectedBusDetail}>
                <Text style={styles.selectedBusLabel}>Status</Text>
                <View style={[
                  styles.statusBadge,
                  selectedBus.status === 'moving' ? styles.statusMoving : styles.statusStopped
                ]}>
                  <Text style={styles.statusText}>
                    {selectedBus.status === 'moving' ? 'Moving' : 'Stopped'}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => handleNavigateToBusDetails(selectedBus)}
            >
              <Text style={styles.viewDetailsButtonText}>View Full Details</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  offlineButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    height: height * 0.3,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapPlaceholderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 8,
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  mapStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  mapStat: {
    alignItems: 'center',
  },
  mapStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  mapStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 8,
  },
  mapControlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  busListContainer: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  refreshText: {
    color: '#1a73e8',
    fontWeight: '600',
    fontSize: 14,
  },
  busList: {
    flex: 1,
  },
  busCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBusCard: {
    borderColor: '#1a73e8',
    backgroundColor: '#f0f7ff',
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  busRouteInfo: {
    flex: 1,
  },
  busRoute: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  busDestination: {
    fontSize: 14,
    color: '#666',
  },
  passengerLoad: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  passengerLoadText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  busDetails: {
    marginBottom: 12,
  },
  busDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  busLocation: {
    fontSize: 14,
    color: '#666',
  },
  busStats: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  busStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  busStatText: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '600',
  },
  busActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
  },
  trackButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a73e8',
  },
  selectedBusPanel: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedBusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedBusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  selectedBusDetails: {
    gap: 8,
    marginBottom: 16,
  },
  selectedBusDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedBusLabel: {
    fontSize: 14,
    color: '#666',
  },
  selectedBusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusMoving: {
    backgroundColor: '#DCFCE7',
  },
  statusStopped: {
    backgroundColor: '#FEF9C3',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#166534',
  },
  viewDetailsButton: {
    backgroundColor: '#1a73e8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewDetailsButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LiveTrackingScreen;