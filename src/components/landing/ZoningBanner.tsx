'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LockKeyhole, ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ZoningBanner() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleConfirm = () => {
    setShowModal(false);
    router.push('/adult-content');
  };

  return (
    <>
      <section className="px-6 py-24 bg-background-dark">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-black border border-primary/40 rounded-none p-12 md:p-24 text-center overflow-hidden cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <div className="relative z-10 space-y-16">
              {/* Lock Icon Hooked Circle */}
              <div className="flex justify-center">
                <div className="size-24 rounded-full border border-primary/30 flex items-center justify-center text-primary bg-primary/5 group-hover:bg-primary/10 transition-all duration-700 shadow-[0_0_40px_rgba(197,160,89,0.1)]">
                  <LockKeyhole size={42} strokeWidth={1} />
                </div>
              </div>
              
              <div className="space-y-8">
                <h3 className="text-primary text-3xl md:text-5xl font-serif font-medium tracking-widest leading-tight">
                  理性を脱ぎ捨て、<br />本能が求める解放の詳細へ。
                </h3>
                
                <p className="text-primary/60 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
                  ここから先は、より深く、一人の女性としての悦びに<br className="hidden md:block" />
                  向き合うための領域です。感覚の深淵に触れる覚悟の<br className="hidden md:block" />
                  ある方のみ、お進みください。
                </p>
              </div>
              
              <div className="flex justify-center pt-8">
                <div className="inline-flex items-center justify-center gap-10 px-12 py-6 border border-primary/30 rounded-none bg-primary/3 text-primary font-serif tracking-[0.4em] text-xs font-bold whitespace-nowrap transition-all duration-700 group-hover:bg-primary/10 group-hover:border-primary/60 group-hover:shadow-[0_0_40px_rgba(197,160,89,0.15)]">
                  <span className="ml-[0.4em]">ENTER PROTECTED ZONE</span>
                  <ArrowRight size={20} className="shrink-0 group-hover:translate-x-3 transition-transform duration-700" />
                </div>
              </div>
            </div>

            {/* Premium Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1500 bg-linear-to-r from-transparent via-primary/10 to-transparent skew-x-[-20deg]"></div>
          </motion.div>
        </div>
      </section>

      {/* Age Verification Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background-dark/95 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-11 bg-surface border border-white/10 rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full text-center space-y-8 shadow-2xl"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="space-y-4">
                <div className="size-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                  <span className="text-xl font-bold font-serif">18+</span>
                </div>
                <h4 className="text-text-cream text-2xl font-serif font-bold">年齢確認</h4>
                <p className="text-text-muted text-sm leading-relaxed">
                  この先のコンテンツには、成人向けの表現が含まれています。<br />
                  あなたは18歳以上ですか？
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-primary text-background-dark py-4 rounded-full font-bold tracking-widest hover:bg-primary-dark transition-colors"
                >
                  はい（18歳以上）
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-white/10 text-white py-4 rounded-full font-bold tracking-widest hover:bg-white/5 transition-colors"
                >
                  いいえ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
