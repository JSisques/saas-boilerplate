import { routing } from '@/shared/presentation/i18n/routing';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const STORAGE_PREFIX = '@repo/sdk:';
const ACCESS_TOKEN_KEY = `${STORAGE_PREFIX}accessToken`;

export default function middleware(request: NextRequest) {
  // Get the pathname without locale
  const pathname = request.nextUrl.pathname;

  // Extract locale from pathname (format: /locale/path)
  const localeMatch = pathname.match(/^\/([^/]+)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  // Check if accessing auth page
  const isAuthPage = pathWithoutLocale === '/auth';

  // Try to get access token from cookies (stored by SDK)
  // Cookies are stored with encoded names (URL-encoded)
  const encodedKey = encodeURIComponent(ACCESS_TOKEN_KEY).replace(
    /[()]/g,
    (c) => {
      return c === '(' ? '%28' : '%29';
    },
  );
  const accessTokenCookie = request.cookies.get(encodedKey)?.value;

  // If token exists in cookie and user is on auth page, redirect to dashboard
  if (accessTokenCookie && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  // Continue with intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
