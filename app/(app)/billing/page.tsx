import { AppShell } from '@/components/app-shell'
import { TOPPINGS } from '@/data/toppings'
import { formatYen } from '@/lib/pricing'

export default function BillingPage() {
  return (
    <AppShell title="料金・支払い管理">
      <section className="card p-4">
        <h2 className="font-heading text-lg font-bold">現在の月額合計</h2>
        <p className="mt-2 text-3xl font-bold text-main">¥3,280 / 月</p>
        <p className="mt-1 text-sm text-subtext">（ベースプラン + 選択中トッピングの合計）</p>
      </section>

      <section className="mt-4 card p-4">
        <h2 className="font-heading text-lg font-bold">トッピング内訳</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {TOPPINGS.slice(0, 4).map((item) => (
            <li key={item.id} className="flex justify-between border-b border-main/10 pb-1">
              <span>{item.name}</span>
              <span>{formatYen(item.price)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 card p-4">
        <h2 className="font-heading text-lg font-bold">Stripe Customer Portal</h2>
        <p className="mt-2 text-sm text-subtext">カード情報管理・請求履歴・領収書ダウンロードはStripe Portalへ遷移させます。</p>
        <button className="mt-3 rounded-lg bg-main px-4 py-2 text-sm font-semibold text-white">支払い情報を管理</button>
        <p className="mt-3 text-xs text-subtext">解約前に「休眠プラン（月額300円）」へのダウングレード案内を表示します。</p>
      </section>
    </AppShell>
  )
}
