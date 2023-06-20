import '@/lib/styles/globals.css'
import SessionProviders from '@/components/SessionProvider'
import { ReduxProvider } from '@/lib/redux/ReduxProvider'
export const metadata = {
  title: 'Languages Spaces',
  description: "Let's talk english here.",
}

interface RootInterface {
  children: React.ReactNode
}

const RootLayout = ({ children }: RootInterface) => {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <SessionProviders>
            {children}
          </SessionProviders>
        </ReduxProvider>
      </body>
    </html>
  )
}

export default RootLayout