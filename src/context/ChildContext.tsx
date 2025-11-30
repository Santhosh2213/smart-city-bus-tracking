import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";

type ChildInfo = {
  id: string;
  name: string;
  routeId: string;
  stopName: string;
  busNumber: string;
};

type LinkSession = {
  sessionId: string;
  otp: string;
  expiresAt: number;
  verified: boolean;
};

type ArrivalStatus = {
  boardedAt?: string;
  reachedAt?: string;
  nextStopEta?: string;
  message: string;
};

type ChildContextType = {
  child: ChildInfo;
  link?: LinkSession;
  arrival: ArrivalStatus;
  location: { lat: number; lng: number } | null;
  createNewSession: () => void;
  generateOtpFromScan: (sessionId: string, childId: string) => string;
  verifyOtp: (code: string) => boolean;
};

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export const useChild = () => {
  const ctx = useContext(ChildContext);
  if (!ctx) throw new Error("useChild must be used inside ChildProvider");
  return ctx;
};

// helper
const randomOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const ChildProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // normally from backend after login:
  const [child] = useState<ChildInfo>({
    id: "child_001",
    name: "Aarav",
    routeId: "R-12",
    stopName: "Anna Nagar 3rd Stop",
    busNumber: "TN09 AB 1234",
  });

  const [link, setLink] = useState<LinkSession | undefined>();
  const [arrival, setArrival] = useState<ArrivalStatus>({
    message: "Link your child to start tracking.",
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  // Create a new QR session (called when child logs in / taps refresh)
  const createNewSession = () => {
    const sessionId = `session_${Date.now()}`;
    setLink({
      sessionId,
      otp: "",
      expiresAt: 0,
      verified: false,
    });
    setArrival({
      message: "Session created. Ask parent to scan your QR.",
    });
  };

  // Called by parent app after scanning QR
  const generateOtpFromScan = (sessionId: string, childId: string) => {
    if (!link || link.sessionId !== sessionId || child.id !== childId) {
      Alert.alert("Invalid QR", "This session is not valid or expired.");
      return "";
    }
    const otp = randomOtp();
    setLink({
      sessionId,
      otp,
      expiresAt: Date.now() + 60_000, // 60 seconds
      verified: false,
    });
    setArrival({
      message: "OTP generated. Enter it on parent mobile to complete linking.",
    });
    return otp;
  };

  const verifyOtp = (code: string) => {
    if (!link) return false;
    if (Date.now() > link.expiresAt) {
      Alert.alert("OTP expired", "Please scan the QR again.");
      setArrival({ message: "OTP expired. Generate again." });
      return false;
    }
    if (code !== link.otp) {
      Alert.alert("Wrong OTP", "Please try again.");
      return false;
    }
    setLink({ ...link, verified: true });
    setArrival({
      boardedAt: new Date().toLocaleTimeString(),
      message: "Child linked successfully. Live tracking active.",
    });
    return true;
  };

  // Location tracking (for arrival ETA – here we just use device GPS)
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission not granted");
        return;
      }

      const watcher = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 20 },
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });

          if (link?.verified) {
            // Very simple fake ETA logic based on distance
            const distanceKm = 0.5; // pretend 500m away
            const speedKmph = 20; // assume 20 kmph
            const etaMinutes = Math.round((distanceKm / speedKmph) * 60);
            setArrival((prev) => ({
              ...prev,
              nextStopEta: `${etaMinutes} min`,
              message:
                etaMinutes <= 1
                  ? "Your child's stop is next. Be ready to receive."
                  : `Bus is ${etaMinutes} min away from ${child.stopName}.`,
            }));
          }
        }
      );

      return () => watcher.remove();
    })();
  }, [link?.verified]);

  return (
    <ChildContext.Provider
      value={{
        child,
        link,
        arrival,
        location,
        createNewSession,
        generateOtpFromScan,
        verifyOtp,
      }}
    >
      {children}
    </ChildContext.Provider>
  );
};

export default ChildProvider;

