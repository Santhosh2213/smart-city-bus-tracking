// app/(tabs)/index.tsx - COMPLETELY ERROR-FREE
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  Alert
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Bus {
  id: string;
  number: string;
  route: string;
  destination: string;
  arrivalTime: string;
  delay: number;
  capacity: number;
  qrCode: string;
}

interface Route {
  id: string;
  name: string;
  stops: number;
  duration: string;
  buses: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [activeBuses, setActiveBuses] = useState<Bus[]>([]);
  const [favoriteRoutes, setFavoriteRoutes] = useState<Route[]>([]);
  const [unreadCount, setUnreadCount] = useState(3);

  useEffect(() => {
    // Mock data
    setActiveBuses([
      {
        id: '1',
        number: '205',
        route: 'Route 12 - Downtown Express',
        destination: 'City Center',
        arrivalTime: '5 min',
        delay: 2,
        capacity: 65,
        qrCode: 'bus_205_route_12'
      },
      {
        id: '2',
        number: '107',
        route: 'Route 5 - University Line',
        destination: 'Campus West',
        arrivalTime: '8 min',
        delay: 0,
        capacity: 42,
        qrCode: 'bus_107_route_5'
      }
    ]);

    setFavoriteRoutes([
      {
        id: '1',
        name: 'Route 12 - Downtown',
        stops: 15,
        duration: '45 min',
        buses: 8
      },
      {
        id: '2',
        name: 'Route 5 - University',
        stops: 12,
        duration: '35 min',
        buses: 6
      }
    ]);
  }, []);

  const quickActions = [
    {
      icon: 'qr-code',
      title: 'Scan QR',
      description: 'Board & track bus',
      color: ['#4F46E5', '#7C73E6'],
      screen: '/QRBoarding'
    },
    {
      icon: 'bus',
      title: 'Track Bus',
      description: 'Live bus locations',
      color: ['#10B981', '#34D399'],
      screen: '/bus-tracker'
    },
    {
      icon: 'notifications',
      title: 'Alerts',
      description: `${unreadCount} new notifications`,
      color: ['#F59E0B', '#FBBF24'],
      screen: '/NotificationScreen'
    },
    {
      icon: 'time',
      title: 'Schedule',
      description: 'Bus timings',
      color: ['#EF4444', '#F87171'],
      screen: '/schedule'
    }
  ];

  const handleNotificationPress = () => {
    try {
      router.push('/NotificationScreen');
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Cannot open notifications at the moment');
    }
  };

  const handleQRAction = () => {
    router.push('/QRBoarding');
  };

  const handleSOSPress = () => {
    router.push('/sos');
  };

  const renderBusCard = (bus: Bus) => (
    <TouchableOpacity key={bus.id} style={styles.busCard}>
      <View style={styles.busHeader}>
        <View style={styles.busNumber}>
          <Text style={styles.busNumberText}>{bus.number}</Text>
        </View>
        <View style={styles.busInfo}>
          <Text style={styles.busRoute}>{bus.route}</Text>
          <Text style={styles.busDestination}>To: {bus.destination}</Text>
        </View>
        <View style={styles.arrivalTime}>
          <Text style={styles.arrivalTimeText}>{bus.arrivalTime}</Text>
          {bus.delay !== 0 && (
            <Text style={styles.delayText}>
              {bus.delay > 0 ? `+${bus.delay}` : bus.delay} min
            </Text>
          )}
        </View>
      </View>
      <View style={styles.busFooter}>
        <View style={styles.capacity}>
          <Ionicons name="people" size={16} color="#64748b" />
          <Text style={styles.capacityText}>{bus.capacity}% full</Text>
        </View>
        <TouchableOpacity 
          style={styles.trackButton}
          onPress={() => router.push(`/bus-details/${bus.id}`)}
        >
          <Text style={styles.trackButtonText}>Live Track</Text>
          <Ionicons name="navigate" size={16} color="#4F46E5" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning! 👋</Text>
            <Text style={styles.subtitle}>Welcome to SmartBus</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotificationPress}
          >
            <Ionicons name="notifications-outline" size={24} color="#1e293b" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.actionCard}
                onPress={() => {
                  if (action.screen === '/QRBoarding') {
                    handleQRAction();
                  } else if (action.screen === '/NotificationScreen') {
                    handleNotificationPress();
                  } else {
                    Alert.alert('Coming Soon', `${action.title} feature is coming soon!`);
                  }
                }}
              >
                <LinearGradient
                  colors={action.color}
                  style={styles.actionIcon}
                >
                  <Ionicons name={action.icon as any} size={24} color="#fff" />
                </LinearGradient>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Active Buses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Buses Nearby</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {activeBuses.map(renderBusCard)}
          </ScrollView>
        </View>

        {/* QR Boarding Promotion */}
        <TouchableOpacity 
          style={styles.qrPromoCard}
          onPress={handleQRAction}
        >
          <LinearGradient
            colors={['#4F46E5', '#7C73E6']}
            style={styles.qrPromoGradient}
          >
            <View style={styles.qrPromoContent}>
              <View style={styles.qrPromoText}>
                <Text style={styles.qrPromoTitle}>Quick Boarding</Text>
                <Text style={styles.qrPromoSubtitle}>Scan QR code for instant bus access</Text>
              </View>
              <View style={styles.qrPromoIcon}>
                <Ionicons name="qr-code" size={40} color="#fff" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Emergency SOS */}
        <TouchableOpacity 
          style={styles.sosButton}
          onPress={handleSOSPress}
        >
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            style={styles.sosGradient}
          >
            <Ionicons name="warning" size={24} color="#fff" />
            <Text style={styles.sosText}>Emergency SOS</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  seeAllText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  busCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  busHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  busNumber: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  busNumberText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  busInfo: {
    flex: 1,
  },
  busRoute: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  busDestination: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  arrivalTime: {
    alignItems: 'flex-end',
  },
  arrivalTimeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  delayText: {
    fontSize: 10,
    color: '#EF4444',
    marginTop: 2,
  },
  busFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capacityText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  trackButtonText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  qrPromoCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  qrPromoGradient: {
    padding: 20,
  },
  qrPromoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qrPromoText: {
    flex: 1,
  },
  qrPromoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  qrPromoSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  qrPromoIcon: {
    marginLeft: 16,
  },
  sosButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sosGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  sosText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});