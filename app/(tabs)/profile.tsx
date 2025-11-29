// app/(tabs)/profile.tsx
import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Personal Information',
      description: 'Update your profile details',
      action: 'personal-info',
      color: '#6E473B',
    },
    {
      icon: 'card-outline',
      title: 'Payment Methods',
      description: 'Manage your payment options',
      action: 'payment',
      color: '#6E473B',
    },
    {
      icon: 'heart-outline',
      title: 'Child Safety',
      description: 'Manage child tracking settings',
      action: 'child-safety',
      color: '#6E473B',
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      description: 'Configure alert preferences',
      action: 'notifications',
      color: '#6E473B',
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Privacy & Security',
      description: 'Manage your privacy settings',
      action: 'privacy',
      color: '#6E473B',
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      description: 'Get help and contact support',
      action: 'help',
      color: '#6E473B',
    },
  ];

  const stats = [
    { label: 'Trips Taken', value: '24', icon: 'bus' },
    { label: 'Favorite Routes', value: '3', icon: 'star' },
    { label: 'Alerts Set', value: '8', icon: 'notifications' },
  ];

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'personal-info':
        router.push('/profile-edit');
        break;
      case 'payment':
        Alert.alert('Payment Methods', 'Manage your payment options');
        break;
      case 'child-safety':
        Alert.alert('Child Safety', 'Child tracking settings');
        break;
      case 'notifications':
        Alert.alert('Notifications', 'Configure your alert preferences');
        break;
      case 'privacy':
        Alert.alert('Privacy & Security', 'Manage your privacy settings');
        break;
      case 'help':
        Alert.alert('Help & Support', 'Get help and contact support');
        break;
      default:
        Alert.alert('Coming Soon', 'This feature will be available soon!');
        break;
    }
  };

  const MenuItem: React.FC<{
    icon: string;
    title: string;
    description: string;
    action: string;
    color: string;
  }> = ({ icon, title, description, action, color }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handleMenuAction(action)}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIconContainer, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <View style={styles.menuText}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuDescription}>{description}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6E473B" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#291C0E" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>Manage your account</Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={22} color="#E1D4C2" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileSection}>
          <LinearGradient
            colors={['#6E473B', '#8B5A4A']}
            style={styles.profileCard}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0) || 'U'}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || 'User'}</Text>
                <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
                <Text style={styles.profileMember}>Member since 2024</Text>
              </View>
            </View>
            
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name={stat.icon} size={16} color="#E1D4C2" />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.sectionSubtitle}>Frequently used features</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => Alert.alert('QR Scan', 'Scan QR code')}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="qr-code" size={24} color="#6E473B" />
              </View>
              <Text style={styles.quickActionText}>QR Scan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => Alert.alert('Favorites', 'Your favorite routes')}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="star" size={24} color="#6E473B" />
              </View>
              <Text style={styles.quickActionText}>Favorites</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => Alert.alert('History', 'Your trip history')}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="time" size={24} color="#6E473B" />
              </View>
              <Text style={styles.quickActionText}>History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => Alert.alert('Alerts', 'Your notifications')}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="notifications" size={24} color="#6E473B" />
              </View>
              <Text style={styles.quickActionText}>Alerts</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <Text style={styles.sectionSubtitle}>Manage your preferences</Text>
          </View>
          
          <View style={styles.menuList}>
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                action={item.action}
                color={item.color}
              />
            ))}
          </View>
        </View>

        {/* Emergency Section */}
        <View style={styles.emergencySection}>
          <LinearGradient
            colors={['#291C0E', '#3A2A1A']}
            style={styles.emergencyCard}
          >
            <View style={styles.emergencyContent}>
              <Ionicons name="shield-checkmark" size={32} color="#E1D4C2" />
              <View style={styles.emergencyText}>
                <Text style={styles.emergencyTitle}>Account Security</Text>
                <Text style={styles.emergencyDescription}>
                  Keep your account safe and secure
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.securityButton}
                onPress={() => Alert.alert('Security', 'Security settings')}
              >
                <Text style={styles.securityButtonText}>Secure</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
          
          <Text style={styles.versionText}>SmartBus v1.0.0</Text>
        </View>
      </ScrollView>
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
    fontSize: 16,
    color: '#BEB5A9',
    marginTop: 4,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(110, 71, 59, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileSection: {
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
  profileCard: {
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E1D4C2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 4,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#291C0E',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E1D4C2',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#BEB5A9',
    marginBottom: 4,
    fontWeight: '400',
  },
  profileMember: {
    fontSize: 12,
    color: 'rgba(225, 212, 194, 0.8)',
    fontWeight: '400',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(225, 212, 194, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E1D4C2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#BEB5A9',
    fontWeight: '500',
    textAlign: 'center',
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
    fontSize: 14,
    color: '#6E473B',
    fontWeight: '400',
  },
  quickActionsSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F8F5F0',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#E1D4C2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#291C0E',
    textAlign: 'center',
  },
  menuSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  menuList: {
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8F5F0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#291C0E',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  menuDescription: {
    fontSize: 12,
    color: '#6E473B',
    fontWeight: '400',
  },
  emergencySection: {
    padding: 24,
  },
  emergencyCard: {
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emergencyText: {
    flex: 1,
    marginLeft: 16,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E1D4C2',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  emergencyDescription: {
    fontSize: 12,
    color: 'rgba(225, 212, 194, 0.8)',
    fontWeight: '400',
  },
  securityButton: {
    backgroundColor: '#E1D4C2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
  },
  securityButtonText: {
    color: '#291C0E',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutSection: {
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.2)',
    width: '100%',
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 12,
    color: '#6E473B',
    fontWeight: '400',
  },
});

export default ProfileScreen;