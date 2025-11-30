import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";
import { useChild } from "../context/ChildContext";

export default function QRScannerScreen() {
  const navigation = useNavigation();
  const { generateOTP } = useChild();
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    BarCodeScanner.requestPermissionsAsync().then((res) => setPermission(res.status === "granted"));
  }, []);

  const handleScan = ({ data }) => {
    const otp = generateOTP();
    alert(`Child ID scanned: ${data}\nOTP: ${otp}`);
    navigation.navigate("OTPVerify", { childId: data });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan QR Code</Text>
      <BarCodeScanner style={{ height: 350, width: "100%" }} onBarCodeScanned={handleScan} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 30, alignItems: "center" },
  title: { fontSize: 22, marginBottom: 15 },
});
