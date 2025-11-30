import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useChild } from "../../src/context/ChildContext";

export default function LiveTrackingScreen() {
  const { location, child } = useChild();

  if (Platform.OS === "web") {
    return (
      <View style={styles.center}>
        <Text>Live Google Map works on Android/iOS (Expo Go), not web.</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <Text>Getting location… make sure GPS is enabled.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: location.lat, longitude: location.lng }}
          title="Child / Bus"
          description={`Bus ${child.busNumber}`}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
