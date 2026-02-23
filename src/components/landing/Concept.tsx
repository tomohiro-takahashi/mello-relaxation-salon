'use client';

import { motion } from 'framer-motion';

export default function Concept() {
  return (
    <section className="px-6 py-6 md:py-24 bg-background-dark relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="space-y-6 md:space-y-12"
        >
          <div className="inline-block">
            <h2 className="text-primary font-serif text-sm font-bold tracking-[0.4em] uppercase mb-4">
              Concept
            </h2>
            <div className="h-px w-full bg-linear-to-r from-transparent via-primary/50 to-transparent"></div>
          </div>

          <p className="text-text-cream font-serif text-lg md:text-3xl leading-loose md:leading-[2.2] tracking-[0.15em] md:tracking-widest max-w-3xl mx-auto">
            身体の凝りだけを解しても、<br />
            心に重い澱（おり）が<br className="md:hidden" />溜まっていては、<br />
            真の癒やしは訪れません。
          </p>

          <div className="max-w-2xl mx-auto space-y-4 md:space-y-8">
            <p className="text-text-muted text-xs md:text-lg leading-relaxed font-light px-4 md:px-0">
              「理」にかなった解剖学的アプローチと、<br className="md:hidden" />「情」を満たす密着。<br />
              その二つが重なる時、あなたは<br className="md:hidden" />一人の女性としての自分を取り戻します。
            </p>
          </div>
        </motion.div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/2 rounded-full blur-[100px] -z-10"></div>
    </section>
  );
}
