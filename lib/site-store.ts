'use client'

import { useEffect, useMemo, useState } from 'react'
import { mockSites, type MockSite } from '@/lib/mock'
import { getTemplatePresetById } from '@/data/template-presets'

const STORAGE_KEY = 'webapp_mock_sites_v2'

function loadSites(): MockSite[] {
  if (typeof window === 'undefined') return mockSites

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return mockSites

    const parsed = JSON.parse(raw) as MockSite[]
    if (!Array.isArray(parsed) || parsed.length === 0) return mockSites
    return parsed
  } catch {
    return mockSites
  }
}

function saveSites(sites: MockSite[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sites))
}

export function useSites() {
  const [sites, setSites] = useState<MockSite[]>(mockSites)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const initial = loadSites()
    setSites(initial)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveSites(sites)
  }, [sites, hydrated])

  const api = useMemo(() => {
    return {
      addSite() {
        setSites((prev) => {
          const serial = prev.length + 1
          const padded = String(serial).padStart(3, '0')
          const preset = getTemplatePresetById('story')

          return [
            {
              id: `site-${padded}`,
              name: `新規HP ${serial}`,
              subdomain: `new-site-${serial}`,
              templateId: preset.id,
              templateName: preset.name,
              isPublished: false,
              enabledToppings: [],
              heroTitle: preset.sampleHeroTitle,
              heroBody: preset.sampleHeroBody,
              ctaText: preset.ctaText
            },
            ...prev
          ]
        })
      },

      updateSite(siteId: string, patch: Partial<MockSite>) {
        setSites((prev) => prev.map((site) => (site.id === siteId ? { ...site, ...patch } : site)))
      },

      toggleTopping(siteId: string, toppingId: string) {
        setSites((prev) =>
          prev.map((site) => {
            if (site.id !== siteId) return site

            const enabled = site.enabledToppings.includes(toppingId)
            return {
              ...site,
              enabledToppings: enabled
                ? site.enabledToppings.filter((id) => id !== toppingId)
                : [...site.enabledToppings, toppingId]
            }
          })
        )
      }
    }
  }, [])

  return {
    sites,
    hydrated,
    ...api
  }
}
