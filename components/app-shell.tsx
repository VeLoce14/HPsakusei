import Link from 'next/link'

const links = [
  { href: '/dashboard', label: 'ダッシュボード' },
  { href: '/templates', label: 'テンプレート' },
  { href: '/toppings', label: 'トッピング' },
  { href: '/publish', label: '公開設定' },
  { href: '/billing', label: '料金・支払い' },
  { href: '/account', label: 'アカウント' }
]

export function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-main/20 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-heading text-xl font-bold text-main">Webapp Builder</Link>
          <nav className="hidden gap-3 text-sm md:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full px-3 py-1.5 hover:bg-accent">
                {link.label}
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
