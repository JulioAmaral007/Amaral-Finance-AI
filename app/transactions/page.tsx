import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { canUserAddTransaction } from '../../_data/can-user-add-transaction'
import { db } from '../../_lib/prisma'
import { AddTransactionButton } from '../_components/add-transaction-button'
import { Navbar } from '../_components/navbar'
import { DataTable } from '../_components/ui/data-table'
import { ScrollArea } from '../_components/ui/scroll-area'
import { transactionColumns } from './_columns'

export default async function TransactionsPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/login')
  }
  const transactions = await db.transaction.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: 'desc',
    },
  })
  const userCanAddTransaction = await canUserAddTransaction()
  return (
    <>
      <Navbar />
      <div className="flex flex-col space-y-6 p-6 xl:overflow-hidden">
        {/* TÍTULO E BOTÃO */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
        </div>
        <ScrollArea className="h-full">
          <DataTable
            columns={transactionColumns}
            data={JSON.parse(JSON.stringify(transactions))}
          />
        </ScrollArea>
      </div>
    </>
  )
}