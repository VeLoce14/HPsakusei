'use client'

import { useEffect, useMemo, useState } from 'react'
import { mockSites, type MockSite } from '@/lib/mock'
import { getTemplatePresetById } from '@/data/template-presets'
import { cloneSections, createDefaultContent } from '@/lib/site-defaults'

const STORAGE_KEY = 'webapp_mock_sites_v3'

function normalizeSite(site: MockSite): MockSite {
  return {
    ...site,
    content: site.content ?? createDefaultContent(site.templateId),
    sections: cloneSections(site.sections)
  }
}

function loadSites(): MockSite[] {
  if (typeof window === 'undefined') return mockSites

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return mockSites.map(normalizeSite)

    const parsed = JSON.parse(raw) as MockSite[]
    if (!Array.isArray(parsed) || parsed.length === 0) return mockSites.map(normalizeSite)
    return parsed.map(normalizeSite)
  } catch {
    return mockSites.map(normalizeSite)
  }
}

function saveSites(sites: MockSite[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sites))
}

export function useSites() {
  const [sites, setSites] = useState<MockSite[]>(mockSites.map(normalizeSite))
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
              ctaText: preset.ctaText,
              content: createDefaultContent(preset.id),
              sections: cloneSections()
            },
            ...prev
          ]
        })
      },

      updateSite(siteId: string, patch: Partial<MockSite>) {
        setSites((prev) => prev.map((site) => (site.id === siteId ? normalizeSite({ ...site, ...patch }) : site)))
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
