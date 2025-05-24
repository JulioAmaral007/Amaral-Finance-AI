import { getDashboard } from '@/_data/get-dashboard'
import { isMatch } from 'date-fns'
import { redirect } from 'next/navigation'
import Navbar from '../_components/navbar'
import ExpensesPerCategory from './_components/expenses-per-category'
import LastTransactions from './_components/last-transactions'
import SummaryCards from './_components/summary-cards'
import TimeSelect from './_components/time-select'
import TransactionsPieChart from './_components/transactions-pie-chart'

interface HomeProps {
  searchParams: {
    month: string
  }
}

export default async function Home({ searchParams: { month } }: HomeProps) {
  const monthIsInvalid = !month || !isMatch(month, 'MM')
  if (monthIsInvalid) {
    redirect(`?month=${new Date().getMonth() + 1}`)
  }
  const dashboard = await getDashboard(month)
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <TimeSelect />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="flex flex-col gap-6">
            <SummaryCards month={month} {...dashboard} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <TransactionsPieChart {...dashboard} />
              <ExpensesPerCategory expensesPerCategory={dashboard.totalExpensePerCategory} />
            </div>
          </div>
          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </main>
  )
}
