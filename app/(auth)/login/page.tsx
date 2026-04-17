'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const ensureSupabase = () => {
    if (!supabase) {
      setMessage('Supabase環境変数が未設定です。.env.local を確認してください。')
      return false
    }
    return true
  }

  const handleEmailLogin = async () => {
    if (!ensureSupabase()) return
    if (!email || !password) {
      setMessage('メールアドレスとパスワードを入力してください。')
      return
    }

    setLoading(true)
    setMessage('')

    const { error } = await supabase!.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setMessage(`ログインに失敗しました: ${error.message}`)
      return
    }

    router.push('/dashboard')
  }

  const handleGoogleLogin = async () => {
    if (!ensureSupabase()) return

    setLoading(true)
    setMessage('')

    const { error } = await supabase!.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })

    if (error) {
      setLoading(false)
      setMessage(`Googleログインに失敗しました: ${error.message}`)
    }
  }

  const handleResetPassword = async () => {
    if (!ensureSupabase()) return
    if (!email) {
      setMessage('パスワードリセットにはメールアドレス入力が必要です。')
      return
    }

    setLoading(true)
    setMessage('')

    const { error } = await supabase!.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`
    })

    setLoading(false)

    if (error) {
      setMessage(`パスワードリセット送信に失敗しました: ${error.message}`)
      return
    }

    setMessage('パスワードリセットメールを送信しました。')
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-heading text-2xl font-bold">ログイン</h1>
      <p className="mt-2 text-sm text-subtext">メール＋パスワード / Googleログイン</p>

      <form className="mt-6 space-y-4 card p-5" onSubmit={(e) => e.preventDefault()}>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">メールアドレス</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-lg border border-main/30 bg-white px-3 py-2 outline-none ring-main/30 focus:ring"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">パスワード</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="rounded-lg border border-main/30 bg-white px-3 py-2 outline-none ring-main/30 focus:ring"
          />
        </label>

        <button
          className="w-full rounded-lg bg-main px-4 py-2.5 font-semibold text-white disabled:opacity-60"
          type="button"
          onClick={handleEmailLogin}
          disabled={loading}
        >
          {loading ? '処理中...' : 'ログイン'}
        </button>

        <button
          className="w-full rounded-lg border border-main/40 px-4 py-2.5 font-semibold text-main disabled:opacity-60"
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          Googleでログイン
        </button>

        <button
          className="w-full text-left text-sm text-main underline disabled:opacity-60"
          type="button"
          onClick={handleResetPassword}
          disabled={loading}
        >
          パスワードをリセット
        </button>
      </form>

      {message ? <p className="mt-3 text-sm text-subtext">{message}</p> : null}

      <p className="mt-4 text-sm text-subtext">
        まだアカウントがない場合は{' '}
        <Link className="text-main underline" href="/signup">
          新規登録
        </Link>
      </p>
    </main>
  )
}
