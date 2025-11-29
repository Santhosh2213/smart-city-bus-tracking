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
          <Stack.Screen name="about" options={{ headerShown: false }} />
          <Stack.Screen name="contact" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="profile-edit" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
        </Stack>
      </TrackingProvider>
    </AuthProvider>
  );
}