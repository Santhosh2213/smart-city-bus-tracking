// app/settings.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState(true);
  const [location, setLocation] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleBack = () => {
    router.back();
  };

  const settingsSections = [
    {
      title: 'Preferences',
      items: [
        {
          icon: 'notifications',
          title: 'Push Notifications',
          description: 'Receive bus alerts and updates',
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          icon: 'location',
          title: 'Location Services',
          description: 'Allow access to your location for better experience',
          type: 'switch',
          value: location,
          onValueChange: setLocation,
        },
        {
          icon: 'moon',
          title: 'Dark Mode',
          description: 'Switch to dark theme',
          type: 'switch',
          value: darkMode,
          onValueChange: setDarkMode,
        },
      ],
    },
    {
      title: 'More Settings',
      items: [
        {
          icon: 'language',
          title: 'Language',
          description: 'English',
          type: 'navigation',
          action: () => Alert.alert('Language', 'Change app language'),
        },
        {
          icon: 'card',
          title: 'Payment Methods',
          description: 'Manage your payment options',
          type: 'navigation',
          action: () => Alert.alert('Payment', 'Manage payment methods'),
        },
        {
          icon: 'shield',
          title: 'Privacy & Security',
          description: 'Manage your privacy settings',
          type: 'navigation',
          action: () => Alert.alert('Privacy', 'Privacy settings'),
        },
      ],
    },
  ];

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
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>Customize your app experience</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.settingItem}
                  onPress={item.action}
                  disabled={item.type === 'switch'}
                >
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIconContainer}>
                      <Ionicons name={item.icon} size={20} color="#6E473B" />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                      <Text style={styles.settingDescription}>{item.description}</Text>
                    </View>
                  </View>
                  {item.type === 'switch' && (
                    <Switch
                      value={item.value}
                      onValueChange={item.onValueChange}
                      trackColor={{ false: '#E1D4C2', true: '#6E473B' }}
                      thumbColor={item.value ? '#E1D4C2' : '#f4f3f4'}
                    />
                  )}
                  {item.type === 'navigation' && (
                    <Ionicons name="chevron-forward" size={20} color="#6E473B" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.infoSection}>
          <LinearGradient
            colors={['#6E473B', '#8B5A4A']}
            style={styles.infoCard}
          >
            <Ionicons name="information-circle" size={32} color="#E1D4C2" />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>SmartBus App</Text>
              <Text style={styles.infoDescription}>
                Version 1.0.0 • Built with ❤️ for better travel experience
              </Text>
            </View>
          </LinearGradient>
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
  section: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#291C0E',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  sectionContent: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8F5F0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E1D4C2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#291C0E',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6E473B',
    fontWeight: '400',
  },
  infoSection: {
    padding: 24,
  },
  infoCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  infoText: {
    flex: 1,
    marginLeft: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E1D4C2',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  infoDescription: {
    fontSize: 12,
    color: 'rgba(225, 212, 194, 0.8)',
    fontWeight: '400',
  },
});