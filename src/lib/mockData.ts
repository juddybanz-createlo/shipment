import { Shipment, Flight } from '../types';

export const mockShipments: Shipment[] = [
  {
    id: '1',
    trackingNumber: 'GLX-77283941',
    sender: 'TechCorp Solutions',
    receiver: 'Global Logistics Hub',
    origin: 'San Francisco, USA',
    destination: 'London, UK',
    status: 'In Transit',
    estimatedDelivery: '2026-04-12T14:00:00Z',
    updates: [
      {
        date: '2026-04-09T08:00:00Z',
        location: 'San Francisco, USA',
        status: 'Picked Up',
        description: 'Shipment picked up from sender',
      },
      {
        date: '2026-04-09T12:30:00Z',
        location: 'SFO International Airport',
        status: 'Processed',
        description: 'Arrived at sorting facility',
      },
    ],
  },
  {
    id: '2',
    trackingNumber: 'GLX-11223344',
    sender: 'Fashion Forward',
    receiver: 'Retail Express',
    origin: 'Milan, Italy',
    destination: 'New York, USA',
    status: 'Delivered',
    estimatedDelivery: '2026-04-08T10:00:00Z',
    updates: [
      {
        date: '2026-04-08T10:00:00Z',
        location: 'New York, USA',
        status: 'Delivered',
        description: 'Package delivered to front desk',
      },
    ],
  },
];

export const mockFlights: Flight[] = [
  {
    id: 'f1',
    flightNumber: 'GL882',
    airline: 'GlobalLogix Air',
    origin: 'JFK',
    destination: 'LHR',
    status: 'Active',
    departureTime: '2026-04-09T10:00:00Z',
    arrivalTime: '2026-04-09T22:00:00Z',
    aircraft: 'Boeing 777-300ER',
  },
  {
    id: 'f2',
    flightNumber: 'GL104',
    airline: 'GlobalLogix Air',
    origin: 'DXB',
    destination: 'SIN',
    status: 'Scheduled',
    departureTime: '2026-04-10T04:00:00Z',
    arrivalTime: '2026-04-10T11:30:00Z',
    aircraft: 'Airbus A350-900',
  },
];
