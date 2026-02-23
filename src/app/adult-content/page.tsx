'use client';

import AdultSection from '@/components/landing/AdultSection';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';

export default function AdultContentPage() {
  return (
    <div className="min-h-screen bg-background-dark text-text-cream">
      {/* Simple Header for Brand Identity */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-8 flex justify-between items-center bg-linear-to-b from-background-dark to-transparent">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-primary font-serif text-2xl font-bold tracking-widest"
        >
          楪 -YUZURIHA-
        </motion.div>
      </header>

      <main>
        {/* Reuse the previously created high-quality AdultSection */}
        <AdultSection />
      </main>

      <Footer />
    </div>
  );
}
