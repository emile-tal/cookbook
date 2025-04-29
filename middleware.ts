import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host');

  if (host && host.includes('run.app')) {
    const url = request.nextUrl.clone();
    url.hostname = 'myrecipiz.com';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}