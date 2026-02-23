import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateSystemPrompt, MELLO_PERSONA_COMPLETE } from '../persona/yuzuriha-persona-complete';
import { Message, Conversation, ChatStage } from '@/types/database';

let modelCache: any = null;

function getIchinoseModel() {
  if (modelCache) return modelCache;
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. AI features will be unavailable.');
    return null;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  modelCache = genAI.getGenerativeModel({
    model: 'gemini-flash-latest',
    systemInstruction: generateSystemPrompt(MELLO_PERSONA_COMPLETE),
  });
  
  return modelCache;
}

const INITIAL_GREETING = 'こんにちは。リラクゼーションサロン Mello（メロ）マネージャーの一ノ瀬です。今日はどんな一日でしたか？何かお話ししたいことがあれば、ゆっくりと聞かせてくださいね。';

/**
 * AI応答の生成とコンテキストの更新
 */
export async function generateIchinoseResponse(
  userMessage: string,
  conversation: Conversation
): Promise<{
  response: string;
  updatedConversation: Conversation;
}> {
  try {
    // 1. まず現在のラウンド数を計算し、今回のリクエストに対するStageを決定する
    const baseMessages = conversation.messages.length === 0 
      ? [{ role: 'model' as const, content: INITIAL_GREETING, timestamp: new Date() as any }]
      : conversation.messages;
      
    const rounds = Math.floor((baseMessages.length + 1) / 2);
    let currentStage: ChatStage = conversation.summary.stage;

    if (rounds <= 3) currentStage = 'building_trust';
    else if (rounds <= 8) currentStage = 'emotional_release';
    else if (rounds <= 12) currentStage = 'needs_awareness';
    else if (rounds <= 15) currentStage = 'considering_service';
    else currentStage = 'ready_to_book';

    // 2. 履歴の変換
    let history = baseMessages.map((msg) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // 最初が user である必要があるため、model で始まる場合は削除
    while (history.length > 0 && history[0].role !== 'user') {
      history.shift();
    }

    // 3. Stage情報を渡してシステムプロンプトを生成
    const systemPrompt = generateSystemPrompt(MELLO_PERSONA_COMPLETE, {
      performedGapAnalysis: conversation.summary.performedGapAnalysis,
      currentStage: currentStage,
    });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({
      history,
    });

    // ユーザーメッセージを送信
    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();

    // メッセージ履歴の更新
    const newMessageList: Message[] = [
      ...baseMessages,
      {
        role: 'user' as const,
        content: userMessage,
        timestamp: new Date() as any,
      },
      {
        role: 'model' as const,
        content: responseText,
        timestamp: new Date() as any,
      },
    ];

    // 占い（矛盾分析）が提供されたかを簡易検知してフラグを更新
    const isInsightProvided = /OS|思考回路|行動原理|矛盾|自家中毒|図星/.test(responseText);
    const performedGapAnalysis = conversation.summary.performedGapAnalysis || isInsightProvided;

    const updatedConversation: Conversation = {
      ...conversation,
      messages: newMessageList,
      summary: {
        ...conversation.summary,
        stage: currentStage,
        performedGapAnalysis,
      },
      updatedAt: new Date() as any,
    };

    return {
      response: responseText,
      updatedConversation,
    };
  } catch (error) {
    console.error('Yuzuriha AI Error:', error);
    throw error;
  }
}
