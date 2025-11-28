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
  BusDetails: { bus: any };
  OfflineMap: undefined;
};

type BusDetailsScreenNavigationProp = NativeStackNavigationProp<
  BusTrackingStackParamList,
  'BusDetails'
>;

type BusDetailsRouteProp = RouteProp<BusTrackingStackParamList, 'BusDetails'>;

// Fallback bus data in case params are not provided
const fallbackBus = {
  id: '1',
  route: 'Route 101',
  currentLocation: 'Downtown Station',
  destination: 'University Campus',
  arrivalTime: 8,
  speed: 35,
  passengerLoad: 65,
  status: 'moving',
  nextStop: 'City Center',
  progress: 65
};

const BusDetailsScreen: React.FC = () => {
  const navigation = useNavigation<BusDetailsScreenNavigationProp>();
  const route = useRoute<BusDetailsRouteProp>();
  
  // Safely get bus from route params with fallback
  const bus = route.params?.bus || fallbackBus;
  
  const { setAlert } = useContext(TrackingContext);
  
  const [isAlertSet, setIsAlertSet] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleSetAlert = () => {
    setAlert(bus.id);
    setIsAlertSet(true);
    Alert.alert(
      'Alert Set',
      `You will be notified when ${bus.route} is 10 minutes away`
    );
  };

  const handleShareBus = async () => {
    try {
      await Share.share({
        message: `Check out ${bus.route} bus! Current location: ${bus.currentLocation}. Arriving in ${bus.arrivalTime} minutes.`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share bus information');
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      `${bus.route} ${isFavorite ? 'removed from' : 'added to'} your favorites`
    );
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

  const DetailRow: React.FC<{ icon: string; label: string; value: string }> = ({
    icon,
    label,
    value,
  }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailLabel}>
        <Ionicons name={icon as any} size={20} color="#666" />
        <Text style={styles.detailLabelText}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value}</Text>
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
            <Text style={styles.headerTitle}>Bus Details</Text>
            <Text style={styles.headerSubtitle}>{bus.route}</Text>
          </View>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShareBus}
          >
            <Ionicons name="share-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Bus Overview Card */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <View style={styles.busInfo}>
              <Text style={styles.busRoute}>{bus.route}</Text>
              <Text style={styles.busDescription}>Express service to {bus.destination}</Text>
            </View>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#EF4444" : "#666"} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.statusSection}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Current Status</Text>
              <View style={[
                styles.statusBadge,
                bus.status === 'moving' ? styles.statusMoving : styles.statusStopped
              ]}>
                <Text style={styles.statusText}>
                  {bus.status === 'moving' ? 'Moving' : 'Stopped'}
                </Text>
              </View>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Passenger Load</Text>
              <View style={[
                styles.passengerLoadBadge,
                { backgroundColor: getPassengerLoadColor(bus.passengerLoad) }
              ]}>
                <Text style={styles.passengerLoadText}>
                  {getPassengerLoadText(bus.passengerLoad)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={[styles.actionButton, isAlertSet && styles.actionButtonActive]}
            onPress={handleSetAlert}
          >
            <Ionicons 
              name={isAlertSet ? "notifications" : "notifications-outline"} 
              size={24} 
              color={isAlertSet ? "#1a73e8" : "#666"} 
            />
            <Text style={[
              styles.actionText,
              isAlertSet && styles.actionTextActive
            ]}>
              {isAlertSet ? 'Alert Set' : 'Set Alert'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('LiveTracking')}
          >
            <Ionicons name="locate-outline" size={24} color="#666" />
            <Text style={styles.actionText}>Live Track</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="time-outline" size={24} color="#666" />
            <Text style={styles.actionText}>Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* Bus Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Bus Information</Text>
          
          <View style={styles.detailsCard}>
            <DetailRow
              icon="location-outline"
              label="Current Location"
              value={bus.currentLocation}
            />
            <DetailRow
              icon="navigate-outline"
              label="Destination"
              value={bus.destination}
            />
            <DetailRow
              icon="time-outline"
              label="Arrival Time"
              value={`${bus.arrivalTime} minutes`}
            />
            <DetailRow
              icon="speedometer-outline"
              label="Current Speed"
              value={`${bus.speed} km/h`}
            />
            <DetailRow
              icon="people-outline"
              label="Passenger Count"
              value={`${bus.passengerLoad}% capacity`}
            />
            <DetailRow
              icon="bus-outline"
              label="Bus Type"
              value="Air Conditioned"
            />
          </View>
        </View>

        {/* Route Information */}
        <View style={styles.routeSection}>
          <Text style={styles.sectionTitle}>Route Information</Text>
          
          <View style={styles.routeCard}>
            <View style={styles.routeTimeline}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Starting Point</Text>
                  <Text style={styles.timelineSubtitle}>Bus Depot</Text>
                  <Text style={styles.timelineTime}>08:00 AM</Text>
                </View>
              </View>
              
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.timelineDotCurrent]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Current Location</Text>
                  <Text style={styles.timelineSubtitle}>{bus.currentLocation}</Text>
                  <Text style={styles.timelineTime}>Now</Text>
                </View>
              </View>
              
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Next Stop</Text>
                  <Text style={styles.timelineSubtitle}>{bus.nextStop || 'City Center'}</Text>
                  <Text style={styles.timelineTime}>
                    {bus.arrivalTime} min
                  </Text>
                </View>
              </View>
              
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Final Destination</Text>
                  <Text style={styles.timelineSubtitle}>{bus.destination}</Text>
                  <Text style={styles.timelineTime}>45 min</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Additional Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Additional Info</Text>
          
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
  shareButton: {
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
  overviewCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  busInfo: {
    flex: 1,
  },
  busRoute: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  busDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  favoriteButton: {
    padding: 4,
  },
  statusSection: {
    flexDirection: 'row',
    gap: 16,
  },
  statusItem: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusMoving: {
    backgroundColor: '#DCFCE7',
  },
  statusStopped: {
    backgroundColor: '#FEF9C3',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  passengerLoadBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  passengerLoadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  actionsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionButtonActive: {
    borderColor: '#1a73e8',
    backgroundColor: '#f0f7ff',
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  actionTextActive: {
    color: '#1a73e8',
  },
  detailsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabelText: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  routeSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  routeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  routeTimeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
    marginTop: 4,
    marginRight: 16,
  },
  timelineDotCurrent: {
    backgroundColor: '#1a73e8',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#1a73e8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  timelineSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  timelineTime: {
    fontSize: 11,
    color: '#1a73e8',
    fontWeight: '600',
  },
  infoSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
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