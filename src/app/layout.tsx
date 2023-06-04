import Providers from '@/lib/redux/Provider'
import '../lib/styles/globals.css'
import SessionProviders from '@/components/SessionProvider'
export const metadata = {
  title: 'Language Spaces',
  description: "Let's talk english here.",
}

interface RootInterface {
  children: React.ReactNode
}

const RootLayout = ({ children }: RootInterface) => {
  return (
    <html lang="en">
      <body>
        <SessionProviders>
          <Providers>
            {children}
          </Providers>
        </SessionProviders>
      </body>
    </html>
  )

}

export default RootLayout