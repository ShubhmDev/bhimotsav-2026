import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getCurrentUser } from '@/app/actions'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'ELECRIC EEL FESTIVAL | EventHub',
  description: 'Book your spot at the best events.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} font-sans bg-background text-foreground antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Navigation user={user ? { name: user.name, phoneNumber: user.phoneNumber } : null} />
          <main className="flex-grow w-full">
            {children}
          </main>
          {/* <Footer /> */}
        </div>
      </body>
    </html>
  )
}

