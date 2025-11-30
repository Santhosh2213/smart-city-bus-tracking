// app/index.tsx
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";

const HEADER_BROWN = "#3b2314";
const CARD_BG = "#f7eee5";

export default function HomeScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoIcon}>🚌</Text>
          <Text style={styles.logoText}>SmartBus</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.iconCircle}>ℹ️</Text>
          <Text style={[styles.iconCircle, { marginLeft: 10 }]}>✉️</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Hero */}
        <Animated.View
          style={[
            styles.hero,
            { opacity: fade, transform: [{ translateY: slide }] },
          ]}
        >
          <Text style={styles.heroTitle}>Smarter Bus Travel</Text>
          <Text style={styles.heroSubtitle}>
            Real-time tracking, smart scheduling,
            {"\n"}and enhanced safety features for everyone.
          </Text>
          <Link href="/child" asChild>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Get Started →</Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>

        {/* Quick actions */}
        <View style={styles.whitePanel}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionSubtitle}>Get where you need to go</Text>

          <View style={styles.cardRow}>
            <ActionCard label="Start Trip" icon="▶" />
            <ActionCard label="View Routes" icon="🗺️" />
            <ActionCard label="Schedule" icon="⏰" />
            <ActionCard label="Alerts" icon="🔔" />
          </View>
        </View>

        {/* Child Mode shortcut */}
        <View style={styles.whitePanel}>
          <Text style={styles.sectionTitle}>Child Safety Mode</Text>
          <Text style={styles.sectionSubtitle}>
            Link your child using QR + OTP and track real-time boarding and arrival.
          </Text>

          <Link href="/child" asChild>
            <TouchableOpacity style={styles.childBtn}>
              <Text style={styles.childEmoji}>👶</Text>
              <View>
                <Text style={styles.childTitle}>Open Child Mode</Text>
                <Text style={styles.childSubtitle}>
                  QR + OTP authentication, live arrival alerts.
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}

const ActionCard: React.FC<{ label: string; icon: string }> = ({ label, icon }) => (
  <View style={styles.actionCard}>
    <View style={styles.actionIconWrap}>
      <Text style={styles.actionIcon}>{icon}</Text>
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: HEADER_BROWN },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logoIcon: { fontSize: 22 },
  logoText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
  },
  headerRight: { flexDirection: "row" },
  iconCircle: {
    backgroundColor: "rgba(255,255,255,0.15)",
    width: 32,
    height: 32,
    borderRadius: 16,
    textAlign: "center",
    textAlignVertical: "center",
  },
  hero: {
    paddingHorizontal: 32,
    paddingVertical: 40,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 10,
  },
  heroSubtitle: {
    color: "#f9e7d6",
    textAlign: "center",
    marginBottom: 26,
  },
  primaryBtn: {
    backgroundColor: "#f7eee5",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 26,
  },
  primaryBtnText: { color: HEADER_BROWN, fontWeight: "700" },
  whitePanel: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginTop: -12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#3b2314" },
  sectionSubtitle: {
    color: "#8a6b52",
    marginTop: 4,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    width: "48%",
    marginBottom: 12,
    alignItems: "center",
  },
  actionIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#e4d1bf",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  actionIcon: { fontSize: 24 },
  actionLabel: { color: "#5a4330", fontWeight: "600" },
  childBtn: {
    marginTop: 12,
    backgroundColor: CARD_BG,
    padding: 16,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  childEmoji: { fontSize: 30, marginRight: 12 },
  childTitle: { fontWeight: "700", color: "#3b2314" },
  childSubtitle: { color: "#8a6b52", fontSize: 12 },
});
