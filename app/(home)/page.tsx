import { auth } from '@clerk/nextjs/server'
import { isMatch } from 'date-fns'
import { redirect } from 'next/navigation'
import { Navbar } from '../_components/navbar'
import { canUserAddTransaction } from '../_data/can-user-add-transaction'
import { getDashboard } from '../_data/get-dashboard'
import { ExpensesPerCategory } from './_components/expenses-per-category'
import { LastTransactions } from './_components/last-transactions'
import { SummaryCards } from './_components/summary-cards'
import { TimeSelect } from './_components/time-select'
import { TransactionsPieChart } from './_components/transactions-pie-chart'

interface HomeProps {
  searchParams: {
    month: string
  }
}

export default async function Home({ searchParams: { month } }: HomeProps) {
  const { userId } = await auth()
  if (!userId) {
    redirect('/login')
  }
  const monthIsInvalid = !month || !isMatch(month, 'MM')
  if (monthIsInvalid) {
    redirect(`?month=${new Date().getMonth() + 1}`)
  }
  const dashboard = await getDashboard(month)
  const userCanAddTransaction = await canUserAddTransaction()

  return (
    <>
      <Navbar />
      <div className="flex h-full flex-col space-y-6 overflow-hidden p-5">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-3">
            {/* <AiReportButton
              month={month}
              hasPremiumPlan={
                user.publicMetadata.subscriptionPlan === 'premium'
              }
            /> */}
            <TimeSelect />
          </div>
        </div>
        <div className="flex h-full flex-col gap-5 overflow-hidden lg:grid lg:grid-cols-[2fr,1fr]">
          <div className="flex flex-col gap-5 overflow-hidden">
            <SummaryCards
              month={month}
              {...dashboard}
              userCanAddTransaction={userCanAddTransaction}
            />
            <div className="flex max-h-full flex-col gap-5 overflow-hidden md:grid md:grid-cols-2 lg:grid-cols-3 lg:flex-row">
              <TransactionsPieChart {...dashboard} />
              <ExpensesPerCategory
                expensesPerCategory={dashboard.totalExpensePerCategory}
              />
            </div>
          </div>
          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </>
  )
}
