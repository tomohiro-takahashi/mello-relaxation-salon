import { Timestamp } from "firebase/firestore";

// 会話ログの1メッセージ
export interface Message {
  role: "user" | "model";
  content: string;
  timestamp: Timestamp;
}

// 会話ステージ (ボットの詳細設計 Version 2.0.0 に準拠)
export type ChatStage =
  | "building_trust" // Stage 1: 信頼構築 (1-5往復)
  | "emotional_release" // Stage 2: 感情の解放 (5-15往復)
  | "needs_awareness" // Stage 3: ニーズの顕在化 (15-20往復)
  | "considering_service" // Stage 4: サービス紹介 (20-25往復)
  | "ready_to_book"; // Stage 5: 予約サポート (25往復以降)

// 会話セッション
export interface Conversation {
  id: string;
  userId: string;
  messages: Message[];
  summary: {
    emotionalState: string[]; // detected: loneliness, exhaustion, anxiety, etc.
    keyTopics: string[]; // extracted topics
    needs: string[]; // inferred: connection, rest, respect, etc.
    attachmentStyle?: string; // inferred: anxious, avoidant, etc.
    cognitivePatterns?: string[]; // detected: black-and-white thinking, etc.
    stage: ChatStage;
    readyForBooking: boolean;
    performedGapAnalysis: boolean; // 占い（矛盾分析）提供済みフラグ
  };
  preferences: {
    atmosphere?: string;
    communicationStyle?: string;
    concerns?: string[];
  };
  matchedTherapistId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// セラピスト
export interface Therapist {
  id: string;
  name: string;
  photoUrl: string;
  bio: string;
  specialties: string[];
  tags: {
    stressTypes: string[];
    treatmentStyle: string[];
    communication: string[];
  };
  availability: {
    date: string; // YYYY-MM-DD
    slots: string[]; // ['19:00', '21:00']
  }[];
  active: boolean;
}

// 予約
export interface Booking {
  id: string;
  conversationId: string;
  userId: string;
  therapistId: string;
  dateTime: Timestamp;
  duration: number; // 分単位
  status: "pending" | "confirmed" | "completed" | "cancelled";
  clientBrief: {
    emotionalState: string;
    background: string;
    preferences: string;
    approach: string;
    avoid: string;
  };
  contactInfo: {
    name?: string;
    email?: string;
    phone?: string;
  };
  createdAt: Timestamp;
}

// ユーザー (匿名ユーザー管理)
export interface User {
  id: string;
  sessionIds: string[];
  bookingHistory: string[];
  createdAt: Timestamp;
  lastActiveAt: Timestamp;
}
