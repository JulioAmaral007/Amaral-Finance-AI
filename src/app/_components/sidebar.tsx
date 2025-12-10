'use client'

import { Toggle } from '@/_components/ui/toggle'
import { Brain, ChevronLeft, Home, PlusCircle, Receipt, Settings, Target, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <nav
      className={`flex h-full flex-col border-r border-border/40 bg-card transition-all duration-300 ${
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

      <div className="flex flex-col gap-2 px-3 flex-1">
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
          href="/entries"
          className={`flex items-center justify-center gap-2 rounded-lg p-2 transition-colors hover:bg-accent ${
            pathname === '/entries'
              ? 'bg-accent font-semibold text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <PlusCircle className="h-5 w-5" />
          {!isCollapsed && <span>Entradas</span>}
        </Link>
        <Link
          href="/analysis"
          className={`flex items-center justify-center gap-2 rounded-lg p-2 transition-colors hover:bg-accent ${
            pathname === '/analysis'
              ? 'bg-accent font-semibold text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <Brain className="h-5 w-5" />
          {!isCollapsed && <span>Análise IA</span>}
        </Link>
        <Link
          href="/target"
          className={`flex items-center justify-center gap-2 rounded-lg p-2 transition-colors hover:bg-accent ${
            pathname === '/target'
              ? 'bg-accent font-semibold text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <Target className="h-5 w-5" />
          {!isCollapsed && <span>Metas</span>}
        </Link>
        <Link
          href="/planning"
          className={`flex items-center justify-center gap-2 rounded-lg p-2 transition-colors hover:bg-accent ${
            pathname === '/planning'
              ? 'bg-accent font-semibold text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <Receipt className="h-5 w-5" />
          {!isCollapsed && <span>Planejamento</span>}
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

      {/* Footer do usuário */}
      <div className="border-t border-border/40">
        <div className={`flex items-center gap-3 px-2 py-4 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">João Silva</p>
              <p className="text-xs text-muted-foreground truncate">Saldo: R$ 12.450,00</p>
            </div>
          )}
        </div>

        {/* Link de configurações no footer */}
        <div className="px-2 pb-4">
          <Link
            href="/settings"
            className={`flex items-center justify-center gap-2 rounded-lg p-2 transition-colors hover:bg-accent ${
              pathname === '/settings'
                ? 'bg-accent font-semibold text-primary'
                : 'text-muted-foreground'
            }`}
          >
            <Settings className="h-5 w-5" />
            {!isCollapsed && <span>Configurações</span>}
          </Link>
        </div>
      </div>
    </nav>
  )
}
