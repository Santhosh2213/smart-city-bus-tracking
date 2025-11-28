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
  Alert,
  Modal,
  Animated,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
  capacity: number;
  nextArrival?: string;
  liveLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface FilterOptions {
  routeType: string[];
  status: string[];
  timeRange: {
    start: string;
    end: string;
  };
}

export default function TripScheduleScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<BusSchedule[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<BusSchedule | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    routeType: [],
    status: [],
    timeRange: { start: '00:00', end: '23:59' }
  });

  useEffect(() => {
    loadSchedules();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [searchQuery, schedules, filterOptions]);

  const loadSchedules = () => {
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
        status: 'on-time',
        delay: 0,
        capacity: 65,
        nextArrival: '5 min',
        liveLocation: { latitude: 40.7128, longitude: -74.0060 }
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
        delay: 5,
        capacity: 42,
        nextArrival: '8 min',
        liveLocation: { latitude: 40.7589, longitude: -73.9851 }
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
        status: 'on-time',
        capacity: 78,
        nextArrival: '12 min',
        liveLocation: { latitude: 40.7505, longitude: -73.9934 }
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
        status: 'early',
        capacity: 35,
        nextArrival: '3 min',
        liveLocation: { latitude: 40.6413, longitude: -73.7781 }
      },
      {
        id: '5',
        busNumber: '522',
        route: 'Route 20 - Night Owl',
        from: 'City Center',
        to: 'Suburban Hub',
        departure: '11:00 PM',
        arrival: '11:50 PM',
        duration: '50 min',
        frequency: 'Every 60 min',
        stops: ['City Center', 'Residential Area', 'Shopping District', 'Suburban Hub'],
        status: 'on-time',
        capacity: 25,
        nextArrival: '15 min',
        liveLocation: { latitude: 40.7831, longitude: -73.9712 }
      }
    ];

    setSchedules(mockSchedules);
  };

  const filterSchedules = () => {
    let filtered = schedules;

    // Search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(schedule =>
        schedule.busNumber.toLowerCase().includes(query) ||
        schedule.route.toLowerCase().includes(query) ||
        schedule.from.toLowerCase().includes(query) ||
        schedule.to.toLowerCase().includes(query) ||
        schedule.stops.some(stop => stop.toLowerCase().includes(query))
      );
    }

    // Route type filter
    if (filterOptions.routeType.length > 0) {
      filtered = filtered.filter(schedule => {
        if (filterOptions.routeType.includes('express') && schedule.route.toLowerCase().includes('express')) return true;
        if (filterOptions.routeType.includes('university') && schedule.route.toLowerCase().includes('university')) return true;
        if (filterOptions.routeType.includes('downtown') && (schedule.from.toLowerCase().includes('downtown') || schedule.to.toLowerCase().includes('downtown'))) return true;
        if (filterOptions.routeType.includes('night') && schedule.route.toLowerCase().includes('night')) return true;
        return false;
      });
    }

    // Status filter
    if (filterOptions.status.length > 0) {
      filtered = filtered.filter(schedule => filterOptions.status.includes(schedule.status));
    }

    setFilteredSchedules(filtered);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call with random status changes
    setTimeout(() => {
      const updatedSchedules = schedules.map(schedule => ({
        ...schedule,
        status: ['on-time', 'delayed', 'early'][Math.floor(Math.random() * 3)] as 'on-time' | 'delayed' | 'early',
        delay: Math.random() > 0.5 ? Math.floor(Math.random() * 10) : 0,
        capacity: Math.floor(Math.random() * 100),
        nextArrival: `${Math.floor(Math.random() * 15) + 1} min`
      }));
      setSchedules(updatedSchedules);
      setRefreshing(false);
      Alert.alert('Refreshed', 'Schedule data has been updated');
    }, 1500);
  }, [schedules]);

  const toggleFavorite = (busId: string) => {
    setFavorites(prev =>
      prev.includes(busId)
        ? prev.filter(id => id !== busId)
        : [...prev, busId]
    );
  };

  const toggleFilter = (type: 'routeType' | 'status', value: string) => {
    setFilterOptions(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const showScheduleDetails = (schedule: BusSchedule) => {
    setSelectedSchedule(schedule);
    setShowDetailsModal(true);
  };

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

  const getCapacityColor = (capacity: number) => {
    if (capacity < 40) return '#10B981';
    if (capacity < 70) return '#F59E0B';
    return '#EF4444';
  };

  const navigateToBusTracker = (busId: string) => {
    Alert.alert(
      'Live Tracking',
      `Would you like to track Bus ${busId} in real-time?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Track Bus', 
          onPress: () => {
            Alert.alert('Navigation', `Navigating to Bus ${busId} tracker...`);
            // router.push(`/bus-tracker/${busId}`);
          }
        }
      ]
    );
  };

  const renderScheduleItem = ({ item, index }: { item: BusSchedule; index: number }) => (
    <Animated.View style={{ 
      opacity: fadeAnim, 
      transform: [{ 
        translateY: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0]
        })
      }] 
    }}>
      <TouchableOpacity 
        style={[
          styles.scheduleCard,
          favorites.includes(item.id) && styles.favoriteCard
        ]}
        onPress={() => showScheduleDetails(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.busInfo}>
            <View style={styles.busNumber}>
              <Text style={styles.busNumberText}>{item.busNumber}</Text>
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeName}>{item.route}</Text>
              <Text style={styles.routeStops}>{item.from} → {item.to}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
          >
            <Ionicons 
              name={favorites.includes(item.id) ? "heart" : "heart-outline"} 
              size={20} 
              color={favorites.includes(item.id) ? "#EF4444" : "#64748b"} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.scheduleHeader}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>
              {getStatusText(item.status)}
              {item.delay && item.delay > 0 ? ` +${item.delay}m` : ''}
            </Text>
          </View>
          {item.nextArrival && (
            <View style={styles.nextArrival}>
              <Ionicons name="time" size={12} color="#4F46E5" />
              <Text style={styles.nextArrivalText}>Next: {item.nextArrival}</Text>
            </View>
          )}
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
          <View style={styles.capacityInfo}>
            <View style={styles.capacityBar}>
              <View 
                style={[
                  styles.capacityFill,
                  { 
                    width: `${item.capacity}%`,
                    backgroundColor: getCapacityColor(item.capacity)
                  }
                ]} 
              />
            </View>
            <Text style={styles.capacityText}>{item.capacity}% full</Text>
          </View>
          <View style={styles.frequency}>
            <Ionicons name="refresh-outline" size={14} color="#64748b" />
            <Text style={styles.frequencyText}>{item.frequency}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.trackButton}
            onPress={(e) => {
              e.stopPropagation();
              navigateToBusTracker(item.id);
            }}
          >
            <Ionicons name="navigate-outline" size={16} color="#4F46E5" />
            <Text style={styles.trackButtonText}>Live Track</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={(e) => {
              e.stopPropagation();
              showScheduleDetails(item);
            }}
          >
            <Text style={styles.detailsButtonText}>View Stops</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const FilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFilters(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Filter Schedules</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Ionicons name="close" size={24} color="#1e293b" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Route Type Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Route Type</Text>
            <View style={styles.filterOptions}>
              {['Express', 'University', 'Downtown', 'Night'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterOption,
                    filterOptions.routeType.includes(type.toLowerCase()) && styles.filterOptionSelected
                  ]}
                  onPress={() => toggleFilter('routeType', type.toLowerCase())}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filterOptions.routeType.includes(type.toLowerCase()) && styles.filterOptionTextSelected
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Status Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Status</Text>
            <View style={styles.filterOptions}>
              {['On Time', 'Delayed', 'Early'].map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterOption,
                    filterOptions.status.includes(status.toLowerCase().replace(' ', '-')) && styles.filterOptionSelected
                  ]}
                  onPress={() => toggleFilter('status', status.toLowerCase().replace(' ', '-'))}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filterOptions.status.includes(status.toLowerCase().replace(' ', '-')) && styles.filterOptionTextSelected
                  ]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Range Filter - Simplified without DateTimePicker */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Time Range</Text>
            <View style={styles.timeRangeContainer}>
              <View style={styles.timeInput}>
                <Ionicons name="time-outline" size={16} color="#64748b" />
                <Text style={styles.timeInputText}>{filterOptions.timeRange.start}</Text>
              </View>
              
              <Text style={styles.timeRangeSeparator}>to</Text>
              
              <View style={styles.timeInput}>
                <Ionicons name="time-outline" size={16} color="#64748b" />
                <Text style={styles.timeInputText}>{filterOptions.timeRange.end}</Text>
              </View>
            </View>
            <Text style={styles.timeRangeNote}>
              Time filter is currently display only. Install @react-native-community/datetimepicker for full functionality.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.filterActions}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setFilterOptions({
                  routeType: [],
                  status: [],
                  timeRange: { start: '00:00', end: '23:59' }
                });
                setShowFilters(false);
              }}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const ScheduleDetailsModal = () => (
    <Modal
      visible={showDetailsModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowDetailsModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Schedule Details</Text>
          <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
            <Ionicons name="close" size={24} color="#1e293b" />
          </TouchableOpacity>
        </View>

        {selectedSchedule && (
          <ScrollView style={styles.modalContent}>
            <View style={styles.detailsHeader}>
              <View style={styles.detailsBusNumber}>
                <Text style={styles.detailsBusNumberText}>{selectedSchedule.busNumber}</Text>
              </View>
              <View style={styles.detailsRoute}>
                <Text style={styles.detailsRouteName}>{selectedSchedule.route}</Text>
                <Text style={styles.detailsRoutePath}>
                  {selectedSchedule.from} → {selectedSchedule.to}
                </Text>
              </View>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Departure</Text>
                <Text style={styles.detailValue}>{selectedSchedule.departure}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Arrival</Text>
                <Text style={styles.detailValue}>{selectedSchedule.arrival}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>{selectedSchedule.duration}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Frequency</Text>
                <Text style={styles.detailValue}>{selectedSchedule.frequency}</Text>
              </View>
            </View>

            <View style={styles.statusCapacitySection}>
              <View style={styles.statusSection}>
                <Text style={styles.sectionLabel}>Status</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedSchedule.status) }]}>
                  <Text style={styles.statusText}>
                    {getStatusText(selectedSchedule.status)}
                    {selectedSchedule.delay && selectedSchedule.delay > 0 ? ` +${selectedSchedule.delay}m` : ''}
                  </Text>
                </View>
              </View>
              <View style={styles.capacitySection}>
                <Text style={styles.sectionLabel}>Capacity</Text>
                <View style={styles.capacityInfo}>
                  <View style={styles.capacityBar}>
                    <View 
                      style={[
                        styles.capacityFill,
                        { 
                          width: `${selectedSchedule.capacity}%`,
                          backgroundColor: getCapacityColor(selectedSchedule.capacity)
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.capacityText}>{selectedSchedule.capacity}% full</Text>
                </View>
              </View>
            </View>

            <View style={styles.stopsSection}>
              <Text style={styles.stopsTitle}>All Stops ({selectedSchedule.stops.length})</Text>
              {selectedSchedule.stops.map((stop, index) => (
                <View key={index} style={styles.stopItem}>
                  <View style={styles.stopMarker}>
                    <View style={styles.stopDot} />
                    {index < selectedSchedule.stops.length - 1 && <View style={styles.stopLine} />}
                  </View>
                  <Text style={styles.stopName}>{stop}</Text>
                  {index === 0 && <Text style={styles.stopType}>Start</Text>}
                  {index === selectedSchedule.stops.length - 1 && <Text style={styles.stopType}>End</Text>}
                </View>
              ))}
            </View>

            <View style={styles.detailsActions}>
              <TouchableOpacity 
                style={styles.primaryAction}
                onPress={() => {
                  setShowDetailsModal(false);
                  navigateToBusTracker(selectedSchedule.id);
                }}
              >
                <Ionicons name="navigate" size={20} color="#fff" />
                <Text style={styles.primaryActionText}>Live Track Bus</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.secondaryAction}
                onPress={() => {
                  toggleFavorite(selectedSchedule.id);
                  Alert.alert(
                    favorites.includes(selectedSchedule.id) ? 'Removed from Favorites' : 'Added to Favorites',
                    favorites.includes(selectedSchedule.id) 
                      ? 'Bus removed from your favorites' 
                      : 'You will get notifications for this bus'
                  );
                }}
              >
                <Ionicons 
                  name={favorites.includes(selectedSchedule.id) ? "heart" : "heart-outline"} 
                  size={20} 
                  color="#4F46E5" 
                />
                <Text style={styles.secondaryActionText}>
                  {favorites.includes(selectedSchedule.id) ? 'Remove Favorite' : 'Add to Favorites'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
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
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter" size={20} color="#4F46E5" />
          {(filterOptions.routeType.length > 0 || filterOptions.status.length > 0 || 
            filterOptions.timeRange.start !== '00:00' || filterOptions.timeRange.end !== '23:59') && (
            <View style={styles.filterBadge} />
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by bus number, route, or location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredSchedules.length}</Text>
          <Text style={styles.statLabel}>Buses</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {filteredSchedules.filter(s => s.status === 'on-time').length}
          </Text>
          <Text style={styles.statLabel}>On Time</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {favorites.length}
          </Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
      </View>

      {/* Schedule List */}
      <FlatList
        data={filteredSchedules}
        renderItem={renderScheduleItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4F46E5']}
            tintColor="#4F46E5"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyStateTitle}>No schedules found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'Try searching with different keywords' : 'No buses match your filters'}
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => {
                setSearchQuery('');
                setFilterOptions({
                  routeType: [],
                  status: [],
                  timeRange: { start: '00:00', end: '23:59' }
                });
              }}
            >
              <Text style={styles.emptyStateButtonText}>Reset Search & Filters</Text>
            </TouchableOpacity>
          </View>
        }
        ListHeaderComponent={
          filteredSchedules.length > 0 && (
            <Text style={styles.resultsText}>
              Showing {filteredSchedules.length} bus{filteredSchedules.length !== 1 ? 'es' : ''}
            </Text>
          )
        }
      />

      {/* Modals */}
      <FilterModal />
      <ScheduleDetailsModal />
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
  filterButton: {
    padding: 8,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
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
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e2e8f0',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultsText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    textAlign: 'center',
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
  favoriteCard: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  favoriteButton: {
    padding: 4,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  nextArrival: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  nextArrivalText: {
    fontSize: 10,
    color: '#4F46E5',
    fontWeight: '600',
    marginLeft: 4,
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
    flex: 1,
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
  capacityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  capacityBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginRight: 8,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    borderRadius: 2,
  },
  capacityText: {
    fontSize: 10,
    color: '#64748b',
    minWidth: 50,
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
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterOptionSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: '#ffffff',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginHorizontal: 4,
  },
  timeInputText: {
    fontSize: 14,
    color: '#1e293b',
    marginLeft: 8,
  },
  timeRangeSeparator: {
    fontSize: 14,
    color: '#64748b',
    marginHorizontal: 8,
  },
  timeRangeNote: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
    fontStyle: 'italic',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  resetButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resetButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  // Details Modal Styles
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  detailsBusNumber: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  detailsBusNumberText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsRoute: {
    flex: 1,
  },
  detailsRouteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  detailsRoutePath: {
    fontSize: 14,
    color: '#64748b',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  detailItem: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  statusCapacitySection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statusSection: {
    flex: 1,
  },
  capacitySection: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  stopsSection: {
    marginBottom: 24,
  },
  stopsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stopMarker: {
    width: 20,
    alignItems: 'center',
    marginRight: 12,
  },
  stopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
  },
  stopLine: {
    width: 2,
    height: 20,
    backgroundColor: '#e2e8f0',
    marginTop: 2,
  },
  stopName: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
  stopType: {
    fontSize: 10,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  detailsActions: {
    gap: 12,
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  primaryActionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  secondaryActionText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
});