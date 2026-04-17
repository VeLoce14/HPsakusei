'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'

export default function PublishPage() {
  const [subdomain, setSubdomain] = useState('green-salon')
  const [availability, setAvailability] = useState<'idle' | 'checking' | 'ok' | 'duplicate'>('idle')

  const checkSubdomain = async (value: string) => {
    if (!value) return
    setAvailability('checking')
    const res = await fetch(`/api/subdomain-check?value=${value}`)
    const data = await res.json()
    setAvailability(data.available ? 'ok' : 'duplicate')
  }

  return (
    <AppShell title="公開設定">
      <div className="grid gap-4 md:grid-cols-2">
        <section className="card p-4">
          <h2 className="font-heading text-lg font-bold">サブドメイン設定</h2>
          <label className="mt-3 block text-sm">
            サブドメイン名
            <input
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              onBlur={(e) => checkSubdomain(e.target.value)}
              className="mt-1 w-full rounded-lg border border-main/30 px-3 py-2"
            />
          </label>
          <p className="mt-2 text-sm text-subtext">
            {availability === 'checking' && 'チェック中...'}
            {availability === 'ok' && 'このサブドメインは利用可能です。'}
            {availability === 'duplicate' && 'すでに使用されています。別の名前を入力してください。'}
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <input id="publish-toggle" type="checkbox" defaultChecked />
            <label htmlFor="publish-toggle">公開する</label>
          </div>
        </section>

        <section className="card p-4">
          <h2 className="font-heading text-lg font-bold">独自ドメイン設定（トッピングON時）</h2>
          <p className="mt-2 text-sm text-subtext">Cloudflare for SaaSを使った接続手順を表示します（実装時に詳細UIを追加）。</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-subtext">
            <li>管理画面で接続したいドメインを入力</li>
            <li>表示されたDNSレコードをドメイン管理側で設定</li>
            <li>反映後に接続状態を確認</li>
          </ol>

          <div className="mt-4 card p-3 text-sm">
            <p>公開URL: https://{subdomain}.example.com</p>
            <div className="mt-2 flex gap-2">
              <button className="rounded border px-3 py-1.5">URLをコピー</button>
              <button className="rounded border px-3 py-1.5">SNSでシェア</button>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
