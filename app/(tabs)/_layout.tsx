// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
<<<<<<< HEAD
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e5e5',
        },
        headerShown: false,
=======
        tabBarActiveTintColor: '#291C0E',
        tabBarInactiveTintColor: '#6E473B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: 'rgba(167, 141, 120, 0.2)',
          elevation: 8,
          shadowColor: '#291C0E',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 16,
        },
>>>>>>> 6a2e44727d483020c3258e3ba209a2c6f4f7391e
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      {/* Add other tabs as needed */}
    </Tabs>
  );
}