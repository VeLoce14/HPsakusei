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

export type ExtraPage = {
  id: string
  title: string
  slug: string
  body: string
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
  extraPages: ExtraPage[]
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

  if (templateId === 'menu') {
    return {
      heroImageUrl: '',
      introTitle: '素材と手しごとへのこだわり',
      introBody: '毎日食べるものだから、素材選びと焼き上げの工程を大切にしています。定番商品はもちろん、季節限定の商品もご用意しています。',
      serviceItems: [
        { name: '匠食パン（1斤）', price: '¥320' },
        { name: 'ニューバード', price: '¥220' },
        { name: '季節のおすすめセット', price: '¥1,280' }
      ],
      reviewText: '朝に買って、昼でもふわふわ。やさしい味で家族みんなのお気に入りです。',
      faqQuestion: '取り置き予約はできますか？',
      faqAnswer: '可能です。前日までにお電話またはフォームからご連絡ください。',
      accessInfo: '東京都〇〇区〇〇 2-3-4\n営業時間 8:00-18:00（売り切れ次第終了）\n定休日: 火曜日',
      contactInfo: 'TEL: 03-0000-1111\nMAIL: bakery@example.com',
      bookingInfo: '来店予約URL: https://example-booking.com\n受け取り希望日時をご記入ください。',
      extraPages: [
        {
          id: 'page-1',
          title: '今週の限定メニュー',
          slug: 'seasonal-menu',
          body: '季節限定商品の一覧を掲載します。\n原材料やアレルギー情報も記載しておくと安心です。'
        }
      ],
      footerText: `© ${new Date().getFullYear()} ${preset.name}`
    }
  }

  if (templateId === 'trust') {
    return {
      heroImageUrl: '',
      introTitle: '初回相談の流れ',
      introBody: '現状ヒアリング→課題整理→最適プラン提案までを丁寧に実施します。無理な契約や押し売りは行いません。',
      serviceItems: [
        { name: '初回相談（60分）', price: '¥5,000' },
        { name: 'スタンダード伴走プラン', price: '¥18,000 / 月' },
        { name: 'プレミアム伴走プラン', price: '¥35,000 / 月' }
      ],
      reviewText: '説明がとてもわかりやすく、やるべきことの優先順位が明確になりました。',
      faqQuestion: 'オンラインでの相談は可能ですか？',
      faqAnswer: '可能です。Zoom / Google Meet のどちらにも対応しています。',
      accessInfo: '東京都〇〇区〇〇 5-6-7\n平日 10:00-19:00 / 土曜 10:00-16:00',
      contactInfo: 'TEL: 03-0000-2222\nMAIL: support@example.com',
      bookingInfo: '相談予約URL: https://example-booking.com\n24時間受付フォーム',
      extraPages: [
        {
          id: 'page-1',
          title: '支援実績',
          slug: 'results',
          body: '導入事例や成果データを掲載します。\n業種ごとの実績を載せると信頼感が高まります。'
        }
      ],
      footerText: `© ${new Date().getFullYear()} ${preset.name}`
    }
  }

  return {
    heroImageUrl: '',
    introTitle: 'はじめての方へ',
    introBody: 'お悩みや理想を丁寧にヒアリングし、あなたに合うデザイン・施術をご提案します。初めての方にも安心してご利用いただけます。',
    serviceItems: [
      { name: 'まつ毛デザイン（60分）', price: '¥6,600' },
      { name: 'アイブロウデザイン（45分）', price: '¥5,500' },
      { name: 'セットメニュー（90分）', price: '¥10,800' }
    ],
    reviewText: '接客が丁寧で、仕上がりも理想通り。毎月通いたくなるサロンです。',
    faqQuestion: '当日予約は可能ですか？',
    faqAnswer: '空きがあれば当日予約も可能です。まずはフォームからご連絡ください。',
    accessInfo: '東京都〇〇区〇〇 1-2-3\n平日 10:00-19:00 / 土日 10:00-18:00',
    contactInfo: 'TEL: 03-0000-0000\nMAIL: info@example.com',
    bookingInfo: '予約ページURL: https://example-booking.com\n予約受付時間: 10:00〜18:00',
    extraPages: [
      {
        id: 'page-1',
        title: '料金について',
        slug: 'pricing',
        body: '料金やプラン内容をこちらに記載します。\n初めての方にもわかりやすい説明を心がけましょう。'
      }
    ],
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
