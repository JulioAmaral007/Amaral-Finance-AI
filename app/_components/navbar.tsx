'use client'

import { UserButton } from '@clerk/nextjs'
import { ArrowRightLeft, HomeIcon, MenuIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from './ui/sheet'

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between border-b border-solid px-4 py-4 lg:px-8">
      <Image src="/logo.svg" width={173} height={39} alt="Finance AI" />

      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="md:hidden">
            <MenuIcon />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-full max-w-xs">
          <SheetHeader className="text-left text-lg font-semibold">
            Menu
          </SheetHeader>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 py-4">
              <UserButton showName />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <SheetClose asChild>
              <Link
                href="/"
                className={
                  pathname === '/'
                    ? 'font-bold text-primary'
                    : 'text-muted-foreground'
                }
              >
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <HomeIcon size={16} />
                  Dashboard
                </Button>
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link
                href="/transactions"
                className={
                  pathname === '/transactions'
                    ? 'font-bold text-primary'
                    : 'text-muted-foreground'
                }
              >
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <ArrowRightLeft />
                  Transações
                </Button>
              </Link>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex md:items-center md:gap-4">
        <Link
          href="/"
          className={
            pathname === '/'
              ? 'font-bold text-primary'
              : 'text-muted-foreground'
          }
        >
          <Button variant="ghost" className="flex items-center gap-2">
            <HomeIcon size={16} />
            Dashboard
          </Button>
        </Link>
        <Link
          href="/transactions"
          className={
            pathname === '/transactions'
              ? 'font-bold text-primary'
              : 'text-muted-foreground'
          }
        >
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowRightLeft />
            Transações
          </Button>
        </Link>
        <UserButton showName />
      </div>
    </nav>
  )
}
