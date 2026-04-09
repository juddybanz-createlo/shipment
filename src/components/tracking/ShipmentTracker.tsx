import { Search, Package, ArrowRight, MapPin, Clock, CheckCircle2, AlertCircle, Box, Scale, Maximize, FileText } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLogistics } from '../../lib/LogisticsContext';
import { Shipment } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from '../ui/dialog';
import Receipt from '../shared/Receipt';

export default function ShipmentTracker() {
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState<Shipment | null>(null);
  const [error, setError] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const { shipments } = useLogistics();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Search in the global context shipments (which includes newly created ones)
    const shipment = shipments.find(s => s.trackingNumber.trim().toUpperCase() === trackingId.trim().toUpperCase());
    if (shipment) {
      setResult(shipment);
    } else {
      setResult(null);
      setError('Tracking number not found. Please check and try again.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-display font-bold tracking-tight text-slate-900">Track Your Shipment</h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Enter your tracking number to get real-time updates on your consignment's journey.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="GLX-XXXXXXXX" 
            className="pl-10 h-12 bg-white border-slate-200 focus:ring-brand-500"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
        </div>
        <Button type="submit" className="h-12 px-8 bg-brand-600 hover:bg-brand-700 text-white font-medium">
          Track
        </Button>
      </form>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700 max-w-md mx-auto"
          >
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tracking Number</p>
                    <CardTitle className="text-2xl font-display">{result.trackingNumber}</CardTitle>
                  </div>
                  <div className="flex items-center gap-3">
                    <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg border-slate-200 hover:bg-slate-50">
                          <FileText className="h-4 w-4 mr-2 text-slate-400" />
                          View Receipt
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl p-0 border-none bg-transparent shadow-none">
                        <DialogHeader className="sr-only">
                          <DialogTitle>Shipment Receipt</DialogTitle>
                          <DialogDescription>Official receipt for shipment {result.trackingNumber}</DialogDescription>
                        </DialogHeader>
                        <Receipt shipment={result} onClose={() => setShowReceipt(false)} />
                      </DialogContent>
                    </Dialog>
                    <Badge className={`px-4 py-1 text-sm font-medium ${
                      result.status === 'Delivered' ? 'bg-emerald-500' : 'bg-brand-500'
                    }`}>
                      {result.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Origin</span>
                    </div>
                    <p className="font-medium text-slate-900">{result.origin}</p>
                    <p className="text-sm text-slate-500">{result.sender}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="h-px bg-slate-100 flex-1 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                        <Package className="h-5 w-5 text-brand-500" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="flex items-center gap-2 text-slate-400 justify-end">
                      <span className="text-xs font-semibold uppercase tracking-wider">Destination</span>
                      <MapPin className="h-4 w-4" />
                    </div>
                    <p className="font-medium text-slate-900">{result.destination}</p>
                    <p className="text-sm text-slate-500">{result.receiver}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Scale className="h-3 w-3" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Weight</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{result.weight || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Maximize className="h-3 w-3" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Dimensions</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{result.dimensions || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Box className="h-3 w-3" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Type</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{result.packageType || 'Standard'}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="h-3 w-3" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Est. Delivery</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{new Date(result.estimatedDelivery).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {result.packageImage && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Package Photo</h4>
                        <div className="aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                          <img 
                            src={result.packageImage} 
                            alt="Package" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-6">
                      <h3 className="font-display font-semibold text-lg text-slate-900 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-slate-400" />
                        Shipment History
                      </h3>
                      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                        {result.updates.map((update, idx) => (
                          <div key={idx} className="relative flex items-start gap-6 pl-12">
                            <div className={`absolute left-0 mt-1.5 h-10 w-10 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
                              idx === 0 ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-400'
                            }`}>
                              <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
                                <p className="font-semibold text-slate-900">{update.status}</p>
                                <time className="text-xs font-mono text-slate-400">
                                  {new Date(update.date).toLocaleString()}
                                </time>
                              </div>
                              <p className="text-sm text-slate-600">{update.description}</p>
                              <p className="text-xs text-slate-400 mt-1">{update.location}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6">
                      <h4 className="font-display font-bold text-xl">Shipment Description</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {result.description || 'No additional description provided for this shipment.'}
                      </p>
                      <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Total Cost</span>
                        <span className="text-2xl font-display font-bold text-brand-400">${result.cost || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
