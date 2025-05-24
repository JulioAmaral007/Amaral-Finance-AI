import type { Metadata } from 'next'
import { Mulish } from 'next/font/google'
import './globals.css'

const mulish = Mulish({
  subsets: ['latin-ext'],
  display: 'swap',
  variable: '--font-mulish',
})

export const metadata: Metadata = {
  title: 'Finance AI - Controle suas finanças',
  description: 'Gerencie suas finanças de forma inteligente com o Finance AI',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark [color-scheme:dark]" suppressHydrationWarning>
      <body
        className={`${mulish.variable} ${mulish.className} bg-background font-sans antialiased`}
      >
        <div className="h-dvh">{children}</div>
      </body>
    </html>
  )
}
