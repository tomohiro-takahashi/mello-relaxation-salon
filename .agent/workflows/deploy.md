---
description: 本番環境（Vercel）へのデプロイ手順
---

# 本番環境（Vercel）デプロイフロー

Mello チャットボットを Vercel で運用するための手順です。Next.js に最適化されており、無料枠でサーバーサイド処理（一ノ瀬のAIロジックなど）を動かすことができます。

## 1. 準備：環境変数の設定

Vercel の管理画面で、ローカルの `.env.local` にある以下の値を設定してください。

- `GEMINI_API_KEY`: AI の回答生成に必要です。
- `FIREBASE_ADMIN_SERVICE_ACCOUNT`: Firebase データベースへの接続に必要です。（`.env.local` の JSON 文字列をそのままコピーしてください）

## 2. GitHub へのプッシュ

ローカルの変更を GitHub のリポジトリにプッシュします。

```bash
git add .
git commit -m "chore: prepare for Vercel deployment with Firebase database"
git push origin main
```

※ リポジトリがまだない場合は、GitHub で新しいリポジトリを作成し、画面の指示に従って `git remote add origin ...` を実行してください。

## 3. Vercel でのデプロイ実行

1. [Vercel Dashboard](https://vercel.com/dashboard) にログインします。
2. `Add New` -> `Project` を選択し、上記のリポジトリをインポートします。
3. `Environment Variables` のセクションで、手順1の変数を入力します。
4. `Deploy` ボタンを押せば、数分でサイトが公開されます！

---

> [!TIP]
> データベースは引き続き **Firebase (Firestore)** が使われます。Vercel にデプロイしても、これまでの会話履歴の保存ロジックはそのまま維持されます。
