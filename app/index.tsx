// app/index.tsx - MODERN REDESIGNED LANDING PAGE
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
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LandingPage() {
  const { width } = useWindowDimensions();
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

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
      {/* Modern Navigation Bar */}
      <Animated.View 
        style={[
          styles.navbar,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="bus" size={24} color="#FFFFFF" />
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

      {/* Modern Hero Section */}
      <View style={styles.hero}>
        <LinearGradient
          colors={['#111827', '#1F2937', '#374151']}
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
                Revolutionizing{' '}
                <Text style={styles.heroTitleGradient}>Urban Mobility</Text>
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
                      colors={['#6366F1', '#8B5CF6']}
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
            </View>
            
            <Animated.View 
              style={[
                styles.heroVisual,
                { opacity: fadeAnim }
              ]}
            >
              <View style={styles.floatingCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="location" size={20} color="#6366F1" />
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
        </LinearGradient>
      </View>

      {/* Modern Features Grid */}
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

      {/* Stats Section with Modern Design */}
      <View style={styles.statsSection}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="bus" size={32} color="#6366F1" />
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

      {/* Quick Actions Section */}
      <View style={styles.quickActionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isSmallScreen && styles.sectionTitleSmall]}>
            Quick Actions
          </Text>
          <Text style={[styles.sectionSubtitle, isSmallScreen && styles.sectionSubtitleSmall]}>
            Access essential features instantly
          </Text>
        </View>
        
        <View style={styles.quickActionsGrid}>
          <Link href="/notifications" asChild>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="notifications" size={28} color="#D97706" />
              </View>
              <Text style={styles.actionTitle}>Notifications</Text>
              <Text style={styles.actionDescription}>Alerts & updates</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/tracking" asChild>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="location" size={28} color="#1D4ED8" />
              </View>
              <Text style={styles.actionTitle}>Live Map</Text>
              <Text style={styles.actionDescription}>Real-time tracking</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/schedule" asChild>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="calendar" size={28} color="#166534" />
              </View>
              <Text style={styles.actionTitle}>Schedule</Text>
              <Text style={styles.actionDescription}>Bus timings</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/sos" asChild>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="warning" size={28} color="#DC2626" />
              </View>
              <Text style={styles.actionTitle}>SOS Alert</Text>
              <Text style={styles.actionDescription}>Emergency help</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Modern CTA Section */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
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

      {/* Modern Footer */}
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
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#111827',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
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
    backgroundColor: '#6366F1',
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
    fontSize: 14,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
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
    marginTop: 72,
  },
  heroBackground: {
    paddingTop: 80,
    paddingBottom: 120,
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
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
    lineHeight: 64,
  },
  heroTitleSmall: {
    fontSize: 40,
    lineHeight: 48,
    textAlign: 'center',
  },
  heroTitleGradient: {
    backgroundImage: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    backgroundColor: '#6366F1',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#D1D5DB',
    lineHeight: 28,
    marginBottom: 40,
  },
  heroSubtitleSmall: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
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
    borderRadius: 16,
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4B5563',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    position: 'relative',
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
  quickActionsSection: {
    paddingVertical: 80,
    paddingHorizontal: 24,
    backgroundColor: '#F9FAFB',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
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
    color: '#6366F1',
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