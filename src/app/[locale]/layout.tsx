import '@/lib/styles/globals.css'
// import "@uploadthing/react/styles.css"
import SessionProviders from '@/components/SessionProvider'
import { notFound } from 'next/navigation'
import 'react-quill/dist/quill.snow.css';
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

  const allTranslation = ['en', 'zh', 'ja', 'kr', 'vi']

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
      <body className='bg-slate-50'>
        <NextIntlClientProvider locale={locale} messages={translation}>
          <SessionProviders>
            {children}
          </SessionProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
