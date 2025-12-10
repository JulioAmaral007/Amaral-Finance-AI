import { requireUser } from '@/_lib/auth'
import { createClient } from '@/_lib/supabase/server'
import { Navbar } from '../_components/navbar'
import { TransactionsTable } from './_components/transactions-table'

export default async function TransactionsPage() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (error) {
    console.error('Erro ao buscar transações:', error)
    throw new Error('Falha ao buscar transações')
  }

  const formattedTransactions = transactions.map(transaction => ({
    ...transaction,
    amount: Number(transaction.amount),
  }))

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 p-6">
        <TransactionsTable transactions={formattedTransactions} />
      </main>
    </div>
  )
}
