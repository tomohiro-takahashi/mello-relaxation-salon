'use client';

import { ShieldCheck, Lock, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const signals = [
  { icon: <ShieldCheck size={20} />, text: "営業許可届出済み" },
  { icon: <Lock size={20} />, text: "完全プライバシー" },
  { icon: <Users size={20} />, text: "女性専用サロン" },
  { icon: <Calendar size={20} />, text: "完全予約制" }
];

export default function TrustSignals() {
  return (
    <section className="px-6 py-6 md:py-12 bg-background-dark/50 backdrop-blur-sm border-y border-white/5">
      <div className="max-w-5xl mx-auto flex flex-wrap justify-around items-center gap-8 md:gap-12">
        {signals.map((signal, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-3 text-text-cream/60 group"
          >
            <div className="text-primary p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
              {signal.icon}
            </div>
            <span className="text-xs font-bold tracking-widest whitespace-nowrap">
              {signal.text}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
