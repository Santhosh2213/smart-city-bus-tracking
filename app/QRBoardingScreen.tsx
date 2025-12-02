// QRBoardingScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
// Remove the duplicate imports below and use this single import:
import { database, databaseService } from '../firebaseConfig'; // Adjust path as needed
import { ref, onValue, get } from 'firebase/database'; // Import Firebase functions separately

const { width: screenWidth } = Dimensions.get('window');

interface BusDetails {
  id: string;
  number: string;
  route: string;
  destination: string;
  nextStop: string;
  arrivalTime: string;
  capacity: number;
  currentLocation: string;
  driver: string;
  lastUpdated: string;
  estimatedArrival: string;
  qrCode?: string;
  active: boolean;
  routeId: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface CheckInData {
  id: string;
  userId: string;
  busId: string;
  busNumber: string;
  timestamp: string;
  checkOutTime?: string;
  active: boolean;
  location?: string;
}

export default function QRBoardingScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [busDetails, setBusDetails] = useState<BusDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [scannedData, setScannedData] = useState<string>('');
  const [currentCheckIn, setCurrentCheckIn] = useState<CheckInData | null>(null);
  const [userId] = useState('user_' + Math.random().toString(36).substr(2, 9)); // Temporary user ID

  useEffect(() => {
    // Request camera permission when component mounts
    if (permission && !permission.granted) {
      requestPermission();
    }
    
    // Check if user has an active check-in
    checkActiveCheckIn();
  }, [permission]);

  const checkActiveCheckIn = async () => {
    try {
      // In a real app, you would query Firebase for active check-ins
      // This is a simplified version
      const checkInsRef = ref(database, 'checkIns');
      const snapshot = await get(checkInsRef);
      if (snapshot.exists()) {
        const checkIns = snapshot.val();
        // Find active check-in for this user
        for (const id in checkIns) {
          if (checkIns[id].userId === userId && checkIns[id].active) {
            setCurrentCheckIn(checkIns[id]);
            setHasCheckedIn(true);
            // Load bus details for this check-in
            loadBusDetails(checkIns[id].busId);
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error checking active check-ins:', error);
    }
  };

  const loadBusDetails = async (busId: string) => {
    setIsLoading(true);
    setCameraActive(false);
    setScannedData(busId);
    
    try {
      // Log the scan to Firebase
      await databaseService.logScan(busId, userId);
      
      // Fetch bus details from Firebase
      const busRef = ref(database, `buses/${busId}`);
      const snapshot = await get(busRef);
      
      if (snapshot.exists()) {
        const busData = snapshot.val();
        setBusDetails({
          id: busId,
          ...busData
        });
      } else {
        // If bus doesn't exist in Firebase, use mock data
        const mockBus = getMockBusData(busId);
        setBusDetails(mockBus);
        
        // Optionally save this bus to Firebase for future reference
        await databaseService.addOrUpdateBus(busId, mockBus);
      }
    } catch (error) {
      console.error('Error loading bus details:', error);
      // Fallback to mock data
      const mockBus = getMockBusData(busId);
      setBusDetails(mockBus);
    } finally {
      setIsLoading(false);
    }
  };

  const getMockBusData = (busId: string): BusDetails => {
    const mockData: { [key: string]: BusDetails } = {
      'bus_205_route_12': {
        id: 'bus_205_route_12',
        number: '205',
        route: 'Route 12 - Downtown Express',
        destination: 'City Center',
        nextStop: 'Main Street Station',
        arrivalTime: '5 min',
        capacity: 65,
        currentLocation: 'Corner of 5th Ave & Pine St',
        driver: 'John Smith',
        lastUpdated: new Date().toISOString(),
        estimatedArrival: '2:45 PM',
        active: true,
        routeId: 'route_12',
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        }
      },
      'bus_107_route_5': {
        id: 'bus_107_route_5',
        number: '107',
        route: 'Route 5 - University Line',
        destination: 'Campus West',
        nextStop: 'University Library',
        arrivalTime: '8 min',
        capacity: 42,
        currentLocation: 'Near Student Union',
        driver: 'Maria Garcia',
        lastUpdated: new Date().toISOString(),
        estimatedArrival: '2:48 PM',
        active: true,
        routeId: 'route_5',
        coordinates: {
          latitude: 40.7306,
          longitude: -73.9352
        }
      },
      'demo_bus_qr': {
        id: 'demo_bus_qr',
        number: '308',
        route: 'Route 8 - Riverside Loop',
        destination: 'Riverside Park',
        nextStop: 'Central Market',
        arrivalTime: '12 min',
        capacity: 38,
        currentLocation: 'Approaching Market Square',
        driver: 'David Chen',
        lastUpdated: new Date().toISOString(),
        estimatedArrival: '2:52 PM',
        active: true,
        routeId: 'route_8',
        coordinates: {
          latitude: 40.7589,
          longitude: -73.9851
        }
      }
    };
    
    return mockData[busId] || mockData['demo_bus_qr'];
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    Alert.alert(
      'QR Code Scanned Successfully!',
      `Bus ID: ${data}`,
      [
        {
          text: 'View Bus Details',
          onPress: () => loadBusDetails(data)
        },
        {
          text: 'Scan Again',
          style: 'cancel',
          onPress: () => {
            setScanned(false);
            setCameraActive(true);
          }
        }
      ]
    );
  };

  const handleCheckIn = async () => {
    if (!busDetails) return;
    
    try {
      const checkInData = {
        userId,
        busId: busDetails.id,
        busNumber: busDetails.number,
        location: busDetails.currentLocation,
        route: busDetails.route,
        estimatedArrival: busDetails.estimatedArrival
      };
      
      // Save check-in to Firebase
      await databaseService.addCheckIn(userId, busDetails.id, checkInData);
      
      setHasCheckedIn(true);
      Alert.alert(
        'Check-in Successful! 🎉',
        `You have safely checked into Bus ${busDetails.number}.\n\nYour journey is now being monitored for safety.`,
        [
          {
            text: 'OK',
            onPress: () => {}
          }
        ]
      );
      
      // Start listening for bus updates
      databaseService.listenToBusUpdates(busDetails.id, (updatedBusData) => {
        if (updatedBusData) {
          setBusDetails(prev => ({
            ...prev!,
            ...updatedBusData,
            lastUpdated: new Date().toISOString()
          }));
        }
      });
      
    } catch (error) {
      console.error('Error during check-in:', error);
      Alert.alert(
        'Error',
        'Failed to check in. Please try again.'
      );
    }
  };

  const handleCheckOut = async () => {
    if (!currentCheckIn) return;
    
    try {
      await databaseService.updateCheckInStatus(currentCheckIn.id, false);
      
      setHasCheckedIn(false);
      setCurrentCheckIn(null);
      Alert.alert(
        'Check-out Successful',
        `You have checked out of Bus ${busDetails?.number}.`,
        [
          {
            text: 'OK',
            onPress: () => {}
          }
        ]
      );
    } catch (error) {
      console.error('Error during check-out:', error);
      Alert.alert(
        'Error',
        'Failed to check out. Please try again.'
      );
    }
  };

  const handleTrackBus = () => {
    if (!busDetails) return;
    
    Alert.alert(
      'Live Tracking',
      `Opening live map for Bus ${busDetails.number}...\n\nYou can track its real-time location and route.`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to tracking screen with bus details
            router.push({
              pathname: '/tracking',
              params: {
                busId: busDetails.id,
                busNumber: busDetails.number,
                route: busDetails.route,
                coordinates: JSON.stringify(busDetails.coordinates)
              }
            });
          }
        }
      ]
    );
  };

  const handleViewRoute = () => {
    if (!busDetails) return;
    
    Alert.alert(
      'Bus Route',
      `Showing complete route for ${busDetails.route}:\n\n• ${busDetails.currentLocation}\n• ${busDetails.nextStop}\n• ${busDetails.destination}`,
      [
        {
          text: 'OK',
          onPress: () => {}
        }
      ]
    );
  };

  const resetScanner = () => {
    setScanned(false);
    setBusDetails(null);
    setHasCheckedIn(false);
    setCurrentCheckIn(null);
    setCameraActive(true);
    setScannedData('');
  };

  const renderCamera = () => (
    <View style={styles.cameraContainer}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.cameraOverlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanText}>Scan Bus QR Code</Text>
          <Text style={styles.scanSubText}>
            Position the QR code within the frame
          </Text>
        </View>
      </CameraView>
    </View>
  );

  const renderBusDetails = () => {
    if (!busDetails) return null;

    return (
      <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
        {/* Bus Card */}
        <View style={styles.busCard}>
          <View style={styles.busHeader}>
            <Text style={styles.busRoute}>{busDetails.route}</Text>
            <Text style={styles.busNumber}>Bus #{busDetails.number}</Text>
          </View>
          
          <View style={styles.busInfoRow}>
            <Ionicons name="location" size={20} color="#6E473B" />
            <Text style={styles.busInfoText}>
              Current: {busDetails.currentLocation}
            </Text>
          </View>
          
          <View style={styles.busInfoRow}>
            <Ionicons name="navigate" size={20} color="#6E473B" />
            <Text style={styles.busInfoText}>
              Destination: {busDetails.destination}
            </Text>
          </View>
          
          <View style={styles.busInfoRow}>
            <Ionicons name="bus" size={20} color="#6E473B" />
            <Text style={styles.busInfoText}>
              Next Stop: {busDetails.nextStop} • {busDetails.arrivalTime}
            </Text>
          </View>
          
          <View style={styles.busInfoRow}>
            <Ionicons name="person" size={20} color="#6E473B" />
            <Text style={styles.busInfoText}>
              Driver: {busDetails.driver}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsSection}>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleTrackBus}
            >
              <LinearGradient
                colors={['#6E473B', '#8A5D4B']}
                style={styles.actionIcon}
              >
                <Ionicons name="navigate" size={24} color="#E1D4C2" />
              </LinearGradient>
              <Text style={styles.actionText}>Live Track</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={hasCheckedIn ? handleCheckOut : handleCheckIn}
            >
              <LinearGradient
                colors={hasCheckedIn ? ['#6E473B', '#8A5D4B'] : ['#6E473B', '#8A5D4B']}
                style={styles.actionIcon}
              >
                <Ionicons 
                  name={hasCheckedIn ? "exit-outline" : "checkmark-circle"} 
                  size={24} 
                  color="#E1D4C2" 
                />
              </LinearGradient>
              <Text style={styles.actionText}>
                {hasCheckedIn ? 'Check Out' : 'Check In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bus Information */}
        <Text style={styles.sectionTitle}>Bus Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bus Number:</Text>
            <Text style={styles.infoValue}>{busDetails.number}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Route:</Text>
            <Text style={styles.infoValue}>{busDetails.route}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Capacity:</Text>
            <Text style={styles.infoValue}>{busDetails.capacity} passengers</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <View style={[styles.statusBadge, busDetails.active ? styles.statusActive : styles.statusInactive]}>
              <Text style={styles.statusText}>
                {busDetails.active ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>{new Date(busDetails.lastUpdated).toLocaleTimeString()}</Text>
          </View>
        </View>

        {/* Reset Scanner Button */}
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={resetScanner}
        >
          <Text style={styles.resetButtonText}>Scan Another QR Code</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#291C0E" />
        <ActivityIndicator size="large" color="#6E473B" />
        <Text style={styles.loadingText}>Loading bus details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#291C0E" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#E1D4C2" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>QR Boarding</Text>
          <Text style={styles.headerSubtitle}>Scan bus QR code to board</Text>
        </View>
        <View style={{ width: 40 }} /> {/* Spacer for alignment */}
      </View>

      {/* Camera or Bus Details */}
      {cameraActive ? renderCamera() : renderBusDetails()}

      {/* If camera not active and no bus details, show scan button */}
      {!cameraActive && !busDetails && (
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={() => setCameraActive(true)}
        >
          <Text style={styles.resetButtonText}>Open Camera Scanner</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F5F0',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6E473B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#291C0E',
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E1D4C2',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#BEB5A9',
    textAlign: 'center',
    marginTop: 4,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#291C0E',
  },
  camera: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    borderWidth: 4,
    borderColor: '#6E473B',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  scanText: {
    marginTop: 24,
    fontSize: 16,
    color: '#E1D4C2',
    fontWeight: '600',
    textAlign: 'center',
  },
  scanSubText: {
    fontSize: 14,
    color: '#BEB5A9',
    textAlign: 'center',
    marginTop: 8,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#F8F5F0',
  },
  busCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  busRoute: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#291C0E',
    flex: 1,
    marginRight: 12,
  },
  busNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6E473B',
    backgroundColor: '#E1D4C2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  busInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  busInfoText: {
    fontSize: 14,
    color: '#291C0E',
    marginLeft: 12,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#291C0E',
    marginTop: 24,
    marginBottom: 16,
    marginHorizontal: 24,
  },
  actionsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#291C0E',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6E473B',
    fontWeight: '400',
  },
  infoValue: {
    fontSize: 14,
    color: '#291C0E',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusActive: {
    backgroundColor: '#E1D4C2',
  },
  statusInactive: {
    backgroundColor: '#F8D7C2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#291C0E',
  },
  resetButton: {
    backgroundColor: '#6E473B',
    marginHorizontal: 24,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  resetButtonText: {
    color: '#E1D4C2',
    fontSize: 16,
    fontWeight: '600',
  },
});