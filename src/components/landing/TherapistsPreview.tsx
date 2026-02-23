'use client';

import { ArrowRight, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const therapists = [
  {
    name: "Ichinose",
    tagline: "マネージャー ｜ 寄り添い・カウンセリング",
    specialties: ["Empathy", "Psychology", "Gap Analysis"],
    bio: "あなたの本音に寄り添い、深層心理から癒やしを導き出します。",
    image: "/images/therapist-1.jpg",
    experience: "10年"
  },
  {
    name: "Takuya",
    tagline: "熟練の技術 ｜ 深層筋アプローチ",
    specialties: ["Deep Tissue", "Anatomy", "Skillful Touch"],
    bio: "解剖学に基づいた確かな技術で、体の芯から疲れを解きほぐします。",
    image: "/images/therapist-2.jpg",
    experience: "8年"
  },
  {
    name: "Ren",
    tagline: "安らぎの空間 ｜ ナチュラル・リフレッシュ",
    specialties: ["Gentle Flow", "Aroma Therapy", "Natural Healing"],
    bio: "穏やかな時間の中で、五感を研ぎ澄ます至福のひとときを提供します。",
    image: "/images/therapist-3.jpg",
    experience: "5年"
  }
];

export default function TherapistsPreview() {
  return (
    <section className="px-6 py-12 md:py-24 bg-background-dark overflow-hidden">
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-primary tracking-wide text-xs font-bold uppercase mb-4"
        >
          Professionals
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-text-cream tracking-tight text-3xl md:text-5xl font-serif font-bold leading-tight mb-6"
        >
          担当するセラピスト
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-text-muted text-base md:text-xl font-medium leading-relaxed max-w-xs md:max-w-md mx-auto"
        >
          経験豊富で、心優しいプロフェッショナルたち。
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {therapists.map((therapist, index) => (
          <motion.div 
            key={therapist.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-surface/30 backdrop-blur-xl border border-white/5 rounded-4xl overflow-hidden"
          >
            {/* Image Section */}
            <div className="relative h-80 overflow-hidden">
              <img 
                src={therapist.image} 
                alt={therapist.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-background-dark to-transparent opacity-60"></div>
              
              <div className="absolute bottom-6 left-6">
                <h3 className="text-text-cream text-2xl font-serif font-bold mb-1">{therapist.name}</h3>
                <p className="text-primary text-xs font-medium">{therapist.tagline}</p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-6">
                {therapist.specialties.map(s => (
                  <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-text-muted uppercase tracking-wider">
                    {s}
                  </span>
                ))}
              </div>

              <p className="text-text-muted text-sm leading-relaxed mb-8 h-12 overflow-hidden line-clamp-2">
                {therapist.bio}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-text-cream/60">
                  <BadgeCheck size={16} className="text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest">Exp: {therapist.experience}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-primary text-[10px] font-bold uppercase tracking-wider mb-1">AI Match</span>
                  <div className="text-text-muted text-xs font-medium italic">
                    診断後に％表示
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <Link 
          href="/therapists"
          className="inline-flex flex-col items-center gap-4 group"
        >
          <div className="flex items-center gap-3 text-text-cream text-lg font-serif group-hover:text-primary transition-colors">
            <span>全てのセラピストを見る</span>
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
          </div>
          <p className="text-text-muted text-xs">
            事前カウンセリングで、あなたに合った方をご提案します
          </p>
        </Link>
      </div>
    </section>
  );
}
