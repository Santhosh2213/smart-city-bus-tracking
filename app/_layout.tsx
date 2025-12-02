// app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { TrackingProvider } from '../src/context/TrackingContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <TrackingProvider>
        <Stack>
          {/* Main screens */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          
          {/* Profile & Settings */}
          <Stack.Screen 
            name="profile-edit" 
            options={{ 
              title: 'Edit Profile',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#291C0E',
              },
              headerTintColor: '#E1D4C2',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }} 
          />
          <Stack.Screen 
            name="settings" 
            options={{ 
              title: 'Settings',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#291C0E',
              },
              headerTintColor: '#E1D4C2',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }} 
          />
          
          {/* Information screens */}
          <Stack.Screen 
            name="about" 
            options={{ 
              title: 'About Us',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#291C0E',
              },
              headerTintColor: '#E1D4C2',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }} 
          />
          <Stack.Screen 
            name="contact" 
            options={{ 
              title: 'Contact Us',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#291C0E',
              },
              headerTintColor: '#E1D4C2',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }} 
          />
          
          {/* Emergency & Utility screens */}
          <Stack.Screen 
            name="sos" 
            options={{ 
              title: 'Emergency SOS',
              headerShown: false, // Let SOS screen handle its own header
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="notification" 
            options={{ 
              title: 'Notifications',
              headerShown: false, // Let notification screen handle its own header
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="QRBoardingScreen" 
            options={{ 
              title: 'QR Boarding',
              headerShown: false, // Let QR screen handle its own header
              presentation: 'modal',
            }} 
          />
          
          {/* Modal screens */}
          <Stack.Screen 
            name="modal" 
            options={{ 
              presentation: 'modal',
              headerShown: false,
            }} 
          />
        </Stack>
      </TrackingProvider>
    </AuthProvider>
  );
}