// app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { TrackingProvider } from '../src/context/TrackingContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <TrackingProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="about" options={{ headerShown: true, title: 'About' }} />
          <Stack.Screen name="contact" options={{ headerShown: true, title: 'Contact' }} />
          
          {/* Add these routes for your features */}
          <Stack.Screen name="notifications" options={{ headerShown: true, title: 'Notifications' }} />
          <Stack.Screen name="tracking" options={{ headerShown: true, title: 'Live Tracking' }} />
          <Stack.Screen name="schedule" options={{ headerShown: true, title: 'Bus Schedule' }} />
          <Stack.Screen name="qr-scan" options={{ headerShown: true, title: 'QR Scan' }} />
          <Stack.Screen name="sos" options={{ headerShown: true, title: 'Emergency SOS' }} />
          <Stack.Screen name="child-mode" options={{ headerShown: true, title: 'Child Safety' }} />
        </Stack>
      </TrackingProvider>
    </AuthProvider>
  );
}