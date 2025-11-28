import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  FlatList,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface BusSchedule {
  id: string;
  busNumber: string;
  route: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  frequency: string;
  stops: string[];
  status: 'on-time' | 'delayed' | 'early';
  delay?: number;
}

export default function TripScheduleScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<BusSchedule[]>([]);

  useEffect(() => {
    // Mock data
    const mockSchedules: BusSchedule[] = [
      {
        id: '1',
        busNumber: '205',
        route: 'Route 12 - Downtown Express',
        from: 'Central Station',
        to: 'City Center',
        departure: '06:00 AM',
        arrival: '06:45 AM',
        duration: '45 min',
        frequency: 'Every 15 min',
        stops: ['Central Station', 'Market St', 'City Park', 'University', 'City Center'],
        status: 'on-time'
      },
      {
        id: '2',
        busNumber: '107',
        route: 'Route 5 - University Line',
        from: 'East Campus',
        to: 'West Campus',
        departure: '06:30 AM',
        arrival: '07:05 AM',
        duration: '35 min',
        frequency: 'Every 20 min',
        stops: ['East Campus', 'Library', 'Student Center', 'Sports Complex', 'West Campus'],
        status: 'delayed',
        delay: 5
      },
      {
        id: '3',
        busNumber: '312',
        route: 'Route 8 - Metro Connector',
        from: 'North Terminal',
        to: 'South Plaza',
        departure: '07:00 AM',
        arrival: '07:50 AM',
        duration: '50 min',
        frequency: 'Every 30 min',
        stops: ['North Terminal', 'Business District', 'Hospital', 'Shopping Mall', 'South Plaza'],
        status: 'on-time'
      },
      {
        id: '4',
        busNumber: '418',
        route: 'Route 15 - Express Line',
        from: 'Airport',
        to: 'Downtown',
        departure: '05:45 AM',
        arrival: '06:15 AM',
        duration: '30 min',
        frequency: 'Every 45 min',
        stops: ['Airport', 'Convention Center', 'Financial District', 'Downtown'],
        status: 'early'
      }
    ];

    setSchedules(mockSchedules);
    setFilteredSchedules(mockSchedules);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSchedules(schedules);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = schedules.filter(schedule =>
        schedule.busNumber.toLowerCase().includes(query) ||
        schedule.route.toLowerCase().includes(query) ||
        schedule.from.toLowerCase().includes(query) ||
        schedule.to.toLowerCase().includes(query) ||
        schedule.stops.some(stop => stop.toLowerCase().includes(query))
      );
      setFilteredSchedules(filtered);
    }
  }, [searchQuery, schedules]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return '#10B981';
      case 'delayed': return '#EF4444';
      case 'early': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-time': return 'On Time';
      case 'delayed': return 'Delayed';
      case 'early': return 'Early';
      default: return status;
    }
  };

  const renderScheduleItem = ({ item }: { item: BusSchedule }) => (
    <TouchableOpacity 
      style={styles.scheduleCard}
      onPress={() => router.push(`/schedule-details/${item.id}`)}
    >
      <View style={styles.scheduleHeader}>
        <View style={styles.busInfo}>
          <View style={styles.busNumber}>
            <Text style={styles.busNumberText}>{item.busNumber}</Text>
          </View>
          <View style={styles.routeInfo}>
            <Text style={styles.routeName}>{item.route}</Text>
            <Text style={styles.routeStops}>{item.from} → {item.to}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>
            {getStatusText(item.status)}
            {item.delay && ` +${item.delay}m`}
          </Text>
        </View>
      </View>

      <View style={styles.scheduleDetails}>
        <View style={styles.timeSlot}>
          <Text style={styles.timeLabel}>Departure</Text>
          <Text style={styles.timeValue}>{item.departure}</Text>
        </View>
        <View style={styles.duration}>
          <Ionicons name="time-outline" size={16} color="#64748b" />
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
        <View style={styles.timeSlot}>
          <Text style={styles.timeLabel}>Arrival</Text>
          <Text style={styles.timeValue}>{item.arrival}</Text>
        </View>
      </View>

      <View style={styles.scheduleFooter}>
        <View style={styles.frequency}>
          <Ionicons name="refresh-outline" size={14} color="#64748b" />
          <Text style={styles.frequencyText}>{item.frequency}</Text>
        </View>
        <View style={styles.stopsInfo}>
          <Ionicons name="location-outline" size={14} color="#64748b" />
          <Text style={styles.stopsText}>{item.stops.length} stops</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.trackButton}
          onPress={() => router.push(`/bus-tracker/${item.id}`)}
        >
          <Ionicons name="navigate-outline" size={16} color="#4F46E5" />
          <Text style={styles.trackButtonText}>Live Track</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => router.push(`/schedule-details/${item.id}`)}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Schedule</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by bus number, route, or location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>

      {/* Schedule List */}
      <FlatList
        data={filteredSchedules}
        renderItem={renderScheduleItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyStateTitle}>No schedules found</Text>
            <Text style={styles.emptyStateText}>
              Try searching with different keywords
            </Text>
          </View>
        }
      />

      {/* Quick Filters */}
      <View style={styles.filters}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>All Routes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Express</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>University</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Downtown</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerRight: {
    width: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    fontSize: 16,
    color: '#1e293b',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  scheduleCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  busInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  busNumber: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  busNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  routeStops: {
    fontSize: 12,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  scheduleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },
  timeSlot: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  scheduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  frequency: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frequencyText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  stopsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopsText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  trackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  trackButtonText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailsButtonText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
});