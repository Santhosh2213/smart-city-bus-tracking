import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ChildModeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👶 Child Mode</Text>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("QRScan")}>
        <Text style={styles.txt}>📷 Scan Child QR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("LiveTracking")}>
        <Text style={styles.txt}>🚌 Live Bus Tracking</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Arrival")}>
        <Text style={styles.txt}>📍 Arrival Status</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 25, fontWeight: "bold", marginBottom: 30 },
  btn: { backgroundColor: "#0066FF", padding: 14, marginTop: 10, width: "75%", borderRadius: 10 },
  txt: { color: "white", fontSize: 18, textAlign: "center" },
});
