import React from 'react';
import { 
  Plane, 
  Download, 
  Printer, 
  Globe2, 
  MapPin, 
  Calendar,
  DollarSign,
  Clock,
  Navigation
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Flight } from '../../types';

interface FlightReceiptProps {
  flight: Flight;
  onClose?: () => void;
}

export default function FlightReceipt({ flight, onClose }: FlightReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-8 max-w-2xl mx-auto border border-slate-200 rounded-2xl shadow-2xl print:shadow-none print:border-none print:p-0">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-brand-600 rounded-xl flex items-center justify-center">
            <Plane className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">SwiftCargo</h1>
            <p className="text-xs text-slate-500 font-medium">Cargo Flight Manifest & Receipt</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-900">Manifest #{flight.flightNumber}</p>
          <p className="text-xs text-slate-500">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Flight Info */}
      <div className="grid grid-cols-2 gap-12 mb-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Origin Airport</p>
            <p className="font-semibold text-slate-900">{flight.origin}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Dep: {new Date(flight.departureTime).toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Destination Airport</p>
            <p className="font-semibold text-slate-900">{flight.destination}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Arr: {new Date(flight.arrivalTime).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Flight Details</p>
            <p className="font-mono font-bold text-brand-600">{flight.flightNumber}</p>
            <p className="text-xs text-slate-500">{flight.airline}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aircraft Type</p>
            <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
              <Navigation className="h-3 w-3 text-slate-400" />
              {flight.aircraft}
            </p>
          </div>
        </div>
      </div>

      {/* Cargo Details */}
      <div className="bg-slate-50 rounded-2xl p-6 mb-8">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-brand-500" />
          Cargo Capacity Info
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Capacity</p>
            <p className="text-sm font-semibold text-slate-900">{flight.capacity || 'Standard Cargo'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
            <p className="text-sm font-semibold text-brand-600">{flight.status}</p>
          </div>
        </div>
      </div>

      {/* Financials */}
      <div className="space-y-3 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Freight Base Rate</span>
          <span className="font-medium text-slate-900">${((flight.cost || 0) * 0.85).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Airport Fees</span>
          <span className="font-medium text-slate-900">${((flight.cost || 0) * 0.1).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Handling Charges</span>
          <span className="font-medium text-slate-900">${((flight.cost || 0) * 0.05).toFixed(2)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between items-center">
          <span className="text-base font-bold text-slate-900">Total Booking Cost</span>
          <span className="text-2xl font-display font-bold text-brand-600">${(flight.cost || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-2">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">SwiftCargo Aviation Logistics</p>
        <p className="text-[10px] text-slate-400">This document serves as an official cargo manifest receipt.</p>
      </div>

      {/* Actions (Hidden on print) */}
      <div className="mt-12 flex gap-4 print:hidden">
        <Button onClick={handlePrint} className="flex-1 bg-slate-900 text-white hover:bg-slate-800">
          <Printer className="h-4 w-4 mr-2" />
          Print Manifest
        </Button>
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
