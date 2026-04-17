import { NextRequest, NextResponse } from 'next/server'

const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'example.com'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  const hostname = host.split(':')[0]

  if (!hostname.endsWith(rootDomain)) return NextResponse.next()

  const subdomain = hostname.replace(`.${rootDomain}`, '')

  if (subdomain && subdomain !== 'www' && subdomain !== 'app' && subdomain !== hostname) {
    const url = req.nextUrl.clone()
    url.pathname = `/sites/${subdomain}${req.nextUrl.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
