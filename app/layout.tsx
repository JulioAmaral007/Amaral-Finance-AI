import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import type { Metadata } from 'next'
import { Mulish } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const mulish = Mulish({
  subsets: ['latin-ext'],
})

export const metadata: Metadata = {
  title: 'Finance AI',
  description:
    'A Finance AI é uma plataforma de gestão financeira que utiliza inteligência artificial para monitorar suas finanças e oferecer insights personalizados.',
  keywords: [
    'finanças, inteligência artificial, orçamento, gestão financeira, insights financeiros',
  ],
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${mulish.className} dark antialiased`}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
          }}
        >
          <div className="flex flex-col overflow-hidden lg:h-full">
            {children}
          </div>
        </ClerkProvider>

        <Toaster />
      </body>
    </html>
  )
}
