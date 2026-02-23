---
description: 本番環境（Vercel）へのデプロイ手順
---

# 本番環境（Vercel）デプロイフロー

一ノ瀬チャットボットを本番環境で運用・テストするための手順です。

## 1. 準備：環境変数の設定

Vercelの管理画面で以下の環境変数を設定してください。
これらは `.env.local` に記述されているものと同じ値である必要があります。

- `GEMINI_API_KEY`: Google Generative AIのリクエストに必要です。
- `FIREBASE_PROJECT_ID`: FirebaseプロジェクトのID
- `FIREBASE_CLIENT_EMAIL`: サービスアカウントのメールアドレス
- `FIREBASE_PRIVATE_KEY`: サービスアカウントの秘密鍵（改行コード `\n` を含めて単一の文字列として設定してください）

## 2. GitHubへのプッシュ

ローカルでの変更をGitHubのリポジトリにプッシュします。

// turbo

```bash
git add .
git commit -m "feat: implement gap analysis logic and mobile optimizations"
git push origin main
```

## 3. Vercelでのデプロイ実行

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセスします。
2. 対象のプロジェクトを選択し、GitHubリポジトリと連携させます。
3. `Deploy` をクリックしてビルドを開始します。

## 4. 動作確認

デプロイ完了後、発行されたURL（例: `https://your-project.vercel.app/chat`）にアクセスし、以下の点を確認してください。

- チャットが正しく開始されるか
- 矛盾分析のフェーズ（提案→情報収集→結論）が意図通りに機能するか
- スマホ表示でヘッダーが崩れていないか

---

> [!IMPORTANT]
> 本番環境にデプロイすると、実際のFirebaseデータベースが更新されます。
