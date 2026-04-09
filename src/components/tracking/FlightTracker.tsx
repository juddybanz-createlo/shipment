import { Plane, Search, MapPin, Clock, AlertCircle, Calendar, FileText } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLogistics } from '../../lib/LogisticsContext';
import { Flight } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from '../ui/dialog';
import FlightReceipt from '../shared/FlightReceipt';

export default function FlightTracker() {
  const [flightNo, setFlightNo] = useState('');
  const [result, setResult] = useState<Flight | null>(null);
  const [error, setError] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const { flights } = useLogistics();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const flight = flights.find(f => f.flightNumber.toLowerCase() === flightNo.toLowerCase());
    if (flight) {
      setResult(flight);
    } else {
      setResult(null);
      setError('Flight not found. Please check the flight number.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-display font-bold tracking-tight text-slate-900">Flight Tracking</h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Monitor the status of cargo flights and estimated arrival times.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
        <div className="relative flex-1">
          <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Flight Number (e.g. GL882)" 
            className="pl-10 h-12 bg-white border-slate-200 focus:ring-brand-500"
            value={flightNo}
            onChange={(e) => setFlightNo(e.target.value)}
          />
        </div>
        <Button type="submit" className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white font-medium">
          Track Flight
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
              <CardHeader className="border-b border-slate-50 p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center">
                      <Plane className="h-6 w-6 text-brand-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-display">{result.flightNumber}</CardTitle>
                      <p className="text-sm text-slate-500">{result.airline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg border-slate-200 hover:bg-slate-50">
                          <FileText className="h-4 w-4 mr-2 text-slate-400" />
                          View Manifest
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl p-0 border-none bg-transparent shadow-none">
                        <DialogHeader className="sr-only">
                          <DialogTitle>Flight Manifest</DialogTitle>
                          <DialogDescription>Official manifest for flight {result.flightNumber}</DialogDescription>
                        </DialogHeader>
                        <FlightReceipt flight={result} onClose={() => setShowReceipt(false)} />
                      </DialogContent>
                    </Dialog>
                    <Badge className={`px-4 py-1 ${
                      result.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-500'
                    }`}>
                      {result.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="flex gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-brand-500" />
                        <div className="flex-1 w-px bg-slate-100" />
                        <div className="h-3 w-3 rounded-full border-2 border-slate-300" />
                      </div>
                      <div className="space-y-8 flex-1">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Departure</p>
                          <p className="text-2xl font-display font-bold text-slate-900">{result.origin}</p>
                          <div className="flex items-center gap-2 text-slate-500">
                            <Clock className="h-3 w-3" />
                            <span className="text-sm">{new Date(result.departureTime).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Arrival</p>
                          <p className="text-2xl font-display font-bold text-slate-900">{result.destination}</p>
                          <div className="flex items-center gap-2 text-slate-500">
                            <Clock className="h-3 w-3" />
                            <span className="text-sm">{new Date(result.arrivalTime).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 bg-slate-50 rounded-2xl p-6">
                    <h4 className="font-semibold text-slate-900">Flight Details</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Aircraft</span>
                        <span className="text-sm font-medium text-slate-900">{result.aircraft}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Date</span>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span className="text-sm font-medium text-slate-900">
                            {new Date(result.departureTime).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Route</span>
                        <span className="text-sm font-medium text-slate-900">{result.origin} → {result.destination}</span>
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
