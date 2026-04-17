'use client'

import { useMemo, useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { useDebouncedEffect } from '@/lib/debounce'
import { contrastRatio } from '@/lib/color'

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

export default function EditorPage() {
  const [heroTitle, setHeroTitle] = useState('地域に愛される、やさしいサロン')
  const [cta, setCta] = useState('無料カウンセリングはこちら')
  const [status, setStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved')
  const [sections, setSections] = useState(initialSections)
  const [bgColor, setBgColor] = useState('#f7f8f5')
  const [buttonColor, setButtonColor] = useState('#2d6a4f')

  useDebouncedEffect(() => {
    if (status === 'unsaved') {
      setStatus('saving')
      fetch('/api/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroTitle, cta, sections })
      }).finally(() => setStatus('saved'))
    }
  }, [heroTitle, cta, sections, status], 900)

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
      <p className="mb-3 text-sm text-subtext">スマホ編集は可能ですが、詳細な調整はPC利用を推奨します。</p>
      <p className="badge">保存状態: {status === 'saved' ? '保存済み' : status === 'saving' ? '保存中...' : '未保存'}</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="card p-4" aria-label="編集パネル">
          <h2 className="font-heading text-lg font-bold">編集パネル</h2>
          <label className="mt-3 block text-sm">
            見出しテキスト
            <input
              value={heroTitle}
              onChange={(e) => {
                setHeroTitle(e.target.value)
                setStatus('unsaved')
              }}
              className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2"
            />
          </label>

          <label className="mt-3 block text-sm">
            ボタンテキスト
            <input
              value={cta}
              onChange={(e) => {
                setCta(e.target.value)
                setStatus('unsaved')
              }}
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
          {lowContrast ? (
            <p className="mt-2 text-sm text-red-700">背景色とボタン色のコントラスト比が低い可能性があります（{ratio.toFixed(2)}:1）</p>
          ) : null}

          <div className="mt-4 card p-3 text-sm">
            <p className="font-medium">画像差し替え</p>
            <p className="mt-1 text-subtext">1枚5MB以内。アップロードまたはUnsplash素材選択（API連携は次ステップ）。</p>
            <button className="mt-2 rounded-lg border border-main/40 px-3 py-1.5">画像をアップロード</button>
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
          <article className="mt-4 rounded-lg bg-white p-4">
            <h3 className="text-2xl font-bold">{heroTitle}</h3>
            <p className="mt-2 text-subtext">テンプレート枠内の指定エリアのみ編集可能です。</p>
            <button style={{ backgroundColor: buttonColor }} className="mt-4 rounded-lg px-4 py-2 font-semibold text-white">{cta}</button>
          </article>
        </section>
      </div>
    </AppShell>
  )
}
