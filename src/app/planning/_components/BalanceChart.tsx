import { Card, CardContent, CardHeader, CardTitle } from '@/_components/ui/card'
import type { MonthExpenses } from '@/types/expense'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface BalanceChartProps {
  months: MonthExpenses[]
}

export function BalanceChart({ months }: BalanceChartProps) {
  const data = months.map(month => ({
    name: month.month,
    receitas: month.salary,
    despesas: month.totalProjected,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução do Saldo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                  'Valor',
                ]}
              />
              <Legend />
              <Bar dataKey="receitas" fill="#22c55e" name="Receitas" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesas" fill="#ef4444" name="Despesas" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
