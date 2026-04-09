import React, { createContext, useContext, useState, useEffect } from 'react';
import { Shipment, Flight, User } from '../types';
import { mockShipments, mockFlights } from './mockData';

interface LogisticsContextType {
  shipments: Shipment[];
  flights: Flight[];
  currentUser: User | null;
  addShipment: (shipment: Shipment) => void;
  updateShipment: (id: string, updates: Partial<Shipment>) => void;
  addFlight: (flight: Flight) => void;
  claimShipment: (trackingNumber: string, userEmail: string) => boolean;
  login: (email: string, name: string, role: 'customer' | 'admin') => void;
  logout: () => void;
}

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined);

export function LogisticsProvider({ children }: { children: React.ReactNode }) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize from localStorage or mock data
  useEffect(() => {
    const savedShipments = localStorage.getItem('glx_shipments');
    const savedFlights = localStorage.getItem('glx_flights');
    const savedUser = localStorage.getItem('glx_user');

    if (savedShipments) {
      setShipments(JSON.parse(savedShipments));
    } else {
      setShipments(mockShipments);
    }

    if (savedFlights) {
      setFlights(JSON.parse(savedFlights));
    } else {
      setFlights(mockFlights);
    }

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Persist changes
  useEffect(() => {
    if (shipments.length > 0) {
      localStorage.setItem('glx_shipments', JSON.stringify(shipments));
    }
  }, [shipments]);

  useEffect(() => {
    if (flights.length > 0) {
      localStorage.setItem('glx_flights', JSON.stringify(flights));
    }
  }, [flights]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('glx_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('glx_user');
    }
  }, [currentUser]);

  const addShipment = (shipment: Shipment) => {
    setShipments(prev => [...prev, shipment]);
  };

  const updateShipment = (id: string, updates: Partial<Shipment>) => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addFlight = (flight: Flight) => {
    setFlights(prev => [...prev, flight]);
  };

  const claimShipment = (trackingNumber: string, userEmail: string) => {
    const shipment = shipments.find(s => s.trackingNumber.trim().toUpperCase() === trackingNumber.trim().toUpperCase());
    if (shipment && !shipment.claimedBy) {
      updateShipment(shipment.id, { claimedBy: userEmail });
      return true;
    }
    return false;
  };

  const login = (email: string, name: string, role: 'customer' | 'admin') => {
    setCurrentUser({ id: Math.random().toString(36).substr(2, 9), email, name, role });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <LogisticsContext.Provider value={{ 
      shipments, 
      flights, 
      currentUser, 
      addShipment, 
      updateShipment, 
      addFlight, 
      claimShipment,
      login,
      logout
    }}>
      {children}
    </LogisticsContext.Provider>
  );
}

export function useLogistics() {
  const context = useContext(LogisticsContext);
  if (context === undefined) {
    throw new Error('useLogistics must be used within a LogisticsProvider');
  }
  return context;
}
