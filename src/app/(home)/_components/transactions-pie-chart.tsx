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
import { TransactionType } from '@prisma/client'
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import PercentageItem from './percentage-item'

const chartConfig = {
  [TransactionType.INVESTMENT]: {
    label: 'Investido',
    color: '#FFFFFF',
  },
  [TransactionType.DEPOSIT]: {
    label: 'Receita',
    color: '#55B02E',
  },
  [TransactionType.EXPENSE]: {
    label: 'Despesas',
    color: '#E93030',
  },
} satisfies ChartConfig

interface TransactionsPieChartProps {
  typesPercentage: TransactionPercentagePerType
  depositsTotal: number
  investmentsTotal: number
  expensesTotal: number
}

export default function TransactionsPieChart({
  depositsTotal,
  investmentsTotal,
  expensesTotal,
  typesPercentage,
}: TransactionsPieChartProps) {
  const chartData = [
    {
      type: TransactionType.DEPOSIT,
      amount: depositsTotal,
      fill: '#55B02E',
    },
    {
      type: TransactionType.EXPENSE,
      amount: expensesTotal,
      fill: '#E93030',
    },
    {
      type: TransactionType.INVESTMENT,
      amount: investmentsTotal,
      fill: '#FFFFFF',
    },
  ]
  return (
    <Card className="flex flex-col p-6 transition-all hover:shadow-md sm:p-8 md:p-12">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] transition-transform hover:scale-105"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="type"
              innerRadius={60}
              className="transition-all hover:opacity-90"
            />
          </PieChart>
        </ChartContainer>

        <div className="mt-6 space-y-2">
          <PercentageItem
            icon={<TrendingUpIcon size={16} className="text-emerald-500" />}
            title="Receita"
            value={typesPercentage[TransactionType.DEPOSIT]}
          />
          <PercentageItem
            icon={<TrendingDownIcon size={16} className="text-red-500" />}
            title="Despesas"
            value={typesPercentage[TransactionType.EXPENSE]}
          />
          <PercentageItem
            icon={<PiggyBankIcon size={16} className="text-primary" />}
            title="Investido"
            value={typesPercentage[TransactionType.INVESTMENT]}
          />
        </div>
      </CardContent>
    </Card>
  )
}
