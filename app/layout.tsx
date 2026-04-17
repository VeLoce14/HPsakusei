import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Webapp Builder',
  description: '個人事業主向けノーコードHP作成サービス（MVP）',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="font-body">{children}</body>
    </html>
  )
}
