'use client'

import { Button } from '@/_components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/_components/ui/popover'
import { createClient } from '@/_lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { LogOut, User as UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserMenuProps {
  user: User | null
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (!user) {
    return (
      <Button variant="outline" className="rounded-full" asChild>
        <a href="/login">Entrar</a>
      </Button>
    )
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário'
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-3 rounded-full border border-border/40 bg-background/50 px-4 py-2 transition-colors hover:bg-muted">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <span className="text-sm font-medium">{displayName}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="mb-2 border-b border-border/40 px-2 pb-2">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-500"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </PopoverContent>
    </Popover>
  )
}

