// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { 
  getDatabase, 
  ref, 
  push, 
  set, 
  onValue, 
  off, 
  query, 
  orderByChild, 
  limitToLast,
  get,
  update,
  remove 
} from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB9e6kIsD1erXsdrNsslogIy-YMX6KrT-U",
  authDomain: "smart-bus-tracking-3f284.firebaseapp.com",
  databaseURL: "https://smart-bus-tracking-3f284-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-bus-tracking-3f284",
  storageBucket: "smart-bus-tracking-3f284.firebasestorage.app",
  messagingSenderId: "551840014048",
  appId: "1:551840014048:web:3fa7a741b9e30c642f7a85",
  measurementId: "G-Z0XZDSKZB9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Tamil Nadu Cities Data
export const TAMILNADU_CITIES = {
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Coimbatore": { lat: 11.0168, lng: 76.9558 },
  "Madurai": { lat: 9.9252, lng: 78.1198 },
  "Trichy": { lat: 10.7905, lng: 78.7047 },
  "Salem": { lat: 11.6643, lng: 78.1460 },
  "Tirunelveli": { lat: 8.7139, lng: 77.7567 },
  "Vellore": { lat: 12.9165, lng: 79.1325 },
  "Erode": { lat: 11.3410, lng: 77.7172 },
  "Kanyakumari": { lat: 8.0883, lng: 77.5385 },
  "Ooty": { lat: 11.4102, lng: 76.6950 },
  "Villupuram": { lat: 11.9398, lng: 79.4928 },
  "Dindigul": { lat: 10.3629, lng: 77.9755 },
  "Virudhunagar": { lat: 9.5827, lng: 77.9570 },
  "Krishnagiri": { lat: 12.5190, lng: 78.2130 },
  "Chengalpattu": { lat: 12.6829, lng: 79.9769 }
};

// Database Collection References
export const DB_COLLECTIONS = {
  BUSES: 'buses',
  ROUTES: 'routes',
  SCHEDULES: 'schedules',
  USERS: 'users',
  TICKETS: 'tickets',
  ALERTS: 'alerts',
  EMERGENCY_ALERTS: 'emergencyAlerts',
  CHECKINS: 'checkIns',
  NOTIFICATIONS: 'notifications'
};

// Firebase Database Service Functions
export const databaseService = {
  // Check-in related functions
  addCheckIn: async (userId: string, busId: string, checkInData: any) => {
    const checkInsRef = ref(database, 'checkIns');
    const newCheckInRef = push(checkInsRef);
    await set(newCheckInRef, {
      ...checkInData,
      id: newCheckInRef.key,
      userId,
      busId,
      timestamp: new Date().toISOString(),
      active: true
    });
    return newCheckInRef.key;
  },

  logScan: async (busId: string, userId: string) => {
    const scansRef = ref(database, `scans/${busId}`);
    const newScanRef = push(scansRef);
    await set(newScanRef, {
      userId,
      busId,
      timestamp: Date.now()
    });
  },

  addOrUpdateBus: async (busId: string, busData: any) => {
    const busRef = ref(database, `buses/${busId}`);
    await set(busRef, busData);
  },

  listenToBusUpdates: (busId: string, callback: (data: any) => void) => {
    const busRef = ref(database, `buses/${busId}`);
    return onValue(busRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      }
    });
  },

  updateCheckInStatus: async (checkInId: string, active: boolean) => {
    const checkInRef = ref(database, `checkIns/${checkInId}`);
    await update(checkInRef, {
      active,
      checkOutTime: !active ? new Date().toISOString() : null
    });
  }
};

// Export everything
export { 
  app, 
  database, 
  auth 
};

// Export Firebase functions for direct use
export { 
  ref, 
  push, 
  set, 
  onValue, 
  off, 
  query, 
  orderByChild, 
  limitToLast,
  get,
  update,
  remove 
};