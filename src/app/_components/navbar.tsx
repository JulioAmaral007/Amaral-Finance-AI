import { getUser } from '@/_lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import { UserMenu } from './user-menu'

export async function Navbar() {
  const user = await getUser()

  return (
    <nav className="flex h-16 items-center justify-between border-b border-border/40 bg-card px-6">
      <div className="flex items-center gap-10">
        <Link href="/">
          <Image
            src="/logo.svg"
            width={173}
            height={39}
            alt="Finance AI"
            priority
            className="h-auto w-auto"
          />
        </Link>

        <NavLinks />
      </div>

      <UserMenu user={user} />
    </nav>
  )
}

function NavLinks() {
  return (
    <div className="flex items-center gap-6">
      <NavLink href="/">Dashboard</NavLink>
      <NavLink href="/transactions">Transações</NavLink>
      <NavLink href="/subscription">Assinatura</NavLink>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
    >
      {children}
    </Link>
  )
}
