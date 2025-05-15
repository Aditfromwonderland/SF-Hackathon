import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PageTransitionWrapper from '@/components/PageTransitionWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Coffee-Chat Coach',
  description: 'Get personalized networking advice tailored to your background and challenges',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PageTransitionWrapper>
          {children}
        </PageTransitionWrapper>
      </body>
    </html>
  )
}
