import React from 'react';
import { motion } from 'motion/react';
import { Globe2, Package, Plane, Users } from 'lucide-react';

const stats = [
  { label: 'Countries Covered', value: '180+', icon: Globe2 },
  { label: 'Packages Tracked', value: '2.5M+', icon: Package },
  { label: 'Active Flights', value: '1,200+', icon: Plane },
  { label: 'Satisfied Clients', value: '15k+', icon: Users },
];

export default function Stats() {
  return (
    <section className="py-20 bg-slate-900 overflow-hidden relative">
      {/* Decorative Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-brand-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-3"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mb-2">
                <stat.icon className="h-6 w-6 text-brand-400" />
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                {stat.value}
              </h3>
              <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
