'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Save, 
  Loader2, 
  AlertCircle, 
  Lock, 
  User, 
  Phone, 
  Mail, 
  LayoutDashboard,
  LogOut,
  CalendarCheck
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const TIME_SLOTS = ["20:00", "21:00", "22:00", "23:00", "00:00", "01:00", "02:00"];

export default function AvailabilityAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [availability, setAvailability] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // セッションチェック（簡易）
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        sessionStorage.setItem('admin_authenticated', 'true');
        setIsAuthenticated(true);
        fetchData();
      } else {
        setLoginError('パスワードが正しくありません');
      }
    } catch (err) {
      setLoginError('エラーが発生しました');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [availRes, bookRes] = await Promise.all([
        fetch('/api/admin/availability'),
        fetch('/api/admin/bookings')
      ]);
      const availData = await availRes.json();
      const bookData = await bookRes.json();
      
      setAvailability(availData);
      setBookings(bookData);
      
      const current = availData.find((a: any) => a.date === selectedDate);
      setBlockedSlots(current ? current.blockedSlots || [] : []);
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
      fetchData();
    } catch (err) {
      setMessage('保存エラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  const blockAll = () => setBlockedSlots([...TIME_SLOTS]);
  const clearAll = () => setBlockedSlots([]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center p-6 font-serif">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-surface/30 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl"
        >
          <div className="text-center space-y-4 mb-10">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl text-text-cream font-light tracking-widest uppercase">Admin Lock</h1>
            <p className="text-text-muted text-xs tracking-widest uppercase">管理画面へのアクセスには鍵が必要です</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <input 
                type="password" 
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background-dark/50 border border-white/10 rounded-2xl py-4 px-6 text-text-cream focus:outline-none focus:border-primary transition-all text-center tracking-[0.5em]"
              />
              {loginError && <p className="text-red-400 text-[10px] text-center uppercase tracking-widest">{loginError}</p>}
            </div>
            <button className="w-full py-4 bg-primary text-background-dark rounded-2xl font-bold tracking-[0.2em] hover:scale-[1.02] transition-all">
              UNLOCK SESSION
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (isLoading) return <div className="flex h-screen items-center justify-center text-text-cream bg-[#0F0F1A]">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-[#0F0F1A] text-slate-100 p-6 md:p-12 font-serif overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-white/5">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-3xl font-light tracking-[0.2em] text-text-cream uppercase flex items-center gap-4">
              <LayoutDashboard className="text-primary" />
              Mello Admin Console
            </h1>
            <p className="text-[10px] text-text-muted tracking-[0.3em] uppercase">Salon Management & Availability</p>
          </div>
          <div className="flex items-center gap-4">
             <button 
              onClick={() => window.location.href = '/'}
              className="text-[10px] text-text-muted hover:text-primary transition-colors uppercase tracking-[0.2em] px-4 py-2 border border-white/5 rounded-full"
            >
              Site View
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-[10px] bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-red-500/20"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Availability Logic */}
          <div className="xl:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-surface/30 border border-white/10 rounded-[2rem] p-8 space-y-6 backdrop-blur-xl">
                <h2 className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
                  <CalendarIcon size={16} />
                  Date Selection
                </h2>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full bg-background-dark border border-white/10 rounded-2xl p-4 text-text-cream focus:outline-none focus:border-primary transition-all font-sans"
                />
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3 text-text-muted">
                    <Clock size={14} className="text-primary" />
                    <p className="text-[10px] uppercase tracking-widest">営業時間: 20:00 - 02:00</p>
                  </div>
                  <p className="text-[10px] text-text-muted/60 font-sans leading-relaxed">
                    ※ 特定の日時の予約をブロックしたい場合は右のパネルで選択してください。
                  </p>
                </div>
              </section>

              <section className="bg-surface/30 border border-white/10 rounded-[2rem] p-8 space-y-8 backdrop-blur-xl">
                <h2 className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
                  <Clock size={16} />
                  Availability Slots
                </h2>
                
                <div className="flex gap-2 mb-4">
                  <button 
                    onClick={blockAll}
                    className="flex-1 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all font-sans"
                  >
                    Block All
                  </button>
                  <button 
                    onClick={clearAll}
                    className="flex-1 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-[10px] uppercase tracking-widest hover:bg-green-500/20 transition-all font-sans"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      onClick={() => toggleSlot(slot)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all font-sans relative overflow-hidden group",
                        blockedSlots.includes(slot)
                          ? 'bg-red-500/5 border-red-500/50 text-red-400'
                          : 'bg-white/5 border-white/10 text-text-muted hover:border-primary/50'
                      )}
                    >
                      <span className="text-lg font-light tracking-tighter mb-1">{slot}</span>
                      <span className="text-[8px] uppercase tracking-widest opacity-60">
                        {blockedSlots.includes(slot) ? 'Blocked' : 'Open'}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full h-14 bg-primary text-background-dark rounded-2xl font-bold tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>SAVE SCHEDULE</span>
                  </button>
                  {message && (
                    <p className={cn(
                      "text-center text-[10px] font-sans tracking-widest uppercase",
                      message.includes('保存完了') ? "text-green-400" : "text-red-400"
                    )}>
                      {message}
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* Booking List */}
            <section className="bg-surface/30 border border-white/10 rounded-[2rem] p-8 space-y-6 backdrop-blur-xl overflow-hidden">
               <h2 className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
                  <CalendarCheck size={16} />
                  Recent Booking Requests
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="py-4 px-2 text-[10px] uppercase tracking-widest text-text-muted">Date</th>
                        <th className="py-4 px-2 text-[10px] uppercase tracking-widest text-text-muted">Time</th>
                        <th className="py-4 px-2 text-[10px] uppercase tracking-widest text-text-muted">Customer</th>
                        <th className="py-4 px-2 text-[10px] uppercase tracking-widest text-text-muted">Contact</th>
                        <th className="py-4 px-2 text-[10px] uppercase tracking-widest text-text-muted text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-sans">
                      {bookings.length > 0 ? bookings.map((booking: any) => (
                        <tr key={booking.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-2 text-text-cream tabular-nums">{booking.date}</td>
                          <td className="py-4 px-2 text-text-cream tabular-nums font-bold">{booking.time}</td>
                          <td className="py-4 px-2">
                             <div className="flex flex-col">
                               <span className="text-text-cream font-medium">{booking.name}</span>
                               <span className="text-[10px] text-primary/70 uppercase">{booking.courseId || 'Standard'}</span>
                             </div>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex flex-col text-[11px] text-text-muted">
                              <span className="flex items-center gap-1"><Phone size={10} /> {booking.phone || '-'}</span>
                              <span className="flex items-center gap-1"><Mail size={10} /> {booking.email || '-'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-right">
                             <span className={cn(
                               "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                               booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-primary/10 text-primary border-primary/20'
                             )}>
                               {booking.status || 'Pending'}
                             </span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-text-muted text-xs uppercase tracking-widest">No bookings found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </section>
          </div>

          {/* Quick Stats / Info Sidebar */}
          <div className="space-y-8">
             <section className="bg-primary/10 border border-primary/20 rounded-[2rem] p-8 space-y-4">
               <h3 className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Today's Summary</h3>
               <div className="space-y-6">
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Total Bookings</p>
                    <p className="text-4xl text-text-cream font-light">{bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length}</p>
                  </div>
                  <p className="text-[10px] text-primary/70 font-sans leading-relaxed">
                    ※ 本日の詳細な予約内容はリストを確認してください。Discord 通知も併せてご確認ください。
                  </p>
               </div>
             </section>

             <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] flex items-start gap-4">
              <AlertCircle className="text-primary shrink-0" size={18} />
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-text-cream font-sans uppercase tracking-widest">Security Notice</h3>
                <p className="text-[10px] text-text-muted font-sans leading-relaxed">
                  セッション情報は24時間保持されます。公共の端末で利用した際は必ずログアウトしてください。
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
