import { Card, CardContent, CardHeader, CardTitle } from '@/_components/ui/card'
import type { MonthExpenses } from '@/types/expense'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface BalanceChartProps {
  months: MonthExpenses[]
}

export function BalanceChart({ months }: BalanceChartProps) {
  const data = months.map(month => ({
    name: month.month,
    saldo: month.salary - month.totalProjected,
    despesas: month.totalProjected,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução do Saldo e Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={value => `R$ ${value.toLocaleString('pt-BR')}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {payload[0].name === 'saldo' ? 'Saldo' : 'Despesas'}
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format(payload[0].value as number)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Mês
                            </span>
                            <span className="font-bold">{payload[0].payload.name}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="saldo"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                name="Saldo"
              />
              <Line
                type="monotone"
                dataKey="despesas"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                name="Despesas"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
