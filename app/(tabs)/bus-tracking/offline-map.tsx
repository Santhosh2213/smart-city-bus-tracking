// app/(tabs)/bus-tracking/offline-map.tsx
import React, { useState } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

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

interface OfflineMapRegion {
  id: string;
  name: string;
  size: string;
  downloaded: boolean;
  progress: number;
}

const OfflineMapScreen: React.FC = () => {
  const navigation = useNavigation<OfflineMapScreenNavigationProp>();
  
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadedRegions, setDownloadedRegions] = useState<string[]>(['city-center']);

  const mapRegions: OfflineMapRegion[] = [
    {
      id: 'city-center',
      name: 'City Center',
      size: '45 MB',
      downloaded: true,
      progress: 100,
    },
    {
      id: 'north-zone',
      name: 'North Zone',
      size: '38 MB',
      downloaded: false,
      progress: 0,
    },
    {
      id: 'south-zone',
      name: 'South Zone',
      size: '42 MB',
      downloaded: false,
      progress: 0,
    },
    {
      id: 'east-zone',
      name: 'East Zone',
      size: '35 MB',
      downloaded: false,
      progress: 0,
    },
    {
      id: 'west-zone',
      name: 'West Zone',
      size: '40 MB',
      downloaded: false,
      progress: 0,
    },
    {
      id: 'entire-city',
      name: 'Entire City',
      size: '180 MB',
      downloaded: false,
      progress: 0,
    },
  ];

  const handleDownloadRegion = async (region: OfflineMapRegion) => {
    if (region.downloaded) {
      Alert.alert('Already Downloaded', `${region.name} is already available offline`);
      return;
    }

    setDownloading(region.id);
    
    // Simulate download progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setDownloading(null);
    setDownloadedRegions([...downloadedRegions, region.id]);
    
    Alert.alert(
      'Download Complete',
      `${region.name} is now available for offline use`
    );
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
            Alert.alert('Deleted', `${region.name} has been removed`);
          },
        },
      ]
    );
  };

  const getTotalDownloadedSize = () => {
    return mapRegions
      .filter(region => downloadedRegions.includes(region.id))
      .reduce((total, region) => {
        const size = parseInt(region.size);
        return total + (isNaN(size) ? 0 : size);
      }, 0);
  };

  const RegionCard: React.FC<{ region: OfflineMapRegion }> = ({ region }) => {
    const isDownloaded = downloadedRegions.includes(region.id);
    const isDownloading = downloading === region.id;

    return (
      <View style={[styles.regionCard, isDownloaded && styles.regionCardDownloaded]}>
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
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
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
                color="#1a73e8" 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

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
            <Text style={styles.headerTitle}>Offline Maps</Text>
            <Text style={styles.headerSubtitle}>
              {downloadedRegions.length} regions downloaded • {getTotalDownloadedSize()} MB
            </Text>
          </View>
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="help-circle-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Map Preview */}
        <View style={styles.mapContainer}>
          <LinearGradient
            colors={['#8B5CF6', '#A78BFA']}
            style={styles.mapPlaceholder}
          >
            <Ionicons name="map-outline" size={48} color="#fff" />
            <Text style={styles.mapPlaceholderTitle}>Offline Maps</Text>
            <Text style={styles.mapPlaceholderText}>
              Access maps without internet connection
            </Text>
            <View style={styles.mapStats}>
              <View style={styles.mapStat}>
                <Text style={styles.mapStatNumber}>{downloadedRegions.length}</Text>
                <Text style={styles.mapStatLabel}>Regions</Text>
              </View>
              <View style={styles.mapStat}>
                <Text style={styles.mapStatNumber}>{getTotalDownloadedSize()}</Text>
                <Text style={styles.mapStatLabel}>MB Used</Text>
              </View>
              <View style={styles.mapStat}>
                <Text style={styles.mapStatNumber}>6</Text>
                <Text style={styles.mapStatLabel}>Available</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Download Status */}
        <View style={styles.statusSection}>
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Ionicons name="cloud-download-outline" size={24} color="#1a73e8" />
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
            <Text style={styles.sectionTitle}>Available Regions</Text>
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
            <Ionicons name="information-circle-outline" size={20} color="#1a73e8" />
            <Text style={styles.tipsTitle}>Offline Map Tips</Text>
          </View>
          <View style={styles.tipsContent}>
            <Text style={styles.tip}>• Download maps while on WiFi to save data</Text>
            <Text style={styles.tip}>• Maps include bus routes and stops</Text>
            <Text style={styles.tip}>• Updates available every 30 days</Text>
            <Text style={styles.tip}>• Works without internet connection</Text>
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
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  helpButton: {
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
    height: height * 0.25,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  mapStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statusSection: {
    padding: 16,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  storageInfo: {
    gap: 8,
  },
  storageBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  storageUsed: {
    height: '100%',
    backgroundColor: '#1a73e8',
    borderRadius: 4,
  },
  storageText: {
    fontSize: 12,
    color: '#666',
  },
  regionsContainer: {
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  regionsList: {
    gap: 12,
  },
  regionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  regionCardDownloaded: {
    borderColor: '#10B981',
    backgroundColor: '#f0fdf4',
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
    color: '#1a1a1a',
  },
  regionSize: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  downloadProgress: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1a73e8',
    borderRadius: 3,
  },
  progressText: {
    position: 'absolute',
    top: -18,
    right: 0,
    fontSize: 10,
    color: '#1a73e8',
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
    color: '#10B981',
    fontWeight: '500',
  },
  regionActions: {
    marginLeft: 12,
  },
  downloadButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButtonDisabled: {
    opacity: 0.6,
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsSection: {
    padding: 16,
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#1a1a1a',
  },
  tipsContent: {
    gap: 4,
  },
  tip: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});

export default OfflineMapScreen;