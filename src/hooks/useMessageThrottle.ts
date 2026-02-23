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

    // 10秒で5回超過: 30秒ブロック（明らかな異常といえる）
    if (countLast10s >= 5) {
      setIsBlocked(true);
      setTimeout(() => setIsBlocked(false), 30000);
      return { allowed: false, reason: '少し時間が経ってからもう一度お送りください（30秒ほど休憩しましょう）' };
    }

    // 5秒で3回超過: 警告表示（送信は可能だが注意を促す）
    if (countLast5s >= 3) {
      setWarning('少し送信が早すぎます。ゆっくりお話ししましょう。');
      setTimeout(() => setWarning(null), 5000);
    }

    sentTimestamps.current.push(now);
    return { allowed: true };
  }, []);

  return { isBlocked, warning, checkThrottle };
}
