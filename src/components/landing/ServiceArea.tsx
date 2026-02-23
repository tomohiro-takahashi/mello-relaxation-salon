'use client';

import { MapPin, Info, Car } from 'lucide-react';
import { motion } from 'framer-motion';

const areas = [
  { name: "池袋", type: "重点エリア", fee: "一律 1,000円" },
  { name: "川口", type: "重点エリア", fee: "一律 1,000円" },
  { name: "大宮", type: "重点エリア", fee: "一律 1,000円" },
];

const otherArea = {
  name: "東京23区（池袋以外）",
  fee: "一律 2,000円",
  note: "重点エリア外のため +1,000円"
};

export default function ServiceArea() {
  return (
    <section id="area" className="px-6 py-24 bg-background-dark overflow-hidden relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Text Info */}
          <div className="space-y-10 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-primary tracking-[0.3em] text-xs font-bold uppercase mb-4">Service Area</p>
              <h2 className="text-text-cream text-3xl md:text-5xl font-serif font-bold leading-tight mb-6">
                あなたの元へ、<br />至福の時間を。
              </h2>
              <p className="text-text-muted text-base md:text-lg leading-relaxed font-light">
                Mello（メロ）は、池袋・川口・大宮を中心とした<br className="hidden md:block" />
                出張リラクゼーションサービスです。<br />
                ご自宅やホテルへ、厳選されたセラピストが伺います。
              </p>
            </motion.div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {areas.map((area, idx) => (
                  <motion.div
                    key={area.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2 group hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-primary">
                      <MapPin size={16} />
                      <span className="text-xs font-bold tracking-widest">{area.type}</span>
                    </div>
                    <p className="text-text-cream text-xl font-bold font-serif">{area.name} エリア</p>
                    <div className="flex items-center gap-2 mt-2">
                       <Car size={14} className="text-text-muted" />
                       <p className="text-primary font-bold text-sm tracking-tighter">{area.fee}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="p-6 bg-surface/30 backdrop-blur-xl border border-white/5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-text-cream font-bold">{otherArea.name}</p>
                    <p className="text-text-muted text-xs">{otherArea.note}</p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <span className="text-primary font-serif text-2xl font-bold">{otherArea.fee}</span>
                  <span className="text-text-muted text-[10px] ml-1 uppercase tracking-tighter">(交通費込)</span>
                </div>
              </motion.div>

              <p className="flex items-start gap-2 text-text-muted text-[10px] md:text-xs leading-relaxed italic">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span>※セラピストの所在地や交通状況により、対応できないエリアがある場合がございます。詳細はお気軽にお問い合わせください。</span>
              </p>
            </div>
          </div>

          {/* Right: Visual Map Display */}
          <div className="relative order-1 lg:order-2 h-[300px] md:h-[500px] w-full flex items-center justify-center">
            {/* Abstract Map Background Elements */}
            <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full scale-75 animate-pulse"></div>
            
            <div className="relative w-full max-w-md aspect-square bg-linear-to-br from-white/10 to-transparent border border-white/5 rounded-full flex items-center justify-center p-8 backdrop-blur-sm overflow-hidden">
               {/* Orbital Rings */}
               <div className="absolute inset-4 border border-white/5 rounded-full"></div>
               <div className="absolute inset-16 border border-white/5 rounded-full"></div>
               <div className="absolute inset-32 border border-white/5 rounded-full opacity-30"></div>
               
               {/* Location Nodes */}
               <motion.div 
                 animate={{ scale: [1, 1.2, 1] }} 
                 transition={{ repeat: Infinity, duration: 3 }}
                 className="absolute top-[20%] right-[30%] flex flex-col items-center"
               >
                 <div className="size-4 md:size-6 bg-primary rounded-full shadow-[0_0_20px_rgba(197,160,89,0.8)] border-2 border-background-dark"></div>
                 <span className="mt-2 text-[10px] md:text-xs font-bold text-primary tracking-widest bg-background-dark/80 px-2 py-1 rounded">大宮</span>
               </motion.div>

               <motion.div 
                 animate={{ scale: [1, 1.1, 1] }} 
                 transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
                 className="absolute top-[45%] right-[45%] flex flex-col items-center"
               >
                 <div className="size-4 md:size-6 bg-primary/80 rounded-full shadow-[0_0_20px_rgba(197,160,89,0.6)] border-2 border-background-dark"></div>
                 <span className="mt-2 text-[10px] md:text-xs font-bold text-primary/80 tracking-widest bg-background-dark/80 px-2 py-1 rounded">川口</span>
               </motion.div>

               <motion.div 
                 animate={{ scale: [1, 1.3, 1] }} 
                 transition={{ repeat: Infinity, duration: 3.5, delay: 1 }}
                 className="absolute bottom-[20%] left-[35%] flex flex-col items-center"
               >
                 <div className="size-4 md:size-6 bg-primary rounded-full shadow-[0_0_20px_rgba(197,160,89,0.8)] border-2 border-background-dark"></div>
                 <span className="mt-2 text-[10px] md:text-xs font-bold text-primary tracking-widest bg-background-dark/80 px-2 py-1 rounded">池袋</span>
               </motion.div>

               <motion.div 
                 animate={{ scale: [1, 1.1, 1] }} 
                 transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
                 className="absolute top-[34%] right-[38%] flex flex-col items-center opacity-70 group/node"
               >
                 <div className="size-3 bg-primary/80 rounded-full shadow-[0_0_15px_rgba(197,160,89,0.4)] border border-background-dark"></div>
                 <span className="mt-1 text-[8px] text-primary font-bold block text-center">浦和</span>
               </motion.div>

               <div className="absolute bottom-[40%] left-[20%] opacity-80 group/node">
                 <div className="size-3.5 bg-primary/90 rounded-full shadow-[0_0_20px_rgba(197,160,89,0.5)] border border-background-dark"></div>
                 <span className="mt-1 text-[8px] text-primary font-bold block text-center">新宿</span>
               </div>

               <div className="absolute bottom-[30%] left-[15%] opacity-60 group/node">
                 <div className="size-3 bg-primary/70 rounded-full shadow-[0_0_10px_rgba(197,160,89,0.3)] border border-background-dark"></div>
                 <span className="mt-1 text-[8px] text-primary/90 font-bold block text-center">渋谷</span>
               </div>
               
               <div className="absolute bottom-[12%] right-[22%] opacity-70 group/node">
                 <div className="size-3 bg-primary/80 rounded-full shadow-[0_0_15px_rgba(197,160,89,0.4)] border border-background-dark"></div>
                 <span className="mt-1 text-[8px] text-primary font-bold block text-center">銀座</span>
               </div>

               {/* Map Grid Lines SVG */}
               <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100">
                  <path d="M20 30 Q 50 50, 80 20" stroke="currentColor" fill="none" strokeWidth="0.5" />
                  <path d="M10 70 Q 40 40, 70 80" stroke="currentColor" fill="none" strokeWidth="0.5" />
                  <path d="M30 10 L 70 90" stroke="currentColor" fill="none" strokeWidth="0.2" />
               </svg>
            </div>

            {/* Floating Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="absolute bottom-4 right-4 md:bottom-12 md:right-12 bg-primary/20 backdrop-blur-md border border-primary/30 p-4 rounded-2xl shadow-2xl"
            >
               <p className="text-primary font-bold text-xs tracking-widest mb-1">Transportation Fee</p>
               <p className="text-text-cream text-lg font-serif">一律 <span className="text-2xl font-bold">¥1,000〜</span></p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
