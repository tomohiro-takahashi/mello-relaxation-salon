'use client';

import { Star, Quote, Users, RotateCcw, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    quote: "最初は『こういうの利用するなんて...』って罪悪感があったけど、専任のカウンセラーに話を聞いてもらって、『自分を大切にしていいんだ』って思えました。実際に会ったセラピストの方も優しくて、本当に来てよかった。",
    author: "K.M. さん",
    age: "27歳",
    occupation: "会社員",
    situation: "仕事と育児の両立に疲れて",
    image: "/assets/landing/testimonial_1.png",
    rating: 5
  },
  {
    id: 2,
    quote: "夫との関係に悩んでて、誰にも相談できなくて...。でもここでは全部話せた。セラピストさんが『大変でしたね』って言ってくれた時、涙が出ました。体も心も, すごく軽くなった。",
    author: "A.T. さん",
    age: "42歳",
    occupation: "専業主婦",
    situation: "パートナーとの距離感に孤独を感じて",
    image: "/assets/landing/testimonial_2.png",
    rating: 5
  },
  {
    id: 3,
    quote: "『マッサージ』って言うけど、本当に技術がちゃんとしてる。肩こりが嘘みたいに楽になって驚きました。それに、話もちゃんと聞いてくれる。ただのリラクゼーションじゃない、『寄り添い』がある。",
    author: "R.S. さん",
    age: "34歳",
    occupation: "管理職",
    situation: "慢性的な肩こりとストレスで",
    image: "/assets/landing/testimonial_3.png",
    rating: 5
  }
];

const stats = [
  { label: "もう一度体験したい", value: "96", unit: "%" },
  { label: "自分へのご褒美として満足", value: "98", unit: "%" },
  { label: "満足度（5点満点）", value: "4.9", unit: "" }
];

export default function Testimonials() {
  return (
    <section className="bg-background-dark py-12 md:py-24 overflow-hidden">
      <div className="px-6 mb-8 md:mb-16 text-center">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-primary tracking-wide text-xs font-bold uppercase mb-4"
        >
          Social Proof
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-text-cream text-3xl md:text-5xl font-serif font-bold leading-tight mb-6"
        >
          ご利用いただいた方の声
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-text-muted text-sm md:text-xl font-normal leading-relaxed max-w-xs md:max-w-md mx-auto"
        >
          一人ひとりのストーリーに寄り添う、確かな変化。
        </motion.p>
      </div>

      {/* Stats Section */}
      <div className="mb-16 md:mb-20 px-6 py-12 md:py-16 bg-surface/20 rounded-[3rem] max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-serif font-bold text-text-cream mb-4">事前体験でいただいた評価</h3>
          <div className="h-1 w-12 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-6 md:p-8 bg-background-dark/50 border border-white/5 rounded-2xl gap-3"
            >
              <div className="flex items-center gap-4 md:gap-5 flex-1 overflow-hidden">
                <div className="size-12 md:size-16 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {index === 0 && <RotateCcw size={24} className="md:w-8 md:h-8" />}
                  {index === 1 && <Users size={24} className="md:w-8 md:h-8" />}
                  {index === 2 && <ThumbsUp size={24} className="md:w-8 md:h-8" />}
                </div>
                <p className="font-bold text-base md:text-xl text-text-cream leading-tight">{stat.label}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-3xl md:text-5xl font-serif font-bold text-primary">{stat.value}</span>
                <span className="text-sm md:text-base font-bold text-primary ml-0.5">{stat.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button className="w-full max-w-sm bg-primary text-background-dark font-bold py-5 rounded-full shadow-xl shadow-primary/20 active:scale-95 transition-all hover:bg-primary-dark">
            事前体験を無料予約する
          </button>
        </div>
      </div>

      {/* Carousel-like Grid for Mobile, Grid for Desktop */}
      <div className="flex overflow-x-auto snap-x snap-mandatory px-6 gap-6 pb-12 no-scrollbar md:grid md:grid-cols-3 md:max-w-6xl md:mx-auto md:overflow-visible">
        {testimonials.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="snap-center flex-none w-[85vw] md:w-auto bg-surface/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-primary/30 transition-colors"
          >
            <Quote className="absolute -right-4 -top-4 text-primary opacity-5 w-32 h-32 rotate-12" />
            
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-bold mb-6 uppercase tracking-wider">
              {item.situation}
            </div>

            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  className={i < item.rating ? "text-primary fill-primary" : "text-white/20"} 
                />
              ))}
            </div>

            <p className="text-text-cream/90 text-base md:text-lg leading-relaxed mb-8 italic font-light">
              「{item.quote}」
            </p>

            <div className="flex items-center gap-4 mt-auto">
              <div 
                className="size-12 rounded-full bg-cover bg-center ring-2 ring-primary/20 grayscale group-hover:grayscale-0 transition-all duration-500" 
                style={{ backgroundImage: `url('${item.image}')` }}
              ></div>
              <div>
                <p className="font-serif font-bold text-text-cream text-base">{item.author}</p>
                <p className="text-xs text-text-muted">{item.age} / {item.occupation}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
