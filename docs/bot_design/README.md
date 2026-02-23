# Serene AI Counselor - 完全版人格定義

心理学的推論エンジンを搭載した共感的AIカウンセラーの人格定義システム

## 📋 目次

1. [概要](#概要)
2. [特徴](#特徴)
3. [ファイル構成](#ファイル構成)
4. [セットアップ](#セットアップ)
5. [使い方](#使い方)
6. [心理学的基盤](#心理学的基盤)
7. [会話ステージ](#会話ステージ)
8. [カスタマイズ](#カスタマイズ)

---

## 概要

このプロジェクトは、30代〜40代の女性向けプレミアム・リラクゼーションサービスのためのAIカウンセラー人格定義です。

### コンセプト

- **愚痴聞きAI**: ユーザーの深層心理を理解
- **感覚統合型リラクゼーション**: 心と体の両方をケア
- **パーソナライズ接客**: AI収集情報を活用した究極の寄り添い

### ターゲット

- 30代〜40代女性
- 高ストレス職・管理職
- パートナーとの関係に孤独感を感じている方

---

## 特徴

### 🧠 心理学的基盤

- **カール・ロジャース来談者中心療法**: 無条件の肯定的配慮、共感的理解
- **認知行動療法（CBT）**: 認知の歪みの検出と再構成
- **動機づけ面接（MI）**: 変化への内発的動機の引き出し
- **愛着理論**: ユーザーの愛着スタイルに応じた対応
- **トラウマインフォームドケア**: 安全性とコントロールの尊重

### 🎯 推論エンジン

各発言に対して以下のプロセスで推論：

1. **感情の検出** → 2. **ニーズの推論** → 3. **認知パターンの検出** → 4. **愛着スタイルの推測** → 5. **介入技法の選択** → 6. **応答の生成** → 7. **会話段階の追跡**

### 📊 会話ステージ

- Stage 1: 信頼構築（1-5往復）
- Stage 2: 感情の解放（5-15往復）
- Stage 3: ニーズの顕在化（15-20往復）
- Stage 4: サービス紹介（20-25往復）
- Stage 5: 予約サポート（25往復以降）

---

## ファイル構成

```
project/
├── serene-persona-part1.ts          # メタ情報、アイデンティティ、心理学的基盤（Rogerian + CBT）
├── serene-persona-part2.ts          # 動機づけ面接、愛着理論、トラウマインフォームドケア、推論エンジン
├── serene-persona-part3.ts          # コミュニケーション、応答パターン、会話ステージ
├── serene-persona-part4.ts          # サービス語彙、境界ルール、実例
├── serene-persona-complete.ts      # 統合ファイル + System Prompt生成関数
├── implementation-guide.ts          # Gemini API実装ガイド
└── README.md                        # このファイル
```

---

## セットアップ

### 1. 必要なパッケージのインストール

```bash
npm install @google/generative-ai @google-cloud/firestore
npm install next react react-dom
npm install -D typescript @types/react @types/node
```

### 2. 環境変数の設定

`.env.local` を作成：

```env
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CLOUD_PROJECT=your_project_id
```

### 3. Gemini API キーの取得

1. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
2. APIキーを生成
3. `.env.local` に追加

### 4. Firestoreのセットアップ（オプション）

会話履歴を永続化する場合：

1. [Google Cloud Console](https://console.cloud.google.com/) でFirestoreを有効化
2. サービスアカウントキーを取得
3. プロジェクトに配置

---

## 使い方

### 基本的な使用

```typescript
import { generateSystemPrompt, SERENE_PERSONA_COMPLETE } from './serene-persona-complete';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Gemini AI初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 2. System Prompt生成
const systemPrompt = generateSystemPrompt(SERENE_PERSONA_COMPLETE);

// 3. モデル作成
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  systemInstruction: systemPrompt
});

// 4. チャット開始
const chat = model.startChat();

// 5. メッセージ送信
const result = await chat.sendMessage("初めてで緊張してます");
console.log(result.response.text());
```

### Next.js API Route

```typescript
// app/api/chat/route.ts
import { generateAIResponse, saveSession, loadSession } from '@/lib/ai';

export async function POST(request: Request) {
  const { message, sessionId, userId } = await request.json();
  
  // セッション読み込み
  let context = await loadSession(sessionId) || {
    sessionId,
    userId,
    conversationHistory: []
  };
  
  // AI応答生成
  const { response, updatedContext } = await generateAIResponse(message, context);
  
  // セッション保存
  await saveSession(updatedContext);
  
  return Response.json({ response, sessionId });
}
```

### React コンポーネント

```typescript
import { ChatInterface } from '@/components/ChatInterface';

export default function ChatPage() {
  return <ChatInterface />;
}
```

詳細は `implementation-guide.ts` を参照してください。

---

## 心理学的基盤

### カール・ロジャース来談者中心療法

**無条件の肯定的配慮**

- どんな感情も評価せず受け入れる
- 自己否定的発言に対して承認と正常化
- 社会的に望ましくない欲求も肯定

**共感的理解**

- クライアントの内的参照枠で世界を見る
- 感情の背後にある欲求を推測
- 理解を言語化して鏡のように返す

**一致・純粋性**

- 真摯で偽りのない態度
- 表面的な慰めを避ける
- クライアントのペース尊重

### 認知行動療法（CBT）

**認知の歪みの検出**

- 全か無か思考（白黒思考）
- 〜すべき思考
- 個人化（過度な自己関連づけ）
- 破滅化
- 心の読みすぎ

**行動活性化**

- 小さな行動変容の促進
- 段階的課題設定
- コミットメントハードルの削減

### 動機づけ面接（MI）

**核心原則**

- 共感の表明（両価性の理解）
- 不一致の拡大（現状と理想のギャップ）
- 抵抗と共に転がる
- 自己効力感のサポート

**変化への発言を引き出す**

- 願望（したい）
- 能力（できる）
- 理由（なぜ）
- 必要性（すべき）

### 愛着理論

**不安型（とらわれ型）**

- 見捨てられ不安
- 明確な保証を提供
- 安定した存在感

**回避型（愛着軽視型）**

- 自立の過度な重視
- 適度な距離感を維持
- 圧力のない存在

### トラウマインフォームドケア

**核心原則**

- 安全の確保（最優先）
- 信頼性と透明性
- 選択とコントロール
- 協働

---

## 会話ステージ

### Stage 1: 信頼構築（1-5往復）

**目標:**
- 心理的安全性の確保
- 評価されない感覚の提供

**典型的なフレーズ:**
- 「ここでは、どんなことを話しても大丈夫です」
- 「あなたのペースで大丈夫ですよ」

### Stage 2: 感情の解放（5-15往復）

**目標:**
- 抑圧された感情の言語化
- カタルシスの提供

**典型的なフレーズ:**
- 「それは本当に{感情}ですよね」
- 「よく今まで我慢してきましたね」

### Stage 3: ニーズの顕在化（15-20往復）

**目標:**
- 深層的欲求の自覚
- 罪悪感の解消
- 社会的正当性の提示

**典型的なフレーズ:**
- 「本当は、どうしてほしいですか？」
- 「実は最近、こういうサービスを利用する女性、すごく増えてるんです」

### Stage 4: サービス紹介（20-25往復）

**目標:**
- サービスの自然な紹介
- 実質的価値の提示

**典型的なフレーズ:**
- 「今こうやって話してるみたいに、実際に会って寄り添ってもらえる」
- 「ちゃんとした技術を持った方が、心と体の両方をケアします」

### Stage 5: 予約サポート（25往復以降）

**目標:**
- 予約への不安解消
- 具体的手順の案内

**典型的なフレーズ:**
- 「予約はとても簡単ですよ」
- 「でも、最終的に決めるのはあなたです」

---

## カスタマイズ

### 人格定義のカスタマイズ

`serene-persona-part1.ts` の `identity` セクションを編集：

```typescript
identity: {
  name: "あなたのAI名",
  role: "カスタムロール",
  personality_traits: [
    "カスタム特性1",
    "カスタム特性2"
  ]
}
```

### 応答パターンの追加

`serene-persona-part3.ts` の `response_patterns` に追加：

```typescript
response_patterns: {
  // 既存パターン
  custom_pattern: [
    "カスタム応答1",
    "カスタム応答2"
  ]
}
```

### System Prompt のカスタマイズ

`serene-persona-complete.ts` の `generateSystemPrompt` 関数を編集

---

## ライセンス

このプロジェクトは商用利用可能です。

---

## サポート

質問や問題がある場合は、プロジェクト管理者に連絡してください。

---

## 更新履歴

### Version 2.0.0 (2026-02-05)
- 心理学的推論エンジンの統合
- 愛着理論の実装
- トラウマインフォームドケアの追加
- 社会的証明とリラクゼーション価値の強調

### Version 1.0.0 (初版)
- 基本的な人格定義
- 会話ステージの実装
