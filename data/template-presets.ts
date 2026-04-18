export type TemplatePreset = {
  id: 'story' | 'menu' | 'trust'
  name: string
  tagline: string
  description: string
  sampleHeroTitle: string
  sampleHeroBody: string
  ctaText: string
}

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'story',
    name: 'Story（想い訴求）',
    tagline: 'サロン・コーチ向けの温かい導線',
    description: 'ファーストビュー→想い→お客様の声の順で信頼を積み上げる骨格。',
    sampleHeroTitle: 'あなたの毎日に、やさしい変化を。',
    sampleHeroBody: 'はじめての方にも安心いただける丁寧なヒアリングで、最適なプランをご提案します。',
    ctaText: '無料相談を予約する'
  },
  {
    id: 'menu',
    name: 'Menu（商品訴求）',
    tagline: '飲食・施術メニューを見せる構成',
    description: 'おすすめメニューを先に見せ、価格と特徴で比較しやすくする骨格。',
    sampleHeroTitle: '今日の気分で選べる、こだわりメニュー。',
    sampleHeroBody: '定番から季節限定まで、あなたにぴったりの一品をわかりやすく紹介します。',
    ctaText: 'メニューを見る'
  },
  {
    id: 'trust',
    name: 'Trust（信頼訴求）',
    tagline: 'スクール・士業系の堅実構成',
    description: '実績・強み・FAQを中心に、不安を先回りして解消する骨格。',
    sampleHeroTitle: '結果につながる、伴走型サポート。',
    sampleHeroBody: '一人ひとりの課題に合わせ、無理のないステップで成果までサポートします。',
    ctaText: 'まずは資料を受け取る'
  }
]

export function getTemplatePresetById(id?: string) {
  return TEMPLATE_PRESETS.find((preset) => preset.id === id) ?? TEMPLATE_PRESETS[0]
}
