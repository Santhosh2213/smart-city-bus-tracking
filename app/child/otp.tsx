import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function OTPPage() {
  const router = useRouter();
  const { otp, child } = useLocalSearchParams();

  const [entered, setEntered] = useState("");

  const verifyOTP = () => {
    if (entered === otp) {
      router.push(`/child/arrival?child=${child}`);
    } else {
      alert("❌ Wrong OTP, try again");
      setEntered("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>

      <Text style={styles.generatedOTP}>Your OTP: {otp}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="numeric"
        maxLength={6}
        value={entered}
        onChangeText={setEntered}
      />

      <TouchableOpacity style={styles.button} onPress={verifyOTP}>
        <Text style={styles.btnText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 30 },
  generatedOTP: { fontSize: 28, textAlign: "center", color: "#007AFF", marginBottom: 30 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 18, textAlign: "center" },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 12, marginTop: 30 },
  btnText: { textAlign: "center", fontSize: 18, color: "white" }
});
