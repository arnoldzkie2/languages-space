import '@/lib/styles/globals.css'
import SessionProviders from '@/components/SessionProvider'
import { ReduxProvider } from '@/lib/redux/ReduxProvider'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
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
export function generateStaticParams() {

  const allTranslation = ['en', 'cn', 'jp', 'kr', 'vn']

  return allTranslation.map((lang) => ({
    locale: lang
  }))

}

export default async function LocaleLayout({ children, params: { locale } }: Props) {

  let translation;

  try {

    translation = (await import(`../../translation/${locale}.json`)).default;

  } catch (error) {

    notFound()

  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={translation}>
          <ReduxProvider>
            <SessionProviders>
              {children}
            </SessionProviders>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
