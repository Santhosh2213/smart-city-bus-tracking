import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  Vibration,
  Dimensions 
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

const QRScanScreen: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleQRScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      Vibration.vibrate(300);
      
      // Accept ANY QR code for testing
      processQRCode(data);
    }
  };

  const processQRCode = async (qrData: string) => {
    try {
      console.log('QR Code Scanned:', qrData);
      
      // For testing, accept any QR code format
      let busId = 'Test Bus';
      
      // Try to extract bus ID if in expected format, otherwise use the full data
      if (qrData.startsWith('bus_')) {
        const parts = qrData.split('_');
        busId = parts[1] || 'Test Bus';
      } else {
        // Use first 10 characters of any QR code as bus ID for testing
        busId = qrData.substring(0, 10) || 'Test Bus';
      }

      // Simulate API call to validate boarding
      const boardingSuccess = await validateBoarding(busId);
      
      if (boardingSuccess) {
        Alert.alert(
          'Boarding Successful!',
          `You have successfully boarded ${busId}`,
          [
            {
              text: 'OK',
              onPress: () => {
                setScanned(false);
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        throw new Error('Boarding validation failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process QR code. Please try again.');
      setTimeout(() => setScanned(false), 2000);
    }
  };

  const validateBoarding = async (busId: string): Promise<boolean> => {
    // Simulate API call to backend
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true); // Always return true for demo
      }, 1000);
    });
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Camera permission is required to scan QR codes</Text>
        <Text style={styles.button} onPress={requestPermission}>
          Grant Permission
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Bus QR Code</Text>
      <Text style={styles.subtitle}>Position the QR code within the frame</Text>
      
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleQRScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />
        
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {scanned ? 'Processing...' : 'Ready to scan'}
        </Text>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const scanFrameSize = width * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  scanFrame: {
    width: scanFrameSize,
    height: scanFrameSize,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default QRScanScreen;