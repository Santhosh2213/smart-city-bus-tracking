// /src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';

// Import stack navigators
// import HomeStackNavigator from './HomeStackNavigator';
// import TrackingStackNavigator from './TrackingStackNavigator';
// import ScheduleStackNavigator from './ScheduleStackNavigator';
// import QRStackNavigator from './QRStackNavigator';
// import ProfileStackNavigator from './ProfileStackNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Tracking') {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'QR') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Tracking"
        component={TrackingStackNavigator}
        options={{ title: 'Tracking' }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleStackNavigator}
        options={{ title: 'Schedule' }}
      />
      <Tab.Screen
        name="QR"
        component={QRStackNavigator}
        options={{ title: 'QR Scan' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;