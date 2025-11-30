<<<<<<< HEAD
// app/index.tsx - CORRECTED VERSION
=======
// app/index.tsx - REDESIGNED STYLES
>>>>>>> 6a2e44727d483020c3258e3ba209a2c6f4f7391e
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LandingPage() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isSmallScreen = width < 375;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const features = [
    {
<<<<<<< HEAD
      icon: 'qr-code',
      title: 'QR Boarding',
      description: 'Quick and contactless boarding with QR codes',
      color: ['#4F46E5', '#7C73E6'],
      onPress: () => router.push('/QRBoarding')
    },
    {
      icon: 'location',
      title: 'Live Tracking',
      description: 'Real-time bus locations and arrival predictions',
      color: ['#10B981', '#34D399'],
      onPress: () => router.push('/bus-tracker')
    },
    {
      icon: 'people',
      title: 'Child Safety',
      description: 'Track your child\'s bus journey in real-time',
      color: ['#F59E0B', '#FBBF24'],
      onPress: () => router.push('/safety')
=======
      icon: 'location',
      title: 'Live Tracking',
      description: 'Real-time bus locations and arrival predictions',
      color: ['#6E473B', '#A78D78'],
    },
    {
      icon: 'qr-code',
      title: 'QR Boarding',
      description: 'Quick and contactless boarding with QR codes',
      color: ['#6E473B', '#A78D78'],
    },
    {
      icon: 'heart',
      title: 'Child Safety',
      description: 'Track your child\'s bus journey in real-time',
      color: ['#6E473B', '#A78D78'],
>>>>>>> 6a2e44727d483020c3258e3ba209a2c6f4f7391e
    },
    {
      icon: 'warning',
      title: 'SOS Alert',
      description: 'Instant emergency alerts with location sharing',
<<<<<<< HEAD
      color: ['#EF4444', '#F87171'],
      onPress: () => router.push('/sos')
    },
    {
      icon: 'time',
      title: 'Smart Schedule',
      description: 'Optimized routes and intelligent scheduling',
      color: ['#8B5CF6', '#A78BFA'],
      onPress: () => router.push('/schedule')
    },
    {
      icon: 'map',
      title: 'Offline Maps',
      description: 'Access maps without internet connection',
      color: ['#06B6D4', '#22D3EE'],
      onPress: () => router.push('/maps')
=======
      color: ['#6E473B', '#A78D78'],
    },
    {
      icon: 'calendar',
      title: 'Smart Schedule',
      description: 'Optimized routes and intelligent scheduling',
      color: ['#6E473B', '#A78D78'],
    },
    {
      icon: 'cloud-offline',
      title: 'Offline Maps',
      description: 'Access maps without internet connection',
      color: ['#6E473B', '#A78D78'],
>>>>>>> 6a2e44727d483020c3258e3ba209a2c6f4f7391e
    },
  ];

  const handleNotificationPress = () => {
    router.push('/NotificationScreen');
  };

  const handleQRBoarding = () => {
    router.push('/QRBoarding');
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar barStyle="light-content" backgroundColor="#291C0E" />
      
      {/* Glass Morphism Header */}
      <Animated.View 
        style={[
          styles.header,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="bus" size={22} color="#E1D4C2" />
          </View>
          <Text style={styles.logo}>SmartBus</Text>
        </View>
        
        <View style={styles.navLinks}>
          <TouchableOpacity 
            style={styles.notificationIcon}
            onPress={handleNotificationPress}
          >
            <Ionicons name="notifications-outline" size={24} color="#1e40af" />
          </TouchableOpacity>
          <Link href="/about" asChild>
            <TouchableOpacity style={styles.navLink}>
              <Ionicons name="information-circle-outline" size={22} color="#E1D4C2" />
            </TouchableOpacity>
          </Link>
          <Link href="/contact" asChild>
            <TouchableOpacity style={styles.navLink}>
              <Ionicons name="mail-outline" size={22} color="#E1D4C2" />
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>

      {/* Minimal Hero Section */}
      <View style={styles.hero}>
        <LinearGradient
          colors={['#291C0E', '#3A2A1A']}
          style={styles.heroBackground}
        >
          <View style={[styles.heroContent, isSmallScreen && styles.heroContentSmall]}>
            <View style={styles.heroText}>
              <Animated.Text 
                style={[
                  styles.heroTitle, 
                  isSmallScreen && styles.heroTitleSmall,
                  { opacity: fadeAnim }
                ]}
              >
                Smarter Bus Travel
              </Animated.Text>
              <Animated.Text 
                style={[
                  styles.heroSubtitle, 
                  isSmallScreen && styles.heroSubtitleSmall,
                  { opacity: fadeAnim }
                ]}
              >
                Real-time tracking, smart scheduling, and enhanced safety features for everyone.
              </Animated.Text>
              <Animated.View 
                style={[
                  styles.heroButtons, 
                  isSmallScreen && styles.heroButtonsSmall,
                  { opacity: fadeAnim }
                ]}
              >
                <Link href="/(tabs)" asChild>
                  <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Get Started</Text>
                    <Ionicons name="arrow-forward" size={18} color="#291C0E" />
                  </TouchableOpacity>
                </Link>
              </Animated.View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Modern Quick Actions */}
      <View style={styles.quickActions}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionSubtitle}>Get where you need to go</Text>
        </View>
        
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="play-circle" size={28} color="#6E473B" />
            </View>
            <Text style={styles.actionText}>Start Trip</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="map" size={28} color="#6E473B" />
            </View>
            <Text style={styles.actionText}>View Routes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="time" size={28} color="#6E473B" />
            </View>
            <Text style={styles.actionText}>Schedule</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="notifications" size={28} color="#6E473B" />
            </View>
            <Text style={styles.actionText}>Alerts</Text>
          </TouchableOpacity>
        </View>
      </View>

<<<<<<< HEAD
      {/* Hero Section */}
      <LinearGradient
        colors={['#1e40af', '#3b82f6', '#60a5fa']}
        style={styles.hero}
      >
        <View style={[styles.heroContent, isSmallScreen && styles.heroContentSmall]}>
          <View style={styles.heroText}>
            <Text style={[styles.heroTitle, isSmallScreen && styles.heroTitleSmall]}>
              Smarter Bus Travel, Safer Journeys
            </Text>
            <Text style={[styles.heroSubtitle, isSmallScreen && styles.heroSubtitleSmall]}>
              Experience the future of public transportation with QR boarding, 
              real-time tracking, and enhanced safety features for everyone.
            </Text>
            <View style={[styles.heroButtons, isSmallScreen && styles.heroButtonsSmall]}>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleQRBoarding}
              >
                <Ionicons name="qr-code" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Scan QR Code</Text>
              </TouchableOpacity>
              <Link href="/(tabs)" asChild>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Launch App</Text>
                  <Ionicons name="arrow-forward" size={20} color="#1e40af" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
          
          <View style={styles.heroVisual}>
            <View style={styles.phoneMockup}>
              <View style={styles.phoneScreen}>
                <LinearGradient
                  colors={['#4F46E5', '#7C73E6']}
                  style={styles.mockupContent}
                >
                  <View style={styles.qrVisual}>
                    <View style={styles.qrCodePlaceholder}>
                      <Ionicons name="qr-code" size={80} color="#fff" />
                      <Text style={styles.qrText}>Scan to Board</Text>
                    </View>
                    <Text style={styles.mockupText}>SmartBus QR</Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </View>
        </View>
=======
      {/* Elegant Search Section */}
      <View style={styles.searchSection}>
        <Text style={styles.searchTitle}>Plan Your Journey</Text>
>>>>>>> 6a2e44727d483020c3258e3ba209a2c6f4f7391e
        
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchInput}>
            <Ionicons name="search" size={20} color="#6E473B" />
            <Text style={styles.searchPlaceholder}>Where do you want to go?</Text>
          </TouchableOpacity>
          
          <View style={styles.searchQuickOptions}>
            <TouchableOpacity style={styles.quickOption}>
              <Ionicons name="home" size={18} color="#6E473B" />
              <Text style={styles.quickOptionText}>Home</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickOption}>
              <Ionicons name="business" size={18} color="#6E473B" />
              <Text style={styles.quickOptionText}>Work</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickOption}>
              <Ionicons name="star" size={18} color="#6E473B" />
              <Text style={styles.quickOptionText}>Favorites</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modern Features Grid */}
      <View style={styles.featuresSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Why SmartBus?</Text>
          <Text style={styles.sectionSubtitle}>Everything you need for stress-free travel</Text>
        </View>
        
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
<<<<<<< HEAD
            <TouchableOpacity 
              key={index} 
              style={styles.featureCard}
              onPress={feature.onPress}
            >
=======
            <TouchableOpacity key={index} style={styles.featureCard}>
>>>>>>> 6a2e44727d483020c3258e3ba209a2c6f4f7391e
              <LinearGradient
                colors={feature.color}
                style={styles.featureIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
<<<<<<< HEAD
                <Ionicons name={feature.icon as any} size={24} color="#fff" />
=======
                <Ionicons name={feature.icon} size={22} color="#E1D4C2" />
>>>>>>> 6a2e44727d483020c3258e3ba209a2c6f4f7391e
              </LinearGradient>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

<<<<<<< HEAD
      {/* QR Boarding Highlight Section */}
      <View style={styles.qrHighlightSection}>
        <LinearGradient
          colors={['#4F46E5', '#7C73E6']}
          style={styles.qrHighlightGradient}
        >
          <View style={styles.qrHighlightContent}>
            <View style={styles.qrHighlightText}>
              <Text style={styles.qrHighlightTitle}>Quick QR Boarding</Text>
              <Text style={styles.qrHighlightSubtitle}>
                Scan unique QR codes on buses for instant access to:
              </Text>
              <View style={styles.qrFeaturesList}>
                <View style={styles.qrFeatureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.qrFeatureText}>Live Route Tracking</Text>
                </View>
                <View style={styles.qrFeatureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.qrFeatureText}>Real-time Arrival Updates</Text>
                </View>
                <View style={styles.qrFeatureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.qrFeatureText}>Safe Travel Check-in</Text>
                </View>
              </View>
            </View>
            <View style={styles.qrHighlightAction}>
              <TouchableOpacity 
                style={styles.qrActionButton}
                onPress={handleQRBoarding}
              >
                <Ionicons name="qr-code" size={24} color="#4F46E5" />
                <Text style={styles.qrActionText}>Try QR Boarding</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Stats Section */}
      <LinearGradient
        colors={['#4F46E5', '#7C73E6']}
        style={styles.statsSection}
      >
=======
      {/* Stats Banner */}
      <View style={styles.statsBanner}>
>>>>>>> 6a2e44727d483020c3258e3ba209a2c6f4f7391e
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Buses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1K+</Text>
            <Text style={styles.statLabel}>Riders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>99%</Text>
            <Text style={styles.statLabel}>On Time</Text>
          </View>
<<<<<<< HEAD
          <View style={styles.stat}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Support</Text>
          </View>
        </View>
      </LinearGradient>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={[styles.ctaTitle, isSmallScreen && styles.ctaTitleSmall]}>
          Ready to Transform Your Commute?
        </Text>
        <Text style={[styles.ctaSubtitle, isSmallScreen && styles.ctaSubtitleSmall]}>
          Join thousands of satisfied users and experience smarter bus travel today
        </Text>
        <View style={[styles.ctaButtons, isSmallScreen && styles.ctaButtonsSmall]}>
          <TouchableOpacity 
            style={styles.ctaPrimary}
            onPress={handleQRBoarding}
          >
            <Ionicons name="qr-code" size={20} color="#fff" />
            <Text style={styles.ctaPrimaryText}>Try QR Boarding</Text>
          </TouchableOpacity>
          <Link href="/(tabs)" asChild>
            <TouchableOpacity style={styles.ctaSecondary}>
              <Text style={styles.ctaSecondaryText}>Explore Features</Text>
            </TouchableOpacity>
          </Link>
=======
>>>>>>> 6a2e44727d483020c3258e3ba209a2c6f4f7391e
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconActive}>
            <Ionicons name="home" size={22} color="#291C0E" />
          </View>
<<<<<<< HEAD
          
          <View style={styles.footerLinks}>
            <Text style={styles.footerHeading}>Features</Text>
            <TouchableOpacity onPress={handleQRBoarding}>
              <Text style={styles.footerLink}>QR Boarding</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Live Tracking</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/sos')}>
              <Text style={styles.footerLink}>Safety</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footerLinks}>
            <Text style={styles.footerHeading}>Company</Text>
            <Link href="/about" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>About Us</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/contact" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Contact</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Careers</Text>
            </TouchableOpacity>
          </View>
        </View>
=======
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
>>>>>>> 6a2e44727d483020c3258e3ba209a2c6f4f7391e
        
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon}>
            <Ionicons name="map-outline" size={22} color="#6E473B" />
          </View>
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon}>
            <Ionicons name="notifications-outline" size={22} color="#6E473B" />
          </View>
          <Text style={styles.navText}>Alerts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon}>
            <Ionicons name="person-outline" size={22} color="#6E473B" />
          </View>
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F0',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(41, 28, 14, 0.95)',
    backdropFilter: 'blur(10px)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(110, 71, 59, 0.3)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(110, 71, 59, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E1D4C2',
    letterSpacing: -0.5,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notificationIcon: {
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  navLink: {
    padding: 8,
  },
  // Hero Styles
  hero: {
    marginTop: 80,
  },
  heroBackground: {
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroContentSmall: {
    flexDirection: 'column',
  },
  heroText: {
    width: '100%',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#E1D4C2',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  heroTitleSmall: {
    fontSize: 28,
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#BEB5A9',
    lineHeight: 24,
    marginBottom: 32,
    textAlign: 'center',
    maxWidth: 280,
    fontWeight: '400',
  },
  heroSubtitleSmall: {
    fontSize: 14,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  heroButtonsSmall: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1D4C2',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    elevation: 4,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  primaryButtonText: {
<<<<<<< HEAD
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#1e40af',
=======
    color: '#291C0E',
>>>>>>> 6a2e44727d483020c3258e3ba209a2c6f4f7391e
    fontSize: 16,
    fontWeight: '600',
  },
  // Quick Actions
  quickActions: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
  },
<<<<<<< HEAD
  phoneMockup: {
    width: 250,
    height: 500,
    backgroundColor: '#1e293b',
    borderRadius: 30,
    padding: 6,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
  },
  mockupContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  qrVisual: {
    alignItems: 'center',
  },
  qrCodePlaceholder: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrText: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
  },
  mockupText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  waveDivider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  featuresSection: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
=======
  sectionHeader: {
    marginBottom: 24,
>>>>>>> 6a2e44727d483020c3258e3ba209a2c6f4f7391e
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
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F8F5F0',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#E1D4C2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#291C0E',
    textAlign: 'center',
  },
  // Search Section
  searchSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#291C0E',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  searchContainer: {
    gap: 16,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F5F0',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.3)',
    gap: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#6E473B',
    fontWeight: '400',
  },
  searchQuickOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F5F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  quickOptionText: {
    fontSize: 12,
    color: '#6E473B',
    fontWeight: '500',
  },
  // Features Section
  featuresSection: {
    padding: 24,
    backgroundColor: '#F8F5F0',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
    elevation: 2,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
<<<<<<< HEAD
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
=======
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
>>>>>>> 6a2e44727d483020c3258e3ba209a2c6f4f7391e
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#291C0E',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  featureDescription: {
    fontSize: 12,
    color: '#6E473B',
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '400',
  },
<<<<<<< HEAD
  qrHighlightSection: {
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  qrHighlightGradient: {
    padding: 30,
  },
  qrHighlightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qrHighlightText: {
    flex: 1,
    paddingRight: 20,
  },
  qrHighlightTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  qrHighlightSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  qrFeaturesList: {
    gap: 8,
  },
  qrFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qrFeatureText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  qrHighlightAction: {
    alignItems: 'center',
  },
  qrActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  qrActionText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsSection: {
    paddingVertical: 50,
=======
  // Stats Banner
  statsBanner: {
    padding: 24,
    backgroundColor: '#6E473B',
    marginHorizontal: 24,
    borderRadius: 20,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
>>>>>>> 6a2e44727d483020c3258e3ba209a2c6f4f7391e
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E1D4C2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#BEB5A9',
    fontWeight: '500',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(225, 212, 194, 0.3)',
  },
  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(167, 141, 120, 0.2)',
    marginTop: 24,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
  },
  navIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  navIconActive: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E1D4C2',
  },
  navText: {
    fontSize: 10,
    color: '#6E473B',
    fontWeight: '500',
  },
  navTextActive: {
    fontSize: 10,
    color: '#291C0E',
    fontWeight: '600',
  },
<<<<<<< HEAD
  ctaSection: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaTitleSmall: {
    fontSize: 24,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  ctaSubtitleSmall: {
    fontSize: 14,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  ctaButtonsSmall: {
    flexDirection: 'column',
  },
  ctaPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  ctaPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ctaSecondary: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  ctaSecondaryText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  footerContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  footerSection: {
    width: '100%',
    marginBottom: 20,
  },
  footerLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  footerTagline: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  footerLinks: {
    width: '48%',
    marginBottom: 20,
  },
  footerHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  footerLink: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 20,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
=======
>>>>>>> 6a2e44727d483020c3258e3ba209a2c6f4f7391e
});