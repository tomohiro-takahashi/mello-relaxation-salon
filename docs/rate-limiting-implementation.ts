/**
 * 📦 納品ファイル: レート制限実装コード
 * 
 * このファイルの内容をそれぞれのコンポーネントに反映させることで、
 * 設計通りのレート制限が有効になります。
 */

/**
 * 1. useMessageThrottle.ts (Custom Hook)
 * 位置: src/hooks/useMessageThrottle.ts
 */
export const useMessageThrottleCode = `
import { useState, useCallback, useRef } from 'react';

export function useMessageThrottle() {
  const [isBlocked, setIsBlocked] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const sentTimestamps = useRef<number[]>([]);

  const checkThrottle = useCallback(() => {
    const now = Date.now();
    // 10秒より古いタイムスタンプを削除
    sentTimestamps.current = sentTimestamps.current.filter(t => now - t < 10000);
    
    const countLast5s = sentTimestamps.current.filter(t => now - t < 5000).length;
    const countLast10s = sentTimestamps.current.length;

    if (countLast10s >= 5) {
      setIsBlocked(true);
      setTimeout(() => setIsBlocked(false), 30000);
      return { allowed: false, reason: 'ブロック中' };
    }

    if (countLast5s >= 3) {
      setWarning('少し送信が早すぎます。ゆっくりお話ししましょう。');
      setTimeout(() => setWarning(null), 5000);
    }

    sentTimestamps.current.push(now);
    return { allowed: true };
  }, []);

  return { isBlocked, warning, checkThrottle };
}
`;

/**
 * 2. API Route (Backend)
 * 位置: src/app/api/chat/route.ts
 */
export const apiRouteCode = `
import { z } from 'zod';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Zodによるスキーマ検証
const ChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  sessionId: z.string(),
  userId: z.string(),
});

// Upstash Redisを用いたレート制限設定
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, "1 h"),
  analytics: true,
});

// POSTハンドラー内での実装例
// const { success } = await ratelimit.limit(userId);
// if (!success) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
`;
