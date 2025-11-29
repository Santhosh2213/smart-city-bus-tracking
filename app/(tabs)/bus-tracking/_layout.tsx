// app/(tabs)/bus-tracking/_layout.tsx
import { Stack } from 'expo-router';

export default function BusTrackingLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="live-tracking" 
        options={{ 
          headerShown: false,
          title: 'Live Tracking'
        }} 
      />
      <Stack.Screen 
        name="bus-details" 
        options={{ 
          headerShown: false,
          title: 'Bus Details'
        }} 
      />
      <Stack.Screen 
        name="offline-map" 
        options={{ 
          headerShown: false,
          title: 'Offline Maps'
        }} 
      />
    </Stack>
  );
}