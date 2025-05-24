import { Button } from '@/_components/ui/button'
import { CardContent, CardHeader, CardTitle } from '@/_components/ui/card'
import { ScrollArea } from '@/_components/ui/scroll-area'
import { TRANSACTION_PAYMENT_METHOD_ICONS } from '@/_constants/transactions'
import { formatCurrency } from '@/_lib/utils'
import { type Transaction, TransactionType } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

interface LastTransactionsProps {
  lastTransactions: Transaction[]
}

export function LastTransactions({ lastTransactions }: LastTransactionsProps) {
  const getAmountColor = (transaction: Transaction) => {
    if (transaction.type === TransactionType.EXPENSE) {
      return 'text-red-500'
    }
    if (transaction.type === TransactionType.DEPOSIT) {
      return 'text-emerald-500'
    }
    return 'text-white'
  }
  const getAmountPrefix = (transaction: Transaction) => {
    if (transaction.type === TransactionType.DEPOSIT) {
      return '+'
    }
    return '-'
  }
  return (
    <ScrollArea className="h-full rounded-lg border border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="flex-row items-center justify-between border-b border-border/40 px-6 py-4">
        <CardTitle className="text-lg font-semibold tracking-tight">Últimas Transações</CardTitle>
        <Button
          variant="outline"
          className="rounded-full font-medium transition-colors hover:bg-muted"
          asChild
        >
          <Link href="/transactions">Ver mais</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {lastTransactions.map(transaction => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/5 p-3 text-white backdrop-blur supports-[backdrop-filter]:bg-white/10">
                <Image
                  src={`/${TRANSACTION_PAYMENT_METHOD_ICONS[transaction.paymentMethod]}`}
                  height={20}
                  width={20}
                  alt={transaction.paymentMethod}
                  className="h-5 w-5"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{transaction.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <p className={`text-sm font-semibold tracking-tight ${getAmountColor(transaction)}`}>
              {getAmountPrefix(transaction)}
              {formatCurrency(Number(transaction.amount))}
            </p>
          </div>
        ))}
      </CardContent>
    </ScrollArea>
  )
}
