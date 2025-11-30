import { View, Text, StyleSheet } from "react-native";
import { useChild } from "../context/ChildContext";

export default function ArrivalScreen() {
  const { linkedChild } = useChild();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Arrival Status</Text>

      {linkedChild ? (
        <Text style={styles.details}>
          Child: {linkedChild.name}{"\n"}
          ID: {linkedChild.id}{"\n"}
          Bus: {linkedChild.bus}{"\n"}
          Status: On the way 🚌
        </Text>
      ) : (
        <Text style={styles.details}>No child linked.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  details: { fontSize: 18, textAlign: "center" },
});
