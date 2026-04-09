import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Package, 
  Plane, 
  Settings, 
  Search, 
  Edit3, 
  Trash2, 
  ArrowRight,
  Truck,
  Warehouse,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Upload,
  X,
  FileText,
  TrendingUp,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '../ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { useLogistics } from '../../lib/LogisticsContext';
import { Shipment, Flight, ShipmentStatus } from '../../types';
import { toast } from 'sonner';
import Receipt from '../shared/Receipt';
import FlightReceipt from '../shared/FlightReceipt';

export default function AdminPortal() {
  const { shipments, flights, addShipment, updateShipment, addFlight } = useLogistics();
  const [activeTab, setActiveTab] = useState<'shipments' | 'flights'>('shipments');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [selectedFlightReceiptId, setSelectedFlightReceiptId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredShipments = shipments.filter(s => 
    s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateShipment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let imageUrl = undefined;
    if (previewImage) {
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: previewImage }),
        });
        const data = await response.json();
        if (data.url) {
          imageUrl = data.url;
        }
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Failed to upload image to Cloudinary. Using local preview instead.");
        imageUrl = previewImage;
      }
    }

    const newShipment: Shipment = {
      id: Math.random().toString(36).substr(2, 9),
      trackingNumber: `GLX-${Math.floor(10000000 + Math.random() * 90000000)}`,
      sender: formData.get('sender') as string,
      receiver: formData.get('receiver') as string,
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      weight: formData.get('weight') as string,
      dimensions: formData.get('dimensions') as string,
      packageType: formData.get('packageType') as string,
      cost: Number(formData.get('cost')),
      description: formData.get('description') as string,
      packageImage: imageUrl,
      status: 'Pending',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      updates: [{
        date: new Date().toISOString(),
        location: formData.get('origin') as string,
        status: 'Pending',
        description: 'Shipment information received'
      }]
    };
    addShipment(newShipment);
    toast.success(`Shipment ${newShipment.trackingNumber} created successfully!`);
    setPreviewImage(null);
    (e.target as HTMLFormElement).reset();
  };

  const handleStatusUpdate = (id: string, newStatus: ShipmentStatus) => {
    const shipment = shipments.find(s => s.id === id);
    if (!shipment) return;

    const newUpdate = {
      date: new Date().toISOString(),
      location: 'Logistics Hub',
      status: newStatus,
      description: `Status updated to ${newStatus}`
    };

    updateShipment(id, { 
      status: newStatus,
      updates: [newUpdate, ...shipment.updates]
    });
    toast.info(`Status updated to ${newStatus}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900">Admin Control Center</h2>
          <p className="text-slate-500">Manage global logistics operations and tracking codes.</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'shipments' ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20">
                  <Plus className="h-4 w-4 mr-2" />
                  New Shipment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Shipment</DialogTitle>
                  <DialogDescription>Enter detailed shipment information and upload package photos.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[80vh] pr-4">
                <form onSubmit={handleCreateShipment} className="space-y-6 py-4">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Parties Involved</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Sender Name</label>
                        <Input name="sender" placeholder="Company A" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Receiver Name</label>
                        <Input name="receiver" placeholder="Company B" required />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Route Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Origin</label>
                        <Input name="origin" placeholder="City, Country" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Destination</label>
                        <Input name="destination" placeholder="City, Country" required />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Package Specifications</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Weight (kg)</label>
                        <Input name="weight" placeholder="e.g. 15.5" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Dimensions (cm)</label>
                        <Input name="dimensions" placeholder="e.g. 40x40x60" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Package Type</label>
                        <Input name="packageType" placeholder="e.g. Fragile Box" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Shipping Cost ($)</label>
                        <Input name="cost" type="number" step="0.01" placeholder="0.00" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input name="description" placeholder="Brief description of contents..." />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Package Photo</h4>
                    <div className="space-y-3">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleImageChange}
                      />
                      {!previewImage ? (
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <Camera className="h-5 w-5 text-slate-400" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-slate-900">Click to upload photo</p>
                            <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative group rounded-2xl overflow-hidden border border-slate-200">
                          <img src={previewImage} alt="Preview" className="w-full h-48 object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button 
                              type="button" 
                              variant="secondary" 
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Change
                            </Button>
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm"
                              onClick={() => setPreviewImage(null)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="submit" className="w-full bg-brand-600 text-white h-12">Generate Tracking Code</Button>
                  </DialogFooter>
                </form>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20">
                  <Plus className="h-4 w-4 mr-2" />
                  New Flight
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Schedule New Flight</DialogTitle>
                  <DialogDescription>Enter cargo flight details and schedule.</DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newFlight: Flight = {
                    id: Math.random().toString(36).substr(2, 9),
                    flightNumber: formData.get('flightNumber') as string,
                    airline: formData.get('airline') as string,
                    origin: formData.get('origin') as string,
                    destination: formData.get('destination') as string,
                    status: 'Scheduled',
                    departureTime: new Date(formData.get('departureTime') as string).toISOString(),
                    arrivalTime: new Date(formData.get('arrivalTime') as string).toISOString(),
                    aircraft: formData.get('aircraft') as string,
                    cost: Number(formData.get('cost')),
                    capacity: formData.get('capacity') as string,
                  };
                  addFlight(newFlight);
                  toast.success(`Flight ${newFlight.flightNumber} scheduled successfully!`);
                  (e.target as HTMLFormElement).reset();
                }} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Flight Number</label>
                      <Input name="flightNumber" placeholder="GL882" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Airline</label>
                      <Input name="airline" placeholder="SwiftCargo Air" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Origin</label>
                      <Input name="origin" placeholder="JFK" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Destination</label>
                      <Input name="destination" placeholder="LHR" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Departure Time</label>
                      <Input name="departureTime" type="datetime-local" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Arrival Time</label>
                      <Input name="arrivalTime" type="datetime-local" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Aircraft</label>
                      <Input name="aircraft" placeholder="B747-8F" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cost ($)</label>
                      <Input name="cost" type="number" placeholder="5000" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Capacity</label>
                      <Input name="capacity" placeholder="140 tons" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-brand-600 text-white h-12">Schedule Flight</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Shipments', value: shipments.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Flights', value: flights.filter(f => f.status === 'Active').length, icon: Plane, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending Updates', value: shipments.filter(s => s.status === 'Pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Revenue (MTD)', value: `$${shipments.reduce((acc, s) => acc + (s.cost || 0), 0).toLocaleString()}`, icon: TrendingUp, color: 'text-brand-600', bg: 'bg-brand-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-display font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('shipments')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'shipments' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Shipments
        </button>
        <button 
          onClick={() => setActiveTab('flights')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'flights' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Cargo Flights
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder={activeTab === 'shipments' ? "Search by tracking or sender..." : "Search by flight number..."}
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {activeTab === 'shipments' ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-semibold">Tracking Number</TableHead>
                <TableHead className="font-semibold">Route</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Claimed By</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.map((shipment) => (
                <TableRow key={shipment.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-mono font-medium text-brand-700">{shipment.trackingNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <span>{shipment.origin}</span>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                      <span>{shipment.destination}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select 
                      onValueChange={(val) => handleStatusUpdate(shipment.id, val as ShipmentStatus)}
                      value={shipment.status}
                    >
                      <SelectTrigger className="w-[180px] h-8 text-xs">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Picked Up">Picked Up</SelectItem>
                        <SelectItem value="Warehouse">Warehouse</SelectItem>
                        <SelectItem value="Carrier 1">Carrier 1</SelectItem>
                        <SelectItem value="Carrier 2">Carrier 2</SelectItem>
                        <SelectItem value="Carrier 5">Carrier 5</SelectItem>
                        <SelectItem value="Customs">Customs</SelectItem>
                        <SelectItem value="In Transit">In Transit</SelectItem>
                        <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {shipment.claimedBy ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                        {shipment.claimedBy}
                      </Badge>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Unclaimed</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog 
                        open={selectedReceiptId === shipment.id} 
                        onOpenChange={(open) => setSelectedReceiptId(open ? shipment.id : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-brand-600">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl p-0 border-none bg-transparent shadow-none">
                          <DialogHeader className="sr-only">
                            <DialogTitle>Shipment Receipt</DialogTitle>
                            <DialogDescription>Official receipt for shipment {shipment.trackingNumber}</DialogDescription>
                          </DialogHeader>
                          <Receipt shipment={shipment} onClose={() => setSelectedReceiptId(null)} />
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-semibold">Flight No.</TableHead>
                <TableHead className="font-semibold">Airline</TableHead>
                <TableHead className="font-semibold">Route</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flights.filter(f => f.flightNumber.toLowerCase().includes(searchQuery.toLowerCase())).map((flight) => (
                <TableRow key={flight.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-mono font-medium text-brand-700">{flight.flightNumber}</TableCell>
                  <TableCell className="text-sm">{flight.airline}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <span>{flight.origin}</span>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                      <span>{flight.destination}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={flight.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-500'}>
                      {flight.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog 
                        open={selectedFlightReceiptId === flight.id} 
                        onOpenChange={(open) => setSelectedFlightReceiptId(open ? flight.id : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-brand-600">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl p-0 border-none bg-transparent shadow-none">
                          <DialogHeader className="sr-only">
                            <DialogTitle>Flight Manifest</DialogTitle>
                            <DialogDescription>Official manifest for flight {flight.flightNumber}</DialogDescription>
                          </DialogHeader>
                          <FlightReceipt flight={flight} onClose={() => setSelectedFlightReceiptId(null)} />
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
