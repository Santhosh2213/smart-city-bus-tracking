import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { MainStackParamList } from "./types";

import HomeScreen from "../screens/Home/HomeScreen";
import ChildModeScreen from "../child/screens/ChildModeScreen";
import QRScannerScreen from "../child/screens/QRScannerScreen";
import OTPVerifyScreen from "../child/screens/OTPVerifyScreen";
import ArrivalScreen from "../child/screens/ArrivalScreen";
import LiveTrackingScreen from "../child/screens/LiveTrackingScreen";

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ChildMode" component={ChildModeScreen} />
        <Stack.Screen name="QRScan" component={QRScannerScreen} />
        <Stack.Screen name="OTPVerify" component={OTPVerifyScreen} />
        <Stack.Screen name="Arrival" component={ArrivalScreen} />
        <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
