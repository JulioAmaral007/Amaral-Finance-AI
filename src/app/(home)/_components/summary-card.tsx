import { Card, CardContent, CardHeader } from '@/_components/ui/card'
import { Eye } from 'lucide-react'
import type { ReactNode } from 'react'
import { AddTransactionButton } from '@/app/_components/add-transaction-button'

interface SummaryCardProps {
  icon: ReactNode
  title: string
  amount: number
  size?: 'small' | 'large'
}

export function SummaryCard({ icon, title, amount, size = 'small' }: SummaryCardProps) {
  return (
    <Card className="border-border/40 bg-card transition-all hover:shadow-md">
      <CardHeader className="flex-row items-center gap-3 pb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50">
          {icon}
        </div>
        <p className="text-sm text-muted-foreground">{title}</p>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className={`font-bold tracking-tight ${size === 'small' ? 'text-2xl' : 'text-4xl'}`}>
            {Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(amount)}
          </p>
          {size === 'large' && (
            <button className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted">
              <Eye className="h-5 w-5" />
            </button>
          )}
        </div>

        {size === 'large' && <AddTransactionButton />}
      </CardContent>
    </Card>
  )
}
