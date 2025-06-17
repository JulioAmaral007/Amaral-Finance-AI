'use server'

import { db } from '@/_lib/prisma'

export async function getTransactions() {
  console.log('Buscando todas as transações...')

  const transactions = await db.transaction.findMany({
    orderBy: { date: 'desc' },
    select: {
      id: true,
      name: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      isFixed: true,
      isInstallment: true,
      currentInstallment: true,
      totalInstallments: true,
      installmentGroupId: true,
    },
  })

  return transactions.map(transaction => ({
    ...transaction,
    amount: Number(transaction.amount),
  }))
}
