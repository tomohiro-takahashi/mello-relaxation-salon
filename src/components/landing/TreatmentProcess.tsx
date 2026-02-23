'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const steps = [
  {
    title: "心解",
    subtitle: "Mind Opening",
    description: "香りと会話で心をリラックス。",
    detail: "オリジナルのアロマが漂う空間で、まずは呼吸を整えます。セラピストとの何気ない会話が、日常で張り詰めた心の糸をゆっくりと緩めていきます。"
  },
  {
    title: "整圧",
    subtitle: "Body Tuning",
    description: "深層筋を捉え、全身の巡りを整える。",
    detail: "解剖学的な知見に基づき、普段意識することのない深部の筋肉までアプローチ。滞っていた血流とリンパの巡りを再開させ、身体を最適な状態へ導きます。"
  },
  {
    title: "融合",
    subtitle: "Sensory Integration",
    description: "肌と肌の対話。本能が求める濃密な癒やし。",
    detail: "マッサージを超えた、手のひらを通じたコミュニケーション。温かなぬくもりが肌に溶け合い、孤独感が消え、深い充足感に包まれていきます。"
  },
  {
    title: "没入",
    subtitle: "Deep Immersion",
    description: "境界線が溶ける、究極の多幸感。",
    detail: "自分と他者、理性と本能の境界が曖昧になる瞬間。深いリラックスの中で、一人の女性としての悦びと感覚の解放を体験します。"
  },
  {
    title: "余韻",
    subtitle: "Afterglow",
    description: "現実へ戻るための、穏やかなフィードバック。",
    detail: "施術後の微睡みの時間。軽くなった心身で現実へと戻るための、温かなお飲み物と丁寧なアフターフォローをご用意しています。"
  }
];

export default function TreatmentProcess() {
  return (
    <section className="px-6 py-12 md:py-24 bg-background-dark overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-16 space-y-4">
          <h2 className="text-primary font-serif text-sm font-bold tracking-[0.4em] uppercase">The Process</h2>
          <h3 className="text-text-cream text-3xl md:text-5xl font-serif font-bold tracking-tight">施術の流れ</h3>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pt-4"
          >
            <Link 
              href="/treatment"
              className="text-primary text-sm font-bold tracking-widest hover:border-b border-primary transition-all flex items-center justify-center gap-2 group"
            >
              五感をハックする「施術の理論」を詳しく見る
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </Link>
          </motion.div>
        </div>

        <div className="relative">
          {/* Vertical line for desktop */}
          <div className="absolute left-[50%] top-0 bottom-0 w-px bg-linear-to-b from-primary/50 via-primary/20 to-transparent hidden md:block"></div>

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="md:w-1/2 flex justify-center md:px-12">
                  <div className={`space-y-4 ${index % 2 === 1 ? 'md:text-left' : 'md:text-right'} text-center md:w-full`}>
                    <div className={`flex items-center gap-4 justify-center ${index % 2 === 1 ? 'md:justify-start' : 'md:justify-end'}`}>
                      <span className="text-primary font-serif italic text-xl">0{index + 1}</span>
                      <h4 className="text-text-cream text-2xl md:text-3xl font-serif font-bold">{step.title}</h4>
                    </div>
                    <p className="text-primary/80 font-serif text-sm tracking-widest">{step.subtitle}</p>
                    <p className="text-text-cream text-lg font-medium">{step.description}</p>
                    <p className="text-text-muted text-sm leading-relaxed max-w-sm mx-auto md:mx-0 ${index % 2 === 1 ? 'md:mr-auto' : 'md:ml-auto'}">
                      {step.detail}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-center">
                  <div className="size-12 rounded-full bg-background-dark border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                    <div className="size-3 rounded-full bg-primary animate-pulse"></div>
                  </div>
                </div>

                <div className="md:w-1/2 hidden md:block px-12">
                  {/* Decorative line extension */}
                  <div className={`h-px w-24 bg-linear-to-r ${index % 2 === 1 ? 'from-transparent to-primary/30 mr-auto' : 'from-primary/30 to-transparent ml-auto'}`}></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
