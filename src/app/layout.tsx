import '../lib/styles/globals.css'
import SessionProviders from '@/components/SessionProvider'
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
        <SessionProviders>
          {children}
        </SessionProviders>
      </body>
    </html>
  )

}

export default RootLayout