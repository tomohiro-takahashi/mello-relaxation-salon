import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 管理者認証チェック
    const authHeader = req.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminDb = getAdminDb();
    if (!adminDb) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // 全セッションを取得（最新100件）
    const snapshot = await adminDb
      .collection('conversations')
      .orderBy('updatedAt', 'desc')
      .limit(100)
      .get();

    const sessions = snapshot.docs.map(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.() || new Date(data.createdAt);
      const updatedAt = data.updatedAt?.toDate?.() || new Date(data.updatedAt);
      
      return {
        id: doc.id,
        userName: data.userName || '不明',
        userEmail: data.userEmail || '不明',
        messageCount: data.messages?.length || 0,
        stage: data.summary?.stage || 'unknown',
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      };
    });

    // 集計
    const todaySessions = sessions.filter(s => new Date(s.createdAt) >= todayStart);
    const weekSessions = sessions.filter(s => new Date(s.createdAt) >= weekStart);
    const monthSessions = sessions.filter(s => new Date(s.createdAt) >= monthStart);

    const totalMessages = sessions.reduce((sum, s) => sum + s.messageCount, 0);
    const todayMessages = todaySessions.reduce((sum, s) => sum + s.messageCount, 0);
    const weekMessages = weekSessions.reduce((sum, s) => sum + s.messageCount, 0);
    const monthMessages = monthSessions.reduce((sum, s) => sum + s.messageCount, 0);

    // 推定API費用（Gemini Flash: $0.075/1M input tokens, $0.30/1M output tokens）
    // 1メッセージ ≒ 500 input tokens + 200 output tokens の見積もり
    const estimatedCostPerMessage = (500 * 0.075 + 200 * 0.30) / 1_000_000;
    const monthEstimatedCost = monthMessages * estimatedCostPerMessage;

    return NextResponse.json({
      summary: {
        today: { sessions: todaySessions.length, messages: todayMessages },
        week: { sessions: weekSessions.length, messages: weekMessages },
        month: { sessions: monthSessions.length, messages: monthMessages },
        total: { sessions: sessions.length, messages: totalMessages },
        estimatedMonthlyCost: `$${monthEstimatedCost.toFixed(4)}`,
      },
      recentSessions: sessions.slice(0, 20),
    });
  } catch (error: any) {
    console.error('Chat Stats Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
