// app/index.tsx - ENHANCED WEBSITE-STYLE DESIGN
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
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function LandingPage() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const floatAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Main animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const floatingTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const features = [
    {
      icon: 'map',
      title: 'Live Tracking',
      description: 'Real-time GPS tracking of all college buses so you always know where your bus is.',
    },
    {
      icon: 'time',
      title: 'Accurate ETAs',
      description: 'Get precise estimated arrival times based on current traffic conditions.',
    },
    {
      icon: 'notifications',
      title: 'Smart Alerts',
      description: 'Receive notifications for delays, route changes, and important updates.',
    },
    {
      icon: 'shield-checkmark',
      title: 'Safety First',
      description: 'Advanced safety features including SOS alerts and emergency contacts.',
    },
    {
      icon: 'calendar',
      title: 'Smart Schedule',
      description: 'Intelligent scheduling with real-time updates and optimization.',
    },
    {
      icon: 'people',
      title: 'Parent Access',
      description: 'Parents can track their children\'s bus journey in real-time.',
    },
  ];

  const stats = [
    { number: '50+', label: 'Active Buses' },
    { number: '1000+', label: 'Daily Riders' },
    { number: '99%', label: 'On Time' },
    { number: '24/7', label: 'Support' },
  ];

  const keyFeatures = [
    'Live tracking of all college buses',
    'Accurate estimated time of arrival (ETA) calculations',
    'Instant notifications for delays or route changes',
    'Safe and reliable transport updates',
    'Mobile-friendly interface for on-the-go access',
    'Historical data for route optimization',
  ];

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" backgroundColor="#fd3d01" />
      
      {/* Enhanced Header */}
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
            <Ionicons name="bus" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.logo}>SmartBus</Text>
        </View>
        
        <View style={styles.navLinks}>
          <Link href="/about" asChild>
            <TouchableOpacity style={styles.navLink}>
              <Ionicons name="information-circle" size={18} color="#FFFFFF" />
              <Text style={styles.navLinkText}>About</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/contact" asChild>
            <TouchableOpacity style={styles.navLink}>
              <Ionicons name="mail" size={18} color="#FFFFFF" />
              <Text style={styles.navLinkText}>Contact</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/notifications" asChild>
            <TouchableOpacity style={styles.navLink}>
              <Ionicons name="notifications" size={18} color="#FFFFFF" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>

      {/* Enhanced Hero Section */}
      <View style={styles.hero}>
        <LinearGradient
          colors={['rgba(253, 61, 1, 0.9)', 'rgba(255, 140, 66, 0.8)']}
          style={styles.heroBackground}
        >
          {/* Floating Elements */}
          <Animated.View 
            style={[
              styles.floatingElement,
              styles.floatingElement1,
              { transform: [{ translateY: floatingTranslate }] }
            ]}
          />
          <Animated.View 
            style={[
              styles.floatingElement,
              styles.floatingElement2,
              { transform: [{ translateY: floatingTranslate }] }
            ]}
          />
          <Animated.View 
            style={[
              styles.floatingElement,
              styles.floatingElement3,
              { transform: [{ translateY: floatingTranslate }] }
            ]}
          />

          <View style={[styles.heroContent, isSmallScreen && styles.heroContentSmall]}>
            <View style={styles.heroText}>
              <Animated.Text 
                style={[
                  styles.heroTitle, 
                  isSmallScreen && styles.heroTitleSmall,
                  { opacity: fadeAnim }
                ]}
              >
                SMART BUS{' '}
                <Text style={styles.heroTitleAccent}>TRACKING</Text>{' '}
                SYSTEM
              </Animated.Text>
              
              <Animated.Text 
                style={[
                  styles.heroSubtitle, 
                  isSmallScreen && styles.heroSubtitleSmall,
                  { opacity: fadeAnim }
                ]}
              >
                Revolutionizing campus transportation with real-time tracking, 
                intelligent scheduling, and enhanced safety features for the modern educational environment.
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
                    <LinearGradient
                      colors={['#fd3d01', '#ff6b35', '#ff8c00']}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Ionicons name="navigate" size={20} color="#FFFFFF" />
                      <Text style={styles.primaryButtonText}>Explore Live Routes</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Link>
              </Animated.View>

              {/* Stats Section */}
              <Animated.View 
                style={[
                  styles.heroStats,
                  { opacity: fadeAnim }
                ]}
              >
                {stats.map((stat, index) => (
                  <View key={index} style={styles.statItem}>
                    <Text style={styles.statNumber}>{stat.number}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </Animated.View>
            </View>
          </View>

          {/* Scroll Indicator */}
          <Animated.View 
            style={[
              styles.scrollIndicator,
              { transform: [{ translateY: floatingTranslate }] }
            ]}
          >
            <View style={styles.mouse}>
              <View style={styles.wheel} />
            </View>
          </Animated.View>
        </LinearGradient>
      </View>

      {/* Banner Section */}
      <LinearGradient
        colors={['#fd3d01', '#FF8C42']}
        style={styles.banner}
      >
        <Text style={[styles.bannerTitle, isSmallScreen && styles.bannerTitleSmall]}>
          College Bus Tracking System
        </Text>
        <Text style={[styles.bannerSubtitle, isSmallScreen && styles.bannerSubtitleSmall]}>
          Track your bus in real-time for a safer, more convenient commute. Stay updated with live tracking and notifications.
        </Text>
      </LinearGradient>

      {/* Features Grid */}
      <View style={styles.featuresSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isSmallScreen && styles.sectionTitleSmall]}>
            Why Choose SmartBus?
          </Text>
          <Text style={[styles.sectionSubtitle, isSmallScreen && styles.sectionSubtitleSmall]}>
            Discover features designed to make your commute safer and smarter
          </Text>
        </View>
        
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Animated.View 
              key={index}
              style={[
                styles.featureCard,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 20 * (index % 2)]
                    })}
                  ]
                }
              ]}
            >
              <LinearGradient
                colors={['#fd3d01', '#FF8C42']}
                style={styles.featureIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name={feature.icon} size={28} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text style={styles.contentTitle}>How It Works</Text>
        <Text style={styles.contentText}>
          The College Bus Tracking System uses advanced GPS technology to provide real-time updates on bus locations. 
          Students and staff can check their bus's current position, estimated arrival time, and route details through our user-friendly platform.
        </Text>

        <Text style={styles.contentTitle}>Key Features</Text>
        <View style={styles.featureList}>
          {keyFeatures.map((feature, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={20} color="#fd3d01" />
              <Text style={styles.listText}>{feature}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.contentTitle}>Why Use This System?</Text>
        <Text style={styles.contentText}>
          With our advanced bus tracking system, students and faculty can plan their journeys better, 
          avoid long waits, and ensure a smoother commute experience. The system helps reduce uncertainty 
          and provides peace of mind for both students and parents.
        </Text>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={[styles.ctaTitle, isSmallScreen && styles.ctaTitleSmall]}>
          Ready to Transform Your Commute?
        </Text>
        <Text style={[styles.ctaSubtitle, isSmallScreen && styles.ctaSubtitleSmall]}>
          Join thousands of satisfied users and experience smarter bus travel today
        </Text>
        <View style={[styles.ctaButtons, isSmallScreen && styles.ctaButtonsSmall]}>
          <Link href="/(tabs)" asChild>
            <TouchableOpacity style={styles.ctaPrimary}>
              <LinearGradient
                colors={['#fd3d01', '#FF8C42']}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.ctaPrimaryText}>Start Free Trial</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Link>
          <Link href="/contact" asChild>
            <TouchableOpacity style={styles.ctaSecondary}>
              <Text style={styles.ctaSecondaryText}>Contact Sales</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Footer */}
      <LinearGradient
        colors={['#343a40', '#212529']}
        style={styles.footer}
      >
        <View style={styles.footerContent}>
          <View style={styles.footerSection}>
            <View style={styles.footerLogoContainer}>
              <Ionicons name="bus" size={24} color="#fd3d01" />
              <Text style={styles.footerLogo}>SmartBus</Text>
            </View>
            <Text style={styles.footerTagline}>
              Providing safe and reliable transportation services for students and staff since 2010.
            </Text>
            <View style={styles.socialContainer}>
              {['logo-facebook', 'logo-twitter', 'logo-instagram', 'logo-linkedin'].map((icon, index) => (
                <TouchableOpacity key={index} style={styles.socialIcon}>
                  <Ionicons name={icon} size={18} color="#FFFFFF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.footerLinks}>
            <Text style={styles.footerHeading}>Quick Links</Text>
            <Link href="/home" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Home</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/schedule" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Bus Schedule</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/notifications" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Notifications</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/emergency" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Emergency Alert</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          <View style={styles.footerLinks}>
            <Text style={styles.footerHeading}>Contact Us</Text>
            <View style={styles.contactItem}>
              <Ionicons name="mail" size={14} color="#fd3d01" />
              <Text style={styles.contactText}>transport@ssm.edu.in</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call" size={14} color="#fd3d01" />
              <Text style={styles.contactText}>123-456-7890</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="location" size={14} color="#fd3d01" />
              <Text style={styles.contactText}>SSM College Campus</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footerBottom}>
          <Text style={styles.copyright}>
            © 2024 SSM College Transport Facility. All Rights Reserved.
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fd3d01',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  navLinkText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  hero: {
    minHeight: screenHeight * 0.9,
  },
  heroBackground: {
    flex: 1,
    paddingTop: 100,
    paddingBottom: 80,
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContentSmall: {
    paddingHorizontal: 20,
  },
  heroText: {
    maxWidth: 800,
    width: '100%',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 56,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  heroTitleSmall: {
    fontSize: 36,
    lineHeight: 42,
  },
  heroTitleAccent: {
    backgroundGradient: 'linear-gradient(45deg, #FFD700, #FFA500)',
    color: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
    maxWidth: 600,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heroSubtitleSmall: {
    fontSize: 16,
    lineHeight: 22,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 60,
  },
  heroButtonsSmall: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    gap: 12,
    elevation: 8,
    shadowColor: '#fd3d01',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  primaryButton: {
    borderRadius: 50,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    gap: 12,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 600,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  floatingElement: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
  },
  floatingElement1: {
    width: 80,
    height: 80,
    top: '20%',
    left: '10%',
  },
  floatingElement2: {
    width: 120,
    height: 120,
    top: '60%',
    right: '10%',
  },
  floatingElement3: {
    width: 60,
    height: 60,
    bottom: '20%',
    left: '20%',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    marginLeft: -12,
  },
  mouse: {
    width: 24,
    height: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
  },
  wheel: {
    width: 3,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 2,
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -1.5,
  },
  banner: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bannerTitleSmall: {
    fontSize: 24,
  },
  bannerSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 800,
  },
  bannerSubtitleSmall: {
    fontSize: 16,
  },
  featuresSection: {
    paddingVertical: 80,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 60,
  },
  sectionTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#343a40',
    marginBottom: 16,
  },
  sectionTitleSmall: {
    fontSize: 32,
  },
  sectionSubtitle: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 600,
  },
  sectionSubtitleSmall: {
    fontSize: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 24,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderTopWidth: 4,
    borderTopColor: '#fd3d01',
  },
  featureIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 12,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  contentSection: {
    padding: 40,
    backgroundColor: '#ffffff',
    margin: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  contentTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fd3d01',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 30,
  },
  featureList: {
    marginBottom: 40,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingLeft: 8,
  },
  listText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  ctaSection: {
    paddingVertical: 80,
    paddingHorizontal: 24,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#343a40',
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaTitleSmall: {
    fontSize: 28,
  },
  ctaSubtitle: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 50,
    maxWidth: 600,
  },
  ctaSubtitleSmall: {
    fontSize: 16,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  ctaButtonsSmall: {
    flexDirection: 'column',
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    gap: 12,
  },
  ctaPrimary: {
    borderRadius: 50,
    elevation: 6,
    shadowColor: '#fd3d01',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  ctaPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ctaSecondary: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fd3d01',
  },
  ctaSecondaryText: {
    color: '#fd3d01',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  footerContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  footerSection: {
    width: '100%',
    marginBottom: 40,
  },
  footerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  footerLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  footerTagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 400,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  socialIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLinks: {
    width: '48%',
    marginBottom: 30,
  },
  footerHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fd3d01',
    marginBottom: 20,
  },
  footerLink: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  contactText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 24,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});