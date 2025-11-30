// /src/navigation/AppNavigator.tsx
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { RootStackParamList } from './types';

// Import navigators
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

// Import contexts
import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'Main' : 'Auth'}
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;