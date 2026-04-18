'use client'

import { useMemo, useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { addContactMessageNote, readContactMessages, updateContactMessageStatus, type ContactMessageStatus } from '@/lib/contact-store'
import { useSites } from '@/lib/site-store'

export default function InboxPage() {
  const { sites } = useSites()
  const [siteFilter, setSiteFilter] = useState('all')
  const [messages, setMessages] = useState(() => readContactMessages())
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    if (siteFilter === 'all') return messages
    return messages.filter((msg) => msg.siteId === siteFilter)
  }, [messages, siteFilter])

  const statusLabel: Record<ContactMessageStatus, string> = {
    new: '未対応',
    in_progress: '対応中',
    done: '対応済み'
  }

  const setStatus = (messageId: string, status: ContactMessageStatus) => {
    updateContactMessageStatus(messageId, status)
    setMessages(readContactMessages())
  }

  const addNote = (messageId: string) => {
    const draft = noteDrafts[messageId] ?? ''
    if (!draft.trim()) return

    addContactMessageNote(messageId, draft)
    setMessages(readContactMessages())
    setNoteDrafts((prev) => ({ ...prev, [messageId]: '' }))
  }

  return (
    <AppShell title="問い合わせ管理">
      <section className="card p-4">
        <label className="text-sm">
          サイトで絞り込み
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="mt-1 w-full rounded-lg border border-main/30 bg-white px-3 py-2 md:max-w-sm"
          >
            <option value="all">すべてのサイト</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>{site.name}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="mt-5 grid gap-3">
        {filtered.length === 0 ? (
          <article className="card p-4 text-sm text-subtext">該当するお問い合わせはありません。</article>
        ) : (
          filtered.map((msg) => (
            <article key={msg.id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{msg.customerName}（{msg.customerEmail}）</p>
                  <p className="text-xs text-subtext">{msg.siteName} / {new Date(msg.createdAt).toLocaleString('ja-JP')}</p>
                </div>
                <span className="badge">{statusLabel[msg.status]}</span>
              </div>

              <p className="mt-2 whitespace-pre-line text-sm text-subtext">{msg.customerMessage}</p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <button type="button" onClick={() => setStatus(msg.id, 'new')} className="rounded border border-main/40 px-2 py-1">未対応</button>
                <button type="button" onClick={() => setStatus(msg.id, 'in_progress')} className="rounded border border-main/40 px-2 py-1">対応中</button>
                <button type="button" onClick={() => setStatus(msg.id, 'done')} className="rounded border border-main/40 px-2 py-1">対応済み</button>
              </div>

              <div className="mt-3 rounded-lg border border-main/15 bg-white p-3">
                <p className="text-xs font-semibold">対応履歴メモ</p>
                <div className="mt-2 flex gap-2">
                  <input
                    value={noteDrafts[msg.id] ?? ''}
                    onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [msg.id]: e.target.value }))}
                    className="w-full rounded border border-main/30 px-2 py-1 text-xs"
                    placeholder="例）4/18 14:30 電話で詳細確認。明日までに返答予定。"
                  />
                  <button type="button" onClick={() => addNote(msg.id)} className="rounded border border-main/40 px-2 py-1 text-xs">追加</button>
                </div>
                {msg.notes.length === 0 ? (
                  <p className="mt-2 text-xs text-subtext">メモはまだありません。</p>
                ) : (
                  <ul className="mt-2 space-y-1 text-xs text-subtext">
                    {msg.notes.map((note) => (
                      <li key={note.id} className="rounded border border-main/10 p-2">
                        <p className="whitespace-pre-line">{note.text}</p>
                        <p className="mt-1 text-[10px]">{new Date(note.createdAt).toLocaleString('ja-JP')}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </AppShell>
  )
}
