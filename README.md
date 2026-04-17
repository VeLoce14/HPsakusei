# webapp

## Project Overview
- **Name**: webapp（仮称）
- **Goal**: 個人事業主・スモールビジネス向けノーコードHP作成サービスのMVPを、Next.js構成で先行モック実装
- **Main Features (Phase1 Mock)**:
  - サービスLP
  - 新規登録 / ログイン（メール + Google導線）
  - ダッシュボード（3主要導線）
  - テンプレート選択（5業種 × 3雰囲気 = 15）
  - HPエディタ（自動保存デバウンス、保存状態表示、セクションON/OFF・並び替え、コントラスト警告）
  - トッピング管理
  - 公開設定（サブドメイン重複チェックAPIモック）
  - 料金・支払い管理（Stripe Portal導線プレースホルダー）
  - アカウント設定（退会警告あり）

## Tech Stack
- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- Prisma (schema定義済み)
- Supabase SDK（接続ヘルパー準備済み）
- Stripe / Resend / Unsplash（.env.exampleでモック先行）

## URLs (Local)
- **App**: `http://localhost:3000`
- **Main Routes**:
  - `/` LP
  - `/signup` 新規登録
  - `/login` ログイン
  - `/dashboard` ダッシュボード
  - `/templates` テンプレート選択
  - `/editor/[siteId]` エディタ
  - `/toppings` トッピング管理
  - `/publish` 公開設定
  - `/billing` 料金・支払い管理
  - `/account` アカウント設定
  - `/sites/[subdomain]/[[...slug]]` 公開サイト表示モック

## API Endpoints (Mock)
- `GET /api/subdomain-check?value=xxx` サブドメイン重複チェック
- `POST /api/autosave` 自動保存モック
- `GET /api/templates` テンプレート一覧
- `GET /api/toppings` トッピング一覧
- `POST /api/contact` 問い合わせ受付モック

## Data Architecture
- **Prisma schema**: `prisma/schema.prisma`
  - Users / Sites / Templates / Toppings / SiteToppings / Subscriptions / Pages / BlogPosts / FormFields / ContactMessages
- **Storage/Service Design (planned)**:
  - Auth/DB/Storage: Supabase
  - Billing: Stripe Subscription + Webhook
  - Mail: Resend
  - Assets: Supabase Storage + Unsplash API

## Current Implementation Status
### Completed
- Next.js基盤への置換
- UIカラー反映（#F7F8F5, #2D6A4F, #1A1A1A, #6B6B6B, #EAF4EE）
- 日本語フォント遅延読み込み（`display: 'swap'`）
- MVP対象画面の骨格作成
- サブドメインrewriteミドルウェア実装
- エディタの主要要件（自動保存デバウンス、公開ボタン分離、保存ステータス）

### Not Yet Implemented
- Supabase Auth実接続（Email/Google）
- Prisma migration & Supabase PostgreSQL接続
- Craft.js本格エディタ実装
- Tiptap投稿管理UI
- Stripe実課金（Customer/Subscription/Items/Webhook/Portal）
- Resendメール送信実装
- Unsplash検索連携
- Cloudflare for SaaS独自ドメイン実接続
- ISR/SSG最適化とSEOトッピング実装

## User Guide (Mock)
1. `/signup` で登録導線を確認
2. `/dashboard` から各機能へ移動
3. `/templates` でテンプレート選択UI確認
4. `/editor/site-001` で編集→自動保存ステータス確認
5. `/publish` でサブドメイン重複チェックを試す
6. `/billing` で料金表示と休眠プラン導線を確認

## Development
```bash
cd /home/user/webapp
npm install
npm run dev
```

## Environment Variables
- `.env.example` を `.env.local` にコピーして値を設定
- APIキー未設定時はモックとして動作

## Recommended Next Steps
1. Supabaseプロジェクト情報を受領しAuth/DBを実接続
2. Stripe test key受領後、課金ロジック（サイト単位subscription + topping item）を実装
3. Resend / Unsplash API接続
4. Craft.js + Tiptapで編集体験を本実装
5. Vercelデプロイ + Cloudflare DNS / SaaS連携

## Deployment Status
- **Platform**: Vercel（予定）
- **Status**: ⚠️ ローカルモック実装完了（本番未デプロイ）
- **Last Updated**: 2026-04-17
