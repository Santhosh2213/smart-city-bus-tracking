// app/(tabs)/bus-tracking/bus-details.tsx
import React, { useState, useContext } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TrackingContext } from '../../../src/context/TrackingContext';

type BusTrackingStackParamList = {
  LiveTracking: undefined;
  BusDetails: { buses: any[] };
  OfflineMap: undefined;
};

type BusDetailsScreenNavigationProp = NativeStackNavigationProp<
  BusTrackingStackParamList,
  'BusDetails'
>;

type BusDetailsRouteProp = RouteProp<BusTrackingStackParamList, 'BusDetails'>;

// Fallback buses data in case params are not provided
const fallbackBuses = [
  {
    id: '1',
    busNumber: 'KA-01-AB-1234',
    route: 'Route 101',
    busType: 'AC',
    source: 'Downtown Station',
    destination: 'University Campus',
    departureTime: '08:00 AM',
    arrivalTime: '08:45 AM',
    totalDistance: '15 km',
    seatAvailability: 25,
    totalSeats: 40,
    ticketPrice: '₹45',
    status: 'on-time',
    currentLocation: 'Downtown Station',
    speed: 35,
    passengerLoad: 65,
    nextStop: 'City Center',
    progress: 65
  },
  {
    id: '2',
    busNumber: 'KA-01-CD-5678',
    route: 'Route 102',
    busType: 'Non-AC',
    source: 'City Center',
    destination: 'Railway Station',
    departureTime: '08:15 AM',
    arrivalTime: '09:00 AM',
    totalDistance: '12 km',
    seatAvailability: 12,
    totalSeats: 40,
    ticketPrice: '₹30',
    status: 'delayed',
    currentLocation: 'Main Road',
    speed: 28,
    passengerLoad: 85,
    nextStop: 'Market Square',
    progress: 45
  },
  {
    id: '3',
    busNumber: 'KA-01-EF-9012',
    route: 'Express 201',
    busType: 'Express',
    source: 'Airport',
    destination: 'City Center',
    departureTime: '08:30 AM',
    arrivalTime: '09:15 AM',
    totalDistance: '20 km',
    seatAvailability: 38,
    totalSeats: 40,
    ticketPrice: '₹60',
    status: 'on-time',
    currentLocation: 'Airport Terminal',
    speed: 40,
    passengerLoad: 25,
    nextStop: 'Highway Junction',
    progress: 15
  },
  {
    id: '4',
    busNumber: 'KA-01-GH-3456',
    route: 'Route 105',
    busType: 'AC Sleeper',
    source: 'Bus Depot',
    destination: 'Beach Front',
    departureTime: '09:00 AM',
    arrivalTime: '10:30 AM',
    totalDistance: '25 km',
    seatAvailability: 15,
    totalSeats: 30,
    ticketPrice: '₹75',
    status: 'on-time',
    currentLocation: 'Bus Depot',
    speed: 0,
    passengerLoad: 20,
    nextStop: 'Central Mall',
    progress: 0
  }
];

const BusDetailsScreen: React.FC = () => {
  const navigation = useNavigation<BusDetailsScreenNavigationProp>();
  const route = useRoute<BusDetailsRouteProp>();
  
  // Safely get buses from route params with fallback
  const buses = route.params?.buses || fallbackBuses;
  
  const { setAlert } = useContext(TrackingContext);
  
  const [alertStates, setAlertStates] = useState<{[key: string]: boolean}>({});
  const [favoriteStates, setFavoriteStates] = useState<{[key: string]: boolean}>({});

  const handleSetAlert = (busId: string) => {
    setAlert(busId);
    setAlertStates(prev => ({...prev, [busId]: true}));
    const bus = buses.find(b => b.id === busId);
    Alert.alert(
      'Alert Set',
      `You will be notified when ${bus?.route} is 10 minutes away`
    );
  };

  const handleShareBus = async (bus: any) => {
    try {
      await Share.share({
        message: `Check out ${bus.route} bus! ${bus.source} to ${bus.destination}. Departure: ${bus.departureTime}, Arrival: ${bus.arrivalTime}. Ticket: ${bus.ticketPrice}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share bus information');
    }
  };

  const handleToggleFavorite = (busId: string) => {
    setFavoriteStates(prev => {
      const newState = {...prev, [busId]: !prev[busId]};
      const bus = buses.find(b => b.id === busId);
      Alert.alert(
        newState[busId] ? 'Added to Favorites' : 'Removed from Favorites',
        `${bus?.route} ${newState[busId] ? 'added to' : 'removed from'} your favorites`
      );
      return newState;
    });
  };

  const handleBookNow = (bus: any) => {
    Alert.alert(
      'Book Ticket',
      `Proceed to book ${bus.route}?\n${bus.source} → ${bus.destination}\nDeparture: ${bus.departureTime}\nPrice: ${bus.ticketPrice}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => {
          // Navigate to booking screen or process booking
          Alert.alert('Success', `Booking confirmed for ${bus.route}`);
        }},
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return '#10B981';
      case 'delayed': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-time': return 'On Time';
      case 'delayed': return 'Delayed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getPassengerLoadColor = (load: number) => {
    if (load > 80) return '#EF4444';
    if (load > 50) return '#F59E0B';
    return '#10B981';
  };

  const getSeatAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return '#10B981';
    if (percentage > 20) return '#F59E0B';
    return '#EF4444';
  };

  const BusCard: React.FC<{ bus: any }> = ({ bus }) => (
    <View style={styles.busCard}>
      {/* Bus Header */}
      <View style={styles.busHeader}>
        <View style={styles.busBasicInfo}>
          <Text style={styles.busRoute}>{bus.route}</Text>
          <Text style={styles.busNumber}>{bus.busNumber}</Text>
          <View style={styles.busTypeBadge}>
            <Text style={styles.busTypeText}>{bus.busType}</Text>
          </View>
        </View>
        <View style={styles.busActions}>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => handleToggleFavorite(bus.id)}
          >
            <Ionicons 
              name={favoriteStates[bus.id] ? "heart" : "heart-outline"} 
              size={24} 
              color={favoriteStates[bus.id] ? "#EF4444" : "#666"} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={() => handleShareBus(bus)}
          >
            <Ionicons name="share-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Route Information */}
      <View style={styles.routeInfo}>
        <View style={styles.routeSegment}>
          <Text style={styles.routeTime}>{bus.departureTime}</Text>
          <Text style={styles.routePlace}>{bus.source}</Text>
        </View>
        <View style={styles.routeLine}>
          <View style={styles.routeDot} />
          <View style={styles.routeLineMiddle} />
          <View style={styles.routeDot} />
        </View>
        <View style={styles.routeSegment}>
          <Text style={styles.routeTime}>{bus.arrivalTime}</Text>
          <Text style={styles.routePlace}>{bus.destination}</Text>
        </View>
      </View>

      {/* Bus Details Grid */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Ionicons name="speedometer-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Distance</Text>
          <Text style={styles.detailValue}>{bus.totalDistance}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Seats</Text>
          <Text style={[styles.detailValue, { color: getSeatAvailabilityColor(bus.seatAvailability, bus.totalSeats) }]}>
            {bus.seatAvailability}/{bus.totalSeats}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Price</Text>
          <Text style={styles.detailValue}>{bus.ticketPrice}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Status</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bus.status) }]}>
            <Text style={styles.statusText}>{getStatusText(bus.status)}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[styles.alertButton, alertStates[bus.id] && styles.alertButtonActive]}
          onPress={() => handleSetAlert(bus.id)}
        >
          <Ionicons 
            name={alertStates[bus.id] ? "notifications" : "notifications-outline"} 
            size={18} 
            color={alertStates[bus.id] ? "#1a73e8" : "#666"} 
          />
          <Text style={[
            styles.alertButtonText,
            alertStates[bus.id] && styles.alertButtonTextActive
          ]}>
            {alertStates[bus.id] ? 'Alert Set' : 'Set Alert'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => handleBookNow(bus)}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Available Buses</Text>
            <Text style={styles.headerSubtitle}>{buses.length} buses found</Text>
          </View>
          <View style={styles.headerPlaceholder} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Buses List */}
        <View style={styles.busesList}>
          {buses.map((bus) => (
            <BusCard key={bus.id} bus={bus} />
          ))}
        </View>

        {/* Additional Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Bus Amenities</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="wifi-outline" size={20} color="#666" />
              <Text style={styles.infoText}>Free WiFi Available</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="snow-outline" size={20} color="#666" />
              <Text style={styles.infoText}>Air Conditioned</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="accessibility-outline" size={20} color="#666" />
              <Text style={styles.infoText}>Wheelchair Accessible</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="battery-charging-outline" size={20} color="#666" />
              <Text style={styles.infoText}>USB Charging Ports</Text>
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
    backgroundColor: '#f8f9fa',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  busesList: {
    padding: 16,
    gap: 16,
  },
  busCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  busBasicInfo: {
    flex: 1,
  },
  busRoute: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  busNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  busTypeBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  busTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a73e8',
  },
  busActions: {
    flexDirection: 'row',
    gap: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  shareButton: {
    padding: 4,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  routeSegment: {
    flex: 1,
  },
  routeTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  routePlace: {
    fontSize: 14,
    color: '#666',
  },
  routeLine: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1a73e8',
  },
  routeLineMiddle: {
    width: 2,
    height: 20,
    backgroundColor: '#e5e7eb',
    marginVertical: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  detailItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  alertButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  alertButtonActive: {
    borderColor: '#1a73e8',
    backgroundColor: '#f0f7ff',
  },
  alertButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  alertButtonTextActive: {
    color: '#1a73e8',
  },
  bookButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#1a73e8',
    borderRadius: 8,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  infoSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
});

export default BusDetailsScreen;