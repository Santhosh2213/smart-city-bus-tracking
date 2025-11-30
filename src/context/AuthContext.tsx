// src/context/AuthContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { useRouter } from 'expo-router';

interface User {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    address: '123 Main Street, Chennai'
  });
  const router = useRouter();

  const login = (email: string, password: string) => {
    setUser({ 
      name: 'John Doe', 
      email,
      phone: '+1 234 567 8900',
      address: '123 Main Street, Chennai'
    });
    router.replace('/(tabs)');
  };

  const logout = () => {
    setUser(null);
    router.replace('/login');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};