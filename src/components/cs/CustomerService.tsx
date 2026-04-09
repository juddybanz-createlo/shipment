import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Headphones, 
  Search, 
  ChevronRight,
  LifeBuoy,
  ShieldQuestion,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
}

export default function CustomerService() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! Welcome to SwiftCargo Support. How can we help you today?",
      sender: 'agent',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate agent response
    setTimeout(() => {
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message. An agent will be with you shortly to assist with your request.",
        sender: 'agent',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, agentMsg]);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900">Customer Support</h2>
          <p className="text-slate-500">We're here to help you with any questions or issues.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Help Center / FAQs */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-lg shadow-slate-200/50 bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-display font-bold">Quick Help</CardTitle>
              <CardDescription>Commonly asked questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { icon: BookOpen, title: 'Tracking Guide', desc: 'How to track your package' },
                { icon: ShieldQuestion, title: 'Claims Process', desc: 'Filing for lost items' },
                { icon: LifeBuoy, title: 'Shipping Rates', desc: 'View our current pricing' }
              ].map((item, i) => (
                <button 
                  key={i}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                    <item.icon className="h-5 w-5 text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg shadow-slate-200/50 bg-brand-600 text-white">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Headphones className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold">24/7 Priority Support</h3>
              <p className="text-brand-100 text-sm">
                Our global team is available around the clock for urgent shipping inquiries.
              </p>
              <Button variant="secondary" className="w-full bg-white text-brand-600 hover:bg-brand-50">
                Call Support
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Live Chat */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-xl shadow-slate-200/60 bg-white h-[600px] flex flex-col">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-brand-100">
                    <AvatarImage src="https://picsum.photos/seed/agent/100/100" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <CardTitle className="text-base font-display font-bold">SwiftCargo Assistant</CardTitle>
                  <CardDescription className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Online • Typically responds in 1m
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full p-6">
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`mt-auto h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                          msg.sender === 'user' ? 'bg-brand-100' : 'bg-slate-100'
                        }`}>
                          {msg.sender === 'user' ? <User className="h-4 w-4 text-brand-600" /> : <MessageSquare className="h-4 w-4 text-slate-600" />}
                        </div>
                        <div className={`p-4 rounded-2xl text-sm ${
                          msg.sender === 'user' 
                            ? 'bg-brand-600 text-white rounded-tr-none' 
                            : 'bg-slate-100 text-slate-900 rounded-tl-none'
                        }`}>
                          {msg.text}
                          <p className={`text-[10px] mt-2 ${msg.sender === 'user' ? 'text-brand-200' : 'text-slate-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <div className="p-4 border-t border-slate-100">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input 
                  placeholder="Type your message..." 
                  className="flex-1 bg-slate-50 border-none focus-visible:ring-brand-500"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button type="submit" size="icon" className="bg-brand-600 hover:bg-brand-700 text-white shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
