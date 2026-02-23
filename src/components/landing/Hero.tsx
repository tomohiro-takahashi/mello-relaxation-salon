'use client';

import Link from 'next/link';
import { Menu, UserCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative flex min-h-dvh w-full flex-col bg-background-dark overflow-hidden">

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-start md:justify-center relative z-10 px-6 pt-2 pb-12 md:py-12 lg:px-12 w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 w-full">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-primary font-serif text-xs font-bold tracking-[0.3em] uppercase border-b border-primary/30 pb-1">
                完全予約制・女性専用
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif tracking-wider text-text-cream"
            >
              <div className="flex flex-col gap-2 md:gap-4 mb-8">
                <span className="text-[1.85rem] md:text-5xl lg:text-6xl leading-[1.2]">本物のリラクゼーション</span>
                <span className="text-xl md:text-3xl text-primary/60">✖️</span>
                <span className="text-[1.85rem] md:text-5xl lg:text-6xl leading-[1.2]">女性用風俗</span>
              </div>
              <div className="text-base md:text-2xl lg:text-3xl leading-relaxed text-text-cream opacity-80 font-light">
                その融合がたどり着いた<br className="md:hidden" />
                一つの正解。
              </div>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="max-w-[320px] md:max-w-2xl mx-auto lg:mx-0 text-sm md:text-lg leading-relaxed text-text-cream opacity-90 font-light"
            >
              表参道の人気サロンオーナーが構築した<br className="md:hidden" />
              現代の価値観に合わせた<br className="md:hidden" />
              リラクゼーションの到達点。<br />
              これは、あなたの「芯」を解放するための<br className="md:hidden" />
              もっとも贅沢で誠実な選択です。
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex w-full flex-col items-center gap-5 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Link 
                href="/chat"
                className="group relative flex h-15 w-full max-w-[290px] items-center justify-center rounded-full bg-primary py-4 text-background-dark text-base font-bold tracking-widest shadow-[0_0_25px_rgba(197,160,89,0.4)] active:scale-95 transition-all hover:bg-primary-dark"
              >
                <span>まずは相談してみる</span>
              </Link>
              <Link 
                href="#features"
                className="flex h-15 w-full max-w-[290px] items-center justify-center rounded-full border border-primary/50 bg-transparent py-4 text-primary text-base font-medium tracking-widest active:scale-95 transition-all hover:bg-primary/5"
              >
                <span>詳しく見る</span>
              </Link>
            </motion.div>
          </div>

          {/* Visual Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="flex-1 w-full max-w-[500px] lg:max-w-none relative aspect-square lg:aspect-4/5 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl"
          >
            <img 
              src="/assets/landing/hero_main.png" 
              alt="Luxury Salon Visual"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background-dark/60 to-transparent"></div>
            
            {/* Floating Info Tag */}
            <div className="absolute bottom-8 left-8 right-8 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-left">
              <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Private Space</p>
              <p className="text-text-cream font-serif text-sm leading-relaxed">
                あなたのためだけの特別な体験を。
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Decorative Elements */}
      <footer className="flex flex-col items-center pb-4 md:pb-24 relative z-10">
        <div className="h-6 md:h-16 w-px bg-linear-to-b from-primary/80 to-transparent"></div>
      </footer>

      {/* Background/Blur Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Subdued Background Image Overlay */}
        <div 
          className="absolute inset-0 h-full w-full opacity-30 mix-blend-soft-light scale-105"
          style={{ 
            backgroundImage: 'url("/assets/landing/hero_bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center' 
          }}
        ></div>
        
        {/* Radial Gradients for Depth */}
        <div className="absolute top-[20%] -left-32 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute bottom-[10%] -right-32 h-[350px] w-[350px] rounded-full bg-primary/5 blur-[100px]"></div>
      </div>
    </section>
  );
}
