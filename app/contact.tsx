// app/contact.tsx - UPDATED WITH INDEX COLOR SCHEME
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
      <StatusBar barStyle="light-content" backgroundColor="#291C0E" />
      
      {/* Hero Section */}
      <LinearGradient
        colors={['#291C0E', '#6E473B', '#8B5A4A']}
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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Get In Touch
        </Text>
        <Text style={styles.sectionSubtitle}>
          Choose your preferred way to reach us
        </Text>
        
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
      </View>

      {/* Contact Form */}
      <View style={styles.sectionDark}>
        <LinearGradient
          colors={['#291C0E', '#6E473B']}
          style={styles.formSection}
        >
          <Text style={styles.sectionTitleLight}>
            Send us a Message
          </Text>
          
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                placeholder="Enter your full name"
                placeholderTextColor="#BEB5A9"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                placeholder="Enter your email"
                placeholderTextColor="#BEB5A9"
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
                placeholderTextColor="#BEB5A9"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Message *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.message}
                onChangeText={(text) => setFormData({...formData, message: text})}
                placeholder="Enter your message"
                placeholderTextColor="#BEB5A9"
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
              <Ionicons name="send" size={20} color="#291C0E" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Frequently Asked Questions
        </Text>
        
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
      </View>

      {/* CTA Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Need Immediate Help?
        </Text>
        <Text style={styles.sectionSubtitle}>
          Our support team is available 24/7 to assist you
        </Text>
        
        <View style={styles.ctaButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Ionicons name="call" size={20} color="#291C0E" />
            <Text style={styles.primaryButtonText}>Call Support</Text>
          </TouchableOpacity>
          
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
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  contactCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F5F0',
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
    color: '#291C0E',
    marginBottom: 8,
    textAlign: 'center',
  },
  contactValue: {
    fontSize: 14,
    color: '#6E473B',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  contactDescription: {
    fontSize: 12,
    color: '#6E473B',
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
    color: '#E1D4C2',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(225, 212, 194, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(225, 212, 194, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#E1D4C2',
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
    backgroundColor: '#E1D4C2',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#291C0E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  faqList: {
    gap: 20,
  },
  faqItem: {
    backgroundColor: '#F8F5F0',
    padding: 20,
    borderRadius: 12,
  },
  faqQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#291C0E',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6E473B',
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
    backgroundColor: '#E1D4C2',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#291C0E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#6E473B',
  },
  secondaryButtonText: {
    color: '#6E473B',
    fontSize: 18,
    fontWeight: '600',
  },
});