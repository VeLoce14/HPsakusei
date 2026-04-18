'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { useDebouncedEffect } from '@/lib/debounce'
import { contrastRatio } from '@/lib/color'
import { useSites } from '@/lib/site-store'

type Section = {
  id: string
  name: string
  enabled: boolean
}

const initialSections: Section[] = [
  { id: 'hero', name: 'ヒーロー', enabled: true },
  { id: 'intro', name: '自己紹介・お店紹介', enabled: true },
  { id: 'services', name: 'サービス・メニュー', enabled: true },
  { id: 'reviews', name: 'お客様の声', enabled: true },
  { id: 'faq', name: 'よくある質問', enabled: false },
  { id: 'access', name: 'アクセス・営業時間', enabled: true },
  { id: 'contact', name: 'お問い合わせ', enabled: true },
  { id: 'footer', name: 'フッター', enabled: true }
]

function TemplatePreview({ templateId, heroTitle, heroBody, ctaText, buttonColor }: { templateId: string; heroTitle: string; heroBody: string; ctaText: string; buttonColor: string }) {
  if (templateId === 'menu') {
    return (
      <article className="mt-4 rounded-lg bg-white p-4">
        <h3 className="text-2xl font-bold">{heroTitle}</h3>
        <p className="mt-2 text-subtext">{heroBody}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {['おすすめA', '定番B', '季節限定C'].map((menu) => (
            <div key={menu} className="rounded-lg border border-main/20 p-3">
              <p className="text-sm text-subtext">{menu}</p>
              <p className="mt-1 font-semibold">¥1,200〜</p>
            </div>
          ))}
        </div>
        <button style={{ backgroundColor: buttonColor }} className="mt-4 rounded-lg px-4 py-2 font-semibold text-white">{ctaText}</button>
      </article>
    )
  }

  if (templateId === 'trust') {
    return (
      <article className="mt-4 rounded-lg bg-white p-4">
        <h3 className="text-2xl font-bold">{heroTitle}</h3>
        <p className="mt-2 text-subtext">{heroBody}</p>
        <div className="mt-4 rounded-lg bg-accent p-3">
          <p className="text-sm font-semibold">実績・強み</p>
          <ul className="mt-1 list-disc pl-5 text-sm text-subtext">
            <li>継続率 92%</li>
            <li>個別カスタム対応</li>
            <li>初回無料相談あり</li>
          </ul>
        </div>
        <button style={{ backgroundColor: buttonColor }} className="mt-4 rounded-lg px-4 py-2 font-semibold text-white">{ctaText}</button>
      </article>
    )
  }

  return (
    <article className="mt-4 rounded-lg bg-white p-4">
      <h3 className="text-2xl font-bold">{heroTitle}</h3>
      <p className="mt-2 text-subtext">{heroBody}</p>
      <div className="mt-4 rounded-lg border border-main/20 p-3">
        <p className="text-sm text-subtext">オーナーからのメッセージ</p>
        <p className="mt-1">はじめての方でも安心してご利用いただけるよう、丁寧にサポートします。</p>
      </div>
      <button style={{ backgroundColor: buttonColor }} className="mt-4 rounded-lg px-4 py-2 font-semibold text-white">{ctaText}</button>
    </article>
  )
}

export default function EditorPage() {
  const params = useParams<{ siteId: string }>()
  const siteId = params.siteId

  const { sites, updateSite } = useSites()
  const site = useMemo(() => sites.find((item) => item.id === siteId), [sites, siteId])

  const [heroTitle, setHeroTitle] = useState('')
  const [heroBody, setHeroBody] = useState('')
  const [ctaText, setCtaText] = useState('')
  const [status, setStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved')
  const [sections, setSections] = useState(initialSections)
  const [bgColor, setBgColor] = useState('#f7f8f5')
  const [buttonColor, setButtonColor] = useState('#2d6a4f')

  useEffect(() => {
    if (!site) return
    setHeroTitle(site.heroTitle)
    setHeroBody(site.heroBody)
    setCtaText(site.ctaText)
    setStatus('saved')
  }, [site])

  useDebouncedEffect(() => {
    if (!site || status !== 'unsaved') return

    setStatus('saving')
    updateSite(siteId, { heroTitle, heroBody, ctaText })

    fetch('/api/autosave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteId, heroTitle, heroBody, ctaText, sections })
    }).finally(() => setStatus('saved'))
  }, [siteId, site, heroTitle, heroBody, ctaText, sections, status], 900)

  const ratio = useMemo(() => contrastRatio(bgColor, buttonColor), [bgColor, buttonColor])
  const lowContrast = ratio < 3

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= sections.length) return

    const copied = [...sections]
    ;[copied[index], copied[target]] = [copied[target], copied[index]]
    setSections(copied)
    setStatus('unsaved')
  }

  const toggleSection = (id: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)))
    setStatus('unsaved')
  }

  return (
    <AppShell title="HPエディタ（MVPモック）">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm text-subtext">編集対象HP: <span className="font-semibold text-text">{site?.name ?? siteId}</span></p>
          <p className="text-xs text-subtext">現在テンプレート: {site?.templateName ?? '未設定'} / スマホ編集は可能ですがPC推奨です。</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/templates?siteId=${siteId}`} className="rounded-lg border border-main/40 px-3 py-1.5 text-sm font-semibold text-main">テンプレート変更</Link>
          <Link href={`/toppings/${siteId}`} className="rounded-lg border border-main/40 px-3 py-1.5 text-sm font-semibold text-main">このHPのトッピング</Link>
        </div>
      </div>

      <p className="badge">保存状態: {status === 'saved' ? '保存済み' : status === 'saving' ? '保存中...' : '未保存'}</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="card p-4" aria-label="編集パネル">
          <h2 className="font-heading text-lg font-bold">編集パネル</h2>

          <label className="mt-3 block text-sm">
            見出しテキスト
            <input
              value={heroTitle}
              onChange={(e) => { setHeroTitle(e.target.value); setStatus('unsaved') }}
              className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2"
            />
          </label>

          <label className="mt-3 block text-sm">
            サブテキスト
            <textarea
              value={heroBody}
              onChange={(e) => { setHeroBody(e.target.value); setStatus('unsaved') }}
              className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2"
              rows={3}
            />
          </label>

          <label className="mt-3 block text-sm">
            CTAボタンテキスト
            <input
              value={ctaText}
              onChange={(e) => { setCtaText(e.target.value); setStatus('unsaved') }}
              className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2"
            />
          </label>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              背景色
              <input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); setStatus('unsaved') }} className="mt-1 h-10 w-full" />
            </label>
            <label className="text-sm">
              ボタン色
              <input type="color" value={buttonColor} onChange={(e) => { setButtonColor(e.target.value); setStatus('unsaved') }} className="mt-1 h-10 w-full" />
            </label>
          </div>

          {lowContrast ? <p className="mt-2 text-sm text-red-700">背景色とボタン色のコントラスト比が低い可能性があります（{ratio.toFixed(2)}:1）</p> : null}

          <div className="mt-4 card p-3 text-sm">
            <p className="font-medium">画像差し替え</p>
            <p className="mt-1 text-subtext">1枚5MB以内。アップロードまたはライセンス確認済み素材のみ利用してください。</p>
            <button className="mt-2 rounded-lg border border-main/40 px-3 py-1.5" type="button">画像をアップロード</button>
          </div>

          <div className="mt-4">
            <p className="font-medium">セクション管理（最大10）</p>
            <div className="mt-2 space-y-2">
              {sections.map((section, index) => (
                <div key={section.id} className="flex items-center justify-between rounded-lg border border-main/20 bg-white p-2 text-sm">
                  <span>{section.name}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => moveSection(index, -1)} className="rounded border px-2" type="button">↑上へ</button>
                    <button onClick={() => moveSection(index, 1)} className="rounded border px-2" type="button">↓下へ</button>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={section.enabled} onChange={() => toggleSection(section.id)} />
                      表示
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="button" className="mt-5 rounded-lg bg-main px-4 py-2 font-semibold text-white">公開する（自動保存とは分離）</button>
        </section>

        <section className="card p-4" aria-label="リアルタイムプレビュー" style={{ backgroundColor: bgColor }}>
          <h2 className="font-heading text-lg font-bold">リアルタイムプレビュー</h2>
          <TemplatePreview
            templateId={site?.templateId ?? 'story'}
            heroTitle={heroTitle}
            heroBody={heroBody}
            ctaText={ctaText}
            buttonColor={buttonColor}
          />
        </section>
      </div>
    </AppShell>
  )
}
