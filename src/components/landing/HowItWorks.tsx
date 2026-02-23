'use client';

import { MessageSquare, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    step: "Step 01",
    title: "専任カウンセラーに相談する",
    description: "まずは、今の気持ちをカウンセラーに話してみてください。どんなことでも大丈夫。あなたのペースで、ゆっくりと。",
    duration: "5〜15分",
    icon: <MessageSquare size={32} />,
    action: "無料・匿名で今すぐ"
  },
  {
    step: "Step 02",
    title: "余裕を持って予約する",
    description: "あなただけの特別な時間を確保しましょう。前後の予定に余裕を持たせることで、心身ともに深いリラックスへと没入できる準備が整います。",
    duration: "3〜5分",
    icon: <Calendar size={32} />,
    action: "ゆとりある時間を確保"
  },
  {
    step: "Step 03",
    title: "全力で癒やされる",
    description: "当日は、すべてを一ノ瀬とセラピストに委ねてください。日常の役割を脱ぎ捨て、一人の女性として、心と体の感覚を解放する究極のひとときを。",
    duration: "90〜180分",
    icon: <Sparkles size={32} />,
    action: "究極の没入体験へ"
  }
];

export default function HowItWorks() {
  return (
    <section className="px-6 py-12 md:py-24 bg-background-dark relative overflow-hidden">
      <div className="max-w-4xl mx-auto mb-10 md:mb-20 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-text-cream tracking-tight text-3xl md:text-5xl font-serif font-bold leading-tight mb-6"
        >
          ご利用の流れ
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-text-muted text-base md:text-xl font-medium leading-relaxed max-w-xs md:max-w-md mx-auto"
        >
          たった3ステップで、あなただけの時間が始まります。
        </motion.p>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Connecting Line (Desktop) */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent hidden md:block"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {steps.map((step, index) => (
            <motion.div 
              key={step.step}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group bg-surface/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center hover:border-primary/50 transition-all duration-500"
            >
              <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-background-dark transition-all duration-500">
                {step.icon}
              </div>
              
              <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-2">
                {step.step}
              </span>
              
              <h3 className="text-text-cream text-xl font-serif font-bold mb-4">
                {step.title}
              </h3>
              
              <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1">
                {step.description}
              </p>

              <div className="w-full pt-6 border-t border-white/5 flex flex-col gap-2">
                <span className="text-text-cream/60 text-[10px] font-bold uppercase tracking-wider">
                  所要時間: {step.duration}
                </span>
                <span className="text-primary text-xs font-bold">
                  {step.action}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>


      <div className="mt-8 md:mt-16 flex justify-center">
        <button className="w-full max-w-sm h-16 bg-primary text-background-dark text-lg font-bold rounded-full shadow-[0_0_30px_rgba(197,160,89,0.3)] active:scale-95 transition-all hover:bg-primary-dark flex items-center justify-center gap-3">
          <span>今すぐカウンセラーに相談する</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}
