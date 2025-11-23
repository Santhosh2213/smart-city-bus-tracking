// app/contact.tsx - FIXED VERSION
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

export default function ContactScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isSmallScreen = width < 375;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    // Handle form submission here
    Alert.alert('Success', 'Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email',
      value: 'support@smartbus.com',
      description: 'Send us an email anytime'
    },
    {
      icon: '📞',
      title: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Call us during business hours'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      value: 'Available 24/7',
      description: 'Get instant help from our team'
    },
    {
      icon: '🏢',
      title: 'Office',
      value: '123 Bus Lane, City',
      description: 'Visit our headquarters'
    },
  ];

  const contactCardWidth = (screenWidth - 60) / 2;

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
          <Text style={[styles.heroTitle, isSmallScreen && styles.heroTitleSmall]}>
            Contact Us
          </Text>
          <Text style={[styles.heroSubtitle, isSmallScreen && styles.heroSubtitleSmall]}>
            We're here to help you
          </Text>
        </View>
      </LinearGradient>

      {/* Contact Methods */}
      <ThemedView style={styles.section}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Get In Touch
        </ThemedText>
        <ThemedText style={styles.sectionSubtitle}>
          Choose your preferred way to reach us
        </ThemedText>
        
        <View style={styles.contactGrid}>
          {contactMethods.map((method, index) => (
            <View key={index} style={[styles.contactCard, { width: contactCardWidth }]}>
              <Text style={styles.contactIcon}>{method.icon}</Text>
              <Text style={styles.contactTitle}>{method.title}</Text>
              <Text style={styles.contactValue}>{method.value}</Text>
              <Text style={styles.contactDescription}>{method.description}</Text>
            </View>
          ))}
        </View>
      </ThemedView>

      {/* Contact Form */}
      <ThemedView style={styles.sectionDark}>
        <LinearGradient
          colors={['#2c3e50', '#34495e']}
          style={styles.formSection}
        >
          <ThemedText type="title" style={styles.sectionTitleLight}>
            Send us a Message
          </ThemedText>
          
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.input}
                value={formData.subject}
                onChangeText={(text) => setFormData({...formData, subject: text})}
                placeholder="Enter subject"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Message *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.message}
                onChangeText={(text) => setFormData({...formData, message: text})}
                placeholder="Enter your message"
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Send Message</Text>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ThemedView>

      {/* FAQ Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Frequently Asked Questions
        </ThemedText>
        
        <View style={styles.faqList}>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I track my bus in real-time?</Text>
            <Text style={styles.faqAnswer}>
              Simply go to the Live Tracking section in the app to see all active buses 
              and their current locations on the map.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What should I do in case of emergency?</Text>
            <Text style={styles.faqAnswer}>
              Use the SOS button in the app to immediately alert authorities and 
              our support team with your location.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How does the QR code system work?</Text>
            <Text style={styles.faqAnswer}>
              Generate a QR code in the app that bus drivers can scan for quick 
              and contactless boarding verification.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Is the app available offline?</Text>
            <Text style={styles.faqAnswer}>
              Yes! You can download offline maps and access key features even without 
              an internet connection.
            </Text>
          </View>
        </View>
      </ThemedView>

      {/* CTA Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Need Immediate Help?
        </ThemedText>
        <ThemedText style={styles.sectionSubtitle}>
          Our support team is available 24/7 to assist you
        </ThemedText>
        
        <View style={styles.ctaButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Call Support</Text>
          </TouchableOpacity>
          
          <Link href="/" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroTitleSmall: {
    fontSize: 28,
  },
  heroSubtitle: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
  heroSubtitleSmall: {
    fontSize: 18,
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
    marginBottom: 20,
    fontSize: 32,
    fontWeight: 'bold',
  },
  sectionTitleLight: {
    textAlign: 'center',
    marginBottom: 20,
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
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  contactCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    marginBottom: 20,
  },
  contactIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  contactValue: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  contactDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  formSection: {
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  form: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34A853',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  faqList: {
    gap: 20,
  },
  faqItem: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
  },
  faqQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  ctaButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 30,
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
    borderColor: '#1a73e8',
  },
  secondaryButtonText: {
    color: '#1a73e8',
    fontSize: 18,
    fontWeight: '600',
  },
});