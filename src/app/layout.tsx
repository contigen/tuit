import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Tuit | AI-Powered Sponsorship Discovery',
  description:
    'Discover YouTube videos with brand sponsorships that include promo codes, discounts',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className='min-h-screen bg-background font-sans antialiased'
        suppressHydrationWarning
      >
        {children}
        <Toaster closeButton />
      </body>
    </html>
  )
}
