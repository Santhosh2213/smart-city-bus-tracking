// app/about.tsx - UPDATED WITH INDEX COLOR SCHEME
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;

  const teamMembers = [
    {
      name: 'John Doe',
      role: 'CEO & Founder',
      description: 'Visionary leader with 10+ years in transportation tech'
    },
    {
      name: 'Jane Smith',
      role: 'CTO',
      description: 'Tech expert specializing in real-time tracking systems'
    },
    {
      name: 'Mike Johnson',
      role: 'Head of Safety',
      description: 'Safety specialist with background in public transport'
    },
  ];

  const values = [
    {
      icon: '🏆',
      title: 'Excellence',
      description: 'We strive for the highest standards in everything we do'
    },
    {
      icon: '🤝',
      title: 'Trust',
      description: 'Building reliable systems that users can depend on'
    },
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'Continuously improving and adapting to new technologies'
    },
    {
      icon: '❤️',
      title: 'Care',
      description: 'Putting our users safety and comfort first'
    },
  ];

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" backgroundColor="#291C0E" />
      
      {/* Hero Section */}
      <LinearGradient
        colors={['#291C0E', '#6E473B', '#8B5A4A']}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text style={[styles.heroTitle, isSmallScreen && styles.heroTitleSmall]}>
            About SmartBus
          </Text>
          <Text style={[styles.heroSubtitle, isSmallScreen && styles.heroSubtitleSmall]}>
            Revolutionizing Public Transportation
          </Text>
        </View>
      </LinearGradient>

      {/* Mission Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.sectionText}>
          At SmartBus, we're committed to transforming public transportation through 
          innovative technology. Our mission is to make bus travel safer, more efficient, 
          and more accessible for everyone.
        </Text>
        <Text style={styles.sectionText}>
          Founded in 2024, we've grown from a simple idea to a comprehensive platform 
          serving thousands of daily riders across multiple cities.
        </Text>
      </View>

      {/* Values Section */}
      <View style={styles.sectionDark}>
        <LinearGradient
          colors={['#291C0E', '#6E473B']}
          style={styles.valuesSection}
        >
          <Text style={styles.sectionTitleLight}>Our Values</Text>
          <View style={styles.valuesGrid}>
            {values.map((value, index) => (
              <View key={index} style={styles.valueCard}>
                <Text style={styles.valueIcon}>{value.icon}</Text>
                <Text style={styles.valueTitle}>{value.title}</Text>
                <Text style={styles.valueDescription}>{value.description}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>

      {/* Team Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Team</Text>
        <Text style={styles.sectionSubtitle}>
          Meet the passionate people behind SmartBus
        </Text>
        
        <View style={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.teamCard}>
              <LinearGradient
                colors={['#6E473B', '#8B5A4A']}
                style={styles.teamImage}
              >
                <Text style={styles.teamInitial}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </LinearGradient>
              <Text style={styles.teamName}>{member.name}</Text>
              <Text style={styles.teamRole}>{member.role}</Text>
              <Text style={styles.teamDescription}>{member.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Active Buses</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1000+</Text>
            <Text style={styles.statLabel}>Daily Riders</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>99%</Text>
            <Text style={styles.statLabel}>On Time Rate</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Support</Text>
          </View>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Join Our Journey</Text>
        <Text style={styles.sectionSubtitle}>
          Be part of the transportation revolution
        </Text>
        
        <View style={styles.ctaButtons}>
          <Link href="/contact" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Get In Touch</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F0',
  },
  heroSection: {
    minHeight: 200,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#E1D4C2',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroTitleSmall: {
    fontSize: 28,
  },
  heroSubtitle: {
    fontSize: 20,
    color: '#E1D4C2',
    textAlign: 'center',
    fontWeight: '600',
  },
  heroSubtitleSmall: {
    fontSize: 18,
  },
  section: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  sectionDark: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#291C0E',
  },
  sectionTitleLight: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E1D4C2',
  },
  sectionSubtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6E473B',
    marginBottom: 40,
    lineHeight: 24,
  },
  sectionText: {
    fontSize: 16,
    color: '#6E473B',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  valuesSection: {
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  valueCard: {
    width: '48%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(225, 212, 194, 0.1)',
    borderRadius: 16,
    marginBottom: 16,
  },
  valueIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  valueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E1D4C2',
    marginBottom: 8,
    textAlign: 'center',
  },
  valueDescription: {
    fontSize: 12,
    color: 'rgba(225, 212, 194, 0.8)',
    textAlign: 'center',
    lineHeight: 16,
  },
  teamGrid: {
    gap: 20,
  },
  teamCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F5F0',
    borderRadius: 16,
    marginBottom: 20,
  },
  teamImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E1D4C2',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#291C0E',
    marginBottom: 4,
  },
  teamRole: {
    fontSize: 14,
    color: '#6E473B',
    fontWeight: '600',
    marginBottom: 8,
  },
  teamDescription: {
    fontSize: 12,
    color: '#6E473B',
    textAlign: 'center',
    lineHeight: 16,
  },
  statsSection: {
    paddingVertical: 40,
    backgroundColor: '#F8F5F0',
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
    color: '#6E473B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#291C0E',
    textAlign: 'center',
    fontWeight: '500',
  },
  ctaButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 30,
  },
  primaryButton: {
    backgroundColor: '#6E473B',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#E1D4C2',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6E473B',
  },
  secondaryButtonText: {
    color: '#6E473B',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});