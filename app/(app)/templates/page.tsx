'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { TEMPLATE_PRESETS } from '@/data/template-presets'
import { useSites } from '@/lib/site-store'

export default function TemplatesPage() {
  const router = useRouter()
  const { sites, updateSite } = useSites()

  const [selectedSiteId, setSelectedSiteId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const siteIdFromQuery = params.get('siteId')

    if (siteIdFromQuery) {
      setSelectedSiteId(siteIdFromQuery)
    }
  }, [])

  const selectedSite = useMemo(() => {
    const fallbackId = selectedSiteId || sites[0]?.id
    return sites.find((site) => site.id === fallbackId)
  }, [sites, selectedSiteId])

  const applyTemplate = (presetId: (typeof TEMPLATE_PRESETS)[number]['id']) => {
    if (!selectedSite) {
      setMessage('先にHPを選択してください。')
      return
    }

    const preset = TEMPLATE_PRESETS.find((item) => item.id === presetId)
    if (!preset) return

    updateSite(selectedSite.id, {
      templateId: preset.id,
      templateName: preset.name,
      heroTitle: preset.sampleHeroTitle,
      heroBody: preset.sampleHeroBody,
      ctaText: preset.ctaText
    })

    setMessage(`「${selectedSite.name}」に ${preset.name} を適用しました。`)
    router.push(`/editor/${selectedSite.id}`)
  }

  return (
    <AppShell title="テンプレート選択（3骨格 1st版）">
      <section className="card p-4">
        <h2 className="font-heading text-lg font-bold">適用先HPを選択</h2>
        <label className="mt-3 block text-sm">
          対象HP
          <select
            value={selectedSite?.id ?? ''}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-main/30 bg-white px-3 py-2 md:max-w-md"
          >
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}（現在: {site.templateName}）
              </option>
            ))}
          </select>
        </label>
        {message ? <p className="mt-2 text-sm text-subtext">{message}</p> : null}
      </section>

      <p className="mt-4 text-sm text-subtext">量産感を避けるため、まずは「3つの高品質骨格」を用意し、配色・写真・文言で展開する方針にしています。</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {TEMPLATE_PRESETS.map((template) => (
          <article key={template.id} className="card overflow-hidden">
            <div className="h-36 bg-accent p-4">
              <p className="badge">{template.tagline}</p>
              <h3 className="mt-3 font-heading text-lg font-bold text-main">{template.name}</h3>
              <p className="mt-2 text-sm text-subtext">{template.description}</p>
            </div>
            <div className="p-4">
              <p className="text-sm text-subtext">見出し例</p>
              <p className="mt-1 text-base font-semibold">{template.sampleHeroTitle}</p>
              <button
                type="button"
                onClick={() => applyTemplate(template.id)}
                className="mt-3 w-full rounded-lg bg-main px-3 py-2 text-sm font-semibold text-white"
              >
                このテンプレートを適用
              </button>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  )
}
