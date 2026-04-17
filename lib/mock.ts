import { TOPPINGS } from '@/data/toppings'

export type MockSite = {
  id: string
  name: string
  subdomain: string
  templateName: string
  isPublished: boolean
  enabledToppings: string[]
}

export const mockUsedSubdomains = ['green-salon', 'seed-cafe', 'warm-school']

export const mockSites: MockSite[] = [
  {
    id: 'site-001',
    name: 'はじめてサロン',
    subdomain: 'green-salon',
    templateName: '美容室・サロン系 / 温かみ・ナチュラル',
    isPublished: true,
    enabledToppings: ['contact-form', 'sns', 'google-map']
  },
  {
    id: 'site-002',
    name: 'まちの整体室',
    subdomain: 'body-care',
    templateName: '整体院・マッサージ / シンプル・クリーン',
    isPublished: false,
    enabledToppings: ['seo']
  }
]

export function getMockSiteById(siteId: string) {
  return mockSites.find((site) => site.id === siteId)
}

export const mockEnabledToppingIds = TOPPINGS.slice(0, 3).map((item) => item.id)
