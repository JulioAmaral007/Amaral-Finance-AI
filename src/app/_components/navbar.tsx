'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between border-b border-border/40 px-8 py-4">
      {/* ESQUERDA */}
      <div className="flex items-center gap-10">
        <Image
          src="/logo.svg"
          width={173}
          height={39}
          alt="Finance AI"
          priority
          className="h-auto w-auto"
        />
        <Link
          href="/"
          className={`transition-colors hover:text-primary ${
            pathname === '/' ? 'font-semibold text-primary' : 'text-muted-foreground'
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/transactions"
          className={`transition-colors hover:text-primary ${
            pathname === '/transactions' ? 'font-semibold text-primary' : 'text-muted-foreground'
          }`}
        >
          Transações
        </Link>
        <Link
          href="/subscription"
          className={`transition-colors hover:text-primary ${
            pathname === '/subscription' ? 'font-semibold text-primary' : 'text-muted-foreground'
          }`}
        >
          Assinatura
        </Link>
      </div>
      {/* DIREITA */}
      {/* <UserButton showName /> */}
    </nav>
  )
}
