export type ContactMessageStatus = 'new' | 'in_progress' | 'done'

export type ContactMessage = {
  id: string
  siteId: string
  siteName: string
  customerName: string
  customerEmail: string
  customerMessage: string
  createdAt: string
  status: ContactMessageStatus
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
      status: item.status ?? 'new'
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
  const next = [message, ...current]
  writeContactMessages(next)
}

export function updateContactMessageStatus(messageId: string, status: ContactMessageStatus) {
  const current = readContactMessages()
  const next = current.map((item) => (item.id === messageId ? { ...item, status } : item))
  writeContactMessages(next)
}

export function readContactMessagesBySite(siteId: string) {
  return readContactMessages().filter((item) => item.siteId === siteId)
}

export function countNewMessagesBySite(siteId: string) {
  return readContactMessagesBySite(siteId).filter((item) => item.status === 'new').length
}
