'use client';

import { motion } from 'framer-motion';
import { Sparkles, Wind, Droplets, Zap, Music, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const phases = [
  {
    phase: "Phase 1",
    title: "開放：出口の清掃",
    subtitle: "Opening the Gateway",
    element: "Decollete & Neck",
    description: "Mello（メロ）の技術は、単なる揉みほぐしではありません。それは、滞った流れを流すための「出口」を確保する作業。ホースの先端を空けるように、まずは全身の不純物が抜けていく準備を整えます。",
    icon: <Wind className="text-primary" size={24} />,
    logic: "解剖学的アプローチ：鎖骨下静脈への還流促進"
  },
  {
    phase: "Phase 2",
    title: "深奥：深部の感情解放",
    subtitle: "Psoas Emotional Release",
    element: "Abdomen & Hip Joints",
    description: "ストレス反応で最も硬直しやすく、負の感情が溜まるとされる「腸腰筋（Psoas）」へ。深い呼気に合わせて、自重でゆっくりと沈み込むようなアプローチ。長年抱えてきた鎧を脱ぎ舍て、本当の自分へと立ち返る瞬間です。",
    icon: <Droplets className="text-primary" size={24} />,
    logic: "心理学的側面：ストレス筋の弛緩による抗緊張状態の解除"
  },
  {
    phase: "Phase 3",
    title: "循環：脳への安らぎ",
    subtitle: "Axillary Relaxation",
    element: "Axilla & Arms",
    description: "自分では触れることのない「腕の内側」を流し、腋窩リンパ節を開放します。ここは脳のリラックスと密接に関わるスイッチ。温かな巡りが指先まで届く頃、思考は透明になり、穏やかな静寂が訪れます。",
    icon: <Zap className="text-primary" size={24} />,
    logic: "脳科学的側面：末端神経への微細刺激による副交感神経の優位化"
  },
  {
    phase: "Phase 4",
    title: "源泉：本能の浄化",
    subtitle: "Sensory Purification",
    element: "Inguinal & Deep Care",
    description: "鼠径リンパを圧迫と解放の調和で整え、全身の老廃物を心臓へと戻します。本能の源泉に触れ、湧き上がる感覚に身を委ねる。一人の女性として、理性から解放され、純粋な「快」へと溶けていく特別な時間です。",
    icon: <Sparkles className="text-primary" size={24} />,
    logic: "プロトコル：プロキシマル・トゥ・ディスタル（中心から末端へ）の完遂"
  },
  {
    phase: "Phase 5",
    title: "調律：脳の完全休止",
    subtitle: "Brain Tuning",
    element: "Head & Sound",
    description: "最後に脳波をα波へと導きます。セラピストの手によるヘッドケアと、空間に響く音叉の共鳴。五感の全てを「オフ」へと導き、現実と夢の境界線にある極上の微睡みの中で、心身を再構築（リビルド）します。",
    icon: <Music className="text-primary" size={24} />,
    logic: "最終シークエンス：感覚ハッキングによる脳疲労の除去"
  }
];

export default function TreatmentDetail() {
  return (
    <main className="bg-background-dark text-text-cream min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-serif text-sm font-bold tracking-[0.4em] uppercase">Professional Protocol</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-tight"
          >
            満足度を最大化する<br />
            <span className="text-primary italic">「施術プロトコル」</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl text-text-muted font-light leading-relaxed max-w-2xl mx-auto"
          >
            リンパの「出口」から開き、最後に「脳」を休ませる。<br className="hidden md:block" />
            表参道の技術と本能の解放が導き出した、唯一無二のシークエンス。
          </motion.p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 px-6 bg-surface/10 border-y border-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-serif font-bold text-primary">感覚統合型<br />センスハッキング</h2>
            <p className="text-text-muted leading-relaxed italic">
              "Sense-Hacking Relaxation"
            </p>
            <p className="leading-relaxed">
              私たちは、ただ「揉む」だけではありません。視覚、聴覚、嗅覚、そして触覚へ。脳が処理しきれないほどの緻密な刺激と安らぎを同時に与えることで、理性のスイッチを強制的に「オフ」へと導きます。
            </p>
            <div className="space-y-4 pt-4">
              {[
                "中心から末端へ（プロキシマル・トゥ・ディスタル）",
                "呼吸同調による深層筋へのアクセス",
                "脳波をα波へと導く音響設計"
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-primary" />
                  <span className="text-sm font-light">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
            <img src="/assets/landing/hero_main.png" alt="Sense Hacking" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-linear-to-t from-background-dark via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Phase Steps */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto space-y-32">
          {phases.map((phase, idx) => (
            <div key={idx} className={`flex flex-col md:flex-row gap-12 items-start ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="md:w-1/2 space-y-6"
              >
                <div className="flex items-center gap-4">
                  <span className="text-primary font-serif italic text-2xl">{phase.phase}</span>
                  <div className="h-px w-12 bg-primary/30"></div>
                  <span className="text-primary/60 text-[10px] tracking-[0.4em] font-bold uppercase">{phase.element}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-text-cream leading-tight">
                  {phase.title}
                </h3>
                <p className="text-primary font-serif text-sm italic">{phase.subtitle}</p>
                <p className="text-text-muted leading-relaxed">
                  {phase.description}
                </p>
                <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] text-primary/40 uppercase tracking-[0.2em] mb-2">Scientific Basis</p>
                  <p className="text-sm font-light text-primary/80">{phase.logic}</p>
                </div>
              </motion.div>
              
              <div className="md:w-1/2 w-full aspect-4/3 md:aspect-square relative rounded-4xl overflow-hidden bg-white/5 border border-white/10 group">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                  <div className="scale-[2] opacity-20">
                    {phase.icon}
                  </div>
                </div>
                {/* Image Placeholder - user should replace these with actual assets if needed */}
                <div className="absolute bottom-6 left-6 right-6">
                   <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-light">Visual Perspective {idx + 1}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-linear-to-b from-transparent to-primary/5 text-center">
        <div className="max-w-3xl mx-auto space-y-12">
          <img src="/favicon.ico" alt="Mello Logo" className="w-12 h-12 mx-auto opacity-40 grayscale" />
          <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
            この理論の先にある、<br />
            言葉を超えた充足感を。
          </h2>
          <p className="text-text-muted leading-relaxed">
            表参道の最高峰と、秘められた悦びの融合。<br />
            まずは事前カウンセリングで、あなたの心をお聞かせください。
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
            <Link 
              href="/chat"
              className="px-12 py-5 bg-primary text-background-dark font-bold rounded-full shadow-[0_0_40px_rgba(197,160,89,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              無料相談 / 事前カウンセリング
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
