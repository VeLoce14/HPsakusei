'use client'

import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { useSites } from '@/lib/site-store'

export default function ToppingsSiteSelectPage() {
  const { sites } = useSites()

  return (
    <AppShell title="トッピング（HP別の確認）">
      <p className="text-subtext">ここは一覧確認用です。編集やトッピング調整は、対象HPを選んで開始します。</p>

      <div className="mt-5 grid gap-3">
        {sites.map((site) => (
          <article key={site.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">{site.name}</h2>
                <p className="text-sm text-subtext">{site.subdomain}.example.com</p>
                <p className="text-xs text-subtext">有効トッピング: {site.enabledToppings.length}件</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/editor/${site.id}`} className="rounded-lg border border-main/40 px-3 py-2 text-sm font-semibold text-main">編集へ</Link>
                <Link href={`/toppings/${site.id}`} className="rounded-lg bg-main px-4 py-2 text-sm font-semibold text-white">このHPのトッピング</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  )
}
