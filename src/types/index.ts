export type ShipmentStatus = 
  | 'Pending' 
  | 'Picked Up'
  | 'Warehouse' 
  | 'Carrier 1' 
  | 'Carrier 2' 
  | 'Carrier 5' 
  | 'Customs' 
  | 'In Transit' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'On Hold';

export interface ShipmentUpdate {
  date: string;
  location: string;
  status: string;
  description: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  sender: string;
  receiver: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  estimatedDelivery: string;
  updates: ShipmentUpdate[];
  claimedBy?: string; // User email or ID
  cost?: number;
  weight?: string;
  dimensions?: string;
  packageType?: string;
  packageImage?: string; // Base64 or URL
  description?: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  status: 'Scheduled' | 'Active' | 'Landed' | 'Delayed';
  departureTime: string;
  arrivalTime: string;
  aircraft: string;
  cost?: number;
  capacity?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}
