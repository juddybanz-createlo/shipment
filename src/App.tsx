import { 
  Package, 
  Plane, 
  UserCircle, 
  LayoutDashboard, 
  Menu, 
  X, 
  Globe2,
  ChevronRight,
  Clock,
  ShieldCheck,
  LogOut,
  Settings,
  Headphones
} from 'lucide-react';
import ShipmentTracker from './components/tracking/ShipmentTracker';
import FlightTracker from './components/tracking/FlightTracker';
import RegistrationForm from './components/auth/RegistrationForm';
import AdminPortal from './components/admin/AdminPortal';
import UserDashboard from './components/dashboard/UserDashboard';
import CustomerService from './components/cs/CustomerService';
import { Button } from './components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { LogisticsProvider, useLogistics } from './lib/LogisticsContext';
import { Toaster } from 'sonner';
import { useState } from 'react';

type Tab = 'home' | 'shipments' | 'flights' | 'register' | 'admin' | 'dashboard' | 'support';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useLogistics();

  const navItems = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'shipments', label: 'Shipments', icon: Package },
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'support', label: 'Support', icon: Headphones },
  ];

  if (!currentUser) {
    navItems.push({ id: 'register', label: 'Sign In', icon: UserCircle });
  } else {
    navItems.push({ id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard });
    if (currentUser.role === 'admin') {
      navItems.push({ id: 'admin', label: 'Admin Portal', icon: Settings });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Toaster position="top-right" />
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="h-8 w-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Globe2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-slate-900 tracking-tight">SwiftCargo</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeTab === item.id 
                      ? 'bg-brand-50 text-brand-600' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
              {currentUser && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-slate-500 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as Tab);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-xl text-left text-base font-medium flex items-center justify-between ${
                      activeTab === item.id 
                        ? 'bg-brand-50 text-brand-600' 
                        : 'text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>
                ))}
                {currentUser && (
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-xl text-left text-base font-medium text-red-600 flex items-center gap-3"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-20 pb-20"
            >
              {/* Hero Section */}
              <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-100/40 via-transparent to-transparent" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className="px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-widest border border-brand-100">
                      Next-Gen Logistics
                    </span>
                  </motion.div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl font-display font-bold text-slate-900 tracking-tight leading-[1.1]"
                  >
                    Global Tracking <br />
                    <span className="text-brand-600">Simplified.</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
                  >
                    Real-time visibility into your supply chain. Track shipments, monitor flights, and manage consignments with precision.
                  </motion.p>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-4 pt-4"
                  >
                    <Button 
                      size="lg" 
                      className="bg-brand-600 hover:bg-brand-700 text-white px-8 h-14 text-lg rounded-xl shadow-lg shadow-brand-500/20"
                      onClick={() => setActiveTab('shipments')}
                    >
                      Track Shipment
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="bg-white border-slate-200 hover:bg-slate-50 px-8 h-14 text-lg rounded-xl"
                      onClick={() => setActiveTab('flights')}
                    >
                      Flight Status
                    </Button>
                  </motion.div>
                </div>
              </section>

              {/* Features Grid */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: 'Real-time Updates',
                      desc: 'Get instant notifications on every milestone of your shipment journey.',
                      icon: Clock,
                      color: 'bg-blue-500'
                    },
                    {
                      title: 'Global Network',
                      desc: 'Access tracking for over 500+ airlines and logistics partners worldwide.',
                      icon: Globe2,
                      color: 'bg-emerald-500'
                    },
                    {
                      title: 'Secure Handling',
                      desc: 'End-to-end encryption for all your consignment data and documentation.',
                      icon: ShieldCheck,
                      color: 'bg-amber-500'
                    }
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                    >
                      <div className={`h-12 w-12 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-display font-bold text-slate-900 mb-3">{feature.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'shipments' && (
            <motion.div
              key="shipments"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-20 px-4"
            >
              <ShipmentTracker />
            </motion.div>
          )}

          {activeTab === 'flights' && (
            <motion.div
              key="flights"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-20 px-4"
            >
              <FlightTracker />
            </motion.div>
          )}

          {activeTab === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-20 px-4"
            >
              <RegistrationForm />
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-20 px-4"
            >
              <AdminPortal />
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-20 px-4"
            >
              <UserDashboard />
            </motion.div>
          )}

          {activeTab === 'support' && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-20 px-4"
            >
              <CustomerService />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Globe2 className="h-6 w-6 text-brand-500" />
              <span className="text-xl font-display font-bold text-white tracking-tight">SwiftCargo</span>
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            </div>
            <p className="text-xs">
              © 2026 SwiftCargo Systems. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LogisticsProvider>
      <AppContent />
    </LogisticsProvider>
  );
}
