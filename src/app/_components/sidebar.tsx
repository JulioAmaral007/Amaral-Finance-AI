'use client'

import { Toggle } from '@/_components/ui/toggle'
import { ChevronLeft, Home, Receipt, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <nav
      className={`flex h-dvh flex-col border-r border-border/40 bg-card transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div
        className={`flex items-center justify-between p-5 ${isCollapsed ? 'justify-center' : ''}`}
      >
        {!isCollapsed && (
          <Image
            src="/logo.svg"
            width={173}
            height={39}
            alt="Finance AI"
            priority
            className="h-auto w-auto"
          />
        )}
        <Toggle
          pressed={isCollapsed}
          onPressedChange={setIsCollapsed}
          className="flex items-center justify-center rounded-lg hover:bg-accent"
        >
          <ChevronLeft
            className={`h-5 w-5 transition-transform duration-300 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </Toggle>
      </div>
      <div className="flex flex-col gap-2 px-3">
        <Link
          href="/"
          className={`flex items-center justify-center gap-2 rounded-lg p-2 transition-colors hover:bg-accent ${
            pathname === '/' ? 'bg-accent font-semibold text-primary' : 'text-muted-foreground'
          }`}
        >
          <Home className="h-5 w-5" />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>
        <Link
          href="/transactions"
          className={`flex items-center justify-center gap-2 rounded-lg p-2 transition-colors hover:bg-accent ${
            pathname === '/transactions'
              ? 'bg-accent font-semibold text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <Receipt className="h-5 w-5" />
          {!isCollapsed && <span>Transações</span>}
        </Link>
        <Link
          href="/subscription"
          className={`flex items-center justify-center gap-2 rounded-lg p-2 transition-colors hover:bg-accent ${
            pathname === '/subscription'
              ? 'bg-accent font-semibold text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <User className="h-5 w-5" />
          {!isCollapsed && <span>Assinatura</span>}
        </Link>
      </div>
    </nav>
  )
}
