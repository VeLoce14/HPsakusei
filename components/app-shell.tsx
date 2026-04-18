'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { countNewMessagesAllSites } from '@/lib/contact-store'

const links = [
  { href: '/dashboard', label: 'ダッシュボード' },
  { href: '/inbox', label: '問い合わせ管理' },
  { href: '/templates', label: 'テンプレート' },
  { href: '/toppings', label: 'トッピング' },
  { href: '/publish', label: '公開設定' },
  { href: '/billing', label: '料金・支払い' },
  { href: '/account', label: 'アカウント' }
]

export function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  const [newMessageCount, setNewMessageCount] = useState(0)

  useEffect(() => {
    const update = () => setNewMessageCount(countNewMessagesAllSites())

    update()
    window.addEventListener('storage', update)
    window.addEventListener('focus', update)

    return () => {
      window.removeEventListener('storage', update)
      window.removeEventListener('focus', update)
    }
  }, [])

  return (
    <div className="min-h-screen">
      <header className="border-b border-main/20 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-heading text-xl font-bold text-main">Webapp Builder</Link>
          <nav className="hidden gap-3 text-sm md:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full px-3 py-1.5 hover:bg-accent">
                <span className="inline-flex items-center gap-1.5">
                  {link.label}
                  {link.href === '/inbox' && newMessageCount > 0 ? <span className="badge">未対応 {newMessageCount}</span> : null}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <h1 className="font-heading text-2xl font-bold">{title}</h1>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  )
}
