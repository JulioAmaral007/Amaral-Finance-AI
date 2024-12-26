'use client'

import { Button } from '@/app/_components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/app/_components/ui/sheet'
import { UserButton } from '@clerk/nextjs'
import { Heart, HomeIcon, MenuIcon, PackageSearchIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/', label: 'Dashboard', icon: <HomeIcon size={16} /> },
  {
    href: '/transactions',
    label: 'Transações',
    icon: <PackageSearchIcon size={16} />,
  },
  { href: '/subscription', label: 'Assinatura', icon: <Heart size={16} /> },
]

export function Navbar() {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <div>
      {/* MOBILE NAVIGATION */}
      <nav className="flex justify-between border-b border-solid px-8 py-4 md:hidden">
        <Link href="/">
          <Image src="/logo.svg" width={173} height={39} alt="Finance AI" />
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <MenuIcon />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[70%]">
            <SheetHeader className="text-left text-lg font-semibold">
              Menu
            </SheetHeader>

            <div className="flex gap-2 py-4">
              <UserButton showName />
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {NAV_LINKS.map(({ href, label, icon }) => (
                <SheetClose asChild key={href}>
                  <Link href={href}>
                    <Button
                      variant={isActive(href) ? 'default' : 'outline'}
                      className="w-full justify-start gap-2"
                      aria-current={isActive(href) ? 'page' : undefined}
                    >
                      {icon}
                      {label}
                    </Button>
                  </Link>
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      {/* DESKTOP NAVIGATION */}
      <nav className="hidden justify-between border-b border-solid px-8 py-4 md:flex">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-10">
          <Link href="/">
            <Image src="/logo.svg" width={173} height={39} alt="Finance AI" />
          </Link>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${
                isActive(href)
                  ? 'font-bold text-primary'
                  : 'text-muted-foreground'
              } transition hover:text-primary`}
              aria-current={isActive(href) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <UserButton />
      </nav>
    </div>
  )
}
