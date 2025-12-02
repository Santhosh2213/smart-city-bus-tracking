// app/(tabs)/bus-tracking/live-tracking.tsx
import React, { useState, useContext, useRef, useEffect } from 'react';
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
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TrackingContext } from '../../../src/context/TrackingContext';
import { AuthContext } from '../../../src/context/AuthContext';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Tamilnadu coordinates and cities
const TAMILNADU_CENTER = {
  latitude: 11.1271,
  longitude: 78.6569,
};

const TAMILNADU_CITIES = {
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Coimbatore": { lat: 11.0168, lng: 76.9558 },
  "Madurai": { lat: 9.9252, lng: 78.1198 },
  "Trichy": { lat: 10.7905, lng: 78.7047 },
  "Salem": { lat: 11.6643, lng: 78.1460 },
  "Tirunelveli": { lat: 8.7139, lng: 77.7567 },
  "Vellore": { lat: 12.9165, lng: 79.1325 },
  "Erode": { lat: 11.3410, lng: 77.7172 },
  "Kanyakumari": { lat: 8.0883, lng: 77.5385 },
  "Ooty": { lat: 11.4102, lng: 76.6950 }
};

// Real-time bus data with actual Tamil Nadu routes
const mockBuses = [
  {
    id: '1',
    route: 'Chennai - Coimbatore',
    currentLocation: 'Salem',
    destination: 'Coimbatore',
    arrivalTime: 45,
    speed: 65,
    passengerLoad: 75,
    latitude: 11.6643,
    longitude: 78.1460,
    status: 'moving',
    nextStop: 'Erode',
    progress: 65,
    routePath: [
      { name: 'Chennai', lat: 13.0827, lng: 80.2707, passed: true, time: '08:00 AM' },
      { name: 'Vellore', lat: 12.9165, lng: 79.1325, passed: true, time: '09:30 AM' },
      { name: 'Krishnagiri', lat: 12.5190, lng: 78.2130, passed: true, time: '10:45 AM' },
      { name: 'Salem', lat: 11.6643, lng: 78.1460, passed: false, time: '11:30 AM' },
      { name: 'Erode', lat: 11.3410, lng: 77.7172, passed: false, time: '12:45 PM' },
      { name: 'Coimbatore', lat: 11.0168, lng: 76.9558, passed: false, time: '02:15 PM' }
    ],
    distance: '45 km to next stop',
    eta: '45 mins',
    totalDistance: '495 km',
    currentLat: 11.6643,
    currentLng: 78.1460
  },
  {
    id: '2',
    route: 'Madurai - Chennai',
    currentLocation: 'Trichy',
    destination: 'Chennai',
    arrivalTime: 25,
    speed: 72,
    passengerLoad: 55,
    latitude: 10.7905,
    longitude: 78.7047,
    status: 'moving',
    nextStop: 'Vellore',
    progress: 45,
    routePath: [
      { name: 'Madurai', lat: 9.9252, lng: 78.1198, passed: true, time: '07:00 AM' },
      { name: 'Dindigul', lat: 10.3629, lng: 77.9755, passed: true, time: '08:15 AM' },
      { name: 'Trichy', lat: 10.7905, lng: 78.7047, passed: false, time: '09:30 AM' },
      { name: 'Vellore', lat: 12.9165, lng: 79.1325, passed: false, time: '11:45 AM' },
      { name: 'Chengalpattu', lat: 12.6829, lng: 79.9769, passed: false, time: '01:30 PM' },
      { name: 'Chennai', lat: 13.0827, lng: 80.2707, passed: false, time: '02:30 PM' }
    ],
    distance: '32 km to next stop',
    eta: '25 mins',
    totalDistance: '460 km',
    currentLat: 10.7905,
    currentLng: 78.7047
  },
  {
    id: '3',
    route: 'Chennai - Tirunelveli',
    currentLocation: 'Madurai',
    destination: 'Tirunelveli',
    arrivalTime: 15,
    speed: 58,
    passengerLoad: 85,
    latitude: 9.9252,
    longitude: 78.1198,
    status: 'stopped',
    nextStop: 'Virudhunagar',
    progress: 75,
    routePath: [
      { name: 'Chennai', lat: 13.0827, lng: 80.2707, passed: true, time: '06:00 AM' },
      { name: 'Villupuram', lat: 11.9398, lng: 79.4928, passed: true, time: '08:30 AM' },
      { name: 'Trichy', lat: 10.7905, lng: 78.7047, passed: true, time: '10:45 AM' },
      { name: 'Dindigul', lat: 10.3629, lng: 77.9755, passed: true, time: '12:00 PM' },
      { name: 'Madurai', lat: 9.9252, lng: 78.1198, passed: false, time: '01:15 PM' },
      { name: 'Virudhunagar', lat: 9.5827, lng: 77.9570, passed: false, time: '02:00 PM' },
      { name: 'Tirunelveli', lat: 8.7139, lng: 77.7567, passed: false, time: '03:30 PM' }
    ],
    distance: '18 km to next stop',
    eta: '15 mins',
    totalDistance: '625 km',
    currentLat: 9.9252,
    currentLng: 78.1198
  }
];

const LiveTrackingScreen: React.FC = () => {
  const navigation = useNavigation<LiveTrackingScreenNavigationProp>();
  const { user } = useContext(AuthContext);
  const { currentBus, nearbyBuses, isLoading, refreshTracking } = useContext(TrackingContext);
  const webViewRef = useRef<WebView>(null);
  
  const [selectedBus, setSelectedBus] = useState<any>(mockBuses[0]);
  const [buses, setBuses] = useState(mockBuses);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [mapCenter, setMapCenter] = useState(TAMILNADU_CENTER);
  const [mapHtml, setMapHtml] = useState('');
  const [showBusList, setShowBusList] = useState(false);

  // Generate map HTML with real-time bus locations
  const generateMapHtml = (selectedBus: any, userLocation: any) => {
    const busesMarkers = buses.map(bus => {
      const busColor = bus.id === selectedBus?.id ? '#6E473B' : '#EF4444';
      return `
        L.marker([${bus.currentLat}, ${bus.currentLng}], {
          icon: L.divIcon({
            html: '<div style="background-color: ${busColor}; color: white; padding: 8px; border-radius: 12px; font-size: 10px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${bus.route.split(' - ')[0]}</div>',
            className: 'bus-marker',
            iconSize: [60, 30],
            iconAnchor: [30, 15]
          })
        })
          .addTo(map)
          .bindPopup('<div style="padding: 8px;"><strong>${bus.route}</strong><br>Status: ${bus.status}<br>Speed: ${bus.speed} km/h<br>Next Stop: ${bus.nextStop}<br>ETA: ${bus.eta}</div>')
          .on('click', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'BUS_SELECTED',
              busId: '${bus.id}'
            }));
          });
      `;
    }).join('');

    const routePolyline = selectedBus ? `
      const routeCoordinates = ${JSON.stringify(selectedBus.routePath.map((stop: any) => [stop.lat, stop.lng]))};
      L.polyline(routeCoordinates, {
        color: '#6E473B',
        weight: 4,
        opacity: 0.7,
        dashArray: '5, 10'
      }).addTo(map);
      
      // Add route markers
      ${selectedBus.routePath.map((stop: any, index: number) => {
        const stopColor = stop.passed ? '#10B981' : '#6E473B';
        return `
          L.marker([${stop.lat}, ${stop.lng}], {
            icon: L.divIcon({
              html: '<div style="background-color: ${stopColor}; color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border: 2px solid white;">${index + 1}</div>',
              className: 'route-marker',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })
          })
            .addTo(map)
            .bindPopup('${stop.name}<br>Time: ${stop.time}${stop.passed ? '<br>✓ Passed' : ''}');
        `;
      }).join('')}
    ` : '';

    const userLocationMarker = userLocation ? `
      L.marker([${userLocation.latitude}, ${userLocation.longitude}], {
        icon: L.divIcon({
          html: '<div style="background-color: #4A90E2; color: white; padding: 6px; border-radius: 50%; font-size: 8px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">YOU</div>',
          className: 'user-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      })
        .addTo(map)
        .bindPopup('Your Current Location')
        .openPopup();
    ` : '';

    const busMarkersArray = buses.map(bus => `L.marker([${bus.currentLat}, ${bus.currentLng}])`).join(',');

    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
          <style>
              body { margin: 0; padding: 0; }
              #map { height: 100vh; width: 100%; }
              .bus-marker { background: transparent !important; border: none !important; }
              .route-marker { background: transparent !important; border: none !important; }
          </style>
      </head>
      <body>
          <div id="map"></div>
          
          <script>
            const map = L.map('map').setView([${mapCenter.latitude}, ${mapCenter.longitude}], 8);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(map);

            // Add user location if available
            ${userLocationMarker}

            // Add active buses
            ${busesMarkers}

            // Add selected bus route
            ${routePolyline}

            // Auto-fit map to show all buses and user location
            const group = new L.featureGroup([
              ${userLocation ? `L.marker([${userLocation.latitude}, ${userLocation.longitude}]),` : ''}
              ${busMarkersArray}
            ]);
            map.fitBounds(group.getBounds().pad(0.1));

            // Handle map clicks
            map.on('click', function(e) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'MAP_CLICKED',
                lat: e.latlng.lat,
                lng: e.latlng.lng
              }));
            });

            // Auto refresh bus positions every 10 seconds
            setInterval(() => {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'REFRESH_REQUEST'
              }));
            }, 10000);
          </script>
      </body>
      </html>
    `;
  };

  // Get user's current location
  useEffect(() => {
    getUserLocation();
    initializeMap();
  }, []);

  useEffect(() => {
    initializeMap();
  }, [selectedBus, userLocation, mapCenter, buses]);

  const initializeMap = () => {
    const html = generateMapHtml(selectedBus, userLocation);
    setMapHtml(html);
  };

  const getUserLocation = async () => {
    try {
      setIsLoadingLocation(true);
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setHasLocationPermission(false);
        Alert.alert(
          'Location Permission Required',
          'Please enable location permissions to see your current location on the map.',
          [{ text: 'OK' }]
        );
        return;
      }

      setHasLocationPermission(true);
      
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      setMapCenter({ latitude, longitude });

      // Save location to cache
      await AsyncStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));

    } catch (error) {
      console.error('Error getting location:', error);
      // Try to load cached location
      const cachedLocation = await AsyncStorage.getItem('userLocation');
      if (cachedLocation) {
        setUserLocation(JSON.parse(cachedLocation));
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'BUS_SELECTED':
          const selectedBus = buses.find(bus => bus.id === data.busId);
          if (selectedBus) {
            setSelectedBus(selectedBus);
          }
          break;
        case 'REFRESH_REQUEST':
          handleRefresh();
          break;
        case 'MAP_CLICKED':
          // Handle map clicks if needed
          break;
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleBusSelect = (bus: any) => {
    setSelectedBus(bus);
    // Center map on selected bus
    setMapCenter({ latitude: bus.currentLat, longitude: bus.currentLng });
  };

  const handleRefresh = () => {
    // Simulate real-time updates
    const updatedBuses = buses.map(bus => {
      // Simulate bus movement
      const progressIncrement = bus.status === 'moving' ? Math.random() * 5 : 0;
      const newProgress = Math.min(100, bus.progress + progressIncrement);
      
      // Find current position based on progress
      const routeSegment = Math.floor((newProgress / 100) * (bus.routePath.length - 1));
      const currentStop = bus.routePath[routeSegment];
      const nextStop = bus.routePath[routeSegment + 1];
      
      return {
        ...bus,
        progress: newProgress,
        currentLocation: currentStop.name,
        nextStop: nextStop?.name || 'Destination',
        arrivalTime: Math.max(1, bus.arrivalTime - 1),
        status: newProgress >= 100 ? 'arrived' : bus.status,
        currentLat: currentStop.lat,
        currentLng: currentStop.lng,
        routePath: bus.routePath.map((stop: any, index: number) => ({
          ...stop,
          passed: index <= routeSegment
        }))
      };
    });
    
    setBuses(updatedBuses);
    
    // Update selected bus if it exists
    if (selectedBus) {
      const updatedSelectedBus = updatedBuses.find(bus => bus.id === selectedBus.id);
      if (updatedSelectedBus) {
        setSelectedBus(updatedSelectedBus);
      }
    }
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

  const handleLocateMe = () => {
    if (userLocation) {
      setMapCenter(userLocation);
    } else {
      getUserLocation();
    }
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
          <Ionicons name="location-outline" size={16} color="#6E473B" />
          <Text style={styles.busLocation}>Current: {bus.currentLocation}</Text>
        </View>
        <View style={styles.busDetailRow}>
          <Ionicons name="navigate-outline" size={16} color="#6E473B" />
          <Text style={styles.busLocation}>Next: {bus.nextStop}</Text>
        </View>
        
        <View style={styles.busStats}>
          <View style={styles.busStat}>
            <Ionicons name="time-outline" size={14} color="#6E473B" />
            <Text style={styles.busStatText}>{bus.arrivalTime} min</Text>
          </View>
          <View style={styles.busStat}>
            <Ionicons name="speedometer-outline" size={14} color="#6E473B" />
            <Text style={styles.busStatText}>{bus.speed} km/h</Text>
          </View>
          <View style={styles.busStat}>
            <Ionicons name="people-outline" size={14} color="#6E473B" />
            <Text style={styles.busStatText}>{bus.passengerLoad}%</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.busActions}>
        <TouchableOpacity 
          style={styles.trackButton}
          onPress={() => handleNavigateToBusDetails(bus)}
        >
          <Ionicons name="navigate-outline" size={16} color="#6E473B" />
          <Text style={styles.trackButtonText}>Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const RouteProgress: React.FC<{ bus: any }> = ({ bus }) => {
    if (!bus) return null;

    return (
      <View style={styles.routeProgressContainer}>
        <View style={styles.routeHeader}>
          <Text style={styles.routeTitle}>Route Progress</Text>
          <View style={styles.routeStats}>
            <View style={styles.routeStat}>
              <Ionicons name="time-outline" size={14} color="#6E473B" />
              <Text style={styles.routeStatText}>{bus.eta}</Text>
            </View>
            <View style={styles.routeStat}>
              <Ionicons name="speedometer-outline" size={14} color="#6E473B" />
              <Text style={styles.routeStatText}>{bus.speed} km/h</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${bus.progress}%` }
            ]} 
          />
        </View>

        <ScrollView style={styles.routeStops} showsVerticalScrollIndicator={false}>
          {bus.routePath.map((stop: any, index: number) => (
            <View key={index} style={styles.stopItem}>
              <View style={[
                styles.stopBullet,
                stop.passed ? styles.passedBullet : styles.upcomingBullet
              ]}>
                {stop.passed && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
              </View>
              <View style={styles.stopInfo}>
                <Text style={[
                  styles.stopName,
                  stop.passed ? styles.passedStopName : styles.upcomingStopName
                ]}>
                  {stop.name}
                </Text>
                <Text style={styles.stopTime}>{stop.time}</Text>
                {index < bus.routePath.length - 1 && (
                  <View style={[
                    styles.stopConnector,
                    stop.passed ? styles.passedConnector : styles.upcomingConnector
                  ]} />
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.distanceInfo}>
          <View style={styles.distanceItem}>
            <Text style={styles.distanceLabel}>Next Stop</Text>
            <Text style={styles.distanceValue}>{bus.nextStop}</Text>
          </View>
          <View style={styles.distanceItem}>
            <Text style={styles.distanceLabel}>Distance</Text>
            <Text style={styles.distanceValue}>{bus.distance}</Text>
          </View>
          <View style={styles.distanceItem}>
            <Text style={styles.distanceLabel}>Total</Text>
            <Text style={styles.distanceValue}>{bus.totalDistance}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6E473B" />
        <Text style={styles.loadingText}>Loading bus locations...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#291C0E" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Live Bus Tracking</Text>
            <Text style={styles.headerSubtitle}>
              {buses.length} buses active • Real-time tracking
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.offlineButton}
            onPress={() => navigation.navigate('OfflineMap')}
          >
            <Ionicons name="download-outline" size={20} color="#E1D4C2" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Map Section */}
        <View style={styles.mapContainer}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: mapHtml }}
            style={styles.map}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            onMessage={handleWebViewMessage}
            renderLoading={() => (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#6E473B" />
                <Text style={styles.loadingText}>Loading Live Map...</Text>
              </View>
            )}
          />
          
          {/* Map Controls */}
          <View style={styles.mapControls}>
            <TouchableOpacity 
              style={styles.mapControlButton}
              onPress={handleLocateMe}
            >
              <Ionicons name="locate" size={20} color="#6E473B" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.mapControlButton}
              onPress={handleRefresh}
            >
              <Ionicons name="refresh" size={20} color="#6E473B" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.mapControlButton}
              onPress={() => setShowBusList(!showBusList)}
            >
              <Ionicons name="list" size={20} color="#6E473B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bus List Modal */}
        <Modal
          visible={showBusList}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowBusList(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Active Buses</Text>
                <TouchableOpacity onPress={() => setShowBusList(false)}>
                  <Ionicons name="close" size={24} color="#291C0E" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.busListModal}>
                {buses.map((bus) => (
                  <BusCard
                    key={bus.id}
                    bus={bus}
                    isSelected={selectedBus?.id === bus.id}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Selected Bus Details */}
        {selectedBus && (
          <View style={styles.selectedBusPanel}>
            <ScrollView style={styles.panelContent}>
              <RouteProgress bus={selectedBus} />
            </ScrollView>
          </View>
        )}
      </View>
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
    backgroundColor: '#F8F5F0',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6E473B',
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E1D4C2',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#BEB5A9',
    marginTop: 4,
  },
  offlineButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(110, 71, 59, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(248, 245, 240, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  selectedBusPanel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.4,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  panelContent: {
    flex: 1,
  },
  routeProgressContainer: {
    padding: 20,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#291C0E',
  },
  routeStats: {
    flexDirection: 'row',
    gap: 12,
  },
  routeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  routeStatText: {
    fontSize: 12,
    color: '#6E473B',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F8F5F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6E473B',
    borderRadius: 4,
  },
  routeStops: {
    maxHeight: 120,
    marginBottom: 16,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stopBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  passedBullet: {
    backgroundColor: '#6E473B',
  },
  upcomingBullet: {
    backgroundColor: '#E1D4C2',
    borderWidth: 2,
    borderColor: '#6E473B',
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  passedStopName: {
    color: '#6E473B',
  },
  upcomingStopName: {
    color: '#291C0E',
  },
  stopTime: {
    fontSize: 12,
    color: '#6E473B',
    marginBottom: 8,
  },
  stopConnector: {
    height: 20,
    width: 2,
    marginLeft: 4,
  },
  passedConnector: {
    backgroundColor: '#6E473B',
  },
  upcomingConnector: {
    backgroundColor: '#E1D4C2',
  },
  distanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F5F0',
    borderRadius: 12,
    padding: 16,
  },
  distanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  distanceLabel: {
    fontSize: 12,
    color: '#6E473B',
    marginBottom: 4,
    fontWeight: '400',
  },
  distanceValue: {
    fontSize: 14,
    color: '#291C0E',
    fontWeight: '700',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(41, 28, 14, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 141, 120, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#291C0E',
  },
  busListModal: {
    padding: 16,
  },
  busCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  selectedBusCard: {
    borderColor: '#6E473B',
    backgroundColor: '#F8F5F0',
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
    color: '#291C0E',
    marginBottom: 4,
  },
  busDestination: {
    fontSize: 14,
    color: '#6E473B',
  },
  passengerLoad: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  passengerLoadText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  busDetails: {
    marginBottom: 12,
  },
  busDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  busLocation: {
    fontSize: 14,
    color: '#6E473B',
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
    color: '#6E473B',
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
    backgroundColor: '#E1D4C2',
    borderRadius: 20,
  },
  trackButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6E473B',
  },
});

export default LiveTrackingScreen;