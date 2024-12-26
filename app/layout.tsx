import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata, Viewport } from 'next'
import { Mulish } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const mulish = Mulish({
  subsets: ['latin-ext'],
})

export const metadata: Metadata = {
  title: 'Finance AI - Gestão Financeira com IA',
  description:
    'A Finance AI é uma plataforma de gestão financeira que utiliza IA para monitorar suas movimentações, e oferecer insights personalizados, facilitando o controle do seu orçamento.',
  keywords: [
    'Gestão Financeira',
    'Inteligência Artificial',
    'Controle de Orçamento',
    'Insights Financeiros',
    'Plataforma de Finanças',
  ],
  authors: [{ name: 'Equipe Finance AI', url: 'https://financeai.com' }],
  openGraph: {
    title: 'Finance AI - Gestão Financeira com IA',
    description:
      'A Finance AI é uma plataforma de gestão financeira que utiliza IA para monitorar suas movimentações, e oferecer insights personalizados, facilitando o controle do seu orçamento.',
    url: 'https://financeai.com',
    siteName: 'Finance AI',
    images: [
      {
        url: 'https://financeai.com/assets/banner.png',
        width: 1200,
        height: 630,
        alt: 'Finance AI - Plataforma de Gestão Financeira',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finance AI - Gestão Financeira com IA',
    description:
      'A Finance AI é uma plataforma de gestão financeira que utiliza IA para monitorar suas movimentações, e oferecer insights personalizados, facilitando o controle do seu orçamento.',
    site: '@financeai',
    creator: '@financeai',
    images: ['https://financeai.com/assets/banner.png'],
  },
  alternates: {
    canonical: 'https://financeai.com',
    languages: {
      'pt-BR': 'https://financeai.com',
      'en-US': 'https://financeai.com/en',
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1a202c',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${mulish.className} dark antialiased`}>
        <ClerkProvider>
          <div className="flex h-full flex-col xl:overflow-hidden">
            {children}
          </div>
        </ClerkProvider>

        <Toaster />
      </body>
    </html>
  )
}
