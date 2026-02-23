'use client';

import { Sparkles, ArrowRight, ShieldCheck, Lock, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const trustBadges = [
  { icon: <ShieldCheck size={18} />, text: "届出済み営業" },
  { icon: <Lock size={18} />, text: "秘密厳守" },
  { icon: <Users size={18} />, text: "女性専用" },
  { icon: <Calendar size={18} />, text: "完全予約制" }
];

export default function FinalCTA() {
  return (
    <section className="relative px-6 pt-24 pb-24 md:py-32 bg-background-dark overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-text-cream text-4xl md:text-6xl font-serif font-bold leading-tight mb-8">
            あなたは、<br className="md:hidden" />十分頑張っています。
          </h2>
          <div className="text-text-muted text-base md:text-xl leading-relaxed max-w-2xl mx-auto font-light space-y-4">
            <p>
              たまには、自分を甘やかす贅沢を。<br />
              あなたがあなたに戻るための、静かな時間と空間。
            </p>
            <p>
              ここは、世界で一番甘えられる場所を<br className="md:hidden" />目指しています。<br />
              あなたのすべてを、私たちが受け止めます。
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-10"
        >
          <Link 
            href="/chat"
            className="group relative flex h-20 w-full max-w-md items-center justify-center rounded-full bg-primary py-4 text-background-dark text-xl font-bold tracking-widest shadow-[0_0_50px_rgba(197,160,89,0.4)] active:scale-95 transition-all hover:bg-primary-dark"
          >
            <Sparkles className="mr-3" />
            <span>まずはチャットで擬似体験してみる</span>
            <ArrowRight className="ml-3 transition-transform group-hover:translate-x-2" size={24} />
          </Link>

          <div className="flex flex-col gap-6">
            <p className="text-text-muted text-sm font-medium">安心してご利用いただけます</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2 text-text-cream/40 text-xs">
                  <span className="text-primary/60">{badge.icon}</span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          <Link 
            href="/therapists"
            className="text-text-cream/60 hover:text-primary transition-colors text-sm font-medium border-b border-white/10 pb-1"
          >
            セラピストを見てみる
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
