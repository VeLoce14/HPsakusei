import type { Metadata } from 'next'
import { M_PLUS_Rounded_1c, Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const bodyFont = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-body'
})

const headingFont = M_PLUS_Rounded_1c({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  display: 'swap',
  variable: '--font-heading'
})

export const metadata: Metadata = {
  title: 'Webapp Builder',
  description: '個人事業主向けノーコードHP作成サービス（MVP）',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${bodyFont.variable} ${headingFont.variable} font-body`}>{children}</body>
    </html>
  )
}
