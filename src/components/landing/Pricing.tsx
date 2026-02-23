'use client';

import { motion } from 'framer-motion';
import { Gift, MessageCircle, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: "Trial",
    time: "90分",
    bonus: "+30分無料",
    total: "120分",
    originalPrice: "23,000円",
    price: "18,000円",
    description: "心身ともに整える人気の基本コース。まずはこちらから。"
  },
  {
    name: "Standard",
    time: "120分",
    bonus: "+30分無料",
    total: "150分",
    originalPrice: "28,000円",
    price: "23,000円",
    isRecommended: true,
    description: "自分へのご褒美に。至高の没入体験を。一番のおすすめです。"
  },
  {
    name: "Premium",
    time: "150分",
    bonus: "+30分無料",
    total: "180分",
    originalPrice: "33,000円",
    price: "28,000円",
    description: "境界線が溶ける、究極の充足。心ゆくまで。"
  }
];

export default function Pricing() {
  return (
    <section className="px-6 py-12 md:py-24 bg-background-dark/80 relative overflow-hidden" id="pricing">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-4"
          >
            <Gift size={14} />
            <span>Pre-Open Special Offer</span>
          </motion.div>
          <h2 className="text-text-cream text-3xl md:text-5xl font-serif font-bold tracking-tight">Pricing Offers</h2>
          <p className="text-text-muted max-w-2xl mx-auto leading-relaxed mt-6">
            表参道のリラクゼーション技術を、女風の相場で。<br />
            私たちは癒しの純度に妥協しません。<br />
            初回の方はすべてのコースで、じっくり心を通わせるための<br className="md:hidden" />30分をプレゼントいたします。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative group p-6 md:p-8 rounded-[2.5rem] border ${plan.isRecommended ? 'bg-surface border-primary shadow-[0_0_40px_rgba(197,160,89,0.15)]Scale-105 z-10' : 'bg-surface/30 border-white/5 backdrop-blur-xl'} flex flex-col`}
            >
              {plan.isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-background-dark px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase z-20">
                  Recommended
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-text-cream text-2xl font-serif font-bold mb-2">{plan.name}</h3>
                <p className="text-text-muted text-xs leading-relaxed h-8">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">施術時間</span>
                  <span className="text-text-cream font-bold">{plan.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-primary text-xs font-bold px-2 py-1 rounded-md bg-primary/10">{plan.bonus}</span>
                  <span className="text-primary font-serif italic text-lg">{plan.total}</span>
                </div>
                <div className="h-px w-full bg-white/5"></div>
                <div className="flex flex-col items-end gap-1 pt-2">
                  <span className="text-text-muted/50 text-xs line-through">{plan.originalPrice}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-primary text-xs font-bold">特別価格</span>
                    <span className="text-text-cream text-3xl font-serif font-bold">{plan.price}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <div className="flex flex-col gap-2 text-[10px] text-text-muted/80">
                  <div className="flex items-center gap-2">
                    <Check size={12} className="text-primary" />
                    <span>心解カウンセリング込み</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={12} className="text-primary" />
                    <span>表参道クオリティ技術</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 max-w-3xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[3rem] bg-linear-to-br from-primary/20 via-primary/5 to-transparent border border-primary/30 relative overflow-hidden group"
          >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <MessageCircle size={120} className="text-primary translate-x-12 -translate-y-12" />
            </div>

            <div className="relative z-10 space-y-6">
              <h4 className="text-text-cream text-xl md:text-2xl font-serif font-bold">
                公式LINE登録で、特別料金適用。
              </h4>
              <p className="text-text-muted text-sm md:text-base leading-relaxed">
                プレオープン期間中に公式LINEへご登録いただいた方限定で、<br className="hidden md:block" />
                特別価格でのご案内が可能になります。
              </p>

              <div className="flex flex-col items-center gap-4">
                <Link
                  href="https://lin.ee/46p9yv9"
                  className="w-full max-w-md bg-[#06C755] text-white py-5 rounded-full font-bold tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(6,199,85,0.3)] flex items-center justify-center gap-3"
                >
                  <MessageCircle size={24} fill="currentColor" />
                  <span>LINE登録で特別料金を適用する</span>
                  <ArrowRight size={20} />
                </Link>
                <p className="text-text-muted text-[11px] font-medium tracking-wider">
                  ※現在、先行予約のみ受け付けております
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-[150px] pointer-events-none"></div>
    </section>
  );
}
