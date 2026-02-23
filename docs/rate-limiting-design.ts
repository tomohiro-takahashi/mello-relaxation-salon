/**
 * 🎯 スパム対策・レート制限の完全設計
 * 
 * このファイルは、リラクゼーションサロン「Serene」において、
 * 悪意のある攻撃や予期せぬAPIコストの増大を防ぐための設計思想をまとめたものです。
 */

export const RateLimitingDesign = {
  title: "スパム対策・レート制限の完全設計",
  strategy: "段階的防御（5層ガード）",
  
  layers: [
    {
      id: 1,
      name: "Layer 1: クライアント側（UX重視）",
      description: "ボタン連打防止、秒間送信制限の視覚的フィードバック",
      action: "useMessageThrottle() フックによる制御"
    },
    {
      id: 2,
      name: "Layer 2: Edge（Vercel + Upstash Redis）",
      description: "IPベース・セッションベースの高速なアクセス制限",
      action: "Middleware による 429 エラーの即時返却"
    },
    {
      id: 3,
      name: "Layer 3: API Route（詳細検証）",
      description: "メッセージの内容、構造、並列リクエストの最終チェック",
      action: "Zod Schema 検証 & セッションロック"
    },
    {
      id: 4,
      name: "Layer 4: Firestore（データ保護）",
      description: "データベースへの不正な書き込み防止",
      action: "Security Rules による書込制限"
    },
    {
      id: 5,
      name: "Layer 5: 監視・分析（異常検知）",
      description: "異常なトラフィックのログ記録とアラート通知",
      action: "Vercel Analytics & Slack 通知"
    }
  ],

  policy: {
    normalBehavior: "連続3回までの送信は制限なし（フォローアップを許容）",
    warning: {
      condition: "5秒以内に3回送信",
      action: "警告を表示するが、送信は継続可能"
    },
    block: {
      condition: "10秒以内に5回送信",
      action: "30秒間の送信ブロック（明らかな異常と判断）"
    }
  },

  uxPrinciples: [
    "透明性: なぜ送信できないのか理由を明示する",
    "予測可能性: ブロックされるまでの猶予を視覚的に示す",
    "優しさ: いきなり遮断せず、まずは警告から入る"
  ]
};
