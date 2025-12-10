import { getDashboard } from '@/_data/get-dashboard'
import { isMatch } from 'date-fns'
import { FileText } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Navbar } from '../_components/navbar'
import { ExpensesPerCategory } from './_components/expenses-per-category'
import { LastTransactions } from './_components/last-transactions'
import { SummaryCards } from './_components/summary-cards'
import { TimeSelect } from './_components/time-select'
import { TransactionsPieChart } from './_components/transactions-pie-chart'

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const currentDate = new Date()
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
  const params = await searchParams
  const month = typeof params?.month === 'string' ? params.month : undefined

  if (month && !isMatch(month, 'MM')) {
    redirect(`/?month=${currentMonth}`)
  }

  const dashboard = await getDashboard(month || currentMonth)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-full border border-border/40 bg-background/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted">
              <FileText className="h-4 w-4" />
              Relatório IA
            </button>
            <TimeSelect />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-6">
            <SummaryCards month={month || currentMonth} {...dashboard} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <TransactionsPieChart {...dashboard} />
              <ExpensesPerCategory expensesPerCategory={dashboard.totalExpensePerCategory} />
            </div>
          </div>
          <div className="h-fit lg:h-[calc(100vh-180px)]">
            <LastTransactions lastTransactions={dashboard.lastTransactions} />
          </div>
        </div>
      </main>
    </div>
  )
}
