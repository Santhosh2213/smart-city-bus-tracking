import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

export default function QRScan() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  const handleScan = ({ data }: any) => {
    router.push(`/child/show-otp?child=${data}`);
  };

  if (!permission?.granted) return <Text>Requesting camera permission...</Text>;

  return (
    <CameraView onBarcodeScanned={handleScan} style={{ flex: 1 }} />
  );
}
