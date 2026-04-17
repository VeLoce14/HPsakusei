import { AppShell } from '@/components/app-shell'
import { FormField } from '@/components/form-field'

export default function AccountPage() {
  return (
    <AppShell title="アカウント設定">
      <section className="grid gap-4 md:grid-cols-2">
        <article className="card p-4">
          <h2 className="font-heading text-lg font-bold">メールアドレス変更</h2>
          <div className="mt-3"><FormField label="新しいメールアドレス" type="email" placeholder="new@example.com" /></div>
          <button className="mt-3 rounded-lg bg-main px-4 py-2 text-sm font-semibold text-white">変更メールを送信</button>
        </article>

        <article className="card p-4">
          <h2 className="font-heading text-lg font-bold">パスワード変更</h2>
          <div className="mt-3 space-y-3">
            <FormField label="現在のパスワード" type="password" />
            <FormField label="新しいパスワード" type="password" />
          </div>
          <button className="mt-3 rounded-lg bg-main px-4 py-2 text-sm font-semibold text-white">更新する</button>
        </article>
      </section>

      <section className="mt-4 card border-red-200 p-4">
        <h2 className="font-heading text-lg font-bold text-red-700">退会</h2>
        <p className="mt-2 text-sm text-red-700">退会すると作成済みのHP・関連データが削除されます。実行前に必ずバックアップを確認してください。</p>
        <button className="mt-3 rounded-lg border border-red-400 px-4 py-2 text-sm font-semibold text-red-700">退会手続きを進める</button>
      </section>
    </AppShell>
  )
}
