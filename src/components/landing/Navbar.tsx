'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, MessageCircle, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const menuItems = [
    { name: 'TOP', href: '/' },
    { name: '感覚の深淵（18歳以上）', href: '/adult-content' },
    { name: '施術の流れ', href: '/#process' },
    { name: '施術の理論と詳細', href: '/treatment' },
    { name: 'セラピスト', href: '/therapists' },
    { name: '料金プラン', href: '/#pricing' },
    { name: 'メインサイトへ戻る', href: '/' }, // Added more explicit back link
  ];

  const chatLinks = [
    { 
      label: '無料相談 / 事前カウンセリング', 
      href: '/chat', 
      icon: <Sparkles size={18} />,
      sub: 'サービスや予約についてのご相談'
    },
    { 
      label: '感情のデトックス / 24h受付', 
      href: '/chat', 
      icon: <Heart size={18} />,
      sub: '誰にも言えない思いや独り言に'
    },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-100 transition-all duration-500 ${
        scrolled ? 'bg-background-dark/80 backdrop-blur-xl py-4 border-b border-white/5' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Menu Button */}
          <button 
            onClick={() => setIsOpen(true)}
            className="flex size-10 items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white cursor-pointer hover:bg-white/10 transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link href="/" className="text-primary font-serif tracking-[0.2em] text-xs font-bold uppercase">
            楪（ゆずりは）
          </Link>

          {/* Chat Shortcut (Visible on scroll or always) */}
          <Link 
            href="/chat"
            className="flex size-10 items-center justify-center rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary cursor-pointer hover:bg-primary/30 transition-colors"
          >
            <MessageCircle size={20} />
          </Link>
        </div>
      </nav>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-110 bg-background-dark flex flex-col pt-24 px-8 overflow-y-auto"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 left-6 flex size-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white"
            >
              <X size={20} />
            </button>

            <div className="max-w-md mx-auto w-full space-y-12 pb-20">
              {/* Main Navigation Links */}
              <div className="space-y-6">
                <span className="text-primary/40 text-[10px] tracking-[0.4em] font-bold uppercase">Navigation</span>
                <div className="flex flex-col gap-4">
                  {menuItems.map((item, i) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link 
                        href={item.href}
                        className="text-2xl md:text-3xl text-text-cream font-serif font-medium hover:text-primary transition-colors flex items-center group"
                      >
                        {item.name}
                        <ArrowRight className="ml-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-primary" size={24} />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Chat Links Section */}
              <div className="space-y-6">
                <span className="text-primary/40 text-[10px] tracking-[0.4em] font-bold uppercase">Chat & Counseling</span>
                <div className="grid grid-cols-1 gap-4">
                  {chatLinks.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (menuItems.length + i) * 0.1 }}
                    >
                      <Link 
                        href={link.href}
                        className="block p-6 rounded-3xl bg-white/5 border border-white/10 group hover:bg-primary/5 hover:border-primary/20 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            {link.icon}
                          </div>
                          <div>
                            <p className="text-text-cream font-bold tracking-wider mb-1">{link.label}</p>
                            <p className="text-text-muted text-xs font-light">{link.sub}</p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer info in menu */}
              <div className="pt-12 border-t border-white/5 text-center">
                <p className="text-primary/60 font-serif text-sm tracking-widest mb-2">楪（ゆずりは）</p>
                <p className="text-white/20 text-[10px] tracking-widest uppercase italic">The Intersection of Relaxation & Instinct</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
