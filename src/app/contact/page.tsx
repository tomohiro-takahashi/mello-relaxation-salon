'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('送信に失敗しました');

      setIsSuccess(true);
    } catch (err) {
      setError('申し訳ありません。送信中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-text-cream font-serif pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
            <Sparkles size={14} className="text-primary" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Support & Inquiry</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-text-cream">Contact</h1>
          <p className="text-text-muted font-sans text-sm md:text-base leading-relaxed">
            どのようなことでも、お気軽にお尋ねください。<br className="hidden md:block" />
            一ノ瀬または専任スタッフが丁寧にお答えいたします。
          </p>
        </header>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface/30 backdrop-blur-xl border border-white/5 rounded-4xl p-12 text-center space-y-6"
            >
              <div className="size-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary">
                <CheckCircle size={40} />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold tracking-wider">送信完了</h2>
                <p className="text-text-muted font-sans text-sm leading-relaxed">
                  お問い合わせありがとうございます。<br />
                  内容を確認の上、通常24時間以内にご返信差し上げます。
                </p>
              </div>
              <button 
                onClick={() => window.location.href = '/'}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 px-8 text-sm font-bold tracking-widest hover:bg-white/10 transition-all font-sans"
              >
                トップページへ戻る
              </button>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <div className="space-y-6 font-sans">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted ml-1">Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="お名前（フルネーム）"
                    className="w-full bg-surface/30 border border-white/10 rounded-2xl p-4 text-text-cream placeholder-text-muted/30 focus:outline-none focus:border-primary/50 transition-all text-sm md:text-base"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted ml-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="example@mello.jp"
                    className="w-full bg-surface/30 border border-white/10 rounded-2xl p-4 text-text-cream placeholder-text-muted/30 focus:outline-none focus:border-primary/50 transition-all text-sm md:text-base"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted ml-1">Message</label>
                  <textarea 
                    required
                    rows={6}
                    placeholder="ご質問、ご要望などをご自由に入力ください。"
                    className="w-full bg-surface/30 border border-white/10 rounded-2xl p-4 text-text-cream placeholder-text-muted/30 focus:outline-none focus:border-primary/50 transition-all resize-none text-sm md:text-base"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-xs text-center font-sans tracking-tight">{error}</p>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 bg-primary text-background-dark rounded-2xl font-bold tracking-[0.2em] shadow-[0_0_30px_rgba(197,160,89,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>SEND MESSAGE</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
