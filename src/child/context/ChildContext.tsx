import React, { createContext, useState, useContext } from "react";
import uuid from "react-native-uuid";

const ChildContext = createContext(null);

export function ChildProvider({ children }) {
  const [linkedChild, setLinkedChild] = useState(null);
  const [generatedOTP, setGeneratedOTP] = useState("");

  const generateOTP = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(newOtp);
    return newOtp;
  };

  const linkChild = (childData) => {
    setLinkedChild(childData);
  };

  return (
    <ChildContext.Provider value={{ generatedOTP, generateOTP, linkedChild, linkChild }}>
      {children}
    </ChildContext.Provider>
  );
}

export const useChild = () => useContext(ChildContext);
