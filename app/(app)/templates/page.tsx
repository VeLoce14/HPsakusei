import { AppShell } from '@/components/app-shell'
import { TEMPLATES, TEMPLATE_OPTIONS } from '@/data/templates'

export default function TemplatesPage() {
  return (
    <AppShell title="テンプレート選択">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block">業種カテゴリ</span>
          <select className="w-full rounded-lg border border-main/30 bg-white px-3 py-2">
            <option value="all">すべて</option>
            {TEMPLATE_OPTIONS.businessTypes.map((item) => (
              <option key={item.key} value={item.key}>{item.label}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block">雰囲気</span>
          <select className="w-full rounded-lg border border-main/30 bg-white px-3 py-2">
            <option value="all">すべて</option>
            {TEMPLATE_OPTIONS.styles.map((item) => (
              <option key={item.key} value={item.key}>{item.label}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-4 text-sm text-subtext">MVPでは5業種 × 3雰囲気 = 15テンプレートを提供します。</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((template) => (
          <article key={template.id} className="card overflow-hidden">
            <img src={template.thumbnail} alt={template.name} className="h-36 w-full object-cover" />
            <div className="p-4">
              <h2 className="font-semibold">{template.name}</h2>
              <p className="mt-1 text-sm text-subtext">ID: {template.id}</p>
              <button type="button" className="mt-3 w-full rounded-lg bg-main px-3 py-2 text-sm font-semibold text-white">このテンプレートを選択</button>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  )
}
