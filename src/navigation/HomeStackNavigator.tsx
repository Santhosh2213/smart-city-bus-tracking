// /src/navigation/HomeStackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackParamList } from './types';
import HomeScreen from '../../app/index';

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;