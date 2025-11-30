// app/profile-edit.tsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { AuthContext } from '../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileEditScreen() {
  const router = useRouter();
  const { user, updateProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      updateProfile(formData);
      Alert.alert('Success', 'Profile updated successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#291C0E" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#E1D4C2" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <Text style={styles.headerSubtitle}>Update your personal information</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Form */}
        <View style={styles.formSection}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {formData.name?.charAt(0) || 'U'}
              </Text>
            </View>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter your full name"
                placeholderTextColor="#6E473B"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Enter your email"
                placeholderTextColor="#6E473B"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Enter your phone number"
                placeholderTextColor="#6E473B"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                placeholder="Enter your address"
                placeholderTextColor="#6E473B"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#6E473B', '#8B5A4A']}
              style={styles.saveButtonGradient}
            >
              <Ionicons name="save-outline" size={20} color="#E1D4C2" />
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleBack}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F0',
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
  backButton: {
    padding: 8,
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  formSection: {
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E1D4C2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#291C0E',
  },
  changePhotoButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#F8F5F0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.3)',
  },
  changePhotoText: {
    color: '#6E473B',
    fontSize: 14,
    fontWeight: '500',
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#291C0E',
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F8F5F0',
    fontSize: 16,
    color: '#291C0E',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  actionSection: {
    padding: 24,
    gap: 16,
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    color: '#E1D4C2',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.3)',
    borderRadius: 16,
  },
  cancelButtonText: {
    color: '#6E473B',
    fontSize: 16,
    fontWeight: '600',
  },
});