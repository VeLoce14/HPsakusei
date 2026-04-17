import Link from 'next/link'
import { FormField } from '@/components/form-field'

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-heading text-2xl font-bold">ログイン</h1>
      <p className="mt-2 text-sm text-subtext">メール＋パスワード / Googleログイン</p>
      <form className="mt-6 space-y-4 card p-5">
        <FormField label="メールアドレス" type="email" placeholder="you@example.com" />
        <FormField label="パスワード" type="password" placeholder="********" />
        <button className="w-full rounded-lg bg-main px-4 py-2.5 font-semibold text-white" type="button">ログイン</button>
        <button className="w-full rounded-lg border border-main/40 px-4 py-2.5 font-semibold text-main" type="button">Googleでログイン</button>
        <button className="w-full text-left text-sm text-main underline" type="button">パスワードをリセット</button>
      </form>
      <p className="mt-4 text-sm text-subtext">
        まだアカウントがない場合は <Link className="text-main underline" href="/signup">新規登録</Link>
      </p>
    </main>
  )
}
