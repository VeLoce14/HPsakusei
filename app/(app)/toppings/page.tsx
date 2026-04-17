import { AppShell } from '@/components/app-shell'
import { TOPPINGS } from '@/data/toppings'
import { calculateMonthlyTotal, formatYen } from '@/lib/pricing'
import { mockEnabledToppingIds } from '@/lib/mock'

export default function ToppingsPage() {
  const price = calculateMonthlyTotal(mockEnabledToppingIds)

  return (
    <AppShell title="トッピング管理">
      <div className="card p-4">
        <p className="text-sm text-subtext">月額合計（リアルタイム表示モック）</p>
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
                  <input type="checkbox" defaultChecked={mockEnabledToppingIds.includes(item.id)} />
                  ON / OFF
                </label>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  )
}
