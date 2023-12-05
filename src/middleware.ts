import createMiddleware from 'next-intl/middleware';

const translationMiddleware = createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'zh', 'ja', 'kr', 'vi'],
    // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
    defaultLocale: 'en'
})

export default translationMiddleware

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};