import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";

export default function ArrivalScreen() {
  const { child } = useLocalSearchParams();

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 13.0827,
          longitude: 80.2707,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={{ latitude: 13.0827, longitude: 80.2707 }} title="Bus Location" />
      </MapView>

      <View style={styles.bottom}>
        <Text style={styles.title}>🚌 Child Linked</Text>
        <Text style={styles.sub}>{child}</Text>
        <Text style={styles.arrival}>Estimated Arrival: 4 mins</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottom: { backgroundColor: "white", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  title: { fontSize: 22, fontWeight: "bold" },
  sub: { fontSize: 16, marginTop: 5, opacity: 0.7 },
  arrival: { marginTop: 15, fontSize: 20, fontWeight: "600", color: "green" }
});
