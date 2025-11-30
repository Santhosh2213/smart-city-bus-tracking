// app/_layout.tsx - UPDATED
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { TrackingProvider } from '../src/context/TrackingContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <TrackingProvider>
        <Stack>
<<<<<<< HEAD
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
=======
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="about" options={{ headerShown: false }} />
          <Stack.Screen name="contact" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="profile-edit" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
>>>>>>> 6a2e44727d483020c3258e3ba209a2c6f4f7391e
        </Stack>
      </TrackingProvider>
    </AuthProvider>
  );
}