import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Supply Chain Director, TechCorp",
    content: "SwiftCargo has completely transformed how we manage our international shipments. The real-time flight tracking is a game-changer for our high-priority hardware deliveries.",
    avatar: "https://picsum.photos/seed/sarah/100/100",
    rating: 5
  },
  {
    name: "Marcus Chen",
    role: "Logistics Manager, Global Retail",
    content: "The transparency provided by SwiftCargo is unmatched. Being able to see exactly where our cargo is, from warehouse to final delivery, has reduced our customer inquiries by 40%.",
    avatar: "https://picsum.photos/seed/marcus/100/100",
    rating: 5
  },
  {
    name: "Elena Rodriguez",
    role: "Operations Lead, EuroFreight",
    content: "Professional, clean, and incredibly reliable. The admin portal makes managing hundreds of tracking codes effortless. Highly recommended for any serious logistics operation.",
    avatar: "https://picsum.photos/seed/elena/100/100",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-slate-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-widest border border-brand-100">
              Trusted Worldwide
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-bold text-slate-900"
          >
            What our partners say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-2xl mx-auto"
          >
            Join thousands of businesses that trust SwiftCargo for their mission-critical logistics tracking and management.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-slate-50 rounded-3xl border border-slate-100 relative group hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
            >
              <Quote className="absolute top-6 right-8 h-12 w-12 text-slate-200 group-hover:text-brand-100 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-slate-700 leading-relaxed mb-8 relative z-10">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  <AvatarImage src={testimonial.avatar} referrerPolicy="no-referrer" />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
