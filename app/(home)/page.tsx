import { canUserAddTransaction } from '@/_data/can-user-add-transaction'
import { getDashboard } from '@/_data/get-dashboard'
import { auth } from '@clerk/nextjs/server'
import { isMatch } from 'date-fns'
import { redirect } from 'next/navigation'
import { Navbar } from '../_components/navbar'
import { ExpensesPerCategory } from './_components/expenses-per-category'
import { LastTransactions } from './_components/last-transactions'
import { SummaryCards } from './_components/summary-cards'
import { TimeSelect } from './_components/time-select'
import { TransactionsPieChart } from './_components/transactions-pie-chart'

type HomeProps = Promise<{ [month: string]: string | undefined }>

export default async function Home(props: { searchParams: HomeProps }) {
  const { userId } = await auth()
  if (!userId) {
    redirect('/login')
  }

  const searchParams = await props.searchParams
  const month = searchParams.month

  const monthIsInvalid = !month || !isMatch(month, 'MM')
  if (monthIsInvalid) {
    redirect(`?month=${new Date().getMonth() + 1}`)
  }

  const dashboard = await getDashboard(month)
  const userCanAddTransaction = await canUserAddTransaction()
  // const user = await clerkClient().users.getUser(userId)
  return (
    <>
      <Navbar />
      <div className="flex flex-col space-y-6 p-6 xl:overflow-hidden">
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
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[2fr,1fr] xl:overflow-hidden">
          <div className="flex flex-col gap-6 xl:overflow-hidden">
            <SummaryCards
              month={month}
              {...dashboard}
              userCanAddTransaction={userCanAddTransaction}
            />
            <div className="flex flex-col gap-6 xl:grid xl:grid-cols-3 xl:grid-rows-1 xl:overflow-hidden">
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
