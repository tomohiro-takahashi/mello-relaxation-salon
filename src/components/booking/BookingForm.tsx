'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, CheckCircle } from 'lucide-react';

export function BookingForm({ therapistId }: { therapistId: string }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    consent: false
  });

  const handleNext = () => setStep(prev => prev + 1);

  if (step === 3) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 py-12"
      >
        <div className="w-20 h-20 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
          <CheckCircle size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-light">予約リクエストを送信しました</h2>
          <p className="text-slate-400 font-sans">
            担当者より、折り返し確認のご連絡を差し上げます。<br />
            一ノ瀬とのお話の内容は、大切にセラピストへ共有されます。
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-md">
      <div className="flex justify-between mb-12">
        {[1, 2].map(i => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= i ? 'bg-[#D4AF37] text-slate-900 font-bold' : 'bg-slate-700 text-slate-400'}`}>
              {i}
            </div>
            <span className={`text-xs tracking-widest uppercase ${step >= i ? 'text-[#D4AF37]' : 'text-slate-500'}`}>
              {i === 1 ? '日時選択' : '情報入力'}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase tracking-widest">希望日</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="date" 
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase tracking-widest">希望時間</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <select 
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all appearance-none"
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                >
                  <option value="">選択してください</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00</option>
                </select>
              </div>
            </div>
          </div>
          <button 
            onClick={handleNext}
            disabled={!formData.date || !formData.time}
            className="w-full py-4 bg-[#D4AF37] text-slate-900 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            次へ進む
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="space-y-4 font-sans">
             <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="お名前（匿名可）"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-1 focus:ring-[#D4AF37] outline-none"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  placeholder="メールアドレス"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-1 focus:ring-[#D4AF37] outline-none"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="tel" 
                  placeholder="電話番号"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-1 focus:ring-[#D4AF37] outline-none"
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <input 
              type="checkbox" 
              className="mt-1 accent-[#D4AF37]" 
              onChange={(e) => setFormData({...formData, consent: e.target.checked})}
            />
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              一ノ瀬との会話内容をAIカルテとしてセラピストに共有することに同意します。
              これにより、よりパーソナライズされたケアを提供することが可能になります。
            </p>
          </div>

          <button 
            onClick={handleNext}
            disabled={!formData.name || !formData.consent}
            className="w-full py-4 bg-[#D4AF37] text-slate-900 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            予約を確定する
          </button>
        </motion.div>
      )}
    </div>
  );
}
