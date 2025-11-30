import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="qr" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="arrival" />
    </Stack>
  );
}
