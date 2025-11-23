// /src/navigation/TrackingStackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TrackingStackParamList } from './types';
import LiveTrackingScreen from '../screens/BusTracking/LiveTrackingScreen';

const Stack = createStackNavigator<TrackingStackParamList>();

const TrackingStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LiveTracking"
        component={LiveTrackingScreen}
        options={{ headerTitle: 'Live Bus Tracking' }}
      />
    </Stack.Navigator>
  );
};

export default TrackingStackNavigator;