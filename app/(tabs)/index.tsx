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
      icon: 'location',
      title: 'Live Tracking',
      description: 'Real-time bus locations and arrival predictions',
      color: ['#6366F1', '#8B5CF6'],
      route: '/tracking'
    },
    {
      icon: 'qr-code',
      title: 'QR Boarding',
      description: 'Quick and contactless boarding with QR codes',
      color: ['#10B981', '#059669'],
      route: '/qr-scan'
    },
    {
      icon: 'heart',
      title: 'Child Safety',
      description: 'Track your child\'s bus journey in real-time',
      color: ['#F59E0B', '#D97706'],
      route: '/child-mode'
    },
    {
      icon: 'warning',
      title: 'SOS Alert',
      description: 'Instant emergency alerts with location sharing',
      color: ['#EF4444', '#DC2626'],
      route: '/sos'
    },
    {
      icon: 'calendar',
      title: 'Smart Schedule',
      description: 'Optimized routes and intelligent scheduling',
      color: ['#8B5CF6', '#7C3AED'],
      route: '/schedule'
    },
    {
      icon: 'cloud-offline',
      title: 'Offline Maps',
      description: 'Access maps without internet connection',
      color: ['#06B6D4', '#0891B2'],
      route: '/tracking'
    },
  ];

  const stats = [
    { number: '150+', label: 'Smart Buses' },
    { number: '25K+', label: 'Happy Riders' },
    { number: '99.2%', label: 'On Time Rate' },
    { number: '100%', label: 'Safe Travel' },
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
              <Text style={styles.navLinkText}>About</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/contact" asChild>
            <TouchableOpacity style={styles.navLink}>
              <Text style={styles.navLinkText}>Contact</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/(tabs)" asChild>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navButtonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
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
                Revolutionizing{' '}
                <Text style={styles.heroTitleAccent}>Urban Mobility</Text>
              </Animated.Text>
              
              <Animated.Text 
                style={[
                  styles.heroSubtitle, 
                  isSmallScreen && styles.heroSubtitleSmall,
                  { opacity: fadeAnim }
                ]}
              >
                Experience seamless bus travel with AI-powered tracking, 
                smart scheduling, and advanced safety features for modern cities.
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
                      <Ionicons name="play" size={20} color="#FFFFFF" />
                      <Text style={styles.primaryButtonText}>Start Journey</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Link>
                
                <Link href="/about" asChild>
                  <TouchableOpacity style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Learn More</Text>
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
            
            <Animated.View 
              style={[
                styles.heroVisual,
                { opacity: fadeAnim }
              ]}
            >
              <View style={styles.floatingCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="location" size={20} color="#fd3d01" />
                  <Text style={styles.cardTitle}>Live Tracking</Text>
                </View>
                <View style={styles.busInfo}>
                  <View style={styles.busRoute}>
                    <View style={styles.routeDot} />
                    <View style={styles.routeLine} />
                    <View style={[styles.routeDot, styles.routeDotActive]} />
                  </View>
                  <View style={styles.busDetails}>
                    <Text style={styles.busNumber}>Bus #B42</Text>
                    <Text style={styles.busEta}>Arriving in 8 min</Text>
                  </View>
                </View>
              </View>
              
              <View style={[styles.floatingCard, styles.floatingCard2]}>
                <View style={styles.cardHeader}>
                  <Ionicons name="notifications" size={20} color="#10B981" />
                  <Text style={styles.cardTitle}>Smart Alerts</Text>
                </View>
                <Text style={styles.cardText}>Real-time updates & notifications</Text>
              </View>
            </Animated.View>
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
            Smart Features
          </Text>
          <Text style={[styles.sectionSubtitle, isSmallScreen && styles.sectionSubtitleSmall]}>
            Powered by advanced technology for better commuting
          </Text>
        </View>
        
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Link key={index} href={feature.route} asChild>
              <TouchableOpacity style={styles.featureCard}>
                <LinearGradient
                  colors={feature.color}
                  style={styles.featureIconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={feature.icon} size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
                <View style={styles.featureArrow}>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            </Link>
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
          {[
            'Live tracking of all college buses',
            'Accurate estimated time of arrival (ETA) calculations',
            'Instant notifications for delays or route changes',
            'Safe and reliable transport updates',
            'Mobile-friendly interface for on-the-go access',
            'Historical data for route optimization'
          ].map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={20} color="#fd3d01" />
              <Text style={styles.listText}>{item}</Text>
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

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="bus" size={32} color="#fd3d01" />
            <Text style={styles.statNumber}>150+</Text>
            <Text style={styles.statLabel}>Smart Buses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="people" size={32} color="#10B981" />
            <Text style={styles.statNumber}>25K+</Text>
            <Text style={styles.statLabel}>Happy Riders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="time" size={32} color="#F59E0B" />
            <Text style={styles.statNumber}>99.2%</Text>
            <Text style={styles.statLabel}>On Time Rate</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="shield-checkmark" size={32} color="#EF4444" />
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Safe Travel</Text>
          </View>
        </View>
      </View>

      {/* CTA Section */}
      <LinearGradient
        colors={['#fd3d01', '#FF8C42']}
        style={styles.ctaSection}
      >
        <View style={styles.ctaContent}>
          <Text style={[styles.ctaTitle, isSmallScreen && styles.ctaTitleSmall]}>
            Ready to Transform Your Daily Commute?
          </Text>
          <Text style={[styles.ctaSubtitle, isSmallScreen && styles.ctaSubtitleSmall]}>
            Join thousands of smart commuters and experience the future of urban transportation today.
          </Text>
          <View style={[styles.ctaButtons, isSmallScreen && styles.ctaButtonsSmall]}>
            <Link href="/(tabs)" asChild>
              <TouchableOpacity style={styles.ctaPrimary}>
                <Text style={styles.ctaPrimaryText}>Start Free Trial</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </Link>
            <Link href="/contact" asChild>
              <TouchableOpacity style={styles.ctaSecondary}>
                <Text style={styles.ctaSecondaryText}>Contact Team</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </LinearGradient>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerMain}>
            <View style={styles.footerBrand}>
              <View style={styles.logoContainer}>
                <View style={styles.logoIcon}>
                  <Ionicons name="bus" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.footerLogo}>SmartBus</Text>
              </View>
              <Text style={styles.footerTagline}>
                Redefining urban mobility through innovation and technology.
              </Text>
              <View style={styles.socialContainer}>
                {['logo-twitter', 'logo-facebook', 'logo-linkedin', 'logo-instagram'].map((icon, index) => (
                  <TouchableOpacity key={index} style={styles.socialIcon}>
                    <Ionicons name={icon} size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.footerLinks}>
              <View style={styles.footerColumn}>
                <Text style={styles.footerHeading}>Product</Text>
                {['Features', 'Live Tracking', 'Safety', 'Schedule'].map((item) => (
                  <TouchableOpacity key={item}>
                    <Text style={styles.footerLink}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.footerColumn}>
                <Text style={styles.footerHeading}>Company</Text>
                {['About', 'Careers', 'Blog', 'Press'].map((item) => (
                  <TouchableOpacity key={item}>
                    <Text style={styles.footerLink}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.footerColumn}>
                <Text style={styles.footerHeading}>Support</Text>
                {['Help Center', 'Contact', 'Privacy', 'Terms'].map((item) => (
                  <TouchableOpacity key={item}>
                    <Text style={styles.footerLink}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.footerBottom}>
          <Text style={styles.copyright}>
            © 2024 SmartBus Technologies. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    paddingVertical: 8,
  },
  navLinkText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
    flexDirection: 'row',
    paddingHorizontal: 24,
    alignItems: 'center',
    minHeight: 600,
  },
  heroContentSmall: {
    flexDirection: 'column',
  },
  heroText: {
    flex: 1,
    paddingRight: 40,
  },
  heroTitle: {
    fontSize: 56,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 24,
    lineHeight: 64,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  heroTitleSmall: {
    fontSize: 40,
    lineHeight: 48,
    textAlign: 'center',
  },
  heroTitleAccent: {
    color: '#FFD700',
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 28,
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heroSubtitleSmall: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
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
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  heroVisual: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  floatingCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    width: 280,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  floatingCard2: {
    position: 'absolute',
    bottom: -40,
    right: 20,
    width: 240,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  busInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  busRoute: {
    alignItems: 'center',
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D1D5DB',
  },
  routeDotActive: {
    backgroundColor: '#10B981',
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  busDetails: {
    flex: 1,
  },
  busNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  busEta: {
    fontSize: 12,
    color: '#6B7280',
  },
  cardText: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: '#F9FAFB',
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 60,
  },
  sectionTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 16,
  },
  sectionTitleSmall: {
    fontSize: 32,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 500,
  },
  sectionSubtitleSmall: {
    fontSize: 14,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 24,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  featureArrow: {
    position: 'absolute',
    top: 24,
    right: 24,
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
  statsSection: {
    paddingVertical: 80,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 40,
    borderRadius: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  ctaSection: {
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  ctaContent: {
    alignItems: 'center',
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  ctaTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaTitleSmall: {
    fontSize: 28,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
  },
  ctaPrimaryText: {
    color: '#fd3d01',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaSecondary: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  ctaSecondaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#111827',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  footerContent: {
    marginBottom: 40,
  },
  footerMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  footerBrand: {
    flex: 1,
    marginBottom: 40,
    minWidth: 300,
  },
  footerLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  footerTagline: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginTop: 12,
    marginBottom: 24,
    maxWidth: 300,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    flex: 2,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  footerColumn: {
    marginBottom: 20,
    minWidth: 120,
  },
  footerHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  footerLink: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 24,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 12,
    color: '#6B7280',
  },
});