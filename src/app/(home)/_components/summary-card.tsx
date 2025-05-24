import { Card, CardContent, CardHeader } from '@/_components/ui/card'
// import AddTransactionButton from '@/app/_components/add-transaction-button'
import type { ReactNode } from 'react'

interface SummaryCardProps {
  icon: ReactNode
  title: string
  amount: number
  size?: 'small' | 'large'
}

export function SummaryCard({ icon, title, amount, size = 'small' }: SummaryCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex-row items-center gap-4">
        <div className="text-muted-foreground">{icon}</div>
        <p className={`${size === 'small' ? 'text-muted-foreground' : 'text-white/70'}`}>{title}</p>
      </CardHeader>
      <CardContent className="flex justify-between">
        <p className={`font-semibold tracking-tight ${size === 'small' ? 'text-2xl' : 'text-4xl'}`}>
          {Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(amount)}
        </p>

        {/* {size === 'large' && <AddTransactionButton />} */}
      </CardContent>
    </Card>
  )
}
