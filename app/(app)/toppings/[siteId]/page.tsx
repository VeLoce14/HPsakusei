'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { TOPPINGS } from '@/data/toppings'
import { useSites } from '@/lib/site-store'
import { calculateMonthlyTotal, formatYen } from '@/lib/pricing'

export default function SiteToppingsPage() {
  const { siteId } = useParams<{ siteId: string }>()
  const { sites, toggleTopping } = useSites()

  const site = useMemo(() => sites.find((item) => item.id === siteId), [sites, siteId])

  if (!site) {
    return (
      <AppShell title="トッピング管理">
        <p className="text-subtext">対象HPが見つかりませんでした。</p>
        <Link href="/toppings" className="mt-4 inline-block rounded-lg border border-main/40 px-4 py-2 text-sm font-semibold text-main">HP選択に戻る</Link>
      </AppShell>
    )
  }

  const price = calculateMonthlyTotal(site.enabledToppings)

  return (
    <AppShell title={`トッピング管理: ${site.name}`}>
      <div className="card p-4">
        <p className="text-sm text-subtext">対象HP</p>
        <p className="mt-1 text-lg font-bold">{site.name}（{site.subdomain}.example.com）</p>
        <p className="mt-2 text-sm text-subtext">月額合計（このHPのみ）</p>
        <p className="mt-1 text-3xl font-bold text-main">{formatYen(price.total)} / 月</p>
        <p className="mt-1 text-sm text-subtext">ベース {formatYen(price.base)} + トッピング {formatYen(price.toppings)}</p>
      </div>

      <div className="mt-5 grid gap-3">
        {TOPPINGS.map((item) => (
          <article key={item.id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="mt-1 text-sm text-subtext">{item.description}</p>
                {item.note ? <p className="mt-1 text-xs text-subtext">※{item.note}</p> : null}
              </div>
              <div className="text-right">
                <p className="font-bold text-main">{formatYen(item.price)} / 月</p>
                <label className="mt-2 inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={site.enabledToppings.includes(item.id)}
                    onChange={() => toggleTopping(site.id, item.id)}
                  />
                  ON / OFF
                </label>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/editor/${site.id}`} className="rounded-lg bg-main px-4 py-2 text-sm font-semibold text-white">このHPを編集</Link>
        <Link href="/toppings" className="rounded-lg border border-main/40 px-4 py-2 text-sm font-semibold text-main">HP一覧に戻る</Link>
      </div>
    </AppShell>
  )
}
