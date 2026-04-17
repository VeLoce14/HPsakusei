import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { mockSites } from '@/lib/mock'

export default function ToppingsSiteSelectPage() {
  return (
    <AppShell title="トッピング管理（HPごと）">
      <p className="text-subtext">トッピングはHP単位で設定します。編集したいHPを選択してください。</p>

      <div className="mt-5 grid gap-3">
        {mockSites.map((site) => (
          <article key={site.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">{site.name}</h2>
                <p className="text-sm text-subtext">{site.subdomain}.example.com</p>
                <p className="text-xs text-subtext">選択中トッピング: {site.enabledToppings.length}件</p>
              </div>
              <Link href={`/toppings/${site.id}`} className="rounded-lg bg-main px-4 py-2 text-sm font-semibold text-white">
                このHPのトッピングを管理
              </Link>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  )
}
