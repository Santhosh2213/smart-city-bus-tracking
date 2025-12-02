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
// CORRECTED IMPORT - single line only:
import { database, ref, push, set, onValue, off, query, orderByChild, limitToLast } from '../firebaseConfig';

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

// Types
interface UserDetails {
  name: string;
  regNumber: string;
  busNumber: string;
  department: string;
  phoneNumber: string;
  timestamp?: string;
  userId?: string;
}

interface EmergencyAlert {
  id?: string;
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
  assignedTo?: string;
  resolvedAt?: number;
  notes?: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface HistoryAlert {
  id: string;
  alertType: string;
  timestamp: number;
  location: string;
  status: string;
  priority: string;
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
    userId: 'user_001',
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
  
  // Firebase state
  const [alertHistory, setAlertHistory] = useState<HistoryAlert[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // Refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countdownRef = useRef<NodeJS.Timeout>();

  // Load user details and alert history on component mount
  useEffect(() => {
    checkConnectionStatus();
    loadUserDetails();
    
    // Cleanup
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      // Unsubscribe from Firebase listeners
      const alertHistoryRef = ref(database, 'emergencyAlerts');
      off(alertHistoryRef);
    };
  }, []);

  // Load alert history when history tab is active
  useEffect(() => {
    if (currentTab === 'history') {
      loadAlertHistory();
    }
  }, [currentTab]);

  const loadUserDetails = async () => {
    // In a real app, you would load this from AsyncStorage or your auth system
    try {
      // Simulate loading user details
      const savedUser = {
        name: 'John Doe',
        regNumber: '2023001',
        busNumber: '5',
        department: 'CSE',
        phoneNumber: '+1234567890',
        userId: 'user_001',
      };
      setUserDetails(savedUser);
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  const loadAlertHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const alertsRef = ref(database, 'emergencyAlerts');
      const recentAlertsQuery = query(
        alertsRef,
        orderByChild('timestamp'),
        limitToLast(10)
      );

      onValue(recentAlertsQuery, (snapshot) => {
        const data = snapshot.val();
        const alerts: HistoryAlert[] = [];
        
        if (data) {
          Object.keys(data).forEach((key) => {
            const alert = data[key];
            // Filter alerts for current user
            if (alert.regNumber === userDetails.regNumber) {
              alerts.push({
                id: key,
                alertType: alert.alertType,
                timestamp: alert.timestamp,
                location: alert.location,
                status: alert.status || 'pending',
                priority: alert.priority,
              });
            }
          });
          
          // Sort by timestamp descending
          alerts.sort((a, b) => b.timestamp - a.timestamp);
          setAlertHistory(alerts);
        }
      }, (error) => {
        console.error('Error loading alert history:', error);
        Alert.alert('Error', 'Failed to load alert history');
      });
    } catch (error) {
      console.error('Error loading alert history:', error);
      Alert.alert('Error', 'Failed to load alert history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

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
    // Check Firebase connection
    const connectedRef = ref(database, '.info/connected');
    onValue(connectedRef, (snap) => {
      setConnectionStatus(snap.val() === true);
    });
    
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

  const getCurrentLocation = async (): Promise<string> => {
    if (!Location) {
      return "Location services not available";
    }

    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      return "Location permission denied";
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const { latitude, longitude } = location.coords;
      setCurrentCoordinates({ lat: latitude, lng: longitude });
      
      // You could also save coordinates to Firebase
      const coordsRef = ref(database, `users/${userDetails.userId}/lastLocation`);
      await set(coordsRef, {
        lat: latitude,
        lng: longitude,
        timestamp: Date.now(),
      });
      
      return `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
    } catch (error) {
      console.error('Error getting location:', error);
      return "Unable to get location";
    }
  };

  const triggerSOSAlert = async () => {
    try {
      // Vibrate device
      if (Platform.OS !== 'web') {
        Vibration.vibrate([500, 500, 500], true);
      }

      // Get current location
      let location = "Location unknown";
      try {
        location = await getCurrentLocation();
      } catch (error) {
        console.error('Error getting location:', error);
      }
      
      const alertData: EmergencyAlert = {
        ...userDetails,
        alertType: "SOS EMERGENCY",
        additionalMessage: "SOS button pressed - immediate assistance required!",
        location: location,
        priority: "critical",
        timestamp: Date.now(),
        status: "active",
        isSOS: true,
        coordinates: currentCoordinates,
        assignedTo: "security",
        notes: "SOS triggered automatically",
      };

      // Submit emergency alert
      await submitEmergencyAlert(alertData);
      
      // Also create a notification
      await createEmergencyNotification(alertData);
    } catch (error) {
      console.error('Error in triggerSOSAlert:', error);
      Alert.alert('Error', 'Failed to trigger SOS alert');
    }
  };

  const createEmergencyNotification = async (alertData: EmergencyAlert) => {
    try {
      const notification = {
        id: `sos_${Date.now()}`,
        title: '🚨 Emergency SOS Alert',
        message: `${alertData.name} has triggered an emergency SOS from ${alertData.location}`,
        type: 'alert',
        timestamp: Date.now(),
        isRead: false,
        priority: 'critical',
        location: alertData.location,
        alertId: alertData.id,
        userId: alertData.userId,
      };

      const notificationsRef = ref(database, 'notifications');
      const newNotificationRef = push(notificationsRef);
      await set(newNotificationRef, notification);
      
    } catch (error) {
      console.error('Error creating notification:', error);
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
        // In a real app, you would upload this to Firebase Storage
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
        assignedTo: "pending",
      };

      // Push to Firebase Realtime Database
      const alertsRef = ref(database, 'emergencyAlerts');
      const newAlertRef = push(alertsRef);
      
      // Add the alert ID to the data
      data.id = newAlertRef.key!;
      
      // Save to Firebase
      await set(newAlertRef, data);
      
      // Also save to user's personal alert history
      const userAlertRef = ref(database, `users/${userDetails.userId}/alerts/${newAlertRef.key}`);
      await set(userAlertRef, {
        alertType: data.alertType,
        timestamp: data.timestamp,
        status: data.status,
        location: data.location,
      });
      
      // Show success
      Alert.alert(
        'Success',
        'Emergency alert submitted successfully! Authorities have been notified.',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              // Refresh history if on history tab
              if (currentTab === 'history') {
                loadAlertHistory();
              }
            }
          }
        ]
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

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // If within 24 hours, show relative time
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      }
      const minutes = Math.floor(diff / (60 * 1000));
      if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      }
      return 'Just now';
    }
    
    // Otherwise show date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#DC2626';
      case 'high': return '#F59E0B';
      case 'medium': return '#10B981';
      case 'low': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#F59E0B';
      case 'resolved': return '#10B981';
      case 'pending': return '#6B7280';
      default: return '#6B7280';
    }
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
          <TouchableOpacity 
            style={styles.locationButton} 
            onPress={() => {
              getCurrentLocation().then(location => {
                setEmergencyLocation(location);
              });
            }}
          >
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
      
      {isLoadingHistory ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EF4444" />
          <Text style={styles.loadingText}>Loading alert history...</Text>
        </View>
      ) : alertHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={64} color="#CBD5E0" />
          <Text style={styles.emptyText}>No alerts submitted yet</Text>
          <Text style={styles.emptySubText}>
            Your emergency alerts will appear here once submitted
          </Text>
        </View>
      ) : (
        <View style={styles.historyList}>
          {alertHistory.map((alert) => (
            <View key={alert.id} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <View style={styles.historyTypeContainer}>
                  <Text style={styles.historyType}>{alert.alertType}</Text>
                  <View style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(alert.priority) }
                  ]}>
                    <Text style={styles.priorityBadgeText}>
                      {alert.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.historyTime}>
                  {formatTime(alert.timestamp)}
                </Text>
              </View>
              <Text style={styles.historyDetails}>
                Location: {alert.location}
              </Text>
              <View style={styles.historyFooter}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(alert.status) }
                ]}>
                  <Text style={styles.statusBadgeText}>
                    {alert.status.toUpperCase()}
                  </Text>
                </View>
                <TouchableOpacity style={styles.viewDetailsButton}>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <Ionicons name="chevron-forward" size={16} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelModalButton}
                onPress={() => setShowConfirmation(false)}
                disabled={isLoading}
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
    backgroundColor: '#F8F5F0',
  },
  darkContainer: {
    backgroundColor: '#291C0E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#291C0E',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E1D4C2',
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
    backgroundColor: '#6E473B',
  },
  offline: {
    backgroundColor: '#BEB5A9',
  },
  statusText: {
    fontSize: 12,
    color: '#E1D4C2',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F5F0',
    marginHorizontal: 24,
    marginVertical: 16,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6E473B',
  },
  activeTabText: {
    color: '#291C0E',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#291C0E',
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
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  selectedAlertOption: {
    backgroundColor: '#6E473B',
    borderColor: '#6E473B',
  },
  alertOptionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#291C0E',
    textAlign: 'center',
  },
  selectedAlertOptionText: {
    color: '#E1D4C2',
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
    borderColor: '#E1D4C2',
    elevation: 4,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priorityText: {
    color: '#E1D4C2',
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
    backgroundColor: '#6E473B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  locationButtonText: {
    color: '#E1D4C2',
    fontWeight: '500',
    marginLeft: 4,
    fontSize: 12,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.3)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#291C0E',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(167, 141, 120, 0.3)',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadButtonText: {
    color: '#6E473B',
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
    backgroundColor: 'rgba(41, 28, 14, 0.7)',
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
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    width: '23%',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  quickActionText: {
    fontSize: 10,
    color: '#6E473B',
    marginTop: 4,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#6E473B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  submitButtonText: {
    color: '#E1D4C2',
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
    backgroundColor: '#EF4444', // Keep SOS button red for emergency visibility
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E1D4C2',
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: '#6E473B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#E1D4C2',
    fontWeight: '600',
  },
  contactsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    width: '31%',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
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
    color: '#291C0E',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 10,
    color: '#6E473B',
  },
  tipsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#6E473B',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  historyList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 141, 120, 0.2)',
    paddingBottom: 12,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  historyType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#291C0E',
    marginRight: 8,
  },
  historyTime: {
    fontSize: 12,
    color: '#6E473B',
  },
  historyDetails: {
    fontSize: 14,
    color: '#6E473B',
    marginBottom: 8,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityBadgeText: {
    color: '#E1D4C2',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: '#E1D4C2',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 12,
    color: '#6E473B',
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(41, 28, 14, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#291C0E',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#6E473B',
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
    backgroundColor: '#6E473B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  confirmButtonText: {
    color: '#E1D4C2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelModalButton: {
    flex: 1,
    backgroundColor: '#E1D4C2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelModalButtonText: {
    color: '#291C0E',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6E473B',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#291C0E',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#6E473B',
    textAlign: 'center',
    marginTop: 8,
  },
});