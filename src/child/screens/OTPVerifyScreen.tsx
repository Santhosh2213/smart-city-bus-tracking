import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useChild } from "../context/ChildContext";
import { useState } from "react";

export default function OTPVerifyScreen() {
  const { generatedOTP, linkChild } = useChild();
  const { params } = useRoute();
  const navigation = useNavigation();
  const [input, setInput] = useState("");

  const verify = () => {
    if (input === generatedOTP) {
      linkChild({ id: params.childId, name: "Student A", bus: "Bus 12" });
      alert("Child linked successfully!");
      navigation.navigate("Arrival");
    } else alert("❌ Wrong OTP");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <TextInput style={styles.input} placeholder="Enter 6-digit OTP" onChangeText={setInput} />
      <Button title="Verify" onPress={verify} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  input: { width: "70%", borderWidth: 1, padding: 10, marginBottom: 20 },
  title: { fontSize: 20, marginBottom: 20 },
});
