// src/context/TrackingContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface Bus {
  id: string;
  route: string;
  currentLocation: string;
  arrivalTime: string;
  passengerLoad: number;
  status?: string;
  nextStop?: string;
  progress?: number;
}

interface TrackingContextType {
  currentBus: Bus | null;
  nearbyBuses: Bus[];
  isLoading: boolean;
}

export const TrackingContext = createContext<TrackingContextType>({
  currentBus: null,
  nearbyBuses: [],
  isLoading: false,
});

export const TrackingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentBus] = useState<Bus | null>({
    id: '1',
    route: 'Route 101',
    currentLocation: 'Downtown Station',
    arrivalTime: '5',
    passengerLoad: 60,
    status: 'moving',
    nextStop: 'University',
    progress: 65
  });

  const [nearbyBuses] = useState<Bus[]>([
    {
      id: '1',
      route: 'Route 101',
      currentLocation: 'Main Street',
      arrivalTime: '3',
      passengerLoad: 85
    },
    {
      id: '2',
      route: 'Route 202',
      currentLocation: 'City Center',
      arrivalTime: '7',
      passengerLoad: 45
    },
    {
      id: '3',
      route: 'Route 303',
      currentLocation: 'Park Avenue',
      arrivalTime: '12',
      passengerLoad: 70
    }
  ]);

  const isLoading = false;

  return (
    <TrackingContext.Provider value={{ currentBus, nearbyBuses, isLoading }}>
      {children}
    </TrackingContext.Provider>
  );
};