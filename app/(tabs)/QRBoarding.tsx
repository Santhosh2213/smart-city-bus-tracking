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

  // Mock bus data - in real app, this would come from API
  const mockBusData: { [key: string]: BusDetails } = {
    'bus_205_route_12': {
      id: '1',
      number: '205',
      route: 'Route 12 - Downtown Express',
      destination: 'City Center',
      nextStop: 'Main Street Station',
      arrivalTime: '5 min',
      capacity: 65,
      currentLocation: 'Corner of 5th Ave & Pine St',
      driver: 'John Smith',
      lastUpdated: '2 minutes ago',
      estimatedArrival: '2:45 PM'
    },
    'bus_107_route_5': {
      id: '2',
      number: '107',
      route: 'Route 5 - University Line',
      destination: 'Campus West',
      nextStop: 'University Library',
      arrivalTime: '8 min',
      capacity: 42,
      currentLocation: 'Near Student Union',
      driver: 'Maria Garcia',
      lastUpdated: '1 minute ago',
      estimatedArrival: '2:48 PM'
    },
    'demo_bus_qr': {
      id: '3',
      number: '308',
      route: 'Route 8 - Riverside Loop',
      destination: 'Riverside Park',
      nextStop: 'Central Market',
      arrivalTime: '12 min',
      capacity: 38,
      currentLocation: 'Approaching Market Square',
      driver: 'David Chen',
      lastUpdated: '3 minutes ago',
      estimatedArrival: '2:52 PM'
    }
  };

  useEffect(() => {
    // Request camera permission when component mounts
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const loadBusDetails = async (busId: string) => {
    setIsLoading(true);
    setCameraActive(false);
    setScannedData(busId);
    
    // Simulate API call
    setTimeout(() => {
      const bus = mockBusData[busId] || mockBusData['demo_bus_qr'];
      setBusDetails(bus);
      setIsLoading(false);
    }, 1500);
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

  const handleCheckIn = () => {
    if (!busDetails) return;
    
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
            // In real app, navigate to tracking screen
            // router.push(`/tracking?busId=${busDetails.id}`);
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
    setCameraActive(true);
    setScannedData('');
  };

  const renderScanner = () => {
    if (!permission) {
      return (
        <View style={styles.centerContainer}>
          <Text>Requesting camera permission...</Text>
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={80} color="#64748b" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            SmartBus needs camera access to scan bus QR codes for quick boarding and real-time information.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.scannerContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417'],
          }}
        >
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </View>
            <Text style={styles.scannerText}>
              Point your camera at the bus QR code
            </Text>
            <Text style={styles.scannerSubtext}>
              Align the QR code within the frame to scan
            </Text>
          </View>
        </CameraView>
      </View>
    );
  };

  const renderBusDetails = () => {
    if (!busDetails) return null;

    return (
      <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
        {/* Bus Overview Card */}
        <View style={styles.overviewCard}>
          <LinearGradient
            colors={['#4F46E5', '#7C73E6']}
            style={styles.overviewGradient}
          >
            <View style={styles.busHeader}>
              <View style={styles.busNumberLarge}>
                <Text style={styles.busNumberTextLarge}>{busDetails.number}</Text>
              </View>
              <View style={styles.busInfo}>
                <Text style={styles.routeName}>{busDetails.route}</Text>
                <Text style={styles.destination}>To: {busDetails.destination}</Text>
              </View>
            </View>
            
            <View style={styles.arrivalInfo}>
              <View style={styles.arrivalTime}>
                <Ionicons name="time" size={20} color="#fff" />
                <Text style={styles.arrivalTimeText}>{busDetails.arrivalTime}</Text>
              </View>
              <View style={styles.capacity}>
                <Ionicons name="people" size={16} color="#fff" />
                <Text style={styles.capacityText}>{busDetails.capacity}% full</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Info Cards */}
        <View style={styles.quickInfoRow}>
          <View style={styles.infoCard}>
            <Ionicons name="location" size={24} color="#4F46E5" />
            <Text style={styles.infoCardTitle}>Next Stop</Text>
            <Text style={styles.infoCardValue}>{busDetails.nextStop}</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="pin" size={24} color="#10B981" />
            <Text style={styles.infoCardTitle}>Est. Arrival</Text>
            <Text style={styles.infoCardValue}>{busDetails.estimatedArrival}</Text>
          </View>
        </View>

        {/* Live Information Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Live Bus Information</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="navigate" size={20} color="#4F46E5" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Current Location</Text>
                <Text style={styles.infoValue}>{busDetails.currentLocation}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="person" size={20} color="#4F46E5" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Driver</Text>
                <Text style={styles.infoValue}>{busDetails.driver}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="refresh" size={20} color="#4F46E5" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Last Updated</Text>
                <Text style={styles.infoValue}>{busDetails.lastUpdated}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="bus" size={20} color="#4F46E5" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Bus Capacity</Text>
                <Text style={styles.infoValue}>{busDetails.capacity}% occupied</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleTrackBus}
            >
              <LinearGradient
                colors={['#10B981', '#34D399']}
                style={styles.actionIcon}
              >
                <Ionicons name="navigate" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.actionText}>Live Track</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleCheckIn}
              disabled={hasCheckedIn}
            >
              <LinearGradient
                colors={hasCheckedIn ? ['#cbd5e1', '#94a3b8'] : ['#F59E0B', '#FBBF24']}
                style={styles.actionIcon}
              >
                <Ionicons 
                  name={hasCheckedIn ? "checkmark-done" : "checkmark-circle"} 
                  size={24} 
                  color="#fff" 
                />
              </LinearGradient>
              <Text style={[
                styles.actionText,
                hasCheckedIn && styles.actionTextDisabled
              ]}>
                {hasCheckedIn ? 'Checked In' : 'Check In'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleViewRoute}
            >
              <LinearGradient
                colors={['#8B5CF6', '#A78BFA']}
                style={styles.actionIcon}
              >
                <Ionicons name="map" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.actionText}>View Route</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={resetScanner}
            >
              <LinearGradient
                colors={['#EF4444', '#F87171']}
                style={styles.actionIcon}
              >
                <Ionicons name="qr-code" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.actionText}>Scan Again</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Safety Check-in Status */}
        {hasCheckedIn && (
          <View style={styles.checkInCard}>
            <View style={styles.checkInHeader}>
              <Ionicons name="shield-checkmark" size={24} color="#10B981" />
              <Text style={styles.checkInTitle}>Safety Check-in Active</Text>
            </View>
            <Text style={styles.checkInText}>
              You are checked into Bus {busDetails.number}. Your journey is being monitored for safety.
            </Text>
            <View style={styles.checkInTime}>
              <Ionicons name="time" size={14} color="#059669" />
              <Text style={styles.checkInTimeText}>Checked in just now</Text>
            </View>
          </View>
        )}

        {/* Scan Another QR Button */}
        <TouchableOpacity 
          style={styles.scanAnotherButton}
          onPress={resetScanner}
        >
          <Ionicons name="camera" size={20} color="#4F46E5" />
          <Text style={styles.scanAnotherText}>Scan Another QR Code</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <LinearGradient
        colors={['#4F46E5', '#7C73E6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              QR Boarding
            </Text>
            <Text style={styles.headerSubtitle}>
              {busDetails ? `Bus ${busDetails.number}` : 'Scan Bus QR Code'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => Alert.alert('Help', 'Scan the QR code located inside the bus to view live information, track location, and check-in for safe travel.')}
          >
            <Ionicons name="help-circle" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading bus details...</Text>
        </View>
      ) : busDetails ? (
        renderBusDetails()
      ) : (
        renderScanner()
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
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
    marginTop: 2,
  },
  helpButton: {
    padding: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#f8fafc',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scannerFrame: {
    width: Math.min(screenWidth - 80, 300),
    height: Math.min(screenWidth - 80, 300),
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    marginBottom: 30,
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#4F46E5',
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#4F46E5',
    borderTopRightRadius: 12,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#4F46E5',
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#4F46E5',
    borderBottomRightRadius: 12,
  },
  scannerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  scannerSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  overviewCard: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  overviewGradient: {
    padding: 24,
  },
  busHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  busNumberLarge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 16,
  },
  busNumberTextLarge: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  busInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  destination: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  arrivalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrivalTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrivalTimeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  capacity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  capacityText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  quickInfoRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoCardTitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  actionsSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  actionTextDisabled: {
    color: '#64748b',
  },
  checkInCard: {
    backgroundColor: '#f0fdf4',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  checkInHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  checkInTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065f46',
  },
  checkInText: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
    marginBottom: 8,
  },
  checkInTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkInTimeText: {
    fontSize: 12,
    color: '#059669',
  },
  scanAnotherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  scanAnotherText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
});