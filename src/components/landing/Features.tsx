'use client';

import { CheckCircle, MessageSquare, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    number: "01",
    title: "事前カウンセリング",
    category: "Accessibility",
    subtitle: "まず、あなたの話を聞かせてください",
    description: "Mello（メロ）では、単なるマッサージに留まらない、心の奥底に触れるカウンセリングを大切にしています。\nどんな悩みも、ここでなら安心して話せます。その上で、あなたに最適なセラピストをご提案。",
    icon: <MessageSquare className="text-primary" size={32} />,
    image: "/assets/landing/feature_counseling.png",
    benefits: [
      "24時間いつでも相談可能",
      "誰にも知られず、安心して話せる",
      "あなたの状態に合わせたマッチング"
    ]
  },
  {
    number: "02",
    title: "本物のリラクゼーション",
    category: "Omotesando Quality",
    subtitle: "心だけじゃなく、体も癒される",
    description: "表参道クオリティの技術力。解剖学に基づき、感覚を鋭敏にさせる独自のトリートメント。ちゃんとした技術を持ったセラピストが、あなたの心と体、両方をケア。肩こり、腰痛、疲労…本当に楽になります。",
    icon: <Sparkles className="text-primary" size={32} />,
    image: "/assets/landing/feature_treatment.png",
    benefits: [
      "解剖学に基づく独自トリートメント",
      "感覚を鋭敏にさせる特殊な手技",
      "リラクゼーションから親密なケアまで"
    ]
  },
  {
    number: "03",
    title: "パーソナライズされた寄り添い",
    category: "Tailored",
    subtitle: "初めてでも、安心",
    description: "専任のマネージャーが事前にあなたのことを理解。担当セラピストにも共有されるので、初対面でも「分かってもらえてる」安心感。あなたのペースで、大丈夫。",
    icon: <Heart className="text-primary" size={32} />,
    image: "/assets/landing/feature_personalized.png",
    benefits: [
      "事前カウンセリングで不安を解消",
      "あなたの好みに合わせた接し方",
      "無理のない、安心できる時間"
    ]
  }
];

export default function Features() {
  return (
    <section id="features" className="px-6 py-12 md:py-24 bg-background-dark overflow-hidden">
      <div className="max-w-4xl mx-auto mb-8 md:mb-16 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-text-cream tracking-tight text-3xl md:text-5xl font-serif font-bold leading-tight mb-6 px-4 md:px-0"
        >
          Mello（メロ）が選ばれる、<br className="md:hidden" />
          <span className="text-primary">3つの理由</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-text-muted text-base md:text-xl font-medium leading-relaxed max-w-xs md:max-w-md mx-auto"
        >
          あなたの心と体、両方を大切にします。
        </motion.p>
      </div>

      <div className="flex flex-col gap-12 max-w-5xl mx-auto w-full">
        {features.map((feature, index) => (
          <motion.div 
            key={feature.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="group relative bg-surface/30 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="relative h-64 md:h-auto md:w-1/2 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-t from-background-dark/80 to-transparent z-10 md:hidden"></div>
                <div className="absolute inset-0 bg-linear-to-r from-background-dark/20 to-transparent z-10 hidden md:block"></div>
                <img 
                  alt={feature.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  src={feature.image} 
                />
                <div className="absolute top-6 left-6 z-20 flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-background-dark font-serif font-bold text-xl shadow-lg">
                  {feature.number}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-12 flex flex-col gap-6 md:w-1/2">
                <div className="flex items-center gap-4">
                  {feature.icon}
                  <h3 className="text-text-cream text-2xl md:text-3xl font-serif font-bold tracking-tight">
                    {feature.title}
                  </h3>
                </div>
                
                <div>
                  <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-2">
                    {feature.category}
                  </p>
                  <p className="text-text-cream font-medium mb-3 text-lg md:text-xl">
                    {feature.subtitle}
                  </p>
                  <p className="text-text-muted text-sm md:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <ul className="flex flex-col gap-3 pt-6 border-t border-white/5">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-cream/90">
                      <CheckCircle className="text-primary shrink-0" size={18} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Feature CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-20 flex flex-col items-center gap-6"
      >
        <button className="w-full max-w-sm h-16 bg-primary text-background-dark text-lg font-bold rounded-full shadow-[0_0_30px_rgba(197,160,89,0.3)] active:scale-95 transition-all hover:bg-primary-dark flex items-center justify-center gap-3">
          <span>事前カウンセリングを始める</span>
          <ArrowRight size={20} />
        </button>
        <p className="text-text-muted/40 text-xs text-center leading-relaxed">
          ※初回カウンセリングは無料でお試しいただけます。<br />
          あなたの心に寄り添う、Mello（メロ）の体験を。
        </p>
      </motion.div>
    </section>
  );
}
