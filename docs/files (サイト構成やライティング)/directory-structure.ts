/**
 * プロジェクト全体のディレクトリ構造
 * Next.js 14 (App Router) + TypeScript
 */

/*
project-root/
├── .env.local                          # 環境変数
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
│
├── public/                             # 静的ファイル
│   ├── images/
│   │   ├── hero-bg.jpg
│   │   ├── therapists/
│   │   │   ├── aoi.jpg
│   │   │   ├── yuki.jpg
│   │   │   └── ...
│   │   └── icons/
│   │       ├── favicon.ico
│   │       └── logo.svg
│   └── fonts/
│
├── src/
│   ├── app/                            # App Router
│   │   ├── layout.tsx                  # ルートレイアウト
│   │   ├── page.tsx                    # ランディングページ (/)
│   │   ├── globals.css                 # グローバルスタイル
│   │   │
│   │   ├── chat/                       # AIチャット
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── therapists/                 # セラピスト一覧
│   │   │   ├── page.tsx
│   │   │   └── [id]/                   # セラピスト詳細
│   │   │       └── page.tsx
│   │   │
│   │   ├── booking/                    # 予約フォーム
│   │   │   ├── page.tsx
│   │   │   └── [id]/                   # 予約確認
│   │   │       └── confirm/
│   │   │           └── page.tsx
│   │   │
│   │   ├── about/                      # サービス詳細
│   │   │   └── page.tsx
│   │   │
│   │   ├── safety/                     # 安全・届出情報
│   │   │   └── page.tsx
│   │   │
│   │   ├── policy/                     # 規約・ポリシー
│   │   │   ├── terms/
│   │   │   │   └── page.tsx
│   │   │   ├── privacy/
│   │   │   │   └── page.tsx
│   │   │   └── commercial/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/                        # API Routes
│   │       ├── chat/
│   │       │   └── route.ts
│   │       ├── therapists/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── match/
│   │       │   └── route.ts
│   │       └── booking/
│   │           ├── route.ts
│   │           └── [id]/
│   │               └── route.ts
│   │
│   ├── components/                     # UIコンポーネント
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── InputArea.tsx
│   │   │   ├── TypingIndicator.tsx
│   │   │   └── TherapistRecommendation.tsx
│   │   │
│   │   ├── therapist/
│   │   │   ├── TherapistCard.tsx
│   │   │   ├── TherapistList.tsx
│   │   │   ├── TherapistDetail.tsx
│   │   │   ├── MatchScore.tsx
│   │   │   └── AvailabilityCalendar.tsx
│   │   │
│   │   ├── booking/
│   │   │   ├── BookingForm.tsx
│   │   │   ├── DateTimePicker.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── ConsentCheck.tsx
│   │   │   └── BookingConfirmation.tsx
│   │   │
│   │   ├── landing/
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── CTA.tsx
│   │   │
│   │   └── common/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── Modal.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Loading.tsx
│   │
│   ├── lib/                            # ライブラリ・ユーティリティ
│   │   ├── ai/
│   │   │   ├── gemini.ts               # Gemini API クライアント
│   │   │   ├── chat.ts                 # チャット処理
│   │   │   ├── matching.ts             # マッチングロジック
│   │   │   └── brief-generator.ts      # カルテ生成
│   │   │
│   │   ├── persona/                    # AI人格定義
│   │   │   ├── serene-persona-part1.ts
│   │   │   ├── serene-persona-part2.ts
│   │   │   ├── serene-persona-part3.ts
│   │   │   ├── serene-persona-part4.ts
│   │   │   └── serene-persona-complete.ts
│   │   │
│   │   ├── db/
│   │   │   ├── firestore.ts            # Firestore クライアント
│   │   │   ├── conversations.ts        # 会話履歴操作
│   │   │   ├── therapists.ts           # セラピスト操作
│   │   │   ├── bookings.ts             # 予約操作
│   │   │   └── users.ts                # ユーザー操作
│   │   │
│   │   ├── automation/
│   │   │   ├── make-webhook.ts         # Make.com連携
│   │   │   ├── calendar.ts             # Google Calendar
│   │   │   └── notifications.ts        # 通知送信
│   │   │
│   │   └── utils/
│   │       ├── date.ts                 # 日付処理
│   │       ├── validation.ts           # バリデーション
│   │       └── format.ts               # フォーマット
│   │
│   ├── types/                          # 型定義
│   │   ├── conversation.ts
│   │   ├── therapist.ts
│   │   ├── booking.ts
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   ├── hooks/                          # カスタムフック
│   │   ├── useChat.ts
│   │   ├── useTherapists.ts
│   │   ├── useBooking.ts
│   │   └── useSession.ts
│   │
│   └── styles/                         # スタイル
│       ├── chat.css
│       └── animations.css
│
├── firestore.rules                     # Firestore セキュリティルール
├── firestore.indexes.json              # Firestore インデックス
│
└── docs/                               # ドキュメント
    ├── README.md
    ├── SETUP.md
    ├── API.md
    └── DEPLOYMENT.md
*/

// ============================================================================
// 主要ファイルの概要
// ============================================================================

/**
 * src/app/page.tsx
 * ランディングページ
 * - Hero セクション
 * - Features（3つの特徴）
 * - How It Works
 * - Testimonials
 * - FAQ
 * - CTA
 */

/**
 * src/app/chat/page.tsx
 * AIチャット画面
 * - リアルタイムチャット
 * - セラピスト推薦モーダル
 * - 会話履歴保存
 */

/**
 * src/app/therapists/page.tsx
 * セラピスト一覧
 * - カード表示
 * - フィルタリング
 * - マッチ度表示
 */

/**
 * src/app/booking/page.tsx
 * 予約フォーム
 * - 日時選択
 * - 連絡先入力
 * - カルテ共有同意
 */

/**
 * src/app/api/chat/route.ts
 * チャットAPI
 * POST /api/chat
 * - メッセージ送信
 * - AI応答生成
 * - 会話履歴更新
 */

/**
 * src/lib/ai/gemini.ts
 * Gemini API クライアント
 * - API呼び出し
 * - System Prompt設定
 * - ストリーミング対応
 */

/**
 * src/lib/db/firestore.ts
 * Firestore クライアント
 * - 初期化
 * - CRUD操作
 * - リアルタイムリスナー
 */

// ============================================================================
// package.json の内容
// ============================================================================

const packageJson = {
  "name": "serene-ai-counselor",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@google/generative-ai": "^0.1.3",
    "firebase": "^10.7.1",
    "firebase-admin": "^12.0.0",
    "zod": "^3.22.4",
    "date-fns": "^3.0.0",
    "nanoid": "^5.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "lucide-react": "^0.294.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.0.4"
  }
};

// ============================================================================
// .env.local の内容
// ============================================================================

const envExample = `
# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (サーバーサイド)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Make.com
MAKE_WEBHOOK_URL=https://hook.make.com/xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;

// ============================================================================
// tailwind.config.ts の内容
// ============================================================================

const tailwindConfig = `
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C5A059', // Muted Gold
          dark: '#A68848',
        },
        background: {
          DEFAULT: '#0A0E14', // Deep Navy
          light: '#1A1E24',
        },
        surface: {
          DEFAULT: '#2A2E34',
          light: '#3A3E44',
        },
        text: {
          DEFAULT: '#F5F5F7', // Soft Cream
          muted: '#A0A0A8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
`;

export { packageJson, envExample, tailwindConfig };
