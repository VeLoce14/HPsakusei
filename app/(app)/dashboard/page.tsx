'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { mockSites, type MockSite } from '@/lib/mock'

export default function DashboardPage() {
  const [sites, setSites] = useState<MockSite[]>(mockSites)

  const createNewSite = () => {
    const serial = sites.length + 1
    const padded = String(serial).padStart(3, '0')
    const newSite: MockSite = {
      id: `site-${padded}`,
      name: `新規HP ${serial}`,
      subdomain: `new-site-${serial}`,
      templateName: 'テンプレート未選択',
      isPublished: false,
      enabledToppings: []
    }

    setSites((prev) => [newSite, ...prev])
  }

  return (
    <AppShell title="ダッシュボード">
      <p className="text-subtext">1ユーザーで複数HPを管理できます。作成したHPを選ぶとエディタへ移動します。</p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <button onClick={createNewSite} type="button" className="card p-5 text-left hover:bg-accent/50">
          <h2 className="font-heading text-lg font-bold">+ HPを新規作成</h2>
          <p className="mt-2 text-sm text-subtext">テンプレート選択前の空HPを追加（モック）</p>
        </button>
        <Link href="/publish" className="card p-5 hover:bg-accent/50">
          <h2 className="font-heading text-lg font-bold">公開設定</h2>
          <p className="mt-2 text-sm text-subtext">サブドメイン変更・公開ON/OFF</p>
        </Link>
        <Link href="/toppings" className="card p-5 hover:bg-accent/50">
          <h2 className="font-heading text-lg font-bold">トッピング管理</h2>
          <p className="mt-2 text-sm text-subtext">HPごとにトッピングを切り替え</p>
        </Link>
      </div>

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
                  <Link href={`/editor/${site.id}`} className="rounded-lg bg-main px-3 py-1.5 text-sm font-semibold text-white">このHPを編集</Link>
                  <Link href={`/toppings/${site.id}`} className="rounded-lg border border-main/40 px-3 py-1.5 text-sm font-semibold text-main">トッピング設定</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
