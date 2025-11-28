// app/sos.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  SafeAreaView,
  StatusBar,
  Animated,
  Platform,
  TextInput,
  ScrollView,
  Modal,
  ActivityIndicator,
  Image,
  Switch,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Optional imports - wrapped in try-catch or conditional checks
let Location: any = null;
let ImagePicker: any = null;
let Audio: any = null;

try {
  Location = require('expo-location');
} catch (error) {
  console.log('expo-location not available');
}

try {
  ImagePicker = require('expo-image-picker');
} catch (error) {
  console.log('expo-image-picker not available');
}

try {
  Audio = require('expo-av');
} catch (error) {
  console.log('expo-av not available');
}

// Firebase configuration (optional - remove if not needed)
// import { initializeApp } from 'firebase/app';
// import { getDatabase, ref, push } from 'firebase/database';

// Types
interface UserDetails {
  name: string;
  regNumber: string;
  busNumber: string;
  department: string;
  phoneNumber: string;
  timestamp?: string;
}

interface EmergencyAlert {
  name: string;
  regNumber: string;
  busNumber: string;
  department: string;
  phoneNumber: string;
  alertType: string;
  additionalMessage: string;
  location: string;
  priority: string;
  timestamp: number;
  status: string;
  image?: string | null;
  coordinates?: Coordinates | null;
  isSOS?: boolean;
}

interface Coordinates {
  lat: number;
  lng: number;
}

export default function EmergencyAlertSystem() {
  const router = useRouter();
  
  // State management
  const [currentTab, setCurrentTab] = useState<'report' | 'resources' | 'history'>('report');
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: 'John Doe',
    regNumber: '2023001',
    busNumber: '5',
    department: 'CSE',
    phoneNumber: '+1234567890',
  });
  
  const [selectedAlert, setSelectedAlert] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [emergencyLocation, setEmergencyLocation] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [emergencyImage, setEmergencyImage] = useState<string | null>(null);
  const [currentCoordinates, setCurrentCoordinates] = useState<Coordinates | null>(null);
  
  // UI state
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(true);
  
  // Refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countdownRef = useRef<NodeJS.Timeout>();

  // Load user details on component mount
  useEffect(() => {
    checkConnectionStatus();
    
    // Cleanup
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const requestLocationPermission = async () => {
    if (!Location) {
      Alert.alert('Location not available', 'Please install expo-location for location services');
      return null;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  const checkConnectionStatus = () => {
    setConnectionStatus(true);
    setTimeout(checkConnectionStatus, 10000);
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const startCountdown = () => {
    setIsSOSActive(true);
    startPulseAnimation();
    
    let timer = 5;
    setCountdown(timer);
    
    countdownRef.current = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      
      if (timer <= 0) {
        triggerSOSAlert();
        clearInterval(countdownRef.current);
      }
    }, 1000);
  };

  const cancelSOS = () => {
    setIsSOSActive(false);
    stopPulseAnimation();
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    setCountdown(5);
  };

  const triggerSOSAlert = async () => {
    // Vibrate device
    if (Platform.OS !== 'web') {
      Vibration.vibrate([500, 500, 500], true);
    }

    // Get current location
    const location = await getCurrentLocation();
    
    const alertData: EmergencyAlert = {
      ...userDetails,
      alertType: "SOS EMERGENCY",
      additionalMessage: "SOS button pressed - immediate assistance required!",
      location: location || "Location unknown",
      priority: "critical",
      timestamp: Date.now(),
      status: "active",
      isSOS: true,
      coordinates: currentCoordinates,
    };

    await submitEmergencyAlert(alertData);
  };

  const getCurrentLocation = async (): Promise<string> => {
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission || !Location) {
      return "Location services not available";
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const { latitude, longitude } = location.coords;
      setCurrentCoordinates({ lat: latitude, lng: longitude });
      
      return `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
    } catch (error) {
      console.error('Error getting location:', error);
      return "Unable to get location";
    }
  };

  const pickImage = async () => {
    if (!ImagePicker) {
      Alert.alert('Image picker not available', 'Please install expo-image-picker for image uploads');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setEmergencyImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = () => {
    setEmergencyImage(null);
  };

  const submitEmergencyAlert = async (alertData?: EmergencyAlert) => {
    setIsLoading(true);
    
    try {
      const data = alertData || {
        ...userDetails,
        alertType: selectedAlert,
        additionalMessage,
        location: emergencyLocation,
        priority: selectedPriority,
        timestamp: Date.now(),
        status: "active",
        image: emergencyImage,
        coordinates: currentCoordinates,
      };

      // In a real app, you would push to Firebase here
      console.log('Submitting emergency alert:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success
      Alert.alert(
        'Success',
        'Emergency alert submitted successfully! Authorities have been notified.',
        [{ text: 'OK', onPress: resetForm }]
      );
      
    } catch (error) {
      console.error('Error submitting alert:', error);
      Alert.alert(
        'Error',
        'Failed to submit alert. Please try again or contact authorities directly.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  const resetForm = () => {
    setSelectedAlert('');
    setEmergencyLocation('');
    setAdditionalMessage('');
    setEmergencyImage(null);
    setIsSOSActive(false);
    stopPulseAnimation();
    if (Platform.OS !== 'web') {
      Vibration.cancel();
    }
  };

  const showEmergencyConfirmation = () => {
    if (!selectedAlert) {
      Alert.alert('Error', 'Please select an emergency type');
      return;
    }
    if (!emergencyLocation) {
      Alert.alert('Error', 'Please specify the emergency location');
      return;
    }
    setShowConfirmation(true);
  };

  const emergencyTypes = [
    { type: 'Medical Emergency', priority: 'critical', icon: 'medkit' as const },
    { type: 'Bus Accident', priority: 'critical', icon: 'car' as const },
    { type: 'Fire in Bus', priority: 'critical', icon: 'flame' as const },
    { type: 'Bus Breakdown', priority: 'high', icon: 'bus' as const },
    { type: 'Brake Failure', priority: 'high', icon: 'warning' as const },
    { type: 'Harassment', priority: 'high', icon: 'shield' as const },
    { type: 'Safety Concern', priority: 'medium', icon: 'warning' as const },
    { type: 'Other Emergency', priority: 'low', icon: 'help-circle' as const },
  ];

  const priorityOptions = [
    { value: 'critical', label: 'Critical', color: '#DC2626' },
    { value: 'high', label: 'High', color: '#F59E0B' },
    { value: 'medium', label: 'Medium', color: '#10B981' },
    { value: 'low', label: 'Low', color: '#6B7280' },
  ];

  const quickActions = [
    { action: 'NotifyBusDriver', label: 'Notify Driver', icon: 'bus' as const },
    { action: 'ShareLocation', label: 'Share Location', icon: 'location' as const },
    { action: 'CallSecurity', label: 'Call Security', icon: 'call' as const },
    { action: 'FirstAidTips', label: 'First Aid', icon: 'medkit' as const },
  ];

  const emergencyContacts = [
    { name: 'Police', number: '911', icon: 'shield' as const, color: ['#EF4444', '#DC2626'] },
    { name: 'Ambulance', number: '911', icon: 'medkit' as const, color: ['#10B981', '#059669'] },
    { name: 'Security', number: '555-0123', icon: 'lock-closed' as const, color: ['#F59E0B', '#D97706'] },
  ];

  const makePhoneCall = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(err => 
      Alert.alert('Error', 'Failed to make phone call')
    );
  };

  const renderReportTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Select Emergency Type</Text>
      
      <View style={styles.alertOptions}>
        {emergencyTypes.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.alertOption,
              selectedAlert === item.type && styles.selectedAlertOption,
            ]}
            onPress={() => {
              setSelectedAlert(item.type);
              setSelectedPriority(item.priority);
            }}
          >
            <Ionicons 
              name={item.icon} 
              size={24} 
              color={selectedAlert === item.type ? '#fff' : '#EF4444'} 
            />
            <Text style={[
              styles.alertOptionText,
              selectedAlert === item.type && styles.selectedAlertOptionText,
            ]}>
              {item.type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Priority Level</Text>
      <View style={styles.priorityOptions}>
        {priorityOptions.map((priority) => (
          <TouchableOpacity
            key={priority.value}
            style={[
              styles.priorityOption,
              { backgroundColor: priority.color },
              selectedPriority === priority.value && styles.selectedPriorityOption,
            ]}
            onPress={() => setSelectedPriority(priority.value)}
          >
            <Text style={styles.priorityText}>{priority.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Location</Text>
      <View style={styles.locationSection}>
        <View style={styles.locationButtons}>
          <TouchableOpacity style={styles.locationButton} onPress={() => setEmergencyLocation('College Main Gate')}>
            <Ionicons name="business" size={20} color="#fff" />
            <Text style={styles.locationButtonText}>Main Gate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.locationButton} onPress={() => setEmergencyLocation('Bus Stand')}>
            <Ionicons name="bus" size={20} color="#fff" />
            <Text style={styles.locationButtonText}>Bus Stand</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.locationButton} onPress={() => getCurrentLocation().then(setEmergencyLocation)}>
            <Ionicons name="location" size={20} color="#fff" />
            <Text style={styles.locationButtonText}>My Location</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Specify exact location..."
          value={emergencyLocation}
          onChangeText={setEmergencyLocation}
          multiline
        />
      </View>

      <Text style={styles.sectionTitle}>Additional Details</Text>
      <TextInput
        style={[styles.textInput, styles.textArea]}
        placeholder="Provide additional information that might help responders..."
        value={additionalMessage}
        onChangeText={setAdditionalMessage}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Text style={styles.sectionTitle}>Attach Photo (Optional)</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Ionicons name="camera" size={24} color="#6B7280" />
        <Text style={styles.uploadButtonText}>Choose Image</Text>
      </TouchableOpacity>
      
      {emergencyImage && (
        <View style={styles.imagePreview}>
          <Image source={{ uri: emergencyImage }} style={styles.previewImage} />
          <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.quickActions}>
        {quickActions.map((action, index) => (
          <TouchableOpacity key={index} style={styles.quickActionButton}>
            <Ionicons name={action.icon} size={20} color="#EF4444" />
            <Text style={styles.quickActionText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.submitButton}
        onPress={showEmergencyConfirmation}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="warning" size={24} color="#fff" />
            <Text style={styles.submitButtonText}>Submit Emergency Alert</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.sosButton}
        onPress={startCountdown}
        disabled={isSOSActive}
      >
        <Animated.View style={[styles.sosButtonInner, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.sosButtonText}>
            {isSOSActive ? countdown : 'SOS'}
          </Text>
          <Ionicons name="warning" size={32} color="#fff" />
        </Animated.View>
      </TouchableOpacity>

      {isSOSActive && (
        <TouchableOpacity style={styles.cancelButton} onPress={cancelSOS}>
          <Text style={styles.cancelButtonText}>Cancel Emergency</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  const renderResourcesTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Emergency Contacts</Text>
      <View style={styles.contactsGrid}>
        {emergencyContacts.map((contact, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contactButton}
            onPress={() => makePhoneCall(contact.number)}
          >
            <LinearGradient colors={contact.color} style={styles.contactIcon}>
              <Ionicons name={contact.icon} size={24} color="#fff" />
            </LinearGradient>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactNumber}>{contact.number}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Safety Tips</Text>
      <View style={styles.tipsList}>
        <View style={styles.tipItem}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text style={styles.tipText}>Ensure your safety first before reporting</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text style={styles.tipText}>Provide accurate location information</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text style={styles.tipText}>Stay on the line if calling emergency services</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderHistoryTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Alert History</Text>
      <View style={styles.historyList}>
        <View style={styles.historyItem}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyType}>Medical Emergency</Text>
            <Text style={styles.historyTime}>Today, 10:23 AM</Text>
          </View>
          <Text style={styles.historyDetails}>Location: Bus Stand</Text>
          <Text style={[styles.historyStatus, { color: '#10B981' }]}>Resolved</Text>
        </View>
        <View style={styles.historyItem}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyType}>Bus Breakdown</Text>
            <Text style={styles.historyTime}>Yesterday, 4:15 PM</Text>
          </View>
          <Text style={styles.historyDetails}>Location: Near Gandhi Statue</Text>
          <Text style={[styles.historyStatus, { color: '#10B981' }]}>Resolved</Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <LinearGradient colors={['#DC2626', '#EF4444']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Alert System</Text>
        <View style={styles.headerRight}>
          <View style={styles.connectionStatus}>
            <View style={[styles.statusDot, connectionStatus ? styles.online : styles.offline]} />
            <Text style={styles.statusText}>
              {connectionStatus ? 'Connected' : 'Offline'}
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={darkMode ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, currentTab === 'report' && styles.activeTab]}
          onPress={() => setCurrentTab('report')}
        >
          <Text style={[styles.tabText, currentTab === 'report' && styles.activeTabText]}>
            Report
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentTab === 'resources' && styles.activeTab]}
          onPress={() => setCurrentTab('resources')}
        >
          <Text style={[styles.tabText, currentTab === 'resources' && styles.activeTabText]}>
            Resources
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentTab === 'history' && styles.activeTab]}
          onPress={() => setCurrentTab('history')}
        >
          <Text style={[styles.tabText, currentTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {currentTab === 'report' && renderReportTab()}
      {currentTab === 'resources' && renderResourcesTab()}
      {currentTab === 'history' && renderHistoryTab()}

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Emergency Alert</Text>
            <Text style={styles.modalText}>
              Are you sure you want to submit this emergency alert? This will notify college authorities immediately.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={() => submitEmergencyAlert()}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelModalButton}
                onPress={() => setShowConfirmation(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Keep the same styles as in the previous code...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  darkContainer: {
    backgroundColor: '#1a202c',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  online: {
    backgroundColor: '#10B981',
  },
  offline: {
    backgroundColor: '#6B7280',
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  activeTabText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    marginTop: 16,
  },
  alertOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  alertOption: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedAlertOption: {
    backgroundColor: '#EF4444',
  },
  alertOptionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    textAlign: 'center',
  },
  selectedAlertOptionText: {
    color: '#fff',
  },
  priorityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityOption: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedPriorityOption: {
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  priorityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  locationSection: {
    marginBottom: 16,
  },
  locationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  locationButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  locationButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
    fontSize: 12,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadButtonText: {
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 8,
  },
  imagePreview: {
    position: 'relative',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickActionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    width: '23%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  sosButton: {
    alignItems: 'center',
    marginBottom: 12,
  },
  sosButtonInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: '#64748b',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  contactsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 10,
    color: '#64748b',
  },
  tipsList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  historyList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 12,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  historyTime: {
    fontSize: 12,
    color: '#64748b',
  },
  historyDetails: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  historyStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelModalButton: {
    flex: 1,
    backgroundColor: '#64748b',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});