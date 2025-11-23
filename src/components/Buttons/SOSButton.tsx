// src/components/Buttons/SOSButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SOSButtonProps {
  onPress: () => void;
  style?: any;
}

const SOSButton: React.FC<SOSButtonProps> = ({ onPress, style }) => {
  const handlePress = () => {
    Alert.alert(
      'Emergency SOS',
      'Are you sure you want to send an emergency alert?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send SOS',
          style: 'destructive',
          onPress: onPress,
        },
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#EA4335', '#D33426']}
        style={styles.gradient}
      >
        <Text style={styles.text}>SOS</Text>
        <Text style={styles.subText}>Emergency</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '500',
    opacity: 0.9,
    marginTop: 2,
  },
});

export default SOSButton;