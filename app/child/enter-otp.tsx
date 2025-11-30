// app/child/enter-otp.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function EnterOTP() {
  const router = useRouter();
  const { otp, user } = useLocalSearchParams(); // OTP from QR screen
  const [inputOTP, setInputOTP] = useState("");

  async function handleVerify() {
    if (inputOTP === otp) {
      await AsyncStorage.setItem("linkedChild", JSON.stringify({ user }));
      Alert.alert("Success 🎉", "Child linked successfully!");
      router.replace("/child/live"); // Navigate to live tracking
    } else {
      Alert.alert("❌ Invalid OTP", "Please check and try again.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 OTP Verification</Text>
      <Text style={styles.subtitle}>Please enter OTP to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit OTP"
        keyboardType="number-pad"
        maxLength={6}
        value={inputOTP}
        onChangeText={setInputOTP}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.btnText}>Verify & Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

// ----------- UI Styling -----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F4F9FF",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0057FF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 10,
    padding: 15,
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 25,
    width: "80%",
    backgroundColor: "#0057FF",
    padding: 15,
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});
