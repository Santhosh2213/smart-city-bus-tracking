import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ShowOTP() {
  const { child } = useLocalSearchParams();
  const router = useRouter();
  const [otp, setOtp] = useState("");

  useEffect(() => {
    setOtp(Math.floor(100000 + Math.random() * 900000).toString()); // 6 digit OTP
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 OTP Generated</Text>

      <Text style={styles.code}>{otp}</Text>

      <Text style={styles.info}>
        Tell this OTP to the parent to enter in next screen.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push(`/child/enter-otp?otp=${otp}&child=${child}`)}
      >
        <Text style={styles.buttonText}>Next →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center" },
  code: { fontSize: 40, fontWeight: "bold", textAlign: "center", marginVertical: 30, color: "green" },
  info: { textAlign: "center", marginBottom: 30, fontSize: 16 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 20 }
});
