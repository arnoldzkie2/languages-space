import Providers from '@/redux/Provider'
import '../styles/globals.css';
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )

}

export default RootLayout