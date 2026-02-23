import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import { sendDiscordNotification, formatBookingMessage } from '@/lib/utils/notifications';

const BookingSchema = z.object({
  therapistId: z.string(),
  courseId: z.string(),
  date: z.string(),
  time: z.string(),
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  sessionId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = BookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid booking data', details: result.error.format() }, { status: 400 });
    }

    const adminDb = getAdminDb();
    if (!adminDb) {
      return NextResponse.json({ error: 'Database service is unavailable' }, { status: 500 });
    }

    const bookingData = {
      ...result.data,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await adminDb.collection('bookings').add(bookingData);

    // 予約NG枠を自動生成 (コース時間 + 前後1時間)
    const selectedDate = result.data.date;
    const selectedTime = result.data.time; // "20:00"
    const courseId = result.data.courseId;
    const hour = parseInt(selectedTime.split(':')[0]);
    
    // コースに応じたブロック枠数の決定
    let blockCount = 3; // Default (Standard)
    if (courseId === 'trial') blockCount = 2; // (1h before + 2h course + 1h after = 4h total slot coverage)
    if (courseId === 'premium') blockCount = 4; // (1h before + 3h course + 1h after = 5h total slot coverage)
    // Wait, my loop i is relative to start hour.
    // i=-1 is buffer before. i=0 is start.
    // Trial (2h): 19, 20, 21. Wait, 20:00-22:00. Buffer after is 23:00. So 19, 20, 21, 22. (i=-1 to 2)
    // Standard (2.5h): 19, 20, 21, 22 + buffer finish 23:30. So 19, 20, 21, 22, 23. (i=-1 to 3)
    // Premium (3h): 19, 20, 21, 22 + buffer finish 00:00. So 19, 20, 21, 22, 23, 00. (i=-1 to 4)
    
    let endI = 3; 
    if (courseId === 'trial') endI = 2;
    if (courseId === 'premium') endI = 4;

    const blockedSlots = [];
    for (let i = -1; i <= endI; i++) {
        let h = (hour + i) % 24;
        if (h < 0) h += 24;
        blockedSlots.push(`${h.toString().padStart(2, '0')}:00`);
    }

    await adminDb.collection('availability').doc(selectedDate).set({
      date: selectedDate,
      blockedSlots: Array.from(new Set([...blockedSlots])), // 重複除去
      updatedAt: new Date()
    }, { merge: true });

    // Discord 通知を送信
    await sendDiscordNotification(formatBookingMessage(result.data));

    return NextResponse.json({ 
      success: true, 
      bookingId: docRef.id,
      message: '予約リクエストを受け付けました。' 
    });
  } catch (error) {
    console.error('Booking API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
