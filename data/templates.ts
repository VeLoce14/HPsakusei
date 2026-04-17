import type { Template } from '@/lib/types'

const businessTypes = [
  { key: 'salon', label: '美容室・サロン系' },
  { key: 'clinic', label: '整体院・マッサージ' },
  { key: 'cafe', label: 'カフェ・飲食店' },
  { key: 'coaching', label: 'コーチング・コンサルタント' },
  { key: 'school', label: '教室・スクール系' }
] as const

const styles = [
  { key: 'simple', label: 'シンプル・クリーン' },
  { key: 'natural', label: '温かみ・ナチュラル' },
  { key: 'stylish', label: 'スタイリッシュ・高級感' }
] as const

export const TEMPLATE_OPTIONS = {
  businessTypes,
  styles
}

export const TEMPLATES: Template[] = businessTypes.flatMap((business) =>
  styles.map((style) => ({
    id: `${business.key}-${style.key}`,
    businessType: business.key,
    style: style.key,
    name: `${business.label} / ${style.label}`,
    thumbnail: '/placeholders/template-thumb.svg'
  }))
)
