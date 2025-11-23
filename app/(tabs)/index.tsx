// app/(tabs)/index.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const features = [
    {
      icon: '🚌',
      title: 'Live Bus Tracking',
      description: 'Real-time location tracking of all buses',
      color: '#4285F4'
    },
    {
      icon: '📅',
      title: 'Smart Scheduling',
      description: 'Optimized bus schedules and routes',
      color: '#34A853'
    },
    {
      icon: '📱',
      title: 'QR Code Access',
      description: 'Quick boarding with QR code scanning',
      color: '#FBBC05'
    },
    {
      icon: '👶',
      title: 'Child Safety Mode',
      description: 'Track your child\'s bus journey safely',
      color: '#EA4335'
    },
    {
      icon: '🗺️',
      title: 'Offline Maps',
      description: 'Access maps without internet connection',
      color: '#9C27B0'
    },
    {
      icon: '🚨',
      title: 'SOS Emergency',
      description: 'Instant emergency alerts and assistance',
      color: '#FF6D00'
    },
  ];

  const stats = [
    { number: '50+', label: 'Active Buses' },
    { number: '1000+', label: 'Daily Riders' },
    { number: '99%', label: 'On Time Rate' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a73e8" />
      
      {/* Hero Section */}
      <LinearGradient
        colors={['#1a73e8', '#4285f4', '#5c9bf2']}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            SmartBus
          </Text>
          <Text style={styles.heroSubtitle}>
            Smarter Travel, Safer Journey
          </Text>
          <Text style={styles.heroDescription}>
            Experience the future of public transportation with real-time tracking, 
            smart scheduling, and enhanced safety features for everyone.
          </Text>
          
          <View style={styles.heroButtons}>
            <Link href="/login" asChild>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.heroImageContainer}>
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.heroImage}
            contentFit="contain"
          />
        </View>
      </LinearGradient>

      {/* Stats Section */}
      <ThemedView style={styles.statsSection}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </ThemedView>

      {/* Features Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Why Choose SmartBus?
        </ThemedText>
        <ThemedText style={styles.sectionSubtitle}>
          Discover the features that make your journey better
        </ThemedText>
        
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.featureCard}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[feature.color, `${feature.color}DD`]}
                style={styles.featureIconContainer}
              >
                <Text style={styles.featureIcon}>{feature.icon}</Text>
              </LinearGradient>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      {/* How It Works Section */}
      <ThemedView style={styles.sectionDark}>
        <LinearGradient
          colors={['#2c3e50', '#34495e']}
          style={styles.howItWorksSection}
        >
          <ThemedText type="title" style={styles.sectionTitleLight}>
            How It Works
          </ThemedText>
          
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Download & Register</Text>
                <Text style={styles.stepDescription}>
                  Get the app and create your account with mobile verification
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Track Your Bus</Text>
                <Text style={styles.stepDescription}>
                  View real-time bus locations and arrival times
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Enjoy Safe Travel</Text>
                <Text style={styles.stepDescription}>
                  Use QR codes, SOS alerts, and child tracking features
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ThemedView>

      {/* Download Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Download Our App
        </ThemedText>
        <ThemedText style={styles.sectionSubtitle}>
          Available on both iOS and Android platforms
        </ThemedText>
        
        <View style={styles.downloadButtons}>
          <TouchableOpacity style={styles.downloadButton}>
            <Ionicons name="logo-apple" size={24} color="#000" />
            <View style={styles.downloadButtonText}>
              <Text style={styles.downloadButtonSubtitle}>Download on the</Text>
              <Text style={styles.downloadButtonTitle}>App Store</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.downloadButton}>
            <Ionicons name="logo-google-play" size={24} color="#000" />
            <View style={styles.downloadButtonText}>
              <Text style={styles.downloadButtonSubtitle}>Get it on</Text>
              <Text style={styles.downloadButtonTitle}>Google Play</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Footer */}
      <LinearGradient
        colors={['#1a73e8', '#1565c0']}
        style={styles.footer}
      >
        <Text style={styles.footerTitle}>SmartBus</Text>
        <Text style={styles.footerSubtitle}>
          Transforming public transportation for a smarter future
        </Text>
        
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.copyright}>
          © 2024 SmartBus. All rights reserved.
        </Text>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  heroSection: {
    minHeight: height * 0.9,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  heroDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  heroButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34A853',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  heroImageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  heroImage: {
    width: width * 0.8,
    height: 200,
    opacity: 0.9,
  },
  statsSection: {
    paddingVertical: 40,
    backgroundColor: '#f8f9fa',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    marginVertical: 10,
    minWidth: 120,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  sectionDark: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 32,
    fontWeight: 'bold',
  },
  sectionTitleLight: {
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sectionSubtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  featureCard: {
    width: (width - 60) / 2,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 32,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  howItWorksSection: {
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  stepsContainer: {
    marginTop: 40,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  stepNumber: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  downloadButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 30,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  downloadButtonText: {
    alignItems: 'flex-start',
  },
  downloadButtonSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  downloadButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  footer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  footerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  footerLink: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  copyright: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
});