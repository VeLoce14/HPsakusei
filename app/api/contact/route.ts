import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  const required = ['siteId', 'siteName', 'customerName', 'customerEmail', 'customerMessage']
  const missing = required.filter((key) => !body?.[key])

  if (missing.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        message: `必須項目が不足しています: ${missing.join(', ')}`
      },
      { status: 400 }
    )
  }

  return NextResponse.json({
    ok: true,
    message: 'お問い合わせを受け付けました。管理画面で確認できます。',
    received: {
      siteId: body.siteId,
      siteName: body.siteName,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerMessage: body.customerMessage
    }
  })
}
