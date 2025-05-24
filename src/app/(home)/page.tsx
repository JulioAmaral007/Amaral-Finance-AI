import { isMatch } from 'date-fns'
import { redirect } from 'next/navigation'
import Navbar from '../_components/navbar'
import SummaryCards from './_components/summary-cards'
import TimeSelect from './_components/time-select'

interface HomeProps {
  searchParams: {
    month: string
  }
}

export default async function Home({ searchParams: { month } }: HomeProps) {
  const monthIsInvalid = !month || !isMatch(month, 'MM')
  if (monthIsInvalid) {
    redirect('?month=01')
  }
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <TimeSelect />
        </div>
        <SummaryCards month={month} />
      </div>
    </main>
  )
}
