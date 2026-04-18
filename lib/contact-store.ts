export type ContactMessageStatus = 'new' | 'in_progress' | 'done'

export type ContactNote = {
  id: string
  text: string
  createdAt: string
}

export type ContactMessage = {
  id: string
  siteId: string
  siteName: string
  customerName: string
  customerEmail: string
  customerMessage: string
  createdAt: string
  status: ContactMessageStatus
  notes: ContactNote[]
}

export const CONTACT_STORAGE_KEY = 'webapp_contact_messages_v1'

export function readContactMessages(): ContactMessage[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(CONTACT_STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as ContactMessage[]
    if (!Array.isArray(parsed)) return []
    return parsed.map((item) => ({
      ...item,
      status: item.status ?? 'new',
      notes: Array.isArray(item.notes) ? item.notes : []
    }))
  } catch {
    return []
  }
}

export function writeContactMessages(messages: ContactMessage[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(messages))
}

export function appendContactMessage(message: ContactMessage) {
  const current = readContactMessages()
  const next = [
    {
      ...message,
      notes: Array.isArray(message.notes) ? message.notes : []
    },
    ...current
  ]
  writeContactMessages(next)
}

export function updateContactMessageStatus(messageId: string, status: ContactMessageStatus) {
  const current = readContactMessages()
  const next = current.map((item) => (item.id === messageId ? { ...item, status } : item))
  writeContactMessages(next)
}

export function addContactMessageNote(messageId: string, text: string) {
  const noteText = text.trim()
  if (!noteText) return

  const current = readContactMessages()
  const next = current.map((item) => {
    if (item.id !== messageId) return item

    const note: ContactNote = {
      id: `note-${Date.now()}`,
      text: noteText,
      createdAt: new Date().toISOString()
    }

    return {
      ...item,
      notes: [note, ...(item.notes ?? [])]
    }
  })

  writeContactMessages(next)
}

export function readContactMessagesBySite(siteId: string) {
  return readContactMessages().filter((item) => item.siteId === siteId)
}

export function countNewMessagesBySite(siteId: string) {
  return readContactMessagesBySite(siteId).filter((item) => item.status === 'new').length
}

export function countNewMessagesAllSites() {
  return readContactMessages().filter((item) => item.status === 'new').length
}
