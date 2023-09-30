import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', request.nextUrl))
  }
}

export const config = {
  matcher: ['/r/:path*/submit', '/r/create']
}
