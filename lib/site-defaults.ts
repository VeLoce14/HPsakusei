import { getTemplatePresetById } from '@/data/template-presets'

export type SiteSection = {
  id: 'hero' | 'intro' | 'services' | 'reviews' | 'faq' | 'access' | 'contact' | 'footer'
  name: string
  enabled: boolean
}

export type ServiceItem = {
  name: string
  price: string
}

export type SiteContent = {
  heroImageUrl: string
  introTitle: string
  introBody: string
  serviceItems: ServiceItem[]
  reviewText: string
  faqQuestion: string
  faqAnswer: string
  accessInfo: string
  contactInfo: string
  bookingInfo: string
  footerText: string
}

export const defaultSections: SiteSection[] = [
  { id: 'hero', name: 'メインビジュアル', enabled: true },
  { id: 'intro', name: '自己紹介・お店紹介', enabled: true },
  { id: 'services', name: 'サービス・料金', enabled: true },
  { id: 'reviews', name: 'お客様の声', enabled: true },
  { id: 'faq', name: 'よくある質問', enabled: false },
  { id: 'access', name: 'アクセス・営業時間', enabled: true },
  { id: 'contact', name: 'お問い合わせ', enabled: true },
  { id: 'footer', name: 'フッター', enabled: true }
]

export function createDefaultContent(templateId: string): SiteContent {
  const preset = getTemplatePresetById(templateId)

  return {
    heroImageUrl: '',
    introTitle: 'はじめての方へ',
    introBody: 'あなたの課題や希望を丁寧にヒアリングし、最適な提案を行います。',
    serviceItems:
      templateId === 'menu'
        ? [
            { name: 'ランチセット', price: '¥1,200' },
            { name: 'スペシャルプレート', price: '¥1,800' },
            { name: '季節のデザート', price: '¥650' }
          ]
        : [
            { name: '初回カウンセリング', price: '¥3,000' },
            { name: 'スタンダードプラン', price: '¥8,000' },
            { name: 'プレミアムプラン', price: '¥12,000' }
          ],
    reviewText: '丁寧で安心できました。はじめてでも相談しやすかったです。',
    faqQuestion: '予約は必要ですか？',
    faqAnswer: '基本的に予約優先です。空きがあれば当日対応も可能です。',
    accessInfo: '東京都〇〇区〇〇 1-2-3 / 平日 10:00-19:00',
    contactInfo: 'TEL: 03-0000-0000 / MAIL: info@example.com',
    bookingInfo: '予約ページURL: https://example-booking.com\n予約受付時間: 10:00〜18:00',
    footerText: `© ${new Date().getFullYear()} ${preset.name}`
  }
}

export function normalizeSections(sections?: SiteSection[]) {
  const source = sections ?? defaultSections

  return defaultSections.map((baseSection) => {
    const found = source.find((item) => item.id === baseSection.id)
    if (!found) return { ...baseSection }
    return {
      ...baseSection,
      name: baseSection.name,
      enabled: found.enabled
    }
  })
}

export function cloneSections(sections?: SiteSection[]) {
  return normalizeSections(sections).map((section) => ({ ...section }))
}
