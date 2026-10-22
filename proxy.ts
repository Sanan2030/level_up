import { NextRequest, NextResponse } from 'next/server';
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (/^\/az(\/|$)/.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/az(?=\/|$)/, '/en');
    return NextResponse.redirect(url, 308);
  }
  if (
    pathname === '/' ||
    (!/^\/en(\/|$)/.test(pathname) && !pathname.startsWith('/_next') && !pathname.includes('.'))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|opengraph-image).*)',
  ],
};
