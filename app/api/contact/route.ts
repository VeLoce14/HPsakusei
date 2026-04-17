import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  return NextResponse.json({
    ok: true,
    message: 'モック環境で受け付けました。Resend連携はAPIキー共有後に有効化します。',
    received: body
  })
}
