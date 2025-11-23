// /src/navigation/types.ts

// Root Stack Param List
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
    Modal: { screen: keyof MainTabParamList; params?: any };
    NotFound: undefined;
  };
  
  // Auth Stack Param List
  export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    Welcome: undefined;
  };
  
  // Main Tab Param List
  export type MainTabParamList = {
    Home: undefined;
    Tracking: undefined;
    Schedule: undefined;
    QR: undefined;
    Profile: undefined;
  };
  
  // Home Stack Param List
  export type HomeStackParamList = {
    HomeMain: undefined;
    Notifications: undefined;
    QuickActions: undefined;
  };
  
  // Tracking Stack Param List
  export type TrackingStackParamList = {
    LiveTracking: undefined;
    BusDetails: { busId: string; bus?: Bus };
    OfflineMap: undefined;
    RouteMap: { routeId: string };
  };
  
  // Schedule Stack Param List
  export type ScheduleStackParamList = {
    BusSchedule: undefined;
    RouteFinder: undefined;
    TripScheduler: undefined;
    ScheduleDetails: { scheduleId: string };
  };
  
  // QR Stack Param List
  export type QRStackParamList = {
    QRScan: undefined;
    QRHistory: undefined;
    QRDetails: { qrData: string };
  };
  
  // Profile Stack Param List
  export type ProfileStackParamList = {
    ProfileMain: undefined;
    Settings: undefined;
    ChildMode: undefined;
    SOS: undefined;
    EmergencyContacts: undefined;
  };
  
  // Child Mode Stack Param List
  export type ChildModeStackParamList = {
    ChildModeMain: undefined;
    ChildLiveTracking: { childId: string };
    ChildArrival: { childId: string };
    AddChild: undefined;
    ChildSettings: { childId: string };
  };
  
  // Data Types
  export interface Bus {
    id: string;
    route: string;
    number: string;
    currentLocation: string;
    nextStop: string;
    arrivalTime: number;
    passengerLoad: number;
    status: 'moving' | 'stopped' | 'delayed';
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }
  
  export interface Schedule {
    id: string;
    route: string;
    busNumber: string;
    departureTime: string;
    arrivalTime: string;
    from: string;
    to: string;
    status: 'on_time' | 'delayed' | 'cancelled';
    delay?: number;
  }
  
  export interface Child {
    id: string;
    name: string;
    age: number;
    school: string;
    busRoute: string;
    busNumber: string;
    pickupTime: string;
    dropoffTime: string;
    isOnBus: boolean;
  }
  
  export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'emergency' | 'delay' | 'safety';
    timestamp: Date;
    read: boolean;
  }
  
  // Extend React Navigation types
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }