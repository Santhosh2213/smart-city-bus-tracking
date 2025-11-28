// app/_layout.tsx - UPDATED
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { TrackingProvider } from '../src/context/TrackingContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <TrackingProvider>
        <Stack>
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false,
              animation: 'fade'
            }} 
          />
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_bottom'
            }} 
          />
          <Stack.Screen 
            name="about" 
            options={{ 
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="contact" 
            options={{ 
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="sos" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right'
            }} 
          />
          <Stack.Screen 
            name="NotificationScreen" 
            options={{ 
              headerShown: false,
              presentation: 'modal',
              animation: 'slide_from_right'
            }} 
          />
        </Stack>
      </TrackingProvider>
    </AuthProvider>
  );
}