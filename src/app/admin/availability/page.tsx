'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Save, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const TIME_SLOTS = ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00", "01:00", "02:00", "03:00"];

export default function AvailabilityAdminPage() {
  const [availability, setAvailability] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await fetch('/api/admin/availability');
      const data = await res.json();
      setAvailability(data);
      
      const current = data.find((a: any) => a.date === selectedDate);
      if (current) {
        setBlockedSlots(current.blockedSlots || []);
      } else {
        setBlockedSlots([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    const current = availability.find((a: any) => a.date === date);
    setBlockedSlots(current ? current.blockedSlots : []);
  };

  const toggleSlot = (slot: string) => {
    setBlockedSlots(prev => 
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          blockedSlots
        })
      });
      if (!res.ok) throw new Error('保存に失敗しました');
      setMessage('保存完了しました');
      fetchAvailability();
    } catch (err) {
      setMessage('保存エラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center text-text-cream">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-slate-100 p-8 font-serif">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-light tracking-widest text-text-cream uppercase">Booking Management</h1>
          <button 
            onClick={() => window.location.href = '/'}
            className="text-xs text-text-muted hover:text-primary transition-colors uppercase tracking-[0.2em]"
          >
            ← Back to Site
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Calendar/Date Selection */}
          <section className="bg-surface/30 border border-white/10 rounded-3xl p-8 space-y-6 backdrop-blur-xl">
            <h2 className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-sm">
              <CalendarIcon size={18} />
              Select Date
            </h2>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full bg-background-dark border border-white/10 rounded-2xl p-4 text-text-cream focus:outline-none focus:border-primary transition-all font-sans"
            />
            <p className="text-xs text-text-muted font-sans font-light">
              ※ 予約不可（NG）にしたい時間を選択してください。
            </p>
          </section>

          {/* Time Slot Selection */}
          <section className="bg-surface/30 border border-white/10 rounded-3xl p-8 space-y-8 backdrop-blur-xl">
            <h2 className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-sm">
              <Clock size={18} />
              Manage Availability
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  onClick={() => toggleSlot(slot)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all font-sans ${
                    blockedSlots.includes(slot)
                      ? 'bg-red-500/10 border-red-500 text-red-400'
                      : 'bg-white/5 border-white/10 text-text-muted hover:border-primary/50'
                  }`}
                >
                  <span className="font-bold tracking-widest">{slot}</span>
                  <span className="text-[10px] uppercase tracking-widest">
                    {blockedSlots.includes(slot) ? 'NG (Blocked)' : 'OK (Available)'}
                  </span>
                </button>
              ))}
            </div>

            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-14 bg-primary text-background-dark rounded-2xl font-bold tracking-[0.2em] shadow-[0_0_30px_rgba(197,160,89,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span>SAVE CHANGES</span>
            </button>
            
            {message && (
              <p className={cn(
                "text-center text-xs font-sans tracking-widest",
                message.includes('保存完了') ? "text-green-400" : "text-red-400"
              )}>
                {message}
              </p>
            )}
          </section>
        </div>

        {/* Note Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4">
            <AlertCircle className="text-primary shrink-0" size={20} />
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-text-cream font-sans uppercase">Admin Notice</h3>
              <p className="text-xs text-text-muted font-sans leading-relaxed">
                ここでNGに設定した時間は、予約フォームから非表示になります。<br />
                また、**新規予約が入ると前後1時間を含めて自動的にブロック**されます。
              </p>
            </div>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4">
            <Clock className="text-primary shrink-0" size={20} />
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-text-cream font-sans uppercase">Business Hours</h3>
              <p className="text-xs text-text-muted font-sans leading-relaxed">
                現在の営業時間: **18:00 〜 翌04:00**<br />
                ※ この時間外のスロットは予約フォームに表示されません。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
