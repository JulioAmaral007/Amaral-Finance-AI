import { db } from '@/_lib/prisma'
import { type TransactionCategory, TransactionType } from '@prisma/client'

export type TransactionPercentagePerType = {
  [key in TransactionType]: number
}

export interface TotalExpensePerCategory {
  category: TransactionCategory
  totalAmount: number
  percentageOfTotal: number
}

export const getDashboard = async (month: string) => {
  const where = {
    date: {
      gte: new Date(`2024-${month}-01`),
      lt: new Date(`2024-${month}-31`),
    },
  }

  const depositsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: 'DEPOSIT' },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0
  )

  const investmentsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: 'INVESTMENT' },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0
  )

  const expensesTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: 'EXPENSE' },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0
  )

  const balance = depositsTotal - investmentsTotal - expensesTotal
  const transactionsTotal = Number(
    (
      await db.transaction.aggregate({
        where,
        _sum: { amount: true },
      })
    )._sum.amount || 0
  )

  const typesPercentage: TransactionPercentagePerType = {
    [TransactionType.DEPOSIT]: Math.round((depositsTotal / transactionsTotal) * 100),
    [TransactionType.EXPENSE]: Math.round((expensesTotal / transactionsTotal) * 100),
    [TransactionType.INVESTMENT]: Math.round((investmentsTotal / transactionsTotal) * 100),
  }

  const totalExpensePerCategory: TotalExpensePerCategory[] = (
    await db.transaction.groupBy({
      by: ['category'],
      where: {
        ...where,
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    })
  ).map(category => ({
    category: category.category,
    totalAmount: Number(category._sum.amount || 0),
    percentageOfTotal: Math.round((Number(category._sum.amount || 0) / expensesTotal) * 100),
  }))

  const lastTransactions = (
    await db.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 15,
    })
  ).map(transaction => ({
    ...transaction,
    amount: Number(transaction.amount),
  }))

  return {
    balance,
    depositsTotal,
    investmentsTotal,
    expensesTotal,
    typesPercentage,
    totalExpensePerCategory,
    lastTransactions,
  }
}
