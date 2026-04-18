import { TOPPINGS } from '@/data/toppings'
import { getTemplatePresetById } from '@/data/template-presets'

export type MockSite = {
  id: string
  name: string
  subdomain: string
  templateId: string
  templateName: string
  isPublished: boolean
  enabledToppings: string[]
  heroTitle: string
  heroBody: string
  ctaText: string
}

const storyPreset = getTemplatePresetById('story')
const trustPreset = getTemplatePresetById('trust')

export const mockUsedSubdomains = ['green-salon', 'seed-cafe', 'warm-school']

export const mockSites: MockSite[] = [
  {
    id: 'site-001',
    name: 'はじめてサロン',
    subdomain: 'green-salon',
    templateId: storyPreset.id,
    templateName: storyPreset.name,
    isPublished: true,
    enabledToppings: ['contact-form', 'sns', 'google-map'],
    heroTitle: storyPreset.sampleHeroTitle,
    heroBody: storyPreset.sampleHeroBody,
    ctaText: storyPreset.ctaText
  },
  {
    id: 'site-002',
    name: 'まちの整体室',
    subdomain: 'body-care',
    templateId: trustPreset.id,
    templateName: trustPreset.name,
    isPublished: false,
    enabledToppings: ['seo'],
    heroTitle: trustPreset.sampleHeroTitle,
    heroBody: trustPreset.sampleHeroBody,
    ctaText: trustPreset.ctaText
  }
]

export function getMockSiteById(siteId: string) {
  return mockSites.find((site) => site.id === siteId)
}

export const mockEnabledToppingIds = TOPPINGS.slice(0, 3).map((item) => item.id)
