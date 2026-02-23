import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { generateIchinoseResponse } from '@/lib/ai/ichinose';
import { Conversation, ChatStage } from '@/types/database';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

import { z } from 'zod';

const MAX_MESSAGES_PER_SESSION = 60; // 往復30回

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  sessionId: z.string().min(1),
  userId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = ChatRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request data', details: result.error.format() }, { status: 400 });
    }

    const { message, sessionId, userId } = result.data;

    const adminDb = getAdminDb();
    if (!adminDb) {
      return NextResponse.json({ error: 'Database service is unavailable. Check environment variables.' }, { status: 500 });
    }

    // 1. セッションの取得または新規作成
    const conversationRef = adminDb.collection('conversations').doc(sessionId);
    const doc = await conversationRef.get();

    let conversation: Conversation;

    if (!doc.exists) {
      conversation = {
        id: sessionId,
        userId,
        messages: [],
        summary: {
          emotionalState: [],
          keyTopics: [],
          needs: [],
          stage: 'building_trust',
          readyForBooking: false,
          performedGapAnalysis: false,
        },
        preferences: {},
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      };
    } else {
      conversation = doc.data() as Conversation;
    }

    // 1.5 上限チェック（往復30回 = 計60メッセージ）
    if (conversation.messages.length >= MAX_MESSAGES_PER_SESSION) {
      return NextResponse.json({
        response: "今日はたくさんお話ししましたね。少し心を休めてから、また明日お話ししましょう。あなたとの会話、私も大切に覚えていますよ。もしよければ、実際にサロンでお会いしてお話しできたら、一ノ瀬も嬉しいな、って。予約フォーム、よかったら覗いてみてくださいね。",
        isLimitReached: true,
        stage: conversation.summary.stage,
        sessionId: conversation.id,
      });
    }

    // 2. AI応答の生成
    const startTime = Date.now();
    
    let aiResult;
    try {
      aiResult = await generateIchinoseResponse(
        message,
        conversation
      );
    } catch (error: any) {
      if (error.message?.includes('429') || error.message?.includes('Quota exceeded')) {
        return NextResponse.json({ 
          error: '本日のカウンセリング回数の上限に達しました。Google APIの無料枠制限（20回/日）によるものです。明日またお話しできるのを楽しみにしています。',
          isQuotaExceeded: true 
        }, { status: 429 });
      }
      throw error;
    }

    const { response, updatedConversation } = aiResult;

    // 3. Firestore への保存
    await conversationRef.set({
      ...updatedConversation,
      updatedAt: new Date(),
    });

    // 「考えている時間」を演出（最低2秒、最大3.5秒）
    const duration = Date.now() - startTime;
    const minDelay = 2000;
    if (duration < minDelay) {
      await new Promise(resolve => setTimeout(resolve, minDelay - duration + Math.random() * 1500));
    }

    return NextResponse.json({
      response,
      stage: updatedConversation.summary.stage,
      sessionId: updatedConversation.id,
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: '申し訳ありません。技術的な問題が発生しました。少し時間を置いて再度お試しください。' }, { status: 500 });
  }
}
