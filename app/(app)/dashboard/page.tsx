import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { mockSites } from '@/lib/mock'

export default function DashboardPage() {
  return (
    <AppShell title="ダッシュボード">
      <p className="text-subtext">1ユーザーで複数HPを管理できる構成です。</p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Link href="/editor/site-001" className="card p-5 hover:bg-accent/50">
          <h2 className="font-heading text-lg font-bold">HPを編集する</h2>
          <p className="mt-2 text-sm text-subtext">Craft.js連携予定（モック段階）</p>
        </Link>
        <Link href="/publish" className="card p-5 hover:bg-accent/50">
          <h2 className="font-heading text-lg font-bold">公開設定</h2>
          <p className="mt-2 text-sm text-subtext">サブドメイン変更・公開ON/OFF</p>
        </Link>
        <Link href="/toppings" className="card p-5 hover:bg-accent/50">
          <h2 className="font-heading text-lg font-bold">トッピング管理</h2>
          <p className="mt-2 text-sm text-subtext">料金合計のリアルタイム反映</p>
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-bold">あなたのHP一覧</h2>
        <div className="mt-4 grid gap-3">
          {mockSites.map((site) => (
            <article key={site.id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{site.name}</h3>
                  <p className="text-sm text-subtext">{site.templateName}</p>
                </div>
                <span className="badge">{site.isPublished ? '公開中' : '非公開'}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
