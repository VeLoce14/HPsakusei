'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { TEMPLATE_PRESETS } from '@/data/template-presets'
import { useSites } from '@/lib/site-store'
import { cloneSections, createDefaultContent } from '@/lib/site-defaults'

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
      ctaText: preset.ctaText,
      content: createDefaultContent(preset.id),
      sections: cloneSections()
    })

    setMessage(`「${selectedSite.name}」に ${preset.name} を適用しました。`)
    router.push(`/editor/${selectedSite.id}`)
  }

  return (
    <AppShell title="テンプレート選択（実戦デザイン版）">
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

      <p className="mt-4 text-sm text-subtext">参考サイトのような「余白・タイポ・導線」を再現しやすいように、3つの骨格テンプレートを強化しました。画像は権利上、必ず自社素材またはライセンス確認済み素材を使用してください。</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {TEMPLATE_PRESETS.map((template) => {
          const isMenu = template.id === 'menu'
          const isTrust = template.id === 'trust'
          const topBg = isMenu
            ? 'from-orange-100 via-amber-50 to-rose-100'
            : isTrust
              ? 'from-slate-100 via-blue-50 to-white'
              : 'from-emerald-100 via-white to-teal-100'

          return (
            <article key={template.id} className="card overflow-hidden border border-main/20 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className={`h-40 bg-gradient-to-br ${topBg} p-4`}>
                <p className="badge">{template.tagline}</p>
                <h3 className="mt-3 font-heading text-xl font-bold text-main">{template.name}</h3>
                <p className="mt-2 text-sm text-subtext">{template.description}</p>
              </div>
              <div className="p-4">
                <p className="text-xs tracking-wide text-subtext">メインコピー例</p>
                <p className="mt-1 whitespace-pre-line text-base font-semibold">{template.sampleHeroTitle}</p>
                <p className="mt-2 text-sm text-subtext">CTA: {template.ctaText}</p>
                <button
                  type="button"
                  onClick={() => applyTemplate(template.id)}
                  className="mt-4 w-full rounded-xl bg-main px-3 py-2.5 text-sm font-semibold text-white"
                >
                  このテンプレートを適用
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </AppShell>
  )
}
