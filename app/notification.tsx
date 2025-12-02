// notification.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// Remove the duplicate line below - keep only ONE of these:
import { database, ref, onValue, set, remove, update, push, get } from '../firebaseConfig';
// Types for our notifications
export type NotificationType = 'alert' | 'update' | 'system' | 'reminder' | 'safety';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: number; // Changed to number for Firebase storage
  isRead: boolean;
  route?: string;
  busNumber?: string;
  priority: 'low' | 'medium' | 'high';
}

const NotificationScreen: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Database reference for notifications
  const notificationsRef = ref(database, 'notifications');

  // Load notifications from Firebase
  const loadNotifications = async () => {
    setRefreshing(true);
    setIsLoading(true);
    try {
      // Using onValue for real-time updates
      onValue(notificationsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Convert Firebase object to array
          const notificationsArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
            timestamp: new Date(data[key].timestamp) // Convert back to Date object
          })).sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first
          setNotifications(notificationsArray);
        } else {
          setNotifications([]);
        }
        setIsLoading(false);
        setRefreshing(false);
      });
    } catch (error) {
      console.error('Error loading notifications:', error);
      Alert.alert('Error', 'Failed to load notifications');
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Add mock data to Firebase (for initial setup)
  const addMockNotifications = async () => {
    const mockNotifications: Omit<Notification, 'id'>[] = [
      {
        title: 'Bus Delay Alert',
        message: 'Bus #205 on Route 12 is delayed by 15 minutes due to traffic congestion on Main Street',
        type: 'alert',
        timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
        isRead: false,
        route: 'Route 12',
        busNumber: '205',
        priority: 'high'
      },
      {
        title: 'Route Update',
        message: 'New bus stops added to Route 8 starting next week. Check the updated schedule.',
        type: 'update',
        timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
        isRead: true,
        route: 'Route 8',
        priority: 'medium'
      },
      {
        title: 'System Maintenance',
        message: 'Scheduled maintenance this Sunday from 2:00 AM to 4:00 AM. Service may be intermittent.',
        type: 'system',
        timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
        isRead: false,
        priority: 'medium'
      },
      {
        title: 'Reminder',
        message: 'Your favorite bus #107 on Route 5 is arriving in 10 minutes at your stop.',
        type: 'reminder',
        timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
        isRead: true,
        route: 'Route 5',
        busNumber: '107',
        priority: 'low'
      },
      {
        title: 'Safety Update',
        message: 'Enhanced safety protocols implemented across all routes. Face masks recommended.',
        type: 'safety',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
        isRead: true,
        priority: 'medium'
      },
      {
        title: 'Weather Alert',
        message: 'Severe weather may affect bus schedules today. Allow extra travel time.',
        type: 'alert',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
        isRead: true,
        priority: 'high'
      },
      {
        title: 'QR Boarding Available',
        message: 'All buses now support QR code boarding. Scan to access live bus information.',
        type: 'update',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1, // 1 day ago
        isRead: false,
        priority: 'medium'
      },
      {
        title: 'New Feature: Live Tracking',
        message: 'Real-time bus tracking is now available for all routes in the app.',
        type: 'update',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
        isRead: true,
        priority: 'low'
      },
    ];

    try {
      // Add each notification to Firebase
      for (const notification of mockNotifications) {
        const newNotificationRef = push(notificationsRef);
        await set(newNotificationRef, notification);
      }
      Alert.alert('Success', 'Mock notifications added to database');
    } catch (error) {
      console.error('Error adding mock notifications:', error);
      Alert.alert('Error', 'Failed to add mock notifications');
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const notificationRef = ref(database, `notifications/${id}`);
      await update(notificationRef, { isRead: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      Alert.alert('Error', 'Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const updates: { [key: string]: any } = {};
      notifications.forEach(notification => {
        updates[`notifications/${notification.id}/isRead`] = true;
      });
      await update(ref(database), updates);
      Alert.alert('Success', 'All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      Alert.alert('Error', 'Failed to mark all notifications as read');
    }
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await set(notificationsRef, null);
              Alert.alert('Success', 'All notifications cleared');
            } catch (error) {
              console.error('Error clearing notifications:', error);
              Alert.alert('Error', 'Failed to clear notifications');
            }
          },
        },
      ]
    );
  };

  const deleteNotification = async (id: string) => {
    try {
      const notificationRef = ref(database, `notifications/${id}`);
      await remove(notificationRef);
    } catch (error) {
      console.error('Error deleting notification:', error);
      Alert.alert('Error', 'Failed to delete notification');
    }
  };

  const getNotificationIcon = (type: NotificationType): string => {
    const icons = {
      alert: 'warning',
      update: 'refresh',
      system: 'settings',
      reminder: 'time',
      safety: 'shield-checkmark',
    };
    return icons[type];
  };

  const getNotificationColor = (type: NotificationType): string => {
    const colors = {
      alert: '#EF4444',
      update: '#10B981',
      system: '#6B7280',
      reminder: '#F59E0B',
      safety: '#8B5CF6',
    };
    return colors[type];
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
    const colors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444',
    };
    return colors[priority];
  };

  const getTimeAgo = (timestamp: Date | number): string => {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Load notifications when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification,
      ]}
      onPress={() => markAsRead(item.id)}
      onLongPress={() => {
        Alert.alert(
          'Notification Options',
          'What would you like to do?',
          [
            {
              text: item.isRead ? 'Mark as Unread' : 'Mark as Read',
              onPress: () => markAsRead(item.id),
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => deleteNotification(item.id),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      }}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <View style={styles.titleContainer}>
            <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(item.type) }]}>
              <Ionicons name={getNotificationIcon(item.type) as any} size={16} color="#fff" />
            </View>
            <Text style={[
              styles.notificationTitle,
              !item.isRead && styles.unreadTitle
            ]}>
              {item.title}
            </Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
              <Text style={styles.priorityText}>{item.priority}</Text>
            </View>
          </View>
          <Text style={styles.timestamp}>
            {getTimeAgo(item.timestamp)}
          </Text>
        </View>
        
        <Text style={styles.notificationMessage}>
          {item.message}
        </Text>
        
        {(item.route || item.busNumber) && (
          <View style={styles.metaContainer}>
            {item.route && (
              <View style={styles.metaItem}>
                <Ionicons name="bus" size={12} color="#007AFF" />
                <Text style={styles.metaText}>{item.route}</Text>
              </View>
            )}
            {item.busNumber && (
              <View style={styles.metaItem}>
                <Ionicons name="location" size={12} color="#007AFF" />
                <Text style={styles.metaText}>Bus #{item.busNumber}</Text>
              </View>
            )}
          </View>
        )}
      </View>
      
      {!item.isRead && (
        <View style={styles.unreadIndicator} />
      )}
    </TouchableOpacity>
  );

  // Add this button to your header or settings for initial data setup
  const renderDevButton = () => (
    <TouchableOpacity 
      style={styles.devButton}
      onPress={addMockNotifications}
    >
      <Text style={styles.devButtonText}>Add Mock Data</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <LinearGradient
        colors={['#4F46E5', '#7C73E6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              Notifications
            </Text>
            {unreadCount > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <View style={styles.headerButtons}>
            {unreadCount > 0 && (
              <TouchableOpacity onPress={markAllAsRead} style={styles.headerButton}>
                <Ionicons name="checkmark-done" size={20} color="#fff" />
              </TouchableOpacity>
            )}
            {notifications.length > 0 && (
              <TouchableOpacity onPress={clearAllNotifications} style={styles.headerButton}>
                <Ionicons name="trash" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'unread' && styles.activeFilterTab]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterText, filter === 'unread' && styles.activeFilterText]}>
            Unread
          </Text>
          {unreadCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="notifications" size={64} color="#4F46E5" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : filteredNotifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off" size={64} color="#cbd5e1" />
          <Text style={styles.emptyStateTitle}>
            {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
          </Text>
          <Text style={styles.emptyStateMessage}>
            {filter === 'unread' 
              ? 'You\'re all caught up! New unread notifications will appear here.'
              : 'You don\'t have any notifications yet.'
            }
          </Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={loadNotifications}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
          {/* Development button - remove in production */}
          {renderDevButton()}
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadNotifications}
              colors={['#4F46E5']}
              tintColor="#4F46E5"
            />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F0',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: '#291C0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E1D4C2',
    marginRight: 8,
  },
  headerBadge: {
    backgroundColor: '#6E473B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadgeText: {
    color: '#E1D4C2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F5F0',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 141, 120, 0.2)',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 16,
    borderRadius: 20,
  },
  activeFilterTab: {
    backgroundColor: '#6E473B',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6E473B',
  },
  activeFilterText: {
    color: '#E1D4C2',
  },
  filterBadge: {
    backgroundColor: '#6E473B',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  filterBadgeText: {
    color: '#E1D4C2',
    fontSize: 10,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    marginHorizontal: 24,
    shadowColor: '#291C0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#E1D4C2',
  },
  unreadNotification: {
    borderLeftColor: '#6E473B',
    backgroundColor: '#F8F5F0',
  },
  notificationContent: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#291C0E',
    marginRight: 8,
  },
  unreadTitle: {
    color: '#291C0E',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    color: '#E1D4C2',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  timestamp: {
    fontSize: 12,
    color: '#6E473B',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#291C0E',
    lineHeight: 20,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1D4C2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#6E473B',
    marginLeft: 4,
    fontWeight: '500',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6E473B',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#291C0E',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#6E473B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#6E473B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  refreshButtonText: {
    color: '#E1D4C2',
    fontSize: 16,
    fontWeight: '600',
  },
  devButton: {
    backgroundColor: '#6E473B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  devButtonText: {
    color: '#E1D4C2',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6E473B',
    marginTop: 16,
  },
});

export default NotificationScreen;