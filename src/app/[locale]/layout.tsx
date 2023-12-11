import '@/lib/styles/globals.css'
// import "@uploadthing/react/styles.css"
import SessionProviders from '@/components/SessionProvider'
import { notFound } from 'next/navigation'
import 'react-quill/dist/quill.snow.css';
import { NextIntlClientProvider, useMessages } from 'next-intl'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { unstable_setRequestLocale } from 'next-intl/server';

export const metadata = {
  title: 'Languages Spaces',
  description: "Let's talk english here.",
}

interface Props {
  children: React.ReactNode
  params: {
    locale: string
  }
}

const locales = ['en', 'zh', 'ja', 'kr', 'vi']

export function generateStaticParams() {
  return locales.map((lang) => ({
    locale: lang
  }))

}

export default function LocaleLayout({ children, params: { locale } }: Props) {

  if (!locales.includes(locale as any)) notFound();

  unstable_setRequestLocale(locale);

  const messages = useMessages();

  return (
    <html lang={locale}>
      <body className='bg-slate-50'>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProviders>
            {children}
            <SpeedInsights />
          </SessionProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
