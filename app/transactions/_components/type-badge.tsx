import { Badge } from '@/app/_components/ui/badge'
import { Transaction, TransactionType } from '@prisma/client'
import { CircleIcon } from 'lucide-react'

interface TransactionTypeBadgeProps {
  transaction: Transaction
}

export function TransactionTypeBadge({
  transaction,
}: TransactionTypeBadgeProps) {
  if (transaction.type === TransactionType.DEPOSIT) {
    return (
      <Badge className="bg-muted font-bold text-primary hover:bg-muted">
        <CircleIcon className="mr-2 fill-primary" size={10} />
        Depósito
      </Badge>
    )
  }
  if (transaction.type === TransactionType.EXPENSE) {
    return (
      <Badge className="bg-muted bg-opacity-10 font-bold text-destructive hover:bg-muted">
        <CircleIcon className="mr-2 fill-destructive" size={10} />
        Despesa
      </Badge>
    )
  }
  return (
    <Badge className="bg-white bg-opacity-10 font-bold text-white hover:bg-muted">
      <CircleIcon className="mr-2 fill-white" size={10} />
      Investimento
    </Badge>
  )
}