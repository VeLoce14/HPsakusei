'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { appendContactMessage } from '@/lib/contact-store'
import { readSitesFromStorage } from '@/lib/site-store'

function getThemeByTemplate(templateId: string) {
  if (templateId === 'menu') {
    return {
      heroBg: 'from-amber-50 via-orange-50 to-rose-50',
      heroCard: 'bg-white/90 border-orange-200',
      sectionTitle: 'text-orange-900',
      accentBg: 'bg-orange-50',
      button: 'bg-orange-800 hover:bg-orange-900'
    }
  }

  if (templateId === 'trust') {
    return {
      heroBg: 'from-slate-100 via-blue-50 to-white',
      heroCard: 'bg-white/95 border-slate-200',
      sectionTitle: 'text-slate-900',
      accentBg: 'bg-slate-50',
      button: 'bg-slate-800 hover:bg-slate-900'
    }
  }

  return {
    heroBg: 'from-emerald-50 via-white to-teal-50',
    heroCard: 'bg-white/90 border-emerald-200',
    sectionTitle: 'text-emerald-900',
    accentBg: 'bg-emerald-50',
    button: 'bg-emerald-800 hover:bg-emerald-900'
  }
}

function extractFirstUrl(text: string) {
  const found = text.match(/https?:\/\/[^\s]+/)
  return found?.[0] ?? ''
}

export default function PublicSitePage() {
  const params = useParams<{ subdomain: string; slug?: string[] }>()
  const subdomain = params.subdomain
  const slugParam = params.slug
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam

  const allSites = useMemo(() => readSitesFromStorage(), [])
  const site = useMemo(() => allSites.find((item) => item.subdomain === subdomain), [allSites, subdomain])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  if (!site) {
    return (
      <main className="min-h-screen bg-bg px-4 py-12">
        <section className="mx-auto max-w-4xl card p-6">
          <h1 className="font-heading text-2xl font-bold text-main">サイトが見つかりません</h1>
          <p className="mt-2 text-subtext">{subdomain}.example.com は未公開または存在しません。</p>
        </section>
      </main>
    )
  }

  const theme = getThemeByTemplate(site.templateId)
  const hasContactForm = site.enabledToppings.includes('contact-form')
  const hasExtraPages = site.enabledToppings.includes('extra-pages')
  const hasBooking = site.enabledToppings.includes('booking')
  const hasMap = site.enabledToppings.includes('google-map')

  const extraPages = hasExtraPages ? site.content.extraPages : []
  const currentExtraPage = slug ? extraPages.find((page) => page.slug === slug) : null
  const bookingUrl = extractFirstUrl(site.content.bookingInfo)

  const sectionEnabled = (id: 'hero' | 'intro' | 'services' | 'reviews' | 'faq' | 'access' | 'contact' | 'footer') => {
    return site.sections.find((section) => section.id === id)?.enabled ?? true
  }

  if (slug && !currentExtraPage) {
    return (
      <main className="min-h-screen bg-bg px-4 py-12">
        <section className="mx-auto max-w-4xl card p-6">
          <h1 className="font-heading text-2xl font-bold text-main">ページが見つかりません</h1>
          <p className="mt-2 text-subtext">指定されたURLのページは存在しないか、追加ページトッピングがOFFです。</p>
          <Link href={`/sites/${subdomain}`} className="mt-4 inline-block rounded-lg border border-main/40 px-4 py-2 text-sm font-semibold text-main">トップページへ戻る</Link>
        </section>
      </main>
    )
  }

  const submitContact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!site || !hasContactForm) return
    if (!name.trim() || !email.trim() || !message.trim()) {
      setSubmitStatus('error')
      setSubmitMessage('名前・メールアドレス・お問い合わせ内容を入力してください。')
      return
    }

    setSubmitStatus('sending')

    const payload = {
      siteId: site.id,
      siteName: site.name,
      siteSubdomain: site.subdomain,
      customerName: name,
      customerEmail: email,
      customerMessage: message
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data?.message || '送信に失敗しました。')
      }

      appendContactMessage({
        id: `msg-${Date.now()}`,
        siteId: site.id,
        siteName: site.name,
        customerName: name,
        customerEmail: email,
        customerMessage: message,
        createdAt: new Date().toISOString(),
        status: 'new'
      })

      setSubmitStatus('done')
      setSubmitMessage('お問い合わせを送信しました。HPの管理画面で確認できます。')
      setName('')
      setEmail('')
      setMessage('')
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage(error instanceof Error ? error.message : '送信に失敗しました。')
    }
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <header className={`bg-gradient-to-b ${theme.heroBg} px-4 pb-12 pt-10 md:pt-14`}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 md:text-sm">
            <p>{site.name}</p>
            <p>{subdomain}.example.com</p>
          </div>

          {hasExtraPages && extraPages.length > 0 ? (
            <nav className="mt-4 flex flex-wrap gap-2 text-xs md:text-sm">
              <Link href={`/sites/${subdomain}`} className={`rounded-full px-3 py-1.5 ${!slug ? 'bg-zinc-900 text-white' : 'bg-white/80 text-zinc-700'}`}>トップ</Link>
              {extraPages.map((page) => (
                <Link
                  key={page.id}
                  href={`/sites/${subdomain}/${page.slug}`}
                  className={`rounded-full px-3 py-1.5 ${slug === page.slug ? 'bg-zinc-900 text-white' : 'bg-white/80 text-zinc-700'}`}
                >
                  {page.title}
                </Link>
              ))}
            </nav>
          ) : null}

          <section className={`mt-6 rounded-2xl border p-6 shadow-sm md:p-10 ${theme.heroCard}`}>
            <p className="inline-flex rounded-full bg-white px-3 py-1 text-xs text-zinc-500">{site.templateName}</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight whitespace-pre-line md:text-5xl">{site.heroTitle}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600 whitespace-pre-line md:text-base">{site.heroBody}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className={`rounded-full px-6 py-3 text-sm font-semibold text-white transition md:text-base ${theme.button}`} type="button">
                {site.ctaText}
              </button>
              {hasBooking ? (
                <a
                  href={bookingUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-800"
                >
                  予約フォームへ
                </a>
              ) : null}
            </div>

            {site.content.heroImageUrl ? (
              <img src={site.content.heroImageUrl} alt="メイン画像" className="mt-8 h-56 w-full rounded-xl object-cover md:h-80" />
            ) : null}
          </section>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 md:space-y-10 md:py-14">
        {currentExtraPage ? (
          <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
            <h2 className="text-2xl font-bold whitespace-pre-line md:text-4xl">{currentExtraPage.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-700 whitespace-pre-line md:text-base">{currentExtraPage.body}</p>
          </article>
        ) : (
          <>
            {sectionEnabled('intro') ? (
              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
                <h2 className={`text-2xl font-bold md:text-3xl ${theme.sectionTitle} whitespace-pre-line`}>{site.content.introTitle}</h2>
                <p className="mt-4 text-sm leading-relaxed text-zinc-700 whitespace-pre-line md:text-base">{site.content.introBody}</p>
              </section>
            ) : null}

            {sectionEnabled('services') ? (
              <section className={`rounded-2xl border border-zinc-200 p-6 md:p-10 ${theme.accentBg}`}>
                <h2 className={`text-2xl font-bold md:text-3xl ${theme.sectionTitle}`}>サービス・料金</h2>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {site.content.serviceItems.map((item, index) => (
                    <article key={`${item.name}-${index}`} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                      <p className="text-sm text-zinc-600 whitespace-pre-line">{item.name}</p>
                      <p className="mt-2 text-xl font-semibold tracking-wide">{item.price}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {sectionEnabled('reviews') ? (
              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
                <h2 className={`text-2xl font-bold md:text-3xl ${theme.sectionTitle}`}>お客様の声</h2>
                <blockquote className="mt-4 border-l-4 border-zinc-300 pl-4 text-sm leading-relaxed text-zinc-700 whitespace-pre-line md:text-base">
                  「{site.content.reviewText}」
                </blockquote>
              </section>
            ) : null}

            {sectionEnabled('faq') ? (
              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
                <h2 className={`text-2xl font-bold md:text-3xl ${theme.sectionTitle}`}>よくある質問</h2>
                <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="font-semibold whitespace-pre-line">Q. {site.content.faqQuestion}</p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700 whitespace-pre-line md:text-base">A. {site.content.faqAnswer}</p>
                </div>
              </section>
            ) : null}

            {sectionEnabled('access') && hasMap ? (
              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
                <h2 className={`text-2xl font-bold md:text-3xl ${theme.sectionTitle}`}>アクセス・営業時間</h2>
                <p className="mt-4 text-sm leading-relaxed text-zinc-700 whitespace-pre-line md:text-base">{site.content.accessInfo}</p>
              </section>
            ) : null}

            {hasBooking ? (
              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
                <h2 className={`text-2xl font-bold md:text-3xl ${theme.sectionTitle}`}>予約フォーム</h2>
                <p className="mt-4 text-sm leading-relaxed text-zinc-700 whitespace-pre-line md:text-base">{site.content.bookingInfo}</p>
                <div className="mt-5">
                  <a
                    href={bookingUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex rounded-full px-6 py-3 text-sm font-semibold text-white ${theme.button}`}
                  >
                    予約サイトを開く
                  </a>
                </div>
              </section>
            ) : null}

            {sectionEnabled('contact') ? (
              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-10">
                <h2 className={`text-2xl font-bold md:text-3xl ${theme.sectionTitle}`}>お問い合わせ</h2>

                {hasContactForm ? (
                  <form onSubmit={submitContact} className="mt-5 space-y-4">
                    <label className="block text-sm">
                      お名前
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2"
                        placeholder="山田 太郎"
                      />
                    </label>

                    <label className="block text-sm">
                      メールアドレス
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2"
                        placeholder="sample@example.com"
                      />
                    </label>

                    <label className="block text-sm">
                      お問い合わせ内容
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                        className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2"
                        placeholder="ご相談内容をご入力ください。"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={submitStatus === 'sending'}
                      className={`rounded-full px-6 py-3 text-sm font-semibold text-white disabled:opacity-60 ${theme.button}`}
                    >
                      {submitStatus === 'sending' ? '送信中...' : 'お問い合わせを送信'}
                    </button>

                    {submitMessage ? (
                      <p className={`text-sm ${submitStatus === 'done' ? 'text-emerald-700' : 'text-red-700'}`}>
                        {submitMessage}
                      </p>
                    ) : null}
                  </form>
                ) : (
                  <p className="mt-4 text-sm leading-relaxed text-zinc-700 whitespace-pre-line md:text-base">{site.content.contactInfo}</p>
                )}
              </section>
            ) : null}
          </>
        )}

        {(site.enabledToppings.includes('sns') || site.enabledToppings.includes('blog') || site.enabledToppings.includes('seo') || site.enabledToppings.includes('ga')) ? (
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className={`text-xl font-bold ${theme.sectionTitle}`}>このサイトで利用中の拡張機能</h2>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {site.enabledToppings.includes('sns') ? <span className="badge">SNSリンク表示</span> : null}
              {site.enabledToppings.includes('blog') ? <span className="badge">ブログ・お知らせ</span> : null}
              {site.enabledToppings.includes('seo') ? <span className="badge">SEO設定</span> : null}
              {site.enabledToppings.includes('ga') ? <span className="badge">アクセス解析</span> : null}
            </div>
          </section>
        ) : null}
      </div>

      {sectionEnabled('footer') ? (
        <footer className="border-t border-zinc-200 px-4 py-8 text-center text-sm text-zinc-500">
          <p className="whitespace-pre-line">{site.content.footerText}</p>
        </footer>
      ) : null}
    </main>
  )
}
