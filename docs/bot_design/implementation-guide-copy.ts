/**
 * Serene AI Counselor - 実装ガイド
 * Gemini API を使用した実装例
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateSystemPrompt, SERENE_PERSONA_COMPLETE } from './serene-persona-complete';

//=============================================================================
// 1. 基本設定
//=============================================================================

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 使用するモデル
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro', // または 'gemini-1.5-flash'
  systemInstruction: generateSystemPrompt(SERENE_PERSONA_COMPLETE)
});

//=============================================================================
// 2. 会話履歴の管理
//=============================================================================

interface Message {
  role: 'user' | 'model';
  parts: string;
  timestamp: Date;
}

interface SessionContext {
  sessionId: string;
  userId: string;
  conversationHistory: Message[];
  summary?: {
    emotionalState: string[];
    keyTopics: string[];
    stage: 'building_trust' | 'emotional_release' | 'needs_awareness' | 'considering_service' | 'ready_to_book';
  };
  preferences?: {
    atmosphere?: string;
    communication?: string;
    concerns?: string[];
  };
}

//=============================================================================
// 3. AI応答生成関数
//=============================================================================

/**
 * AIからの応答を生成
 */
export async function generateAIResponse(
  userMessage: string,
  sessionContext: SessionContext
): Promise<{
  response: string;
  updatedContext: SessionContext;
}> {
  try {
    // 会話履歴をGemini形式に変換
    const history = sessionContext.conversationHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.parts }]
    }));

    // チャットセッションを開始
    const chat = model.startChat({
      history: history
    });

    // ユーザーメッセージを送信
    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();

    // 会話履歴を更新
    const updatedHistory = [
      ...sessionContext.conversationHistory,
      {
        role: 'user' as const,
        parts: userMessage,
        timestamp: new Date()
      },
      {
        role: 'model' as const,
        parts: response,
        timestamp: new Date()
      }
    ];

    // コンテキストを更新
    const updatedContext: SessionContext = {
      ...sessionContext,
      conversationHistory: updatedHistory
    };

    return {
      response,
      updatedContext
    };

  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

//=============================================================================
// 4. Firestore連携（会話履歴の永続化）
//=============================================================================

import { Firestore } from '@google-cloud/firestore';

const db = new Firestore();

/**
 * セッションの保存
 */
export async function saveSession(context: SessionContext): Promise<void> {
  await db.collection('conversations').doc(context.sessionId).set({
    userId: context.userId,
    conversationHistory: context.conversationHistory,
    summary: context.summary,
    preferences: context.preferences,
    updatedAt: new Date()
  });
}

/**
 * セッションの読み込み
 */
export async function loadSession(sessionId: string): Promise<SessionContext | null> {
  const doc = await db.collection('conversations').doc(sessionId).get();
  
  if (!doc.exists) {
    return null;
  }
  
  const data = doc.data()!;
  
  return {
    sessionId,
    userId: data.userId,
    conversationHistory: data.conversationHistory || [],
    summary: data.summary,
    preferences: data.preferences
  };
}

//=============================================================================
// 5. Next.js API Route 実装例
//=============================================================================

/**
 * /api/chat/route.ts
 */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, userId } = await request.json();

    // セッションを読み込むか、新規作成
    let context = await loadSession(sessionId);
    
    if (!context) {
      context = {
        sessionId,
        userId,
        conversationHistory: []
      };
    }

    // AI応答を生成
    const { response, updatedContext } = await generateAIResponse(message, context);

    // セッションを保存
    await saveSession(updatedContext);

    return NextResponse.json({
      response,
      sessionId: updatedContext.sessionId
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

//=============================================================================
// 6. フロントエンド実装例（React）
//=============================================================================

/**
 * ChatInterface.tsx
 */
import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          sessionId,
          userId: 'anonymous' // または実際のユーザーID
        })
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Send message error:', error);
      // エラーハンドリング
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* ヘッダー */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <h1 className="text-xl font-semibold text-gray-100">Serene</h1>
        <p className="text-sm text-gray-400">あなたの話を聞かせてください</p>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>こんにちは。</p>
            <p>今日はどんな一日でしたか？</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 入力エリア */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="メッセージを入力..."
            className="flex-1 bg-gray-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}

//=============================================================================
// 7. 環境変数設定
//=============================================================================

/**
 * .env.local
 * 
 * GEMINI_API_KEY=your_gemini_api_key_here
 * GOOGLE_CLOUD_PROJECT=your_project_id
 */

//=============================================================================
// 8. パッケージのインストール
//=============================================================================

/**
 * npm install @google/generative-ai
 * npm install @google-cloud/firestore
 * npm install next react react-dom
 */

//=============================================================================
// 9. デプロイ（Vercel）
//=============================================================================

/**
 * vercel.json
 * 
 * {
 *   "env": {
 *     "GEMINI_API_KEY": "@gemini-api-key"
 *   }
 * }
 * 
 * コマンド:
 * vercel env add GEMINI_API_KEY
 * vercel deploy
 */

//=============================================================================
// 10. テスト
//=============================================================================

/**
 * 簡単なテスト関数
 */
export async function testChat() {
  const context: SessionContext = {
    sessionId: 'test_session',
    userId: 'test_user',
    conversationHistory: []
  };

  console.log('Test: 初回メッセージ');
  const result1 = await generateAIResponse('初めてで緊張してます', context);
  console.log('AI:', result1.response);

  console.log('\nTest: フォローアップ');
  const result2 = await generateAIResponse('どんなサービスなんですか？', result1.updatedContext);
  console.log('AI:', result2.response);
}

// テスト実行（開発環境のみ）
if (process.env.NODE_ENV === 'development') {
  // testChat();
}
