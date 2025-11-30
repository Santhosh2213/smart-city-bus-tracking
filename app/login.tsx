// app/login.tsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../src/context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      // Navigation is handled in the AuthContext
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#291C0E" />
      
      {/* Header */}
      <LinearGradient
        colors={['#291C0E', '#3A2A1A']}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="bus" size={28} color="#E1D4C2" />
          </View>
          <Text style={styles.logo}>SmartBus</Text>
        </View>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue your journey</Text>
      </LinearGradient>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Ionicons name="mail-outline" size={20} color="#6E473B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#6E473B"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Ionicons name="lock-closed-outline" size={20} color="#6E473B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#6E473B"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#6E473B', '#8B5A4A']}
            style={styles.loginButtonGradient}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text style={styles.signupLink}>Sign Up</Text>
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
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 60,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 12,
  },
  logoIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(110, 71, 59, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.2)',
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E1D4C2',
    letterSpacing: -0.5,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E1D4C2',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#BEB5A9',
    textAlign: 'center',
  },
  formContainer: {
    padding: 24,
    marginTop: -20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flex: 1,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 141, 120, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F8F5F0',
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#291C0E',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#6E473B',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  loginButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#E1D4C2',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    color: '#6E473B',
    fontSize: 14,
  },
  signupLink: {
    color: '#6E473B',
    fontSize: 14,
    fontWeight: '600',
  },
});