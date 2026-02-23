import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import { sendDiscordNotification, formatBookingMessage } from '@/lib/utils/notifications';

const BookingSchema = z.object({
  therapistId: z.string(),
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
