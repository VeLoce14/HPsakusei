'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
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

  const handleEmailSignup = async () => {
    if (!ensureSupabase()) return
    if (!email || !password) {
      setMessage('メールアドレスとパスワードを入力してください。')
      return
    }

    setLoading(true)
    setMessage('')

    const redirectTo = `${window.location.origin}/dashboard`
    const { error } = await supabase!.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo }
    })

    setLoading(false)

    if (error) {
      setMessage(`登録に失敗しました: ${error.message}`)
      return
    }

    setMessage('登録リクエストを送信しました。確認メールをご確認ください。')
  }

  const handleGoogleSignup = async () => {
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
      setMessage(`Google登録に失敗しました: ${error.message}`)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-heading text-2xl font-bold">新規登録</h1>
      <p className="mt-2 text-sm text-subtext">メール登録またはGoogleログインに対応</p>

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
            placeholder="8文字以上"
            className="rounded-lg border border-main/30 bg-white px-3 py-2 outline-none ring-main/30 focus:ring"
          />
        </label>

        <button
          className="w-full rounded-lg bg-main px-4 py-2.5 font-semibold text-white disabled:opacity-60"
          type="button"
          onClick={handleEmailSignup}
          disabled={loading}
        >
          {loading ? '処理中...' : 'メールで登録'}
        </button>

        <button
          className="w-full rounded-lg border border-main/40 px-4 py-2.5 font-semibold text-main disabled:opacity-60"
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
        >
          Googleで登録
        </button>
      </form>

      {message ? <p className="mt-3 text-sm text-subtext">{message}</p> : null}

      <p className="mt-4 text-sm text-subtext">
        すでにアカウントをお持ちですか？{' '}
        <Link className="text-main underline" href="/login">
          ログイン
        </Link>
      </p>
    </main>
  )
}
