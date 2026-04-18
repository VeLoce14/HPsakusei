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
    name: 'Elegant Story（上質サロン）',
    tagline: '余白・静けさ・信頼をつくるサロン導線',
    description: '世界観→こだわり→お客様の声→予約へ、の順で迷わせずに自然に行動へ導きます。',
    sampleHeroTitle: '感動は、細部に宿る。',
    sampleHeroBody: 'まつ毛・眉・肌の印象設計を、丁寧なカウンセリングと確かな技術で。毎日が少し好きになる体験を届けます。',
    ctaText: 'ご予約・ご相談はこちら'
  },
  {
    id: 'menu',
    name: 'Craft Menu（商品魅力訴求）',
    tagline: '商品写真とメニューを主役にする構成',
    description: '看板メニュー→価格→こだわり→来店案内までを一枚で伝える、店舗向けの実用導線です。',
    sampleHeroTitle: '毎日食べたい、手しごとのおいしさ。',
    sampleHeroBody: '素材の香りと焼きたての食感にこだわった、定番と季節限定のラインナップをお届けします。',
    ctaText: '本日のメニューを見る'
  },
  {
    id: 'trust',
    name: 'Professional Trust（専門性訴求）',
    tagline: '実績と説明力で不安を解消する導線',
    description: '強み・実績・よくある質問を先回りで提示し、初回相談の心理ハードルを下げる設計です。',
    sampleHeroTitle: 'あなたの課題に、根拠ある提案を。',
    sampleHeroBody: '状況を正しく整理し、優先順位を明確化。無理のない計画で、成果まで伴走します。',
    ctaText: '初回相談を申し込む'
  }
]

export function getTemplatePresetById(id?: string) {
  return TEMPLATE_PRESETS.find((preset) => preset.id === id) ?? TEMPLATE_PRESETS[0]
}
