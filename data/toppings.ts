import type { Topping } from '@/lib/types'

export const TOPPINGS: Topping[] = [
  { id: 'extra-pages', name: '追加ページ', description: 'ページを最大8ページまで追加。OFF時は非公開でデータ保持。', price: 300, note: '4〜8ページ目は1,000円/ページ（月）に切り替え予定（本実装時）' },
  { id: 'contact-form', name: 'お問い合わせフォーム＋自動返信', description: 'フォーム項目カスタマイズ、Resendで自動返信。', price: 800 },
  { id: 'blog', name: 'ブログ・お知らせ機能', description: 'Tiptapによる記事投稿。HPに一覧・詳細を自動生成。', price: 500 },
  { id: 'sns', name: 'SNSリンク・アイコン表示', description: 'Instagram/X/Facebook/LINE/YouTubeに対応。', price: 200 },
  { id: 'google-map', name: 'Google Map埋め込み', description: '埋め込みURLを設定しアクセス欄に表示。', price: 200 },
  { id: 'custom-domain', name: '独自ドメイン接続', description: 'Cloudflare for SaaSで独自ドメイン公開。', price: 500 },
  { id: 'seo', name: 'SEO設定', description: 'タイトル/メタ/OGP/サイトマップ管理。', price: 300, note: 'SEO効果が出るまで数ヶ月かかる旨を画面で表示' },
  { id: 'ga', name: 'アクセス解析（GA連携）', description: '測定ID入力で連携。設定ガイド付き。', price: 500 },
  { id: 'booking', name: '予約フォーム（外部埋め込み）', description: '外部予約サービスへの導線または埋め込み。', price: 800 },
  { id: 'hibernation', name: '休眠プラン', description: '非公開でデータ保持。解約前のダウングレード候補。', price: 300 }
]
