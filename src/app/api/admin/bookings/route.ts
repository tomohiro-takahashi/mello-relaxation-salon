import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function GET(req: NextRequest) {
  try {
    // 認証チェック（クッキー）
    const session = req.cookies.get('admin_session');
    if (session?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminDb = getAdminDb();
    if (!adminDb) return NextResponse.json({ error: 'Database service is unavailable' }, { status: 500 });

    // 最近の予約を50件取得
    const snapshot = await adminDb.collection('bookings')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }));

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
