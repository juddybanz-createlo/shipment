import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useLogistics } from '../../lib/LogisticsContext';
import { toast } from 'sonner';
import { User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegistrationForm() {
  const [isLogin, setIsLogin] = useState(false);
  const { login } = useLogistics();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/registration
    const role = email.includes('admin') ? 'admin' : 'customer';
    login(email, name || 'User', role);
    toast.success(`Logged in as ${name || email}`);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-none shadow-2xl shadow-slate-200/60 bg-white">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-brand-600 flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-display font-bold">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Enter your credentials to access your dashboard' 
                : 'Join GlobalLogix for seamless shipment management'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      className="pl-10" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@company.com" 
                    className="pl-10" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
                    <button type="button" className="text-xs text-brand-600 hover:underline font-medium">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input id="password" type="password" className="pl-10" required />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white h-11 mt-2">
                {isLogin ? 'Sign In' : 'Register Now'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="text-center mt-6">
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-slate-500 hover:text-brand-600 transition-colors"
                >
                  {isLogin 
                    ? "Don't have an account? Register" 
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="mt-6 p-4 bg-slate-100 rounded-lg text-xs text-slate-500 text-center">
          <p>Tip: Use an email containing "admin" to access the Admin Portal.</p>
        </div>
      </motion.div>
    </div>
  );
}
