import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { i18n } from "../i18n-config";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-expect-error locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );
  

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  // // If you have one
  if (
    [
      '/manifest.json',
      '/icons/32.ico',
      '/icons/48.ico',
      '/icons/48.png',
      '/icons/48.ico',
      '/icons/72.ico',
      '/icons/72.png',
      '/icons/96.ico',
      '/icons/96.png',
      '/icons/128.ico',
      '/icons/128.png',
      '/icons/144.ico',
      '/icons/144.png',
      '/icons/152.ico',
      '/icons/152.png',
      '/icons/192.ico',
      '/icons/192.png',
      '/icons/256.ico',
      '/icons/384.png',
      '/icons/512.png',
      '/next-auth/provider/icon-svg/QQ.svg',
      // '/sw.ts',
      '/sw.js'
      // Your other files in `public`
    ].includes(pathname)
  )
    return

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
