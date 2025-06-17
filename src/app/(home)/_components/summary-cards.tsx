import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon, WalletIcon } from 'lucide-react'
import { SummaryCard } from './summary-card'

interface SummaryCardsProps {
  month: string
  balance: number
  depositsTotal: number
  investmentsTotal: number
  expensesTotal: number
}

export function SummaryCards({
  balance,
  depositsTotal,
  expensesTotal,
  investmentsTotal,
  month,
}: SummaryCardsProps) {
  return (
    <div className="h-full space-y-3">
      {/* PRIMEIRO CARD */}
      <SummaryCard
        icon={<WalletIcon size={16} className="text-primary" />}
        title="Saldo"
        amount={balance}
        size="large"
      />

      {/* OUTROS CARDS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          icon={<PiggyBankIcon size={16} className="text-primary" />}
          title="Investido"
          amount={investmentsTotal}
        />
        <SummaryCard
          icon={<TrendingUpIcon size={16} className="text-emerald-500" />}
          title="Receita"
          amount={depositsTotal}
        />
        <SummaryCard
          icon={<TrendingDownIcon size={16} className="text-red-500" />}
          title="Despesas"
          amount={expensesTotal}
        />
      </div>
    </div>
  )
}
