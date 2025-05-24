import { getDashboard } from '@/_data/get-dashboard'
import { Decimal } from '@prisma/client/runtime/library'
import { isMatch } from 'date-fns'
import { redirect } from 'next/navigation'
import { Sidebar } from '../_components/sidebar'
import { ExpensesPerCategory } from './_components/expenses-per-category'
import { LastTransactions } from './_components/last-transactions'
import { SummaryCards } from './_components/summary-cards'
import { TimeSelect } from './_components/time-select'
import { TransactionsPieChart } from './_components/transactions-pie-chart'

interface HomeProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Home({ searchParams }: HomeProps) {
  const month = searchParams?.month as string | undefined
  const monthIsInvalid = !month || !isMatch(month, 'MM')

  if (monthIsInvalid) {
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0')
    redirect(`?month=${currentMonth}`)
  }
  const dashboard = await getDashboard(month)
  return (
    <div className="flex bg-background">
      <Sidebar />
      <main className="h-dvh w-full max-w-screen-2xl mx-auto">
        <div className="flex flex-col space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-3">
              <TimeSelect />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
            <div className="flex h-min flex-col gap-3 col-span-3">
              <SummaryCards month={month} {...dashboard} />
              <div className="grid h-min grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <TransactionsPieChart {...dashboard} />
                <ExpensesPerCategory expensesPerCategory={dashboard.totalExpensePerCategory} />
              </div>
            </div>
            <div className="h-[calc(100dvh-100px)] col-span-1">
              <LastTransactions
                lastTransactions={dashboard.lastTransactions.map(transaction => ({
                  ...transaction,
                  amount: new Decimal(transaction.amount),
                }))}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
