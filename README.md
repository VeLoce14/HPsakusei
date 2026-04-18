# webapp

## Project Overview
- **Name**: webapp（仮称）
- **Goal**: 個人事業主・スモールビジネス向けノーコードHP作成サービスのMVPを、Next.js構成で先行モック実装
- **Main Features (Phase1 Mock)**:
  - サービスLP
  - 新規登録 / ログイン（Supabase Auth接続済み：メール + Google）
  - ダッシュボード（HP選択起点UI + 新規HP作成 + 最新問い合わせのステータス更新）
  - テンプレート選択（上質系デザインを意識した3骨格テンプレートをHPへ即時適用）
  - HPエディタ（自動保存デバウンス、保存状態表示、最終保存時刻表示、Undo/Redo[最大20履歴]、セクションON/OFF・並び替え、OFFセクションの編集項目自動非表示、改行入力対応、コントラスト警告、公開前チェック[未入力/低コントラスト/画像比率/URL形式/スラッグ重複]、各セクション本文編集、料金編集、画像アップロード[5MB以内]、画像削除、画像情報表示[形式/サイズ/解像度/比率]、推奨比率警告）
  - トッピング管理（HPごと / エディタ画面内でON・OFF可能）
  - トッピング連動プレビュー（予約フォーム・SNS・ブログ・SEO・GAの反映、予約URL入力時はiframe埋め込みプレビュー対応）
  - 追加ページトッピング反映（エディタで追加ページを作成・編集し、公開URL `/sites/[subdomain]/[slug]` へ反映。公開状態バッジ、公開ON/OFF、ドラッグ並び替え、スラッグ必須/重複バリデーション対応。公開サイト上部ナビは公開中ページのみ表示）
  - お問い合わせフォーム実装（公開ページから名前/メール/本文を送信し、ダッシュボードと問い合わせ管理画面で受信・未対応/対応中/対応済み管理。問い合わせメモ追記と履歴時刻表示、ヘッダー未対応件数バッジ対応）
  - 公開サイトデザイン強化（テンプレート別テーマ色、余白設計、ヒーロー/サービス/FAQ/予約/問い合わせ導線の実戦レイアウト、予約URLのhttp/https検証、404ガイド強化、追加ページが未公開時の導線整理）
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
  - `/inbox` 問い合わせ管理
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
- `POST /api/contact` 問い合わせ受付（必須項目バリデーションあり）

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
- Prisma migration & Supabase PostgreSQL接続
- Craft.js本格エディタ実装
- Tiptap投稿管理UI
- Stripe実課金（Customer/Subscription/Items/Webhook/Portal）
- Resendメール送信実装
- Unsplash検索連携
- Cloudflare for SaaS独自ドメイン実接続
- ISR/SSG最適化とSEOトッピング実装
- 公開フローの本番運用（承認ワークフロー・ロール権限・監査ログ）

## User Guide (Mock)
1. `/signup` で登録導線を確認
2. `/dashboard` から各機能へ移動
3. `/dashboard` のHP選択起点から、編集 or トッピングへ移動
4. `/templates?siteId=site-001` でテンプレート適用し、`/editor/site-001` へ遷移確認
5. `/editor/site-001` でセクション本文・料金・画像（5MB以内）を編集し、プレビュー連動を確認（改行入力可）
6. `/sites/green-salon` を開き、テンプレート別の公開デザイン（ヒーロー・カード・導線）を確認
7. `/editor/site-001` 下部の「トッピング（このHP）」でHP単位トッピングON/OFF確認（予約フォームON時は編集パネルとプレビューに予約機能が表示）
8. `追加ページ`トッピングをONにし、`追加ページ設定`でページを作成後、公開ON/OFF切替・ドラッグ並び替え・スラッグ重複チェックを確認
9. `公開ページを開く` から `/sites/[subdomain]` を開き、公開中の追加ページのみナビ表示されることを確認
10. 公開ページ `/sites/[subdomain]` のお問い合わせフォームから送信し、`/dashboard` の「最新のお問い合わせ」で受信確認
11. `/inbox` でお問い合わせを未対応/対応中/対応済みに更新し、メモを追加して履歴表示を確認
12. `/publish` でサブドメイン重複チェックを試す
13. `/billing` で料金表示と休眠プラン導線を確認

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
- **Last Updated**: 2026-04-18（実用改善機能一括実装版）
