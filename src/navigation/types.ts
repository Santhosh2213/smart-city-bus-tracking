// src/navigation/types.ts
export type MainStackParamList = {
    Home: undefined;
    Profile: undefined;
    QRScan: undefined;
    SOS: undefined;
    ChildMode: undefined;
    OfflineMap: undefined;
    Notifications: undefined;
    BusDetails: { bus: any };
  };
  export type RootStackParamList = {
  // ... your existing routes
  Notification: undefined;
  // ... other routes
};

// If you have tab navigation
export type MainTabParamList = {
  // ... your existing tabs
  Notification: undefined;
  // ... other tabs
};