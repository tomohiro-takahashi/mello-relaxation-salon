import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, AlertTriangle } from 'lucide-react';

const STATIC_TIME_SLOTS = ["19:00", "20:00", "21:00"];

export function BookingForm({ therapistId }: { therapistId: string }) {
  const [step, setStep] = useState(1);
  const [availability, setAvailability] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    courseId: 'standard',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    consent: false
  });

  const COURSES = [
    { id: 'trial', name: 'Trial', label: '90分 (+30分無料)', total: 120 },
    { id: 'standard', name: 'Standard', label: '120分 (+30分無料)', total: 150 },
    { id: 'premium', name: 'Premium', label: '150分 (+30分無料)', total: 180 }
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [isInitLoading, setIsInitLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await fetch('/api/admin/availability');
      const data = await res.json();
      setAvailability(data);
    } catch (err) {
      console.error('Failed to fetch availability:', err);
    } finally {
      setIsInitLoading(false);
    }
  };

  const GENERATED_TIME_SLOTS = ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00", "01:00", "02:00", "03:00"];

  const handleDateChange = (date: string) => {
    setFormData({ ...formData, date, time: '' });
    const config = availability.find(a => a.date === date);
    if (config) {
      const blocked = config.blockedSlots || [];
      setAvailableSlots(GENERATED_TIME_SLOTS.filter(s => !blocked.includes(s)));
    } else {
      setAvailableSlots(GENERATED_TIME_SLOTS);
    }
  };

  const handleNext = () => setStep(prev => prev + 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    
    // session_id を取得
    const sessionId = localStorage.getItem('mello_session_id') || undefined;

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          therapistId,
          sessionId
        })
      });

      if (!res.ok) throw new Error('送信に失敗しました');

      setStep(3);
    } catch (err) {
      setError('申し訳ありません。エラーが発生しました。時間を置いて再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase tracking-widest">コース選択</label>
            <div className="grid grid-cols-1 gap-3">
              {COURSES.map(course => (
                <button
                  key={course.id}
                  onClick={() => setFormData({...formData, courseId: course.id})}
                  className={`flex justify-between items-center p-4 rounded-xl border transition-all ${formData.courseId === course.id ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]' : 'bg-slate-900/50 border-slate-700 text-slate-400'}`}
                >
                  <span className="font-bold">{course.name}</span>
                  <span className="text-xs">{course.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase tracking-widest">希望日</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="date" 
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                  onChange={(e) => handleDateChange(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase tracking-widest">希望時間</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <select 
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all appearance-none"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  disabled={!formData.date}
                >
                  <option value="">{formData.date ? '時間を選択してください' : '先に日付を選択してください'}</option>
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              {formData.date && availableSlots.length === 0 && (
                <p className="text-[10px] text-red-400 flex items-center gap-1 mt-1 font-sans">
                  <AlertTriangle size={12} />
                  選択した日はすべての枠が埋まっています。
                </p>
              )}
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

          {error && (
            <p className="text-red-400 text-xs text-center font-sans">{error}</p>
          )}

          <button 
            onClick={handleSubmit}
            disabled={!formData.name || !formData.consent || isLoading}
            className="w-full py-4 bg-[#D4AF37] text-slate-900 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? '送信中...' : '予約を確定する'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
