import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import { sendDiscordNotification, formatInquiryMessage } from '@/lib/utils/notifications';

const InquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = InquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid inquiry data', details: result.error.format() }, { status: 400 });
    }

    const adminDb = getAdminDb();
    if (!adminDb) {
      return NextResponse.json({ error: 'Database service is unavailable' }, { status: 500 });
    }

    const inquiryData = {
      ...result.data,
      status: 'new',
      createdAt: new Date(),
    };

    const docRef = await adminDb.collection('inquiries').add(inquiryData);

    // Discord 通知を送信
    await sendDiscordNotification(formatInquiryMessage(result.data));

    return NextResponse.json({ 
      success: true, 
      inquiryId: docRef.id,
      message: 'お問い合わせを送信しました。' 
    });
  } catch (error) {
    console.error('Inquiry API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
