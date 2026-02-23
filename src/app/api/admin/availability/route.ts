import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function GET(req: NextRequest) {
  try {
    const adminDb = getAdminDb();
    if (!adminDb) return NextResponse.json({ error: 'Database service is unavailable' }, { status: 500 });

    const snapshot = await adminDb.collection('availability').get();
    const availability = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(availability);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, blockedSlots, isFullDayBlocked } = body;

    if (!date) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

    const adminDb = getAdminDb();
    if (!adminDb) return NextResponse.json({ error: 'Database service is unavailable' }, { status: 500 });

    const docId = date; // 使用日期作为 ID
    await adminDb.collection('availability').doc(docId).set({
      date,
      blockedSlots: blockedSlots || [],
      isFullDayBlocked: !!isFullDayBlocked,
      updatedAt: new Date()
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
