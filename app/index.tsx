// app/index.tsx - ENHANCED LANDING PAGE
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LandingPage() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;

  const features = [
    {
      icon: '📍',
      title: 'Live Tracking',
      description: 'Real-time bus locations and arrival predictions',
      color: ['#4F46E5', '#7C73E6']
    },
    {
      icon: '📱',
      title: 'QR Boarding',
      description: 'Quick and contactless boarding with QR codes',
      color: ['#10B981', '#34D399']
    },
    {
      icon: '👶',
      title: 'Child Safety',
      description: 'Track your child\'s bus journey in real-time',
      color: ['#F59E0B', '#FBBF24']
    },
    {
      icon: '🚨',
      title: 'SOS Alert',
      description: 'Instant emergency alerts with location sharing',
      color: ['#EF4444', '#F87171']
    },
    {
      icon: '🗓️',
      title: 'Smart Schedule',
      description: 'Optimized routes and intelligent scheduling',
      color: ['#8B5CF6', '#A78BFA']
    },
    {
      icon: '📶',
      title: 'Offline Maps',
      description: 'Access maps without internet connection',
      color: ['#06B6D4', '#22D3EE']
    },
  ];

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1e40af" />
      
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <Text style={styles.logo}>SmartBus</Text>
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
              <Text style={styles.navButtonText}>Launch App</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

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
              Experience the future of public transportation with real-time tracking, 
              smart scheduling, and enhanced safety features for everyone.
            </Text>
            <View style={[styles.heroButtons, isSmallScreen && styles.heroButtonsSmall]}>
              <Link href="/(tabs)" asChild>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </Link>
              <Link href="/about" asChild>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Learn More</Text>
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
                  <Text style={styles.mockupText}>SmartBus App</Text>
                  <View style={styles.mockupFeature}>
                    <Ionicons name="bus" size={32} color="#fff" />
                    <Text style={styles.mockupFeatureText}>Live Tracking</Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </View>
        </View>
        
        {/* Wave Divider */}
        <View style={styles.waveDivider}>
          <View style={styles.wave} />
        </View>
      </LinearGradient>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={[styles.sectionTitle, isSmallScreen && styles.sectionTitleSmall]}>
          Why Choose SmartBus?
        </Text>
        <Text style={[styles.sectionSubtitle, isSmallScreen && styles.sectionSubtitleSmall]}>
          Discover features designed to make your commute safer and smarter
        </Text>
        
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <LinearGradient
                colors={feature.color}
                style={styles.featureIcon}
              >
                <Text style={styles.featureIconText}>{feature.icon}</Text>
              </LinearGradient>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <LinearGradient
        colors={['#4F46E5', '#7C73E6']}
        style={styles.statsSection}
      >
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Active Buses</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>1K+</Text>
            <Text style={styles.statLabel}>Daily Riders</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>99%</Text>
            <Text style={styles.statLabel}>On Time</Text>
          </View>
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
          <Link href="/(tabs)" asChild>
            <TouchableOpacity style={styles.ctaPrimary}>
              <Text style={styles.ctaPrimaryText}>Start Free Trial</Text>
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
        colors={['#1e293b', '#0f172a']}
        style={styles.footer}
      >
        <View style={styles.footerContent}>
          <View style={styles.footerSection}>
            <Text style={styles.footerLogo}>SmartBus</Text>
            <Text style={styles.footerTagline}>
              Transforming public transportation for a smarter future
            </Text>
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
          
          <View style={styles.footerLinks}>
            <Text style={styles.footerHeading}>Legal</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Terms</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Security</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footerBottom}>
          <Text style={styles.copyright}>
            © 2024 SmartBus. All rights reserved.
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  navLink: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  navLinkText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  navButton: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  hero: {
    paddingTop: 40,
    paddingBottom: 80,
  },
  heroContent: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroContentSmall: {
    flexDirection: 'column',
  },
  heroText: {
    flex: 1,
    paddingRight: 20,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    lineHeight: 48,
  },
  heroTitleSmall: {
    fontSize: 32,
    lineHeight: 36,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 26,
    marginBottom: 32,
  },
  heroSubtitleSmall: {
    fontSize: 16,
    lineHeight: 22,
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
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  heroVisual: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
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
  mockupText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  mockupFeature: {
    alignItems: 'center',
    gap: 8,
  },
  mockupFeatureText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 16,
  },
  sectionTitleSmall: {
    fontSize: 28,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  sectionSubtitleSmall: {
    fontSize: 14,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  featureCard: {
    width: '48%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    marginBottom: 16,
  },
  featureIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIconText: {
    fontSize: 28,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  statsSection: {
    paddingVertical: 50,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
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
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
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
});