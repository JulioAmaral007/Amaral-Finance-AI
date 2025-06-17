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
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
  const selectedMonth = month || currentMonth

  const where = {
    date: {
      gte: new Date(`${currentYear}-${selectedMonth}-01`),
      lt: new Date(`${currentYear}-${selectedMonth}-31`),
    },
  }

  // Buscar todas as transações do mês para debug
  const allTransactions = await db.transaction.findMany({
    where,
    select: {
      id: true,
      name: true,
      amount: true,
      type: true,
      date: true,
    },
  })

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
  const transactionsTotal = depositsTotal + investmentsTotal + expensesTotal

  const typesPercentage: TransactionPercentagePerType = {
    [TransactionType.DEPOSIT]:
      transactionsTotal > 0 ? Math.round((depositsTotal / transactionsTotal) * 100) : 0,
    [TransactionType.EXPENSE]:
      transactionsTotal > 0 ? Math.round((expensesTotal / transactionsTotal) * 100) : 0,
    [TransactionType.INVESTMENT]:
      transactionsTotal > 0 ? Math.round((investmentsTotal / transactionsTotal) * 100) : 0,
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
    percentageOfTotal:
      expensesTotal > 0 ? Math.round((Number(category._sum.amount || 0) / expensesTotal) * 100) : 0,
  }))

  const lastTransactions = (
    await db.transaction.findMany({
      orderBy: { date: 'desc' },
      take: 15,
      select: {
        id: true,
        name: true,
        amount: true,
        type: true,
        category: true,
        date: true,
        createdAt: true,
        updatedAt: true,
        isFixed: true,
        isInstallment: true,
        currentInstallment: true,
        totalInstallments: true,
        installmentGroupId: true,
      },
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
