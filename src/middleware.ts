import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const locales = ['en', 'zh', 'kr', 'ja', 'vi'];
const publicPages = ['/', '/auth', '/error'];

const intlMiddleware = createIntlMiddleware({
  locales,
  localePrefix: 'as-needed',
  defaultLocale: 'en'
});

const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null
    },
    pages: {
      signIn: '/auth',
      error: '/error'
    }
  }
);

export default async function middleware(req: NextRequest) {

  //this is the current session I will use this later to prevent none admin users to navigate in admin routes
  // const token = await getToken({
  //   req,
  //   secret: process.env.NEXTAUTH_SECRET
  // }) as any

  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};