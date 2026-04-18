'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { TOPPINGS } from '@/data/toppings'
import { contrastRatio } from '@/lib/color'
import { useDebouncedEffect } from '@/lib/debounce'
import { calculateMonthlyTotal, formatYen } from '@/lib/pricing'
import { useSites } from '@/lib/site-store'
import { cloneSections, createDefaultContent, type ExtraPage, type ServiceItem, type SiteSection } from '@/lib/site-defaults'

function PreviewSection({ section, children }: { section: SiteSection; children: React.ReactNode }) {
  if (!section.enabled) return null
  return <section className="mt-4 rounded-lg bg-white p-4">{children}</section>
}

type ImageMeta = {
  fileName: string
  fileSizeText: string
  width: number
  height: number
  ratioText: string
  ratioValue: number
  format: string
}

function gcd(a: number, b: number): number {
  if (!b) return a
  return gcd(b, a % b)
}

function createRatioText(width: number, height: number) {
  const divisor = gcd(width, height)
  return `${Math.round(width / divisor)}:${Math.round(height / divisor)}`
}

function getRecommendedRatio(templateId: string) {
  if (templateId === 'menu') return { width: 4, height: 3, label: '4:3' }
  if (templateId === 'trust') return { width: 1, height: 1, label: '1:1' }
  return { width: 16, height: 9, label: '16:9' }
}

function extractFirstUrl(text: string) {
  const found = text.match(/https?:\/\/[^\s]+/)
  return found?.[0] ?? ''
}

export default function EditorPage() {
  const params = useParams<{ siteId: string }>()
  const siteId = params.siteId

  const { sites, updateSite, toggleTopping } = useSites()
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
  const [bookingInfo, setBookingInfo] = useState('')
  const [extraPages, setExtraPages] = useState<ExtraPage[]>([])
  const [footerText, setFooterText] = useState('')

  const [status, setStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved')
  const [sections, setSections] = useState<SiteSection[]>(cloneSections())
  const [bgColor, setBgColor] = useState('#f7f8f5')
  const [buttonColor, setButtonColor] = useState('#2d6a4f')
  const [uploadMessage, setUploadMessage] = useState('')
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null)
  const [sectionNotice, setSectionNotice] = useState('')

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
    setBookingInfo(content.bookingInfo)
    setExtraPages(content.extraPages)
    setFooterText(content.footerText)
    setSections(cloneSections(site.sections))
    setStatus('saved')
  }, [site])

  useEffect(() => {
    if (!heroImageUrl) {
      setImageMeta(null)
      return
    }

    const img = new Image()
    img.onload = () => {
      const width = img.naturalWidth
      const height = img.naturalHeight
      const ratioText = createRatioText(width, height)
      setImageMeta((prev) => ({
        fileName: prev?.fileName ?? '登録済み画像',
        fileSizeText: prev?.fileSizeText ?? '不明',
        width,
        height,
        ratioText,
        ratioValue: width / height,
        format: prev?.format ?? '不明'
      }))
    }
    img.src = heroImageUrl
  }, [heroImageUrl])

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
        bookingInfo,
        extraPages,
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
          bookingInfo,
          extraPages,
          footerText
        }
      })
    }).finally(() => setStatus('saved'))
  }, [site, status, siteId, heroTitle, heroBody, ctaText, heroImageUrl, introTitle, introBody, serviceItems, reviewText, faqQuestion, faqAnswer, accessInfo, contactInfo, bookingInfo, extraPages, footerText, sections], 900)

  const ratio = useMemo(() => contrastRatio(bgColor, buttonColor), [bgColor, buttonColor])
  const lowContrast = ratio < 3

  const visibleSectionMap = useMemo(
    () => Object.fromEntries(sections.map((section) => [section.id, section])) as Record<SiteSection['id'], SiteSection>,
    [sections]
  )

  const sitePrice = calculateMonthlyTotal(site?.enabledToppings ?? [])
  const enabledSectionIds = useMemo(() => sections.filter((section) => section.enabled).map((section) => section.id), [sections])
  const recommendedRatio = useMemo(() => getRecommendedRatio(site?.templateId ?? 'story'), [site?.templateId])
  const bookingUrl = useMemo(() => extractFirstUrl(bookingInfo), [bookingInfo])
  const ratioWarning = useMemo(() => {
    if (!imageMeta) return null
    const recommendedValue = recommendedRatio.width / recommendedRatio.height
    const diff = Math.abs(imageMeta.ratioValue - recommendedValue)
    if (diff < 0.12) return null
    return `現在の比率 ${imageMeta.ratioText} は推奨 ${recommendedRatio.label} と差があります。表示時にトリミングされる可能性があります。`
  }, [imageMeta, recommendedRatio])

  const sectionLockReason: Partial<Record<SiteSection['id'], string>> = {
    access: '「Google Map埋め込み」トッピングをONにすると表示できます。',
    contact: '「お問い合わせフォーム＋自動返信」トッピングをONにすると表示できます。'
  }

  const canEnableSection = (sectionId: SiteSection['id']) => {
    if (!site) return false
    if (sectionId === 'access') return site.enabledToppings.includes('google-map')
    if (sectionId === 'contact') return site.enabledToppings.includes('contact-form')
    return true
  }

  const isSectionEnabled = (sectionId: SiteSection['id']) => enabledSectionIds.includes(sectionId)
  const hasTopping = (toppingId: string) => Boolean(site?.enabledToppings.includes(toppingId))

  const getToppingEffectMessage = (toppingId: string) => {
    if (toppingId === 'booking') return '予約フォーム設定パネルが編集できるようになります。'
    if (toppingId === 'extra-pages') return '追加ページ編集パネルが有効になり、公開ページに反映されます。'
    if (toppingId === 'google-map') return 'アクセス・営業時間セクションを表示できます。'
    if (toppingId === 'contact-form') return 'お問い合わせフォームを表示できます。'
    if (toppingId === 'sns') return 'プレビューにSNSリンク表示が追加されます。'
    if (toppingId === 'blog') return 'プレビューにブログ機能ラベルが追加されます。'
    return 'このトッピングの設定を反映しました。'
  }

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= sections.length) return

    const copied = [...sections]
    ;[copied[index], copied[target]] = [copied[target], copied[index]]
    setSections(copied)
    setStatus('unsaved')
  }

  const toggleSection = (id: SiteSection['id']) => {
    const target = sections.find((section) => section.id === id)
    if (!target) return

    if (!target.enabled && !canEnableSection(id)) {
      setSectionNotice(sectionLockReason[id] ?? 'このセクションは現在ONにできません。')
      return
    }

    setSectionNotice('')
    setSections((prev) => prev.map((section) => (section.id === id ? { ...section, enabled: !section.enabled } : section)))
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

  const addExtraPage = () => {
    setExtraPages((prev) => {
      if (prev.length >= 8) return prev
      const serial = prev.length + 1
      return [
        ...prev,
        {
          id: `page-${Date.now()}-${serial}`,
          title: `追加ページ ${serial}`,
          slug: `page-${serial}`,
          body: 'このページの内容を入力してください。'
        }
      ]
    })
    setStatus('unsaved')
  }

  const updateExtraPage = (pageId: string, key: keyof ExtraPage, value: string) => {
    setExtraPages((prev) => prev.map((page) => (page.id === pageId ? { ...page, [key]: value } : page)))
    setStatus('unsaved')
  }

  const removeExtraPage = (pageId: string) => {
    setExtraPages((prev) => prev.filter((page) => page.id !== pageId))
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
      if (typeof result !== 'string') return

      const img = new Image()
      img.onload = () => {
        const width = img.naturalWidth
        const height = img.naturalHeight

        setHeroImageUrl(result)
        setImageMeta({
          fileName: file.name,
          fileSizeText: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          width,
          height,
          ratioText: createRatioText(width, height),
          ratioValue: width / height,
          format: file.type || 'image/*'
        })
        setUploadMessage('画像をセットしました。')
        setStatus('unsaved')
      }
      img.src = result
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setHeroImageUrl('')
    setImageMeta(null)
    setUploadMessage('画像を削除しました。')
    setStatus('unsaved')
  }

  if (!site) {
    return (
      <AppShell title="HPエディタ">
        <p className="text-subtext">対象HPが見つかりませんでした。</p>
        <Link href="/dashboard" className="mt-4 inline-block rounded-lg border border-main/40 px-4 py-2 text-sm font-semibold text-main">ダッシュボードへ戻る</Link>
      </AppShell>
    )
  }

  return (
    <AppShell title="HPエディタ（実用改善版）">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm text-subtext">編集対象HP: <span className="font-semibold text-text">{site.name}</span></p>
          <p className="text-xs text-subtext">現在テンプレート: {site.templateName} / OFFにしたセクションの編集項目は自動で隠れます。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/sites/${site.subdomain}`} target="_blank" className="rounded-lg bg-main px-3 py-1.5 text-sm font-semibold text-white">公開ページを開く</Link>

          {hasTopping('extra-pages') && extraPages.length > 0 ? (
            <details className="group relative">
              <summary className="cursor-pointer list-none rounded-lg border border-main/40 px-3 py-1.5 text-sm font-semibold text-main">追加ページを開く ▾</summary>
              <div className="absolute right-0 z-10 mt-1 min-w-56 rounded-lg border border-main/20 bg-white p-2 shadow-lg">
                <Link href={`/sites/${site.subdomain}`} target="_blank" className="block rounded px-2 py-1 text-sm hover:bg-accent">/（トップ）</Link>
                {extraPages.map((page) => (
                  <Link
                    key={page.id}
                    href={`/sites/${site.subdomain}/${page.slug}`}
                    target="_blank"
                    className="mt-1 block rounded px-2 py-1 text-sm hover:bg-accent"
                  >
                    /{page.slug || 'page'}
                  </Link>
                ))}
              </div>
            </details>
          ) : null}

          <Link href={`/templates?siteId=${siteId}`} className="rounded-lg border border-main/40 px-3 py-1.5 text-sm font-semibold text-main">テンプレート変更</Link>
          <Link href="/dashboard" className="rounded-lg border border-main/40 px-3 py-1.5 text-sm font-semibold text-main">HP選択に戻る</Link>
        </div>
      </div>

      <p className="badge">保存状態: {status === 'saved' ? '保存済み' : status === 'saving' ? '保存中...' : '未保存'}</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="card p-4" aria-label="編集パネル">
          <h2 className="font-heading text-lg font-bold">編集パネル</h2>

          <div className="mt-4 rounded-lg border border-main/20 bg-white p-3">
            <p className="font-medium">セクション表示・並び替え</p>
            <p className="mt-1 text-xs text-subtext">ONのセクションだけ下の編集項目に表示されます。改行は Enter で入力できます。</p>
            <div className="mt-2 space-y-2">
              {sections.map((section, index) => {
                const isLocked = !section.enabled && !canEnableSection(section.id)

                return (
                  <div key={section.id} className="flex items-center justify-between rounded-lg border border-main/15 p-2 text-sm">
                    <div>
                      <span>{section.name}</span>
                      {isLocked && sectionLockReason[section.id] ? <p className="text-xs text-subtext">{sectionLockReason[section.id]}</p> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => moveSection(index, -1)} className="rounded border px-2" type="button">↑</button>
                      <button onClick={() => moveSection(index, 1)} className="rounded border px-2" type="button">↓</button>
                      <label className="flex items-center gap-1">
                        <input type="checkbox" checked={section.enabled} onChange={() => toggleSection(section.id)} disabled={isLocked} />
                        表示
                      </label>
                    </div>
                  </div>
                )
              })}
            </div>
            {sectionNotice ? <p className="mt-2 text-xs text-main">{sectionNotice}</p> : null}
          </div>

          {isSectionEnabled('hero') ? (
            <div className="mt-4 rounded-lg border border-main/20 bg-white p-3">
              <p className="font-medium">メインビジュアル</p>
              <label className="mt-2 block text-sm">
                見出し（改行可）
                <textarea value={heroTitle} onChange={(e) => { setHeroTitle(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" rows={2} />
              </label>
              <label className="mt-2 block text-sm">
                本文（改行可）
                <textarea value={heroBody} onChange={(e) => { setHeroBody(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" rows={3} />
              </label>
              <label className="mt-2 block text-sm">
                ボタンテキスト（改行可）
                <textarea value={ctaText} onChange={(e) => { setCtaText(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" rows={2} />
              </label>
              <div className="mt-3">
                <p className="text-sm font-medium">メイン画像（5MB以内）</p>
                <input type="file" accept="image/*" className="mt-1 block w-full text-sm" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button type="button" onClick={clearImage} className="rounded border border-main/40 px-2 py-1 text-xs text-main">画像を削除</button>
                  <p className="text-xs text-subtext">推奨比率: {recommendedRatio.label}</p>
                </div>
                {imageMeta ? (
                  <div className="mt-2 rounded-lg border border-main/15 bg-accent/40 p-2 text-xs text-subtext">
                    <p>ファイル: {imageMeta.fileName}</p>
                    <p>形式: {imageMeta.format}</p>
                    <p>サイズ: {imageMeta.fileSizeText}</p>
                    <p>解像度: {imageMeta.width} × {imageMeta.height}</p>
                    <p>比率: {imageMeta.ratioText}</p>
                  </div>
                ) : null}
                {ratioWarning ? <p className="mt-1 text-xs text-red-700">{ratioWarning}</p> : null}
                {uploadMessage ? <p className="mt-1 text-xs text-subtext">{uploadMessage}</p> : null}
              </div>
            </div>
          ) : null}

          {isSectionEnabled('intro') ? (
            <div className="mt-4 rounded-lg border border-main/20 bg-white p-3">
              <p className="font-medium">自己紹介・お店紹介</p>
              <label className="mt-2 block text-sm">
                タイトル（改行可）
                <textarea value={introTitle} onChange={(e) => { setIntroTitle(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" rows={2} />
              </label>
              <label className="mt-2 block text-sm">
                本文（改行可）
                <textarea value={introBody} onChange={(e) => { setIntroBody(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" rows={3} />
              </label>
            </div>
          ) : null}

          {isSectionEnabled('services') ? (
            <div className="mt-4 rounded-lg border border-main/20 bg-white p-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">サービス・料金</p>
                <button type="button" onClick={addServiceItem} className="rounded border border-main/40 px-2 py-1 text-xs">+ 項目追加</button>
              </div>
              <div className="mt-2 space-y-2">
                {serviceItems.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="grid grid-cols-12 gap-2">
                    <input value={item.name} onChange={(e) => updateServiceItem(index, 'name', e.target.value)} className="col-span-7 rounded border border-main/30 px-2 py-1 text-sm" placeholder="サービス名" />
                    <input value={item.price} onChange={(e) => updateServiceItem(index, 'price', e.target.value)} className="col-span-4 rounded border border-main/30 px-2 py-1 text-sm" placeholder="¥8,000" />
                    <button type="button" onClick={() => removeServiceItem(index)} className="col-span-1 rounded border text-xs">×</button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {isSectionEnabled('reviews') ? (
            <div className="mt-4 rounded-lg border border-main/20 bg-white p-3">
              <p className="font-medium">お客様の声（改行可）</p>
              <textarea value={reviewText} onChange={(e) => { setReviewText(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" rows={3} />
            </div>
          ) : null}

          {isSectionEnabled('faq') ? (
            <div className="mt-4 rounded-lg border border-main/20 bg-white p-3">
              <p className="font-medium">よくある質問</p>
              <textarea value={faqQuestion} onChange={(e) => { setFaqQuestion(e.target.value); setStatus('unsaved') }} className="mt-2 w-full rounded-lg border border-main/30 px-3 py-2" rows={2} placeholder="質問（改行可）" />
              <textarea value={faqAnswer} onChange={(e) => { setFaqAnswer(e.target.value); setStatus('unsaved') }} className="mt-2 w-full rounded-lg border border-main/30 px-3 py-2" rows={2} placeholder="回答（改行可）" />
            </div>
          ) : null}

          {isSectionEnabled('access') ? (
            <div className="mt-4 rounded-lg border border-main/20 bg-white p-3">
              <p className="font-medium">アクセス・営業時間（改行可）</p>
              <textarea value={accessInfo} onChange={(e) => { setAccessInfo(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" rows={3} />
            </div>
          ) : null}

          {isSectionEnabled('contact') ? (
            <div className="mt-4 rounded-lg border border-main/20 bg-white p-3">
              <p className="font-medium">お問い合わせ（改行可）</p>
              <textarea value={contactInfo} onChange={(e) => { setContactInfo(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" rows={3} />
            </div>
          ) : null}

          {isSectionEnabled('footer') ? (
            <div className="mt-4 rounded-lg border border-main/20 bg-white p-3">
              <p className="font-medium">フッター</p>
              <textarea value={footerText} onChange={(e) => { setFooterText(e.target.value); setStatus('unsaved') }} className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2" rows={2} />
            </div>
          ) : null}

          <div className="mt-4 rounded-lg border border-main/20 bg-white p-3">
            <p className="font-medium">予約フォーム設定（トッピング連動）</p>
            {hasTopping('booking') ? (
              <>
                <p className="mt-1 text-xs text-subtext">予約フォームトッピングがONです。ここで予約導線を編集できます。URLを含めると公開ページでiframe埋め込み表示されます。</p>
                <textarea
                  value={bookingInfo}
                  onChange={(e) => {
                    setBookingInfo(e.target.value)
                    setStatus('unsaved')
                  }}
                  className="mt-2 w-full rounded-lg border border-main/30 px-3 py-2"
                  rows={3}
                  placeholder="例）予約URL: https://example-booking.com\n来店前にご希望メニューをご記入ください。"
                />
                {bookingUrl ? (
                  <div className="mt-3 rounded-lg border border-main/20 bg-accent/40 p-2">
                    <p className="text-xs text-subtext">埋め込みプレビュー（編集画面）</p>
                    <iframe
                      src={bookingUrl}
                      title="予約フォームプレビュー"
                      className="mt-2 h-56 w-full rounded border border-main/20 bg-white"
                      loading="lazy"
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <p className="mt-1 text-xs text-subtext">「予約フォーム（外部埋め込み）」トッピングをONにすると編集できます。</p>
            )}
          </div>

          <div className="mt-4 rounded-lg border border-main/20 bg-white p-3">
            <p className="font-medium">追加ページ設定（トッピング連動）</p>
            {hasTopping('extra-pages') ? (
              <>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-xs text-subtext">作成済み {extraPages.length} / 8 ページ</p>
                  <button
                    type="button"
                    onClick={addExtraPage}
                    className="rounded border border-main/40 px-2 py-1 text-xs"
                    disabled={extraPages.length >= 8}
                  >
                    + 追加ページを作成
                  </button>
                </div>

                <div className="mt-2 space-y-3">
                  {extraPages.map((page, index) => (
                    <div key={page.id} className="rounded-lg border border-main/15 p-2">
                      <p className="text-xs text-subtext">ページ {index + 1}</p>
                      <label className="mt-1 block text-xs">
                        タイトル
                        <input
                          value={page.title}
                          onChange={(e) => updateExtraPage(page.id, 'title', e.target.value)}
                          className="mt-1 w-full rounded border border-main/30 px-2 py-1"
                        />
                      </label>
                      <label className="mt-1 block text-xs">
                        URLスラッグ（例: menu）
                        <input
                          value={page.slug}
                          onChange={(e) => updateExtraPage(page.id, 'slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                          className="mt-1 w-full rounded border border-main/30 px-2 py-1"
                        />
                      </label>
                      <label className="mt-1 block text-xs">
                        本文（改行可）
                        <textarea
                          value={page.body}
                          onChange={(e) => updateExtraPage(page.id, 'body', e.target.value)}
                          className="mt-1 w-full rounded border border-main/30 px-2 py-1"
                          rows={3}
                        />
                      </label>
                      <button type="button" onClick={() => removeExtraPage(page.id)} className="mt-2 rounded border px-2 py-1 text-xs">このページを削除</button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-1 text-xs text-subtext">「追加ページ」トッピングをONにすると編集できます。</p>
            )}
          </div>

          <div className="mt-4 rounded-lg border border-main/20 bg-white p-3">
            <p className="font-medium">トッピング（このHP）</p>
            <p className="mt-1 text-sm text-subtext">月額合計: {formatYen(sitePrice.total)}（ベース {formatYen(sitePrice.base)} + トッピング {formatYen(sitePrice.toppings)}）</p>
            <div className="mt-2 grid gap-2">
              {TOPPINGS.map((item) => (
                <label key={item.id} className="flex items-center justify-between rounded border border-main/15 px-2 py-1.5 text-sm">
                  <span>{item.name}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-subtext">{formatYen(item.price)}</span>
                    <input
                      type="checkbox"
                      checked={site.enabledToppings.includes(item.id)}
                      onChange={() => {
                        toggleTopping(site.id, item.id)
                        setSectionNotice(getToppingEffectMessage(item.id))
                        setStatus('unsaved')
                      }}
                    />
                  </span>
                </label>
              ))}
            </div>
          </div>

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

          <button type="button" className="mt-5 rounded-lg bg-main px-4 py-2 font-semibold text-white">公開する（自動保存とは分離）</button>
        </section>

        <section className="card p-4" aria-label="リアルタイムプレビュー" style={{ backgroundColor: bgColor }}>
          <h2 className="font-heading text-lg font-bold">リアルタイムプレビュー</h2>

          <PreviewSection section={visibleSectionMap.hero}>
            <h3 className="text-2xl font-bold whitespace-pre-line">{heroTitle}</h3>
            <p className="mt-2 text-subtext whitespace-pre-line">{heroBody}</p>
            {heroImageUrl ? <img src={heroImageUrl} alt="トップ画像" className="mt-3 h-48 w-full rounded-lg object-cover" /> : null}
            <button style={{ backgroundColor: buttonColor }} className="mt-4 rounded-lg px-4 py-2 font-semibold whitespace-pre-line text-white">{ctaText}</button>
          </PreviewSection>

          <PreviewSection section={visibleSectionMap.intro}>
            <h4 className="text-xl font-bold whitespace-pre-line">{introTitle}</h4>
            <p className="mt-2 text-subtext whitespace-pre-line">{introBody}</p>
          </PreviewSection>

          <PreviewSection section={visibleSectionMap.services}>
            <h4 className="text-xl font-bold">サービス・料金</h4>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {serviceItems.map((item, index) => (
                <div key={`${item.name}-${index}`} className="rounded-lg border border-main/20 p-3">
                  <p className="text-sm text-subtext whitespace-pre-line">{item.name}</p>
                  <p className="mt-1 font-semibold">{item.price}</p>
                </div>
              ))}
            </div>
          </PreviewSection>

          <PreviewSection section={visibleSectionMap.reviews}>
            <h4 className="text-xl font-bold">お客様の声</h4>
            <p className="mt-2 text-subtext whitespace-pre-line">「{reviewText}」</p>
          </PreviewSection>

          <PreviewSection section={visibleSectionMap.faq}>
            <h4 className="text-xl font-bold">よくある質問</h4>
            <p className="mt-2 font-semibold whitespace-pre-line">Q. {faqQuestion}</p>
            <p className="mt-1 text-subtext whitespace-pre-line">A. {faqAnswer}</p>
          </PreviewSection>

          <PreviewSection section={visibleSectionMap.access}>
            <h4 className="text-xl font-bold">アクセス・営業時間</h4>
            <p className="mt-2 text-subtext whitespace-pre-line">{accessInfo}</p>
          </PreviewSection>

          <PreviewSection section={visibleSectionMap.contact}>
            <h4 className="text-xl font-bold">お問い合わせ</h4>
            <p className="mt-2 text-subtext whitespace-pre-line">{contactInfo}</p>
          </PreviewSection>

          {hasTopping('booking') ? (
            <section className="mt-4 rounded-lg border border-main/25 bg-white p-4">
              <h4 className="text-xl font-bold">予約フォーム</h4>
              <p className="mt-2 text-subtext whitespace-pre-line">{bookingInfo}</p>
              {bookingUrl ? (
                <>
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex rounded-lg bg-main px-4 py-2 text-sm font-semibold text-white"
                  >
                    予約サイトを開く
                  </a>
                  <iframe
                    src={bookingUrl}
                    title="予約フォーム埋め込み"
                    className="mt-3 h-72 w-full rounded-lg border border-main/20"
                    loading="lazy"
                  />
                </>
              ) : (
                <button className="mt-3 rounded-lg bg-main px-4 py-2 text-sm font-semibold text-white" type="button">予約へ進む</button>
              )}
            </section>
          ) : null}

          {(hasTopping('sns') || hasTopping('blog') || hasTopping('seo') || hasTopping('ga')) ? (
            <section className="mt-4 rounded-lg border border-main/25 bg-white p-4">
              <h4 className="text-lg font-bold">有効な追加機能</h4>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {hasTopping('sns') ? <span className="badge">SNSリンク表示</span> : null}
                {hasTopping('blog') ? <span className="badge">ブログ・お知らせ</span> : null}
                {hasTopping('seo') ? <span className="badge">SEO設定</span> : null}
                {hasTopping('ga') ? <span className="badge">アクセス解析</span> : null}
              </div>
            </section>
          ) : null}

          {hasTopping('extra-pages') && extraPages.length > 0 ? (
            <section className="mt-4 rounded-lg border border-main/25 bg-white p-4">
              <h4 className="text-lg font-bold">追加ページ導線</h4>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {extraPages.map((page) => (
                  <span key={page.id} className="badge">/{page.slug || 'page'}</span>
                ))}
              </div>
            </section>
          ) : null}

          <PreviewSection section={visibleSectionMap.footer}>
            <p className="text-sm text-subtext whitespace-pre-line">{footerText}</p>
          </PreviewSection>
        </section>
      </div>
    </AppShell>
  )
}
