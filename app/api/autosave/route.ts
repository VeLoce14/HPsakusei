import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const payload = await req.json()

  return NextResponse.json({
    ok: true,
    savedAt: new Date().toISOString(),
    size: JSON.stringify(payload).length
  })
}
