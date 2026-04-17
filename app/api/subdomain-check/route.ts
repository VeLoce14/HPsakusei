import { NextResponse } from 'next/server'
import { mockUsedSubdomains } from '@/lib/mock'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const value = (searchParams.get('value') || '').trim().toLowerCase()

  const isValid = /^[a-z0-9-]{3,30}$/.test(value)
  const available = isValid && !mockUsedSubdomains.includes(value)

  return NextResponse.json({ value, available, isValid })
}
