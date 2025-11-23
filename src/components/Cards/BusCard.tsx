// src/components/Cards/BusCard.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Bus } from '../../types';
import PassengerLoadIndicator from '../Map/PassengerLoadIndicator';

interface BusCardProps {
  bus: Bus;
  compact?: boolean;
  onPress: () => void;
}

const BusCard: React.FC<BusCardProps> = ({ bus, compact = false, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.container, compact && styles.compact]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.routeInfo}>
          <Text style={styles.routeNumber}>Route {bus.routeNumber}</Text>
          <Text style={styles.destination}>{bus.destination}</Text>
        </View>
        <View style={styles.statusIndicator}>
          <View 
            style={[
              styles.statusDot,
              { backgroundColor: bus.status === 'active' ? '#34A853' : '#EA4335' }
            ]} 
          />
          <Text style={styles.statusText}>
            {bus.status === 'active' ? 'On Time' : 'Delayed'}
          </Text>
        </View>
      </View>
      
      {!compact && (
        <>
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Next Stop</Text>
              <Text style={styles.detailValue}>{bus.nextStop}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Arrival</Text>
              <Text style={styles.detailValue}>{bus.arrivalTime}</Text>
            </View>
            <PassengerLoadIndicator 
              passengerCount={bus.passengerCount}
              capacity={bus.capacity}
            />
          </View>
        </>
      )}
      
      <View style={styles.footer}>
        <Text style={styles.driver}>Driver: {bus.driverName}</Text>
        <Text style={styles.distance}>{bus.distance} away</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#1a73e8',
  },
  compact: {
    padding: 12,
    minWidth: 280,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  routeInfo: {
    flex: 1,
  },
  routeNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  destination: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  driver: {
    fontSize: 12,
    color: '#666',
  },
  distance: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '600',
  },
});

export default BusCard;