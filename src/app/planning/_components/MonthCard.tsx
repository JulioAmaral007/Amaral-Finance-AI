'use client'

import { Badge } from '@/_components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/_components/ui/card'
import type { MonthExpenses } from '@/types/expense'

interface MonthCardProps {
  data: MonthExpenses
  onClick: () => void
}

export function MonthCard({ data, onClick }: MonthCardProps) {
  const saldo = data.salary - data.totalProjected
  const saldoStatus = saldo >= 0 ? 'positive' : 'negative'

  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{data.month}</CardTitle>
        <Badge variant={saldoStatus === 'positive' ? 'default' : 'destructive'}>
          {saldoStatus === 'positive' ? 'Positivo' : 'Negativo'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Receitas</span>
            <span className="text-sm font-medium text-blue-500">
              R$ {data.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Despesas Fixas</span>
            <span className="text-sm font-medium text-orange-500">
              R$ {data.fixedExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Parcelas</span>
            <span className="text-sm font-medium text-orange-500">
              R$ {data.activeParcels.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="text-sm font-medium">Saldo Projetado</span>
            <span
              className={`text-sm font-medium ${
                saldoStatus === 'positive' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
