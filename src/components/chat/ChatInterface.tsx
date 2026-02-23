'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Sparkles, AlertCircle, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { nanoid } from 'nanoid';
import { useMessageThrottle } from '@/hooks/useMessageThrottle';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  
  const [sessionId, setSessionId] = useState('');
  const [userId, setUserId] = useState('');

  const { isBlocked, warning, checkThrottle } = useMessageThrottle();
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // セッションIDとユーザーIDの初期化（ブラウザ側のみ）
    const savedSession = localStorage.getItem('yuzuriha_session_id');
    const lastActivity = localStorage.getItem('yuzuriha_last_activity');
    const now = Date.now();
    const TWO_HOURS = 2 * 60 * 60 * 1000;

    // 2時間以上経過している場合はセッションをリセット
    const isExpired = lastActivity && (now - parseInt(lastActivity)) > TWO_HOURS;
    
    let currentSessionId: string;
    if (savedSession && !isExpired) {
      currentSessionId = savedSession;
    } else {
      currentSessionId = `session_${now}`;
      localStorage.setItem('yuzuriha_session_id', currentSessionId);
    }
    setSessionId(currentSessionId);
    localStorage.setItem('yuzuriha_last_activity', now.toString());

    const savedUser = localStorage.getItem('yuzuriha_user_id');
    const currentUserId = savedUser || `user_${Math.random().toString(36).substr(2, 9)}`;
    if (!savedUser) localStorage.setItem('yuzuriha_user_id', currentUserId);
    setUserId(currentUserId);
    // Initial Greeting
    if (messages.length === 0) {
      setMessages([{
        id: 'initial',
        role: 'assistant',
        content: 'こんにちは。リラクゼーションサロン楪（ゆずりは）マネージャーの一ノ瀬です。今日はどんな一日でしたか？何かお話ししたいことがあれば、ゆっくりと聞かせてくださいね。',
        timestamp: new Date()
      }]);
    }
  }, []);

  // 滑らかなオートスクロールの実行
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleReset = () => {
    if (confirm('会話をリセットして、最初からやり直しますか？')) {
      localStorage.removeItem('yuzuriha_session_id');
      const newId = `session_${Date.now()}`;
      localStorage.setItem('yuzuriha_session_id', newId);
      setSessionId(newId);
      setMessages([{
        id: 'initial',
        role: 'assistant',
        content: 'こんにちは。リラクゼーションサロン楪（ゆずりは）マネージャーの一ノ瀬です。今日はどんな一日でしたか？何かお話ししたいことがあれば、ゆっくりと聞かせてくださいね。',
        timestamp: new Date()
      }]);
      setIsLimitReached(false);
      setInput('');
    }
  };

  const handleSend = async () => {
    const currentInput = input.trim();
    if (!currentInput || isLoading || isBlocked || isLimitReached) return;

    // スロットルチェック
    const throttleResult = checkThrottle();
    if (!throttleResult.allowed) return;

    // 即座にステートをクリアし、通信を開始
    setInput('');
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: nanoid(),
      role: 'user',
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          sessionId,
          userId,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) throw new Error(data.error || '通信エラーが発生しました');

      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // 最終活動時刻を更新
      localStorage.setItem('yuzuriha_last_activity', Date.now().toString());

      if (data.isLimitReached) {
        setIsLimitReached(true);
      }
    } catch (error: any) {
      console.error('Chat Error:', error);
      const errorMessage: ChatMessage = {
        id: nanoid(),
        role: 'assistant',
        content: `申し訳ありません。エラーが発生しました: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-dvh bg-background-dark text-text-cream overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-background-dark/80 backdrop-blur-md relative z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sparkles className="text-primary w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base md:text-lg font-serif font-bold text-text-cream leading-tight overflow-wrap-break-word">
              一ノ瀬 <span className="text-[10px] md:text-xs font-normal opacity-70 block md:inline md:ml-1">(マネージャー兼カウンセラー)</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleReset}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-cream transition-all flex items-center gap-2 text-xs"
          title="会話をリセット"
        >
          <RefreshCcw size={14} />
          <span className="hidden sm:inline">リセット</span>
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide relative min-h-0"
      >
        {/* Background Decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

        <AnimatePresence initial={false}>
          {messages.length === 0 && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="size-20 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                <Sparkles className="text-primary w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-serif font-bold text-text-cream">穏やかなひとときを</h2>
                <p className="text-text-muted text-sm max-w-[240px] leading-relaxed mx-auto font-sans">
                  どのようなことでも、ゆっくりとお話しください。あなたの声に寄り添います。
                </p>
              </div>
            </motion.div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex w-full items-start gap-4",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "size-9 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500",
                msg.role === 'user' 
                  ? "bg-surface-light/50 border-white/10" 
                  : "bg-primary/10 border-primary/20"
              )}>
                {msg.role === 'user' ? <User size={16} className="text-text-cream/60" /> : <Sparkles size={16} className="text-primary" />}
              </div>
              
              <div className={cn(
                "max-w-[85%] px-5 py-4 rounded-3xl shadow-xl leading-relaxed text-[15px] font-sans",
                msg.role === 'user'
                  ? "bg-primary text-background-dark font-bold rounded-tr-none"
                  : "bg-surface/40 backdrop-blur-xl border border-white/5 rounded-tl-none text-text-cream/90"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-4"
            >
              <div className="size-9 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/20">
                <Sparkles size={16} className="text-primary animate-pulse" />
              </div>
              <div className="flex space-x-1.5 px-6 py-5 bg-surface/30 backdrop-blur-md rounded-3xl border border-white/5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                    className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(197,160,89,0.5)]"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* レート制限の警告表示 */}
        <AnimatePresence>
          {warning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-2 text-xs text-primary font-medium mx-auto max-w-fit"
            >
              <AlertCircle size={14} />
              {warning}
            </motion.div>
          )}
        </AnimatePresence>

        {/* スクロール用のアンカー要素 */}
        <div ref={bottomRef} className="h-4 w-full shrink-0" />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-background-dark/80 backdrop-blur-2xl border-t border-white/5 relative z-20 shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-3 bg-surface/40 backdrop-blur-md p-2 md:p-3 rounded-3xl md:rounded-4xl border border-white/10 focus-within:border-primary/50 transition-all duration-500">
            {isLimitReached ? (
              <div className="flex-1 flex flex-col items-center py-4 gap-4">
                <p className="text-sm text-text-muted font-medium">今日はたくさんお話ししましたね。続きはぜひ、サロンで...</p>
                <button
                  onClick={() => window.location.href = '/booking'}
                  className="bg-primary text-background-dark px-8 py-3 rounded-xl font-bold tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                >
                  実際にサロンで話してみる
                </button>
              </div>
            ) : (
              <>
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      const val = e.currentTarget.value;
                      if (val.trim()) {
                        handleSend();
                      }
                    }
                  }}
                  placeholder={isBlocked ? "30秒ほど休憩しましょう..." : "あなたの想いを綴ってください..."}
                  disabled={isBlocked}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-text-cream placeholder-text-muted/40 resize-none py-3 px-4 min-h-[44px] max-h-32 md:max-h-48 font-sans text-base disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || isBlocked}
                  className={cn(
                    "size-10 md:size-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0",
                    input.trim() && !isLoading
                      ? "bg-primary text-background-dark shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:scale-105 active:scale-95"
                      : "bg-surface-light/50 text-text-muted/30"
                  )}
                >
                  <Send size={18} className={cn(input.trim() && !isLoading ? "translate-x-0.5 -translate-y-0.5" : "")} />
                </button>
              </>
            )}
          </div>
          <div className="hidden md:flex justify-center mt-4">
            <p className="text-[10px] text-text-muted/40 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="size-1 rounded-full bg-primary/30"></span>
              Secure & Private session
              <span className="size-1 rounded-full bg-primary/30"></span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


