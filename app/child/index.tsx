import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useChild } from "../../src/context/ChildContext";

export default function ChildModeHome() {
  const { child, arrival, link, createNewSession } = useChild();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Child Mode</Text>
      <Text style={styles.subtitle}>Linked child</Text>
      <View style={styles.card}>
        <Text style={styles.childName}>{child.name}</Text>
        <Text style={styles.childLine}>{child.busNumber} • Route {child.routeId}</Text>
        <Text style={styles.childLine}>Stop: {child.stopName}</Text>
        {link?.verified ? (
          <Text style={styles.badge}>Linked ✓</Text>
        ) : (
          <Text style={styles.badgePending}>Not linked</Text>
        )}
      </View>

      <Text style={styles.statusTitle}>Status</Text>
      <Text style={styles.statusText}>{arrival.message}</Text>

      <View style={{ height: 20 }} />

      <TouchableOpacity style={styles.btnOutline} onPress={createNewSession}>
        <Text style={styles.btnOutlineText}>Create / Refresh QR Session</Text>
      </TouchableOpacity>

      <Link href="/child/qr" asChild>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Scan Child QR (Parent)</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/child/arrival" asChild>
        <TouchableOpacity style={styles.btnSecondary}>
          <Text style={styles.btnText}>View Arrival Status</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/child/live" asChild>
        <TouchableOpacity style={styles.btnSecondary}>
          <Text style={styles.btnText}>Live Bus Tracking</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 4, color: "#3b2314" },
  subtitle: { color: "#8a6b52", marginBottom: 12 },
  card: {
    backgroundColor: "#f7eee5",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  childName: { fontSize: 18, fontWeight: "700", color: "#3b2314" },
  childLine: { color: "#7a5e45", marginTop: 4 },
  badge: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#d1f5d3",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    color: "#236b2a",
    fontWeight: "600",
  },
  badgePending: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#ffe1c8",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    color: "#b65100",
    fontWeight: "600",
  },
  statusTitle: { fontWeight: "700", color: "#3b2314", marginTop: 8 },
  statusText: { color: "#6a4d34", marginTop: 4 },
  btn: {
    backgroundColor: "#3b2314",
    padding: 14,
    borderRadius: 16,
    marginTop: 12,
  },
  btnSecondary: {
    backgroundColor: "#6b4b31",
    padding: 14,
    borderRadius: 16,
    marginTop: 10,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  btnOutline: {
    borderWidth: 1,
    borderColor: "#3b2314",
    padding: 12,
    borderRadius: 16,
  },
  btnOutlineText: {
    textAlign: "center",
    color: "#3b2314",
    fontWeight: "600",
  },
});
