'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Users, TrendingUp, DollarSign, RefreshCcw, ArrowLeft } from 'lucide-react';

interface ChatStats {
  summary: {
    today: { sessions: number; messages: number };
    week: { sessions: number; messages: number };
    month: { sessions: number; messages: number };
    total: { sessions: number; messages: number };
    estimatedMonthlyCost: string;
  };
  recentSessions: {
    id: string;
    userName: string;
    userEmail: string;
    messageCount: number;
    stage: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

const STAGE_LABELS: Record<string, string> = {
  building_trust: '🤝 信頼構築',
  emotional_release: '💧 感情解放',
  needs_awareness: '💡 ニーズ顕在化',
  considering_service: '🏪 サービス検討',
  ready_to_book: '📅 予約準備',
  unknown: '❓ 不明',
};

export default function ChatStatsPage() {
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const password = localStorage.getItem('admin_password');
      if (!password) {
        setError('管理者パスワードが必要です。/admin からログインしてください。');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/admin/chat-stats', {
        headers: { Authorization: `Bearer ${password}` },
      });

      if (res.status === 401) {
        setError('認証エラー: 管理者パスワードが正しくありません。');
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error('データ取得に失敗しました');
      
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-gray-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/admin" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
              <ArrowLeft size={18} />
            </a>
            <div>
              <h1 className="text-2xl font-bold tracking-wider">💬 チャット統計</h1>
              <p className="text-sm text-gray-400 mt-1">一ノ瀬AIチャットの使用状況</p>
            </div>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {stats && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<Users size={20} />}
                label="今日のセッション"
                value={stats.summary.today.sessions}
                sub={`${stats.summary.today.messages} メッセージ`}
                color="text-blue-400"
              />
              <StatCard
                icon={<MessageSquare size={20} />}
                label="今週"
                value={stats.summary.week.sessions}
                sub={`${stats.summary.week.messages} メッセージ`}
                color="text-green-400"
              />
              <StatCard
                icon={<TrendingUp size={20} />}
                label="今月"
                value={stats.summary.month.sessions}
                sub={`${stats.summary.month.messages} メッセージ`}
                color="text-purple-400"
              />
              <StatCard
                icon={<DollarSign size={20} />}
                label="推定月額費用"
                value={stats.summary.estimatedMonthlyCost}
                sub="Gemini API"
                color="text-amber-400"
                isString
              />
            </div>

            {/* Recent Sessions */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold tracking-wider">最近のセッション</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-left">
                      <th className="py-3 px-4">名前</th>
                      <th className="py-3 px-4">メール</th>
                      <th className="py-3 px-4 text-center">メッセージ</th>
                      <th className="py-3 px-4">ステージ</th>
                      <th className="py-3 px-4">開始時刻</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentSessions.map((session) => (
                      <tr key={session.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                        <td className="py-3 px-4 font-medium">{session.userName}</td>
                        <td className="py-3 px-4 text-gray-400 text-xs">{session.userEmail}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-1 rounded-lg bg-white/5 text-xs font-bold">
                            {session.messageCount}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs">{STAGE_LABELS[session.stage] || session.stage}</td>
                        <td className="py-3 px-4 text-gray-400 text-xs">{formatDate(session.createdAt)}</td>
                      </tr>
                    ))}
                    {stats.recentSessions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">セッションデータがありません</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {loading && !stats && (
          <div className="flex items-center justify-center py-20">
            <RefreshCcw size={24} className="animate-spin text-gray-500" />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color, isString }: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub: string;
  color: string;
  isString?: boolean;
}) {
  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
      <div className={`${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold">{isString ? value : value.toLocaleString()}</p>
        <p className="text-xs text-gray-400 mt-1">{label}</p>
        <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}
