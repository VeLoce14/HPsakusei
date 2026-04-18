'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { countNewMessagesBySite, readContactMessagesBySite, updateContactMessageStatus, type ContactMessage, type ContactMessageStatus } from '@/lib/contact-store'
import { useSites } from '@/lib/site-store'

export default function DashboardPage() {
  const { sites, hydrated, addSite } = useSites()
  const [activeSiteId, setActiveSiteId] = useState('')
  const [siteMessages, setSiteMessages] = useState<ContactMessage[]>([])

  const activeSite = useMemo(() => {
    const fallbackId = activeSiteId || sites[0]?.id
    return sites.find((site) => site.id === fallbackId)
  }, [sites, activeSiteId])

  const refreshSiteMessages = () => {
    if (!activeSite?.id) {
      setSiteMessages([])
      return
    }

    setSiteMessages(readContactMessagesBySite(activeSite.id))
  }

  useEffect(() => {
    refreshSiteMessages()
  }, [activeSite?.id, hydrated])

  const statusLabel: Record<ContactMessageStatus, string> = {
    new: '未対応',
    in_progress: '対応中',
    done: '対応済み'
  }

  const setMessageStatus = (messageId: string, status: ContactMessageStatus) => {
    updateContactMessageStatus(messageId, status)
    refreshSiteMessages()
  }

  return (
    <AppShell title="ダッシュボード">
      <p className="text-subtext">まず編集対象のHPを選んでから、編集・トッピング設定に進む導線にしています。</p>

      <section className="mt-4 card p-4">
        <h2 className="font-heading text-lg font-bold">HP選択起点</h2>
        {!hydrated ? (
          <p className="mt-2 text-sm text-subtext">読み込み中...</p>
        ) : (
          <>
            <label className="mt-3 block text-sm">
              編集したいHP
              <select
                value={activeSite?.id ?? ''}
                onChange={(e) => setActiveSiteId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-main/30 bg-white px-3 py-2 md:max-w-md"
              >
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}（{site.subdomain}）
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={addSite} type="button" className="rounded-lg border border-main/40 px-3 py-2 text-sm font-semibold text-main">
                + HPを新規作成
              </button>
              {activeSite ? (
                <>
                  <Link href={`/editor/${activeSite.id}`} className="rounded-lg bg-main px-3 py-2 text-sm font-semibold text-white">編集を開始</Link>
                  <Link href={`/toppings/${activeSite.id}`} className="rounded-lg border border-main/40 px-3 py-2 text-sm font-semibold text-main">トッピングを見る</Link>
                  <Link href={`/templates?siteId=${activeSite.id}`} className="rounded-lg border border-main/40 px-3 py-2 text-sm font-semibold text-main">テンプレート適用</Link>
                </>
              ) : null}
            </div>

            {activeSite ? (
              <div className="mt-4 rounded-lg border border-main/20 bg-white p-3">
                <p className="text-sm font-semibold">最新のお問い合わせ（{activeSite.name}）</p>
                {siteMessages.length === 0 ? (
                  <p className="mt-1 text-xs text-subtext">まだお問い合わせはありません。公開ページのフォーム送信でここに届きます。</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {siteMessages.slice(0, 3).map((msg) => (
                      <li key={msg.id} className="rounded border border-main/15 px-2 py-2 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold">{msg.customerName}（{msg.customerEmail}）</p>
                          <span className="badge">{statusLabel[msg.status]}</span>
                        </div>
                        <p className="mt-1 whitespace-pre-line text-subtext">{msg.customerMessage}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button type="button" onClick={() => setMessageStatus(msg.id, 'in_progress')} className="rounded border border-main/40 px-2 py-1">対応中にする</button>
                          <button type="button" onClick={() => setMessageStatus(msg.id, 'done')} className="rounded border border-main/40 px-2 py-1">対応済みにする</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/inbox" className="mt-2 inline-block text-xs font-semibold text-main underline">問い合わせ一覧を開く</Link>
              </div>
            ) : null}
          </>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-bold">あなたのHP一覧</h2>
        <div className="mt-4 grid gap-3">
          {sites.map((site) => (
            <article key={site.id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{site.name}</h3>
                  <p className="text-sm text-subtext">{site.templateName}</p>
                  <p className="text-xs text-subtext">{site.subdomain}.example.com</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge">{site.isPublished ? '公開中' : '非公開'}</span>
                  {countNewMessagesBySite(site.id) > 0 ? <span className="badge">未対応 {countNewMessagesBySite(site.id)}件</span> : null}
                  <Link href={`/editor/${site.id}`} className="rounded-lg bg-main px-3 py-1.5 text-sm font-semibold text-white">編集</Link>
                  <Link href={`/toppings/${site.id}`} className="rounded-lg border border-main/40 px-3 py-1.5 text-sm font-semibold text-main">トッピング</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
