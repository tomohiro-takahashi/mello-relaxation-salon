'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Shield, Heart, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdultSection() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1, ease: "easeOut" }
  } as const;

  return (
    <section id="adult-area" className="relative px-6 py-12 md:py-24 bg-background-dark overflow-hidden">
      {/* Background Subtle Decor */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[5%] left-[5%] w-[400px] h-[400px] bg-primary/3 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[5%] right-[5%] w-[500px] h-[500px] bg-primary/2 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <motion.div 
          {...fadeInUp}
          className="text-center mb-12 md:mb-20"
        >
          <span className="text-primary tracking-[0.4em] text-xs font-bold uppercase mb-4 block">The Deepest Relaxation</span>
          <h2 className="text-text-cream text-4xl md:text-7xl font-serif font-bold tracking-wider leading-tight">
            感覚の深淵へ
          </h2>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-16 md:space-y-32">
          
          {/* Section 1: Introduction with Image */}
          <motion.div 
            {...fadeInUp}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-baseline">
              <span className="text-primary/40 font-serif text-2xl md:text-3xl">01</span>
              <h3 className="text-xl md:text-3xl text-text-cream font-serif font-bold border-b border-primary/20 pb-2 md:pb-4 flex-1">
                境界線を越える理由
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-sm md:text-xl leading-relaxed text-text-cream/90 font-light italic order-2 md:order-1">
                <p className="mb-4">
                  「癒やしの先に、まだ見ぬ自分を。
                </p>
                <p className="mb-4">
                  私たちが『女性用風俗』という形をあえて選んだのは、従来のサロンでは触れられなかった『本能の孤独』を癒やすためです。
                </p>
                <p>
                  理性という鎧を脱ぎ捨て、一人の女性としてただ愛おしまれる。
                  それは、大人の女性が明日を生きるために必要な、もっとも純粋な儀式だと私たちは考えます。」
                </p>
              </div>
              <div className="relative aspect-square md:aspect-[4/5] rounded-3xl md:rounded-4xl overflow-hidden border border-white/5 shadow-2xl order-1 md:order-2">
                <Image 
                  src="/images/adult/boundary.png"
                  alt="Boundary Concept"
                  fill
                  className="object-cover opacity-80"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-background-dark via-transparent to-transparent"></div>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Core Technique with Macro Image */}
          <motion.div 
            {...fadeInUp}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-baseline">
              <span className="text-primary/40 font-serif text-2xl md:text-3xl">02</span>
              <h3 className="text-xl md:text-3xl text-text-cream font-serif font-bold border-b border-primary/20 pb-2 md:pb-4 flex-1">
                施術の核心：技術が導く「多幸感（Euphoria）」
              </h3>
            </div>

            <div className="relative w-full h-48 md:h-96 rounded-3xl md:rounded-4xl overflow-hidden mb-6 border border-white/5 group">
              <Image 
                src="/images/adult/euphoria.png"
                alt="Euphoria"
                fill
                className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-[3000ms]"
              />
              <div className="absolute inset-0 bg-linear-to-b from-background-dark/40 via-transparent to-background-dark/40"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-primary">
                  <Sparkles size={16} />
                  <span className="text-xs font-bold tracking-widest uppercase">触感の設計</span>
                </div>
                <p className="text-text-muted text-xs md:text-base leading-relaxed font-light">
                  表参道で培ったのは、筋肉を解くだけの技術ではありません。あなたの肌が何を求めているのかを指先で聴き、呼吸を合わせ、深い安心感の中で感度を呼び覚ましていきます。
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-primary">
                  <Heart size={16} />
                  <span className="text-xs font-bold tracking-widest uppercase">全肯定の密着</span>
                </div>
                <p className="text-text-muted text-xs md:text-base leading-relaxed font-light">
                  一人で抱え込んできたストレスや緊張を、体温の共有によって溶かしていきます。あなたのすべてが肯定される、圧倒的な没入体験をお約束します。
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 3: Professionalism with Interior Image */}
          <motion.div 
            {...fadeInUp}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-baseline">
              <span className="text-primary/40 font-serif text-2xl md:text-3xl">03</span>
              <h3 className="text-xl md:text-3xl text-text-cream font-serif font-bold border-b border-primary/20 pb-2 md:pb-4 flex-1">
                セラピストの矜持：プロフェッショナルとしての寄り添い
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="md:col-span-2 relative aspect-video md:aspect-auto rounded-3xl md:rounded-4xl overflow-hidden border border-white/5">
                <Image 
                  src="/images/adult/sanctuary.png"
                  alt="Sanctuary"
                  fill
                  className="object-cover opacity-60"
                />
              </div>
              <div className="md:col-span-3 grid grid-cols-1 gap-4">
                <div className="p-6 md:p-8 bg-white/2 backdrop-blur-md border border-white/5 rounded-3xl md:rounded-4xl space-y-3">
                  <div className="flex items-center gap-3 text-primary/60">
                    <Shield size={16} />
                    <span className="text-xs font-bold tracking-widest uppercase">技術と倫理</span>
                  </div>
                  <p className="text-text-muted text-xs md:text-sm leading-relaxed font-light">
                    厳しい技術審査に加え、女性の心理を深く理解するための研修を修了したキャストのみが在籍しています。あなたの心に寄り添い、望まない強要は一切いたしません。
                  </p>
                </div>
                <div className="p-6 md:p-8 bg-white/2 backdrop-blur-md border border-white/5 rounded-3xl md:rounded-4xl space-y-3">
                  <div className="flex items-center gap-3 text-primary/60">
                    <EyeOff size={16} />
                    <span className="text-xs font-bold tracking-widest uppercase">プライバシー</span>
                  </div>
                  <p className="text-text-muted text-xs md:text-sm leading-relaxed font-light">
                    秘密は厳守されます。日常から完全に切り離された、あなただけの聖域を提供します。
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Final Path to Ichinose */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-16 md:mt-32 text-center"
        >
          <div className="bg-white/2 backdrop-blur-xl border border-white/5 rounded-4xl md:rounded-[3rem] p-8 md:p-20 space-y-8 md:space-y-12">
            <div className="space-y-4">
              <span className="text-primary tracking-[0.3em] text-[10px] md:text-xs font-bold uppercase block">Self-Liberation Inquiry</span>
              <h3 className="text-text-cream text-2xl md:text-4xl font-serif font-bold tracking-wider">
                あなたの「本当」に、<br className="md:hidden" />向き合う準備はできていますか。
              </h3>
            </div>

            <p className="text-text-muted text-base md:text-2xl font-light leading-relaxed italic max-w-2xl mx-auto">
              「ここから先は、言葉ではなく体験で。<br />
              一ノ瀬があなたの秘めたる願望を伺います。」
            </p>
            
            <Link 
              href="/chat"
              className="inline-flex group relative h-16 md:h-20 items-center justify-center rounded-full bg-primary px-10 md:px-16 text-background-dark text-lg md:text-xl font-bold tracking-widest shadow-[0_0_50px_rgba(197,160,89,0.3)] active:scale-95 transition-all hover:bg-primary-dark hover:shadow-[0_0_60px_rgba(197,160,89,0.5)]"
            >
              <span>チャットで無料相談</span>
              <ArrowRight className="ml-3 transition-transform group-hover:translate-x-2" size={24} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
