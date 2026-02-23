import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function GET(req: NextRequest) {
  try {
    const adminDb = getAdminDb();
    if (!adminDb) return NextResponse.json({ error: 'Database service is unavailable' }, { status: 500 });

    const doc = await adminDb.collection('settings').doc('business').get();
    if (!doc.exists) {
      // Default settings
      return NextResponse.json({
        openTime: '18:00',
        closeTime: '04:00',
        courses: [
          { id: 'trial', name: 'Trial', time: 90, bonus: 30, total: 120 },
          { id: 'standard', name: 'Standard', time: 120, bonus: 30, total: 150 },
          { id: 'premium', name: 'Premium', time: 150, bonus: 30, total: 180 }
        ]
      });
    }

    return NextResponse.json(doc.data());
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const adminDb = getAdminDb();
    if (!adminDb) return NextResponse.json({ error: 'Database service is unavailable' }, { status: 500 });

    await adminDb.collection('settings').doc('business').set({
      ...body,
      updatedAt: new Date()
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
