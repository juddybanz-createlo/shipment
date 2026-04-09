import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CheckCircle2,
  AlertCircle,
  Layout,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useLogistics } from '../../lib/LogisticsContext';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from '../ui/dialog';
import Receipt from '../shared/Receipt';

export default function UserDashboard() {
  const { shipments, currentUser, claimShipment } = useLogistics();
  const [claimCode, setClaimCode] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);

  const userShipments = shipments.filter(s => s.claimedBy === currentUser?.email);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please login to claim shipments');
      return;
    }
    
    const success = claimShipment(claimCode, currentUser.email);
    if (success) {
      toast.success('Shipment claimed successfully!');
      setClaimCode('');
      setIsClaiming(false);
    } else {
      toast.error('Invalid tracking code or shipment already claimed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900">My Shipments</h2>
          <p className="text-slate-500">Manage and monitor your claimed consignments.</p>
        </div>
        <Button 
          onClick={() => setIsClaiming(!isClaiming)}
          className="bg-brand-600 hover:bg-brand-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Claim New Shipment
        </Button>
      </div>

      <AnimatePresence>
        {isClaiming && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-brand-50 border-brand-100 mb-8">
              <CardContent className="p-6">
                <form onSubmit={handleClaim} className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Enter Tracking Code (e.g. GLX-XXXXXXXX)" 
                      className="pl-10 bg-white"
                      value={claimCode}
                      onChange={(e) => setClaimCode(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="bg-brand-600 text-white">Claim Shipment</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {userShipments.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 bg-transparent py-20">
          <CardContent className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Package className="h-8 w-8 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display font-semibold text-slate-900">No shipments found</h3>
              <p className="text-slate-500 max-w-xs">
                You haven't claimed any shipments yet. Enter a tracking code to start monitoring.
              </p>
            </div>
            <Button variant="outline" onClick={() => setIsClaiming(true)}>Claim your first shipment</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {userShipments.map((shipment) => (
            <motion.div
              key={shipment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-none shadow-lg shadow-slate-200/50 bg-white overflow-hidden group hover:shadow-xl transition-all">
                <CardHeader className="bg-slate-900 text-white p-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Tracking ID</p>
                      <h4 className="text-lg font-display font-bold">{shipment.trackingNumber}</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <Dialog 
                        open={selectedShipmentId === shipment.id} 
                        onOpenChange={(open) => setSelectedShipmentId(open ? shipment.id : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-400 hover:text-white hover:bg-white/10">
                            <FileText className="h-4 w-4 mr-1.5" />
                            Receipt
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl p-0 border-none bg-transparent shadow-none">
                          <DialogHeader className="sr-only">
                            <DialogTitle>Shipment Receipt</DialogTitle>
                            <DialogDescription>Official receipt for shipment {shipment.trackingNumber}</DialogDescription>
                          </DialogHeader>
                          <Receipt shipment={shipment} onClose={() => setSelectedShipmentId(null)} />
                        </DialogContent>
                      </Dialog>
                      <Badge className="bg-brand-500">{shipment.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From</p>
                      <p className="font-semibold text-slate-900">{shipment.origin}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300" />
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">To</p>
                      <p className="font-semibold text-slate-900">{shipment.destination}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-brand-500" />
                        Latest Activity
                      </h5>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(shipment.updates[0].date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-slate-900">{shipment.updates[0].status}</p>
                      <p className="text-xs text-slate-500 mt-1">{shipment.updates[0].description}</p>
                      <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {shipment.updates[0].location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
