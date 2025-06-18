'use client'

import { Badge } from '@/_components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/_components/ui/card'
import type { MonthExpenses } from '@/types/expense'
import { PercentageEditor } from './PercentageEditor'

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

interface MonthCardProps {
  data: MonthExpenses
  onClick: () => void
  onUpdatePercentages: (percentages: { bills: number; investment: number; savings: number }) => void
}

export function MonthCard({ data, onClick, onUpdatePercentages }: MonthCardProps) {
  const saldo = data.salary - data.totalProjected
  const saldoStatus = saldo >= 0 ? 'positive' : 'negative'

  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={onClick}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{data.month}</span>
          <Badge variant={data.totalProjected > data.salary ? 'destructive' : 'default'}>
            {formatCurrency(data.totalProjected)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Salário</span>
            <span>{formatCurrency(data.salary)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Despesas Fixas</span>
            <span>{formatCurrency(data.fixedExpenses)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Parcelas</span>
            <span>{formatCurrency(data.activeParcels)}</span>
          </div>
          <div className="h-px bg-border my-2" />
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Contas</span>
              <span>{formatCurrency((data.salary * data.percentages.bills) / 100)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Investimento</span>
              <span>{formatCurrency((data.salary * data.percentages.investment) / 100)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reserva</span>
              <span>{formatCurrency((data.salary * data.percentages.savings) / 100)}</span>
            </div>
          </div>
          <div className="pt-2" onClick={e => e.stopPropagation()}>
            <PercentageEditor
              month={data.month}
              percentages={data.percentages}
              onSave={onUpdatePercentages}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
