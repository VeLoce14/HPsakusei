'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { appendContactMessage } from '@/lib/contact-store'
import { readSitesFromStorage } from '@/lib/site-store'

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

  const hasContactForm = site.enabledToppings.includes('contact-form')
  const hasExtraPages = site.enabledToppings.includes('extra-pages')
  const extraPages = hasExtraPages ? site.content.extraPages : []
  const currentExtraPage = slug ? extraPages.find((page) => page.slug === slug) : null

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
    <main className="min-h-screen bg-bg px-4 py-12">
      <section className="mx-auto max-w-4xl card p-6">
        <p className="badge">公開ページ（MVPモック）</p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-main whitespace-pre-line">{site.heroTitle}</h1>
        <p className="mt-2 text-subtext whitespace-pre-line">{site.heroBody}</p>

        {site.content.heroImageUrl ? (
          <img src={site.content.heroImageUrl} alt="メイン画像" className="mt-4 h-56 w-full rounded-lg object-cover" />
        ) : null}

        {hasExtraPages && extraPages.length > 0 ? (
          <nav className="mt-5 flex flex-wrap gap-2 text-sm">
            <Link href={`/sites/${subdomain}`} className={`rounded-full px-3 py-1.5 ${!slug ? 'bg-main text-white' : 'bg-accent text-main'}`}>トップ</Link>
            {extraPages.map((page) => (
              <Link
                key={page.id}
                href={`/sites/${subdomain}/${page.slug}`}
                className={`rounded-full px-3 py-1.5 ${slug === page.slug ? 'bg-main text-white' : 'bg-accent text-main'}`}
              >
                {page.title}
              </Link>
            ))}
          </nav>
        ) : null}

        {currentExtraPage ? (
          <article className="mt-6 rounded-lg bg-white p-5">
            <h2 className="text-2xl font-bold whitespace-pre-line">{currentExtraPage.title}</h2>
            <p className="mt-3 text-subtext whitespace-pre-line">{currentExtraPage.body}</p>
          </article>
        ) : (
          <>
            <article className="mt-6 rounded-lg bg-white p-5">
              <h2 className="text-2xl font-bold whitespace-pre-line">{site.content.introTitle}</h2>
              <p className="mt-2 text-subtext whitespace-pre-line">{site.content.introBody}</p>
            </article>

            {hasContactForm ? (
              <article className="mt-6 rounded-lg bg-white p-5">
                <h2 className="text-2xl font-bold">お問い合わせフォーム</h2>
                <p className="mt-2 text-sm text-subtext">このHPをご覧の方から、運営者へ直接お問い合わせを送信できます。</p>

                <form onSubmit={submitContact} className="mt-4 space-y-3">
                  <label className="block text-sm">
                    お名前
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2"
                      placeholder="山田 太郎"
                    />
                  </label>

                  <label className="block text-sm">
                    メールアドレス
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2"
                      placeholder="sample@example.com"
                    />
                  </label>

                  <label className="block text-sm">
                    お問い合わせ内容
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2"
                      placeholder="お問い合わせ内容をご入力ください。"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={submitStatus === 'sending'}
                    className="rounded-lg bg-main px-4 py-2 font-semibold text-white disabled:opacity-60"
                  >
                    {submitStatus === 'sending' ? '送信中...' : 'お問い合わせを送信'}
                  </button>
                </form>

                {submitMessage ? (
                  <p className={`mt-3 text-sm ${submitStatus === 'done' ? 'text-main' : 'text-red-700'}`}>
                    {submitMessage}
                  </p>
                ) : null}
              </article>
            ) : (
              <article className="mt-6 rounded-lg bg-white p-5">
                <h2 className="text-xl font-bold">お問い合わせ</h2>
                <p className="mt-2 text-subtext whitespace-pre-line">{site.content.contactInfo}</p>
              </article>
            )}
          </>
        )}
      </section>
    </main>
  )
}
