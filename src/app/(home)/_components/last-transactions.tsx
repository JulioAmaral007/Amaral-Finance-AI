import { Button } from '@/_components/ui/button'
import { CardContent, CardHeader, CardTitle } from '@/_components/ui/card'
import { ScrollArea } from '@/_components/ui/scroll-area'
import { formatCurrency } from '@/_lib/utils'
import type { Transaction, TransactionCategory } from '@/types/database'
import {
  Banknote,
  CreditCard,
  GraduationCap,
  Heart,
  Home,
  MoreHorizontal,
  PiggyBank,
  Utensils,
  Wallet,
} from 'lucide-react'
import Link from 'next/link'

interface LastTransactionsProps {
  lastTransactions: Transaction[]
}

const CATEGORY_ICONS: Record<TransactionCategory, React.ReactNode> = {
  HOUSING: <Home className="h-4 w-4" />,
  TRANSPORTATION: <CreditCard className="h-4 w-4" />,
  FOOD: <Utensils className="h-4 w-4" />,
  ENTERTAINMENT: <MoreHorizontal className="h-4 w-4" />,
  HEALTH: <Heart className="h-4 w-4" />,
  UTILITY: <Wallet className="h-4 w-4" />,
  SALARY: <Banknote className="h-4 w-4" />,
  EDUCATION: <GraduationCap className="h-4 w-4" />,
  OTHER: <PiggyBank className="h-4 w-4" />,
}

export function LastTransactions({ lastTransactions }: LastTransactionsProps) {
  const getAmountColor = (transaction: Transaction) => {
    if (transaction.type === 'EXPENSE') {
      return 'text-red-500'
    }
    if (transaction.type === 'DEPOSIT') {
      return 'text-emerald-500'
    }
    return 'text-white'
  }

  const getAmountPrefix = (transaction: Transaction) => {
    if (transaction.type === 'DEPOSIT') {
      return '+'
    }
    if (transaction.type === 'EXPENSE') {
      return '-'
    }
    return '-'
  }

  return (
    <ScrollArea className="h-full rounded-xl border border-border/40 bg-card">
      <CardHeader className="flex-row items-center justify-between border-b border-border/40 px-6 py-4">
        <CardTitle className="text-lg font-semibold">Transações</CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-xs font-medium"
          asChild
        >
          <Link href="/transactions">Ver mais</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-1">
          {lastTransactions.map(transaction => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
                  {CATEGORY_ICONS[transaction.category]}
                </div>
                <div>
                  <p className="text-sm font-medium">{transaction.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <p className={`text-sm font-semibold ${getAmountColor(transaction)}`}>
                {getAmountPrefix(transaction)}
                {formatCurrency(Number(transaction.amount))}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </ScrollArea>
  )
}
