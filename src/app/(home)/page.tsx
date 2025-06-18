import { getDashboard } from '@/_data/get-dashboard'
import { isMatch } from 'date-fns'
import { redirect } from 'next/navigation'
import { Sidebar } from '../_components/sidebar'
import { ExpensesPerCategory } from './_components/expenses-per-category'
import { LastTransactions } from './_components/last-transactions'
import { SummaryCards } from './_components/summary-cards'
import { TimeSelect } from './_components/time-select'
import { TransactionsPieChart } from './_components/transactions-pie-chart'

interface HomePageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const currentDate = new Date()
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
  const month = typeof searchParams?.month === 'string' ? searchParams.month : undefined

  if (month && !isMatch(month, 'MM')) {
    redirect(`/?month=${currentMonth}`)
  }

  const dashboard = await getDashboard(month || currentMonth)

  return (
    <div className="flex bg-background">
      <Sidebar />
      <main className="h-dvh w-full overflow-y-auto">
        <div className="flex flex-col space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-3">
              <TimeSelect />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
            <div className="flex h-min flex-col gap-3 col-span-3">
              <SummaryCards month={month || currentMonth} {...dashboard} />
              <div className="grid h-min grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <TransactionsPieChart {...dashboard} />
                <ExpensesPerCategory expensesPerCategory={dashboard.totalExpensePerCategory} />
              </div>
            </div>
            <div className="h-[calc(100dvh-100px)] col-span-1">
              <LastTransactions lastTransactions={dashboard.lastTransactions} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
