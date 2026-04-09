import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Globe2, 
  Package, 
  MapPin, 
  Calendar,
  DollarSign,
  Scale,
  Maximize
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Shipment } from '../../types';

interface ReceiptProps {
  shipment: Shipment;
  onClose?: () => void;
}

export default function Receipt({ shipment, onClose }: ReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-8 max-w-2xl mx-auto border border-slate-200 rounded-2xl shadow-2xl print:shadow-none print:border-none print:p-0">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-brand-600 rounded-xl flex items-center justify-center">
            <Globe2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">SwiftCargo</h1>
            <p className="text-xs text-slate-500 font-medium">Official Shipment Receipt</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-900">Receipt #{shipment.trackingNumber.split('-')[1]}</p>
          <p className="text-xs text-slate-500">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Shipment Info */}
      <div className="grid grid-cols-2 gap-12 mb-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sender</p>
            <p className="font-semibold text-slate-900">{shipment.sender}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {shipment.origin}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Receiver</p>
            <p className="font-semibold text-slate-900">{shipment.receiver}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {shipment.destination}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tracking Number</p>
            <p className="font-mono font-bold text-brand-600">{shipment.trackingNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shipment Date</p>
            <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400" />
              {new Date(shipment.updates[shipment.updates.length - 1].date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div className="bg-slate-50 rounded-2xl p-6 mb-8">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Package className="h-4 w-4 text-brand-500" />
          Package Specifications
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weight</p>
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
              <Scale className="h-3 w-3 text-slate-400" />
              {shipment.weight || 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dimensions</p>
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
              <Maximize className="h-3 w-3 text-slate-400" />
              {shipment.dimensions || 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</p>
            <p className="text-sm font-semibold text-slate-900">{shipment.packageType || 'Standard'}</p>
          </div>
        </div>
      </div>

      {/* Financials */}
      <div className="space-y-3 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Shipping Base Rate</span>
          <span className="font-medium text-slate-900">${((shipment.cost || 0) * 0.8).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Fuel Surcharge</span>
          <span className="font-medium text-slate-900">${((shipment.cost || 0) * 0.1).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Insurance & Handling</span>
          <span className="font-medium text-slate-900">${((shipment.cost || 0) * 0.1).toFixed(2)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between items-center">
          <span className="text-base font-bold text-slate-900">Total Amount Paid</span>
          <span className="text-2xl font-display font-bold text-brand-600">${(shipment.cost || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-2">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Thank you for choosing SwiftCargo</p>
        <p className="text-[10px] text-slate-400">This is a computer-generated document. No signature required.</p>
      </div>

      {/* Actions (Hidden on print) */}
      <div className="mt-12 flex gap-4 print:hidden">
        <Button onClick={handlePrint} className="flex-1 bg-slate-900 text-white hover:bg-slate-800">
          <Printer className="h-4 w-4 mr-2" />
          Print Receipt
        </Button>
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
