// app/(tabs)/bus-tracking/offline-map.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
  Dimensions,
  ActivityIndicator,
  Platform,
  Linking,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

type BusTrackingStackParamList = {
  LiveTracking: undefined;
  BusDetails: { bus: any };
  OfflineMap: undefined;
};

type OfflineMapScreenNavigationProp = NativeStackNavigationProp<
  BusTrackingStackParamList,
  'OfflineMap'
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

interface OfflineMapRegion {
  id: string;
  name: string;
  size: string;
  downloaded: boolean;
  progress: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

interface RouteInfo {
  from: string;
  to: string;
  distance: string;
  duration: string;
}

const OfflineMapScreen: React.FC = () => {
  const navigation = useNavigation<OfflineMapScreenNavigationProp>();
  const webViewRef = useRef<WebView>(null);
  
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadedRegions, setDownloadedRegions] = useState<string[]>(['city-center']);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [mapCenter, setMapCenter] = useState(TAMILNADU_CENTER);
  const [selectedFromCity, setSelectedFromCity] = useState<string>('');
  const [selectedToCity, setSelectedToCity] = useState<string>('');
  const [showCityModal, setShowCityModal] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [mapHtml, setMapHtml] = useState('');

  const mapRegions: OfflineMapRegion[] = [
    {
      id: 'city-center',
      name: 'Chennai City',
      size: '45 MB',
      downloaded: true,
      progress: 100,
      coordinates: { latitude: 13.0827, longitude: 80.2707 },
      bounds: { north: 13.2827, south: 12.8827, east: 80.4707, west: 80.0707 }
    },
    {
      id: 'north-zone',
      name: 'North Tamilnadu',
      size: '38 MB',
      downloaded: false,
      progress: 0,
      coordinates: { latitude: 13.0837, longitude: 80.2700 },
      bounds: { north: 13.5837, south: 12.5837, east: 80.6700, west: 79.8700 }
    },
    {
      id: 'south-zone',
      name: 'South Tamilnadu',
      size: '42 MB',
      downloaded: false,
      progress: 0,
      coordinates: { latitude: 10.7905, longitude: 78.7047 },
      bounds: { north: 11.2905, south: 9.2905, east: 79.2047, west: 78.2047 }
    },
    {
      id: 'east-zone',
      name: 'East Coastal',
      size: '35 MB',
      downloaded: false,
      progress: 0,
      coordinates: { latitude: 11.3410, longitude: 79.8400 },
      bounds: { north: 12.3410, south: 10.3410, east: 80.3400, west: 79.3400 }
    },
    {
      id: 'west-zone',
      name: 'West Tamilnadu',
      size: '40 MB',
      downloaded: false,
      progress: 0,
      coordinates: { latitude: 11.0055, longitude: 76.9661 },
      bounds: { north: 12.0055, south: 10.0055, east: 77.4661, west: 76.4661 }
    },
    {
      id: 'entire-city',
      name: 'Entire Tamilnadu',
      size: '180 MB',
      downloaded: false,
      progress: 0,
      coordinates: TAMILNADU_CENTER,
      bounds: { north: 13.5, south: 8.0, east: 80.5, west: 76.0 }
    },
  ];

  // Generate map HTML with route functionality
  const generateMapHtml = (fromCity?: string, toCity?: string) => {
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
              .route-info { 
                position: absolute; 
                top: 10px; 
                left: 10px; 
                background: white; 
                padding: 10px; 
                border-radius: 5px; 
                z-index: 1000;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                border: 1px solid rgba(167, 141, 120, 0.3);
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              }
          </style>
      </head>
      <body>
          <div id="map"></div>
          ${routeInfo ? `
            <div class="route-info">
              <strong>${routeInfo.from} to ${routeInfo.to}</strong><br>
              Distance: ${routeInfo.distance}<br>
              Duration: ${routeInfo.duration}
            </div>
          ` : ''}
          
          <script>
            const map = L.map('map').setView([${mapCenter.latitude}, ${mapCenter.longitude}], 10);
            
            // Try to use cached tiles first, then fallback to online
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(map);

            // Add Tamilnadu major cities
            const cities = ${JSON.stringify(TAMILNADU_CITIES)};

            Object.keys(cities).forEach(cityName => {
                const city = cities[cityName];
                L.marker([city.lat, city.lng])
                    .addTo(map)
                    .bindPopup(cityName)
                    .on('click', function() {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'CITY_SELECTED',
                            city: cityName
                        }));
                    });
            });

            // User location marker (if available)
            ${userLocation ? `
                L.marker([${userLocation.latitude}, ${userLocation.longitude}])
                    .addTo(map)
                    .bindPopup('Your Location')
                    .openPopup();
            ` : ''}

            // Draw route if both cities are selected
            ${fromCity && toCity ? `
                const from = cities['${fromCity}'];
                const to = cities['${toCity}'];
                
                if (from && to) {
                    // Draw a simple straight line for demonstration
                    // In real implementation, you would use a routing service
                    const route = L.polyline([
                        [from.lat, from.lng],
                        [to.lat, to.lng]
                    ], { color: '#6E473B', weight: 4 }).addTo(map);
                    
                    // Fit map to show both cities
                    map.fitBounds([[from.lat, from.lng], [to.lat, to.lng]]);
                    
                    // Calculate approximate distance (simplified)
                    const distance = Math.sqrt(
                        Math.pow(from.lat - to.lat, 2) + 
                        Math.pow(from.lng - to.lng, 2)
                    ) * 111; // Convert to kilometers
                    
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'ROUTE_CALCULATED',
                        distance: distance.toFixed(1) + ' km',
                        duration: Math.round(distance * 2) + ' mins' // Simplified calculation
                    }));
                }
            ` : ''}

            // Handle map clicks for offline caching
            map.on('moveend', function() {
                const center = map.getCenter();
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'MAP_MOVED',
                    center: { lat: center.lat, lng: center.lng },
                    zoom: map.getZoom()
                }));
            });
          </script>
      </body>
      </html>
    `;
  };

  // Get user's current location
  useEffect(() => {
    getUserLocation();
    checkNetworkStatus();
    initializeMap();
  }, []);

  useEffect(() => {
    initializeMap();
  }, [selectedFromCity, selectedToCity, userLocation, mapCenter]);

  const initializeMap = () => {
    const html = generateMapHtml(selectedFromCity, selectedToCity);
    setMapHtml(html);
  };

  const checkNetworkStatus = () => {
    // Simple network check - in real app, use NetInfo from react-native
    setIsOnline(true); // Default to true for this example
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

  const handleDownloadRegion = async (region: OfflineMapRegion) => {
    if (region.downloaded) {
      Alert.alert('Already Downloaded', `${region.name} is already available offline`);
      return;
    }

    setDownloading(region.id);
    
    // Simulate download progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Update progress in regions list
      const updatedRegions = mapRegions.map(r => 
        r.id === region.id ? { ...r, progress } : r
      );
    }

    setDownloading(null);
    setDownloadedRegions([...downloadedRegions, region.id]);
    
    // Cache the region data
    await AsyncStorage.setItem(`mapRegion_${region.id}`, JSON.stringify(region));
    
    Alert.alert(
      'Download Complete',
      `${region.name} is now available for offline use`
    );
  };

  const handleCitySelection = (city: string) => {
    if (!selectedFromCity) {
      setSelectedFromCity(city);
    } else if (!selectedToCity) {
      setSelectedToCity(city);
      setShowCityModal(false);
      
      // Calculate route
      const fromCoords = TAMILNADU_CITIES[selectedFromCity as keyof typeof TAMILNADU_CITIES];
      const toCoords = TAMILNADU_CITIES[city as keyof typeof TAMILNADU_CITIES];
      
      if (fromCoords && toCoords) {
        // Simple distance calculation (in real app, use proper routing)
        const distance = calculateDistance(fromCoords, toCoords);
        const duration = calculateDuration(distance);
        
        setRouteInfo({
          from: selectedFromCity,
          to: city,
          distance: `${distance} km`,
          duration: `${duration} mins`
        });
      }
    }
  };

  const calculateDistance = (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
    // Simplified distance calculation - in real app, use proper routing
    const R = 6371; // Earth's radius in km
    const dLat = (to.lat - from.lat) * Math.PI / 180;
    const dLon = (to.lng - from.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  const calculateDuration = (distance: number) => {
    // Assume average speed of 60 km/h
    return Math.round((distance / 60) * 60);
  };

  const clearRoute = () => {
    setSelectedFromCity('');
    setSelectedToCity('');
    setRouteInfo(null);
    initializeMap();
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'CITY_SELECTED':
          handleCitySelection(data.city);
          break;
        case 'ROUTE_CALCULATED':
          // Route calculated by the map
          break;
        case 'MAP_MOVED':
          // Cache the current map view
          AsyncStorage.setItem('lastMapView', JSON.stringify(data));
          break;
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const loadCachedMap = async () => {
    try {
      const cachedView = await AsyncStorage.getItem('lastMapView');
      if (cachedView) {
        const view = JSON.parse(cachedView);
        setMapCenter({ latitude: view.center.lat, longitude: view.center.lng });
      }
    } catch (error) {
      console.error('Error loading cached map:', error);
    }
  };

  const handleLocateMe = () => {
    if (userLocation) {
      setMapCenter(userLocation);
    } else {
      getUserLocation();
    }
  };

  const getTotalDownloadedSize = () => {
    return mapRegions
      .filter(region => downloadedRegions.includes(region.id))
      .reduce((total, region) => {
        const size = parseInt(region.size);
        return total + (isNaN(size) ? 0 : size);
      }, 0);
  };

  const handleDeleteRegion = (region: OfflineMapRegion) => {
    Alert.alert(
      'Delete Offline Map',
      `Are you sure you want to delete ${region.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedRegions = downloadedRegions.filter(id => id !== region.id);
            setDownloadedRegions(updatedRegions);
            AsyncStorage.removeItem(`mapRegion_${region.id}`);
            Alert.alert('Deleted', `${region.name} has been removed`);
          },
        },
      ]
    );
  };

  const RegionCard: React.FC<{ region: OfflineMapRegion }> = ({ region }) => {
    const isDownloaded = downloadedRegions.includes(region.id);
    const isDownloading = downloading === region.id;

    return (
      <TouchableOpacity 
        style={[styles.regionCard, isDownloaded && styles.regionCardDownloaded]}
        onPress={() => setMapCenter(region.coordinates)}
      >
        <View style={styles.regionInfo}>
          <View style={styles.regionHeader}>
            <Text style={styles.regionName}>{region.name}</Text>
            <Text style={styles.regionSize}>{region.size}</Text>
          </View>
          
          {isDownloading && (
            <View style={styles.downloadProgress}>
              <View 
                style={[styles.progressBar, { width: `${region.progress}%` }]} 
              />
              <Text style={styles.progressText}>{region.progress}%</Text>
            </View>
          )}
          
          {isDownloaded && (
            <View style={styles.downloadedInfo}>
              <Ionicons name="checkmark-circle" size={16} color="#6E473B" />
              <Text style={styles.downloadedText}>Downloaded</Text>
            </View>
          )}
        </View>
        
        <View style={styles.regionActions}>
          {isDownloaded ? (
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDeleteRegion(region)}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[
                styles.downloadButton,
                isDownloading && styles.downloadButtonDisabled
              ]}
              onPress={() => handleDownloadRegion(region)}
              disabled={isDownloading}
            >
              <Ionicons 
                name={isDownloading ? "download" : "download-outline"} 
                size={20} 
                color="#6E473B" 
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#291C0E" />
      
      {/* Header */}
      <LinearGradient
        colors={['#291C0E', '#3D2A1A']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#E1D4C2" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Offline Maps</Text>
            <Text style={styles.headerSubtitle}>
              {isOnline ? 'Online' : 'Offline'} • {downloadedRegions.length} regions
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={getUserLocation}
          >
            <Ionicons name="refresh" size={20} color="#E1D4C2" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Route Selection */}
        <View style={styles.routeSection}>
          <View style={styles.routeHeader}>
            <Text style={styles.sectionTitle}>Plan Your Route</Text>
            {(selectedFromCity || selectedToCity) && (
              <TouchableOpacity onPress={clearRoute}>
                <Text style={styles.clearRouteText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.routeInputs}>
            <TouchableOpacity 
              style={styles.cityInput}
              onPress={() => setShowCityModal(true)}
            >
              <Text style={selectedFromCity ? styles.cityInputText : styles.cityInputPlaceholder}>
                {selectedFromCity || 'From City'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cityInput}
              onPress={() => setShowCityModal(true)}
            >
              <Text style={selectedToCity ? styles.cityInputText : styles.cityInputPlaceholder}>
                {selectedToCity || 'To City'}
              </Text>
            </TouchableOpacity>
          </View>

          {routeInfo && (
            <View style={styles.routeInfoCard}>
              <Text style={styles.routeTitle}>{routeInfo.from} → {routeInfo.to}</Text>
              <View style={styles.routeDetails}>
                <Text style={styles.routeDetail}>Distance: {routeInfo.distance}</Text>
                <Text style={styles.routeDetail}>Duration: {routeInfo.duration}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Map Preview */}
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
                <Text style={styles.loadingText}>Loading Map...</Text>
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
              onPress={() => setMapCenter(TAMILNADU_CENTER)}
            >
              <Ionicons name="earth" size={20} color="#6E473B" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.mapControlButton}
              onPress={loadCachedMap}
            >
              <Ionicons name="refresh" size={20} color="#6E473B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Location Status */}
        <View style={styles.locationStatus}>
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Ionicons 
                name={hasLocationPermission ? "location" : "location-outline"} 
                size={24} 
                color={hasLocationPermission ? "#6E473B" : "#BEB5A9"} 
              />
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusTitle}>
                  {hasLocationPermission ? "Location Access Enabled" : "Location Access Required"}
                </Text>
                <Text style={styles.statusSubtitle}>
                  {hasLocationPermission 
                    ? userLocation 
                      ? `Location: ${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}` 
                      : "Getting your location..."
                    : "Enable location to see your position"
                  }
                </Text>
              </View>
            </View>
            {!hasLocationPermission && (
              <TouchableOpacity 
                style={styles.enableLocationButton}
                onPress={getUserLocation}
              >
                <Text style={styles.enableLocationText}>Enable Location</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Download Status */}
        <View style={styles.statusSection}>
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Ionicons name="cloud-download-outline" size={24} color="#6E473B" />
              <Text style={styles.statusTitle}>Download Status</Text>
            </View>
            <View style={styles.storageInfo}>
              <View style={styles.storageBar}>
                <View 
                  style={[
                    styles.storageUsed,
                    { width: `${(getTotalDownloadedSize() / 400) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.storageText}>
                {getTotalDownloadedSize()} MB of 400 MB used
              </Text>
            </View>
          </View>
        </View>

        {/* Regions List */}
        <View style={styles.regionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Regions in Tamilnadu</Text>
            <Text style={styles.sectionSubtitle}>
              Download maps for offline use
            </Text>
          </View>

          <View style={styles.regionsList}>
            {mapRegions.map((region) => (
              <RegionCard key={region.id} region={region} />
            ))}
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <View style={styles.tipsHeader}>
            <Ionicons name="information-circle-outline" size={20} color="#6E473B" />
            <Text style={styles.tipsTitle}>Offline Map Tips</Text>
          </View>
          <View style={styles.tipsContent}>
            <Text style={styles.tip}>• Download maps while on WiFi to save data</Text>
            <Text style={styles.tip}>• Maps include bus routes and stops in Tamilnadu</Text>
            <Text style={styles.tip}>• Works without internet connection once downloaded</Text>
            <Text style={styles.tip}>• Tap on regions to view them on the map</Text>
            <Text style={styles.tip}>• Use locate button to find your position</Text>
          </View>
        </View>
      </ScrollView>

      {/* City Selection Modal */}
      <Modal
        visible={showCityModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select City</Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <Ionicons name="close" size={24} color="#291C0E" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {Object.keys(TAMILNADU_CITIES).map(city => (
                <TouchableOpacity
                  key={city}
                  style={styles.cityItem}
                  onPress={() => handleCitySelection(city)}
                >
                  <Text style={styles.cityItemText}>{city}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(110, 71, 59, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E1D4C2',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#BEB5A9',
    marginTop: 4,
  },
  helpButton: {
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
  routeSection: {
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
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearRouteText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },
  routeInputs: {
    gap: 8,
  },
  cityInput: {
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.3)',
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#F8F5F0',
  },
  cityInputText: {
    fontSize: 16,
    color: '#291C0E',
  },
  cityInputPlaceholder: {
    fontSize: 16,
    color: '#6E473B',
  },
  routeInfoCard: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F8F5F0',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6E473B',
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6E473B',
    marginBottom: 4,
  },
  routeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  routeDetail: {
    fontSize: 14,
    color: '#6E473B',
  },
  mapContainer: {
    height: height * 0.4,
    position: 'relative',
  },
  map: {
    flex: 1,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(248, 245, 240, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6E473B',
    fontWeight: '500',
  },
  locationStatus: {
    padding: 24,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#291C0E',
  },
  statusSubtitle: {
    fontSize: 12,
    color: '#6E473B',
    marginTop: 2,
  },
  enableLocationButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#6E473B',
    borderRadius: 12,
    alignItems: 'center',
  },
  enableLocationText: {
    color: '#E1D4C2',
    fontSize: 14,
    fontWeight: '600',
  },
  statusSection: {
    padding: 24,
  },
  storageInfo: {
    gap: 8,
  },
  storageBar: {
    height: 8,
    backgroundColor: 'rgba(167, 141, 120, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  storageUsed: {
    height: '100%',
    backgroundColor: '#6E473B',
    borderRadius: 4,
  },
  storageText: {
    fontSize: 12,
    color: '#6E473B',
  },
  regionsContainer: {
    padding: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#291C0E',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6E473B',
  },
  regionsList: {
    gap: 12,
  },
  regionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  regionCardDownloaded: {
    borderColor: '#6E473B',
    backgroundColor: '#F8F5F0',
  },
  regionInfo: {
    flex: 1,
  },
  regionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  regionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#291C0E',
  },
  regionSize: {
    fontSize: 12,
    color: '#6E473B',
    fontWeight: '500',
  },
  downloadProgress: {
    height: 6,
    backgroundColor: 'rgba(167, 141, 120, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6E473B',
    borderRadius: 3,
  },
  progressText: {
    position: 'absolute',
    top: -18,
    right: 0,
    fontSize: 10,
    color: '#6E473B',
    fontWeight: '600',
  },
  downloadedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  downloadedText: {
    fontSize: 12,
    color: '#6E473B',
    fontWeight: '500',
  },
  regionActions: {
    marginLeft: 12,
  },
  downloadButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8F5F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  downloadButtonDisabled: {
    opacity: 0.6,
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8F5F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  tipsSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#291C0E',
  },
  tipsContent: {
    gap: 4,
  },
  tip: {
    fontSize: 12,
    color: '#6E473B',
    lineHeight: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(41, 28, 14, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#291C0E',
  },
  cityItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 141, 120, 0.1)',
  },
  cityItemText: {
    fontSize: 16,
    color: '#291C0E',
  },
});

export default OfflineMapScreen;