'use client'

import { Pie, PieChart } from 'recharts'

import { Card, CardContent } from '@/_components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/_components/ui/chart'
import type { TransactionPercentagePerType } from '@/_data/get-dashboard'
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import { PercentageItem } from './percentage-item'

const chartConfig = {
  INVESTMENT: {
    label: 'Investimentos',
    color: '#FFFFFF',
  },
  DEPOSIT: {
    label: 'Ganhos',
    color: '#55B02E',
  },
  EXPENSE: {
    label: 'Gastos',
    color: '#E93030',
  },
} satisfies ChartConfig

interface TransactionsPieChartProps {
  typesPercentage: TransactionPercentagePerType
  depositsTotal: number
  investmentsTotal: number
  expensesTotal: number
}

export function TransactionsPieChart({
  depositsTotal,
  investmentsTotal,
  expensesTotal,
  typesPercentage,
}: TransactionsPieChartProps) {
  const chartData = [
    {
      type: 'DEPOSIT',
      amount: depositsTotal,
      fill: '#55B02E',
    },
    {
      type: 'EXPENSE',
      amount: expensesTotal,
      fill: '#E93030',
    },
    {
      type: 'INVESTMENT',
      amount: investmentsTotal,
      fill: '#FFFFFF',
    },
  ]

  const hasData = depositsTotal > 0 || expensesTotal > 0 || investmentsTotal > 0

  return (
    <Card className="flex h-full flex-col border-border/40 bg-card p-4">
      <CardContent className="flex-1 p-0">
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[200px]"
          >
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="type"
                innerRadius={50}
                outerRadius={80}
                strokeWidth={0}
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Sem dados para exibir</p>
          </div>
        )}

        <div className="mt-4 space-y-2">
          <PercentageItem
            icon={<TrendingUpIcon size={14} className="text-emerald-500" />}
            title="Ganhos"
            value={typesPercentage.DEPOSIT}
          />
          <PercentageItem
            icon={<TrendingDownIcon size={14} className="text-red-500" />}
            title="Gastos"
            value={typesPercentage.EXPENSE}
          />
          <PercentageItem
            icon={<PiggyBankIcon size={14} className="text-white" />}
            title="Investimentos"
            value={typesPercentage.INVESTMENT}
          />
        </div>
      </CardContent>
    </Card>
  )
}
