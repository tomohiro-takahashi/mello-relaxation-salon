'use client';

import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function EmotionalDetox() {
  return (
    <section className="px-6 py-8 md:py-24 bg-background-dark/50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="bg-surface/30 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-16 relative overflow-hidden group">
          {/* Background Highlight */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] transition-all duration-1000 group-hover:bg-primary/20"></div>

          <div className="flex flex-col items-center text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6 max-w-3xl"
            >
              <div className="flex flex-col items-center gap-3 text-primary">
                <MessageCircle size={24} />
                <span className="text-xs font-bold tracking-[0.3em] uppercase">Emotional Detox</span>
              </div>
              <h3 className="text-text-cream text-2xl md:text-5xl font-serif font-bold leading-[1.4] md:leading-tight">
                誰にも言えない不満や<br />
                モヤモヤを抱えていませんか？
              </h3>

              <p className="text-text-muted text-sm md:text-lg leading-relaxed max-w-2xl mx-auto font-light">
                理性を脱ぎ捨て、本能を解放することは、<br className="md:hidden" />
                心の充足に直結します。<br />
                リラクゼーションサロン楪（ゆずりは）では、<br className="md:hidden" />
                マネージャーの一ノ瀬があなたの気持ちに寄り添います。<br />
                まずは、あなたの心の重荷をここに置いていってください。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-12 w-full max-w-md"
            >
              <Link
                href="/chat"
                className="flex items-center justify-center gap-4 bg-primary text-background-dark px-8 py-5 rounded-full font-bold tracking-widest hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(197,160,89,0.3)] group-hover:shadow-[0_0_50px_rgba(197,160,89,0.5)]"
              >
                <span>心をデトックスしてみる</span>
                <ArrowRight size={20} />
              </Link>
            </motion.div>

            {/* Benefit Area with Blur Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-20 w-full max-w-4xl relative"
            >
              <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10 rounded-full scale-150 opacity-50"></div>
              
              <div className="bg-white/2 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 relative z-10">
                  <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Sparkles size={18} className="text-primary" />
                      </div>
                      <h4 className="text-primary font-serif italic text-xl tracking-wide">心理学</h4>
                    </div>
                    <p className="text-text-cream leading-relaxed font-light">
                      論理的なアプローチで、あなたの心の<br className="md:hidden" />「現在地」を読み解きます。
                    </p>
                  </div>

                  <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <div className="text-primary font-serif font-bold text-lg leading-none">§</div>
                      </div>
                      <h4 className="text-primary font-serif italic text-xl tracking-wide">占い学</h4>
                    </div>
                    <p className="text-text-cream leading-relaxed font-light">
                      古来からの統計的智慧を用いて、<br className="hidden md:block" />
                      自分では気づけない「可能性」を提示します。
                    </p>
                  </div>
                </div>

                {/* Bottom tagline */}
                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                  <p className="text-text-muted text-xs md:text-sm tracking-[0.2em] font-light">
                    一人の女性としてのあなたを、<br className="md:hidden" />多角的な視点で見守り、支えます。
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
