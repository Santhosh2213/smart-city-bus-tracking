import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert, Vibration, Platform } from 'react-native';
import * as Location from 'expo-location';

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

interface SOSContextType {
  isSOSActive: boolean;
  activateSOS: (manual?: boolean) => void;
  deactivateSOS: () => void;
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (contact: EmergencyContact) => void;
  removeEmergencyContact: (phone: string) => void;
}

const SOSContext = createContext<SOSContextType | undefined>(undefined);

export const SOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      name: 'Police',
      phone: '100',
      relationship: 'Emergency Service'
    },
    {
      name: 'Transport Authority',
      phone: '+1234567890',
      relationship: 'Emergency Service'
    }
  ]);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location permission is required for SOS feature');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const activateSOS = async (manual = false) => {
    try {
      // Vibrate device
      Vibration.vibrate([0, 500, 200, 500]);
      
      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Simulate sending alerts
      await sendEmergencyAlerts(location, manual);

      setIsSOSActive(true);
      
      if (manual) {
        Alert.alert(
          'SOS Activated!',
          'Emergency alerts have been sent to authorities and your emergency contacts.',
          [{ text: 'OK', onPress: () => {} }]
        );
      }

      // Auto-deactivate after 30 seconds
      setTimeout(() => {
        if (isSOSActive) {
          deactivateSOS();
        }
      }, 30000);

    } catch (error) {
      console.error('Error activating SOS:', error);
      Alert.alert('Error', 'Failed to activate SOS. Please try again.');
    }
  };

  const deactivateSOS = () => {
    setIsSOSActive(false);
    Vibration.cancel();
  };

  const sendEmergencyAlerts = async (location: Location.LocationObject, manual: boolean) => {
    const emergencyData = {
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      },
      timestamp: new Date().toISOString(),
      type: manual ? 'Manual SOS' : 'Shake Detection',
      busInfo: {
        number: '205', // This would come from your bus context
        route: 'Route 12 - Downtown Express'
      }
    };

    // In a real app, you would send this data to your backend
    // which would then notify emergency services and contacts
    console.log('Sending emergency alerts:', emergencyData);

    // Simulate API calls
    await simulateAPICall('Police', emergencyData);
    await simulateAPICall('Transport Authority', emergencyData);
    
    // Send to emergency contacts
    emergencyContacts.forEach(contact => {
      if (contact.relationship !== 'Emergency Service') {
        simulateSMSSend(contact, emergencyData);
      }
    });
  };

  const simulateAPICall = async (service: string, data: any) => {
    console.log(`Sending alert to ${service}:`, data);
    // Actual implementation would use fetch/axios to call your API
  };

  const simulateSMSSend = (contact: EmergencyContact, data: any) => {
    console.log(`Sending SMS to ${contact.name} (${contact.phone}):`, {
      message: `EMERGENCY ALERT: SOS activated from SmartBus app. Location: ${data.location.latitude}, ${data.location.longitude}. Bus: ${data.busInfo.number}. Time: ${new Date(data.timestamp).toLocaleString()}`
    });
  };

  const addEmergencyContact = (contact: EmergencyContact) => {
    setEmergencyContacts(prev => [...prev, contact]);
  };

  const removeEmergencyContact = (phone: string) => {
    setEmergencyContacts(prev => prev.filter(contact => contact.phone !== phone));
  };

  return (
    <SOSContext.Provider value={{
      isSOSActive,
      activateSOS,
      deactivateSOS,
      emergencyContacts,
      addEmergencyContact,
      removeEmergencyContact,
    }}>
      {children}
    </SOSContext.Provider>
  );
};

export const useSOS = () => {
  const context = useContext(SOSContext);
  if (context === undefined) {
    throw new Error('useSOS must be used within an SOSProvider');
  }
  return context;
};