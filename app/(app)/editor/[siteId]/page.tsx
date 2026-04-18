'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { useDebouncedEffect } from '@/lib/debounce'
import { contrastRatio } from '@/lib/color'
import { useSites } from '@/lib/site-store'
import { cloneSections, createDefaultContent, type SiteSection, type ServiceItem } from '@/lib/site-defaults'

function PreviewSection({ section, children }: { section: SiteSection; children: React.ReactNode }) {
  if (!section.enabled) return null
  return <section className="mt-4 rounded-lg bg-white p-4">{children}</section>
}

export default function EditorPage() {
  const params = useParams<{ siteId: string }>()
  const siteId = params.siteId

  const { sites, updateSite } = useSites()
  const site = useMemo(() => sites.find((item) => item.id === siteId), [sites, siteId])

  const [heroTitle, setHeroTitle] = useState('')
  const [heroBody, setHeroBody] = useState('')
  const [ctaText, setCtaText] = useState('')
  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [introTitle, setIntroTitle] = useState('')
  const [introBody, setIntroBody] = useState('')
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([])
  const [reviewText, setReviewText] = useState('')
  const [faqQuestion, setFaqQuestion] = useState('')
  const [faqAnswer, setFaqAnswer] = useState('')
  const [accessInfo, setAccessInfo] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [footerText, setFooterText] = useState('')

  const [status, setStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved')
  const [sections, setSections] = useState<SiteSection[]>(cloneSections())
  const [bgColor, setBgColor] = useState('#f7f8f5')
  const [buttonColor, setButtonColor] = useState('#2d6a4f')
  const [uploadMessage, setUploadMessage] = useState('')

  useEffect(() => {
    if (!site) return

    const content = site.content ?? createDefaultContent(site.templateId)

    setHeroTitle(site.heroTitle)
    setHeroBody(site.heroBody)
    setCtaText(site.ctaText)
    setHeroImageUrl(content.heroImageUrl)
    setIntroTitle(content.introTitle)
    setIntroBody(content.introBody)
    setServiceItems(content.serviceItems)
    setReviewText(content.reviewText)
    setFaqQuestion(content.faqQuestion)
    setFaqAnswer(content.faqAnswer)
    setAccessInfo(content.accessInfo)
    setContactInfo(content.contactInfo)
    setFooterText(content.footerText)
    setSections(cloneSections(site.sections))
    setStatus('saved')
  }, [site])

  useDebouncedEffect(() => {
    if (!site || status !== 'unsaved') return

    setStatus('saving')

    updateSite(siteId, {
      heroTitle,
      heroBody,
      ctaText,
      content: {
        heroImageUrl,
        introTitle,
        introBody,
        serviceItems,
        reviewText,
        faqQuestion,
        faqAnswer,
        accessInfo,
        contactInfo,
        footerText
      },
      sections
    })

    fetch('/api/autosave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        heroTitle,
        heroBody,
        ctaText,
        sections,
        content: {
          heroImageUrl,
          introTitle,
          introBody,
          serviceItems,
          reviewText,
          faqQuestion,
          faqAnswer,
          accessInfo,
          contactInfo,
          footerText
        }
      })
    }).finally(() => setStatus('saved'))
  }, [site, status, siteId, heroTitle, heroBody, ctaText, heroImageUrl, introTitle, introBody, serviceItems, reviewText, faqQuestion, faqAnswer, accessInfo, contactInfo, footerText, sections], 900)

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

  const toggleSection = (id: SiteSection['id']) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)))
    setStatus('unsaved')
  }

  const updateServiceItem = (index: number, key: keyof ServiceItem, value: string) => {
    const copied = [...serviceItems]
    copied[index] = { ...copied[index], [key]: value }
    setServiceItems(copied)
    setStatus('unsaved')
  }

  const addServiceItem = () => {
    setServiceItems((prev) => [...prev, { name: '新しいメニュー', price: '¥0' }])
    setStatus('unsaved')
  }

  const removeServiceItem = (index: number) => {
    setServiceItems((prev) => prev.filter((_, i) => i !== index))
    setStatus('unsaved')
  }

  const handleImageUpload = (file: File | undefined) => {
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setUploadMessage('画像は5MB以内にしてください。')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        setHeroImageUrl(result)
        setUploadMessage('画像をセットしました。')
        setStatus('unsaved')
      }
    }
    reader.readAsDataURL(file)
  }

  const visibleSectionMap = useMemo(() => {
    return Object.fromEntries(sections.map((section) => [section.id, section])) as Record<SiteSection['id'], SiteSection>
  }, [sections])

  return (
    <AppShell title="HPエディタ（編集機能強化版）">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm text-subtext">編集対象HP: <span className="font-semibold text-text">{site?.name ?? siteId}</span></p>
          <p className="text-xs text-subtext">現在テンプレート: {site?.templateName ?? '未設定'} / セクション本文・料金・画像を編集できます。</p>
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
            ヒーロー見出し
            <input value={heroTitle} onChange={(e) => { setHeroTitle(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" />
          </label>

          <label className="mt-3 block text-sm">
            ヒーロー本文
            <textarea value={heroBody} onChange={(e) => { setHeroBody(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" rows={3} />
          </label>

          <label className="mt-3 block text-sm">
            CTAテキスト
            <input value={ctaText} onChange={(e) => { setCtaText(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" />
          </label>

          <div className="mt-4 card p-3 text-sm">
            <p className="font-medium">ヒーロー画像（5MB以内）</p>
            <input
              type="file"
              accept="image/*"
              className="mt-2 block w-full text-sm"
              onChange={(e) => handleImageUpload(e.target.files?.[0])}
            />
            {uploadMessage ? <p className="mt-2 text-xs text-subtext">{uploadMessage}</p> : null}
          </div>

          <label className="mt-4 block text-sm">
            自己紹介タイトル
            <input value={introTitle} onChange={(e) => { setIntroTitle(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" />
          </label>

          <label className="mt-3 block text-sm">
            自己紹介本文
            <textarea value={introBody} onChange={(e) => { setIntroBody(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" rows={3} />
          </label>

          <div className="mt-4 card p-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">サービス・料金（ここを編集）</p>
              <button type="button" onClick={addServiceItem} className="rounded border border-main/40 px-2 py-1 text-xs">+ 項目追加</button>
            </div>
            <div className="mt-2 space-y-2">
              {serviceItems.map((item, index) => (
                <div key={`${item.name}-${index}`} className="grid grid-cols-12 gap-2">
                  <input
                    value={item.name}
                    onChange={(e) => updateServiceItem(index, 'name', e.target.value)}
                    className="col-span-7 rounded border border-main/30 px-2 py-1 text-sm"
                    placeholder="メニュー名"
                  />
                  <input
                    value={item.price}
                    onChange={(e) => updateServiceItem(index, 'price', e.target.value)}
                    className="col-span-4 rounded border border-main/30 px-2 py-1 text-sm"
                    placeholder="¥8,000"
                  />
                  <button type="button" onClick={() => removeServiceItem(index)} className="col-span-1 rounded border text-xs">×</button>
                </div>
              ))}
            </div>
          </div>

          <label className="mt-4 block text-sm">
            お客様の声
            <textarea value={reviewText} onChange={(e) => { setReviewText(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" rows={2} />
          </label>

          <label className="mt-3 block text-sm">
            FAQ 質問
            <input value={faqQuestion} onChange={(e) => { setFaqQuestion(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" />
          </label>

          <label className="mt-3 block text-sm">
            FAQ 回答
            <textarea value={faqAnswer} onChange={(e) => { setFaqAnswer(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" rows={2} />
          </label>

          <label className="mt-3 block text-sm">
            アクセス・営業時間
            <textarea value={accessInfo} onChange={(e) => { setAccessInfo(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" rows={2} />
          </label>

          <label className="mt-3 block text-sm">
            お問い合わせ情報
            <textarea value={contactInfo} onChange={(e) => { setContactInfo(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" rows={2} />
          </label>

          <label className="mt-3 block text-sm">
            フッターテキスト
            <input value={footerText} onChange={(e) => { setFooterText(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" />
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

          <div className="mt-4">
            <p className="font-medium">セクションON/OFF・並び替え</p>
            <div className="mt-2 space-y-2">
              {sections.map((section, index) => (
                <div key={section.id} className="flex items-center justify-between rounded-lg border border-main/20 bg-white p-2 text-sm">
                  <span>{section.name}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => moveSection(index, -1)} className="rounded border px-2" type="button">↑</button>
                    <button onClick={() => moveSection(index, 1)} className="rounded border px-2" type="button">↓</button>
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

          <PreviewSection section={visibleSectionMap.hero}>
            <h3 className="text-2xl font-bold">{heroTitle}</h3>
            <p className="mt-2 text-subtext">{heroBody}</p>
            {heroImageUrl ? <img src={heroImageUrl} alt="ヒーロー画像" className="mt-3 h-48 w-full rounded-lg object-cover" /> : null}
            <button style={{ backgroundColor: buttonColor }} className="mt-4 rounded-lg px-4 py-2 font-semibold text-white">{ctaText}</button>
          </PreviewSection>

          <PreviewSection section={visibleSectionMap.intro}>
            <h4 className="text-xl font-bold">{introTitle}</h4>
            <p className="mt-2 text-subtext">{introBody}</p>
          </PreviewSection>

          <PreviewSection section={visibleSectionMap.services}>
            <h4 className="text-xl font-bold">サービス・メニュー</h4>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {serviceItems.map((item, index) => (
                <div key={`${item.name}-${index}`} className="rounded-lg border border-main/20 p-3">
                  <p className="text-sm text-subtext">{item.name}</p>
                  <p className="mt-1 font-semibold">{item.price}</p>
                </div>
              ))}
            </div>
          </PreviewSection>

          <PreviewSection section={visibleSectionMap.reviews}>
            <h4 className="text-xl font-bold">お客様の声</h4>
            <p className="mt-2 text-subtext">「{reviewText}」</p>
          </PreviewSection>

          <PreviewSection section={visibleSectionMap.faq}>
            <h4 className="text-xl font-bold">よくある質問</h4>
            <p className="mt-2 font-semibold">Q. {faqQuestion}</p>
            <p className="mt-1 text-subtext">A. {faqAnswer}</p>
          </PreviewSection>

          <PreviewSection section={visibleSectionMap.access}>
            <h4 className="text-xl font-bold">アクセス・営業時間</h4>
            <p className="mt-2 text-subtext whitespace-pre-line">{accessInfo}</p>
          </PreviewSection>

          <PreviewSection section={visibleSectionMap.contact}>
            <h4 className="text-xl font-bold">お問い合わせ</h4>
            <p className="mt-2 text-subtext whitespace-pre-line">{contactInfo}</p>
          </PreviewSection>

          <PreviewSection section={visibleSectionMap.footer}>
            <p className="text-sm text-subtext">{footerText}</p>
          </PreviewSection>
        </section>
      </div>
    </AppShell>
  )
}
