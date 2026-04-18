import { TOPPINGS } from '@/data/toppings'
import { getTemplatePresetById } from '@/data/template-presets'
import { cloneSections, createDefaultContent, type SiteContent, type SiteSection } from '@/lib/site-defaults'

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
  content: SiteContent
  sections: SiteSection[]
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
    ctaText: storyPreset.ctaText,
    content: createDefaultContent(storyPreset.id),
    sections: cloneSections(undefined, storyPreset.id)
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
    ctaText: trustPreset.ctaText,
    content: createDefaultContent(trustPreset.id),
    sections: cloneSections(undefined, trustPreset.id)
  }
]

export function getMockSiteById(siteId: string) {
  return mockSites.find((site) => site.id === siteId)
}

export const mockEnabledToppingIds = TOPPINGS.slice(0, 3).map((item) => item.id)
