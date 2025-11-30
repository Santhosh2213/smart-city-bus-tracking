import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet } from "react-native";

export default function LiveTrackingScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 13.0827,
          longitude: 80.2707,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
        <Marker coordinate={{ latitude: 13.0827, longitude: 80.2707 }} title="School Bus" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
