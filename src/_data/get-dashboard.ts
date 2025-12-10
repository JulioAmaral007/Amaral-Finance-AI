import { requireUser } from '@/_lib/auth'
import { createClient } from '@/_lib/supabase/server'
import type { Transaction, TransactionCategory, TransactionType } from '@/types/database'

export type TransactionPercentagePerType = {
  [key in TransactionType]: number
}

export interface TotalExpensePerCategory {
  category: TransactionCategory
  totalAmount: number
  percentageOfTotal: number
}

export const getDashboard = async (month: string) => {
  const user = await requireUser()
  const supabase = await createClient()

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
  const selectedMonth = month || currentMonth

  // Calcular início e fim do mês
  const startDate = new Date(`${currentYear}-${selectedMonth}-01T00:00:00.000Z`)
  const endDate = new Date(currentYear, parseInt(selectedMonth), 0, 23, 59, 59, 999)

  // Buscar todas as transações do mês
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate.toISOString())
    .lte('date', endDate.toISOString())

  if (error) {
    console.error('Erro ao buscar transações:', error)
    throw new Error('Falha ao buscar dados do dashboard')
  }

  // Calcular totais
  const depositsTotal = transactions
    .filter(t => t.type === 'DEPOSIT')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const investmentsTotal = transactions
    .filter(t => t.type === 'INVESTMENT')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const expensesTotal = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = depositsTotal - investmentsTotal - expensesTotal
  const transactionsTotal = depositsTotal + investmentsTotal + expensesTotal

  // Calcular percentuais por tipo
  const typesPercentage: TransactionPercentagePerType = {
    DEPOSIT: transactionsTotal > 0 ? Math.round((depositsTotal / transactionsTotal) * 100) : 0,
    EXPENSE: transactionsTotal > 0 ? Math.round((expensesTotal / transactionsTotal) * 100) : 0,
    INVESTMENT: transactionsTotal > 0 ? Math.round((investmentsTotal / transactionsTotal) * 100) : 0,
  }

  // Calcular gastos por categoria
  const expensesByCategory = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => {
      const category = t.category
      acc[category] = (acc[category] || 0) + Number(t.amount)
      return acc
    }, {} as Record<TransactionCategory, number>)

  const totalExpensePerCategory: TotalExpensePerCategory[] = Object.entries(expensesByCategory)
    .map(([category, totalAmount]) => ({
      category: category as TransactionCategory,
      totalAmount,
      percentageOfTotal: expensesTotal > 0 ? Math.round((totalAmount / expensesTotal) * 100) : 0,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount)

  // Buscar últimas transações (sem filtro de mês)
  const { data: lastTransactions, error: lastError } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(15)

  if (lastError) {
    console.error('Erro ao buscar últimas transações:', lastError)
    throw new Error('Falha ao buscar últimas transações')
  }

  return {
    balance,
    depositsTotal,
    investmentsTotal,
    expensesTotal,
    typesPercentage,
    totalExpensePerCategory,
    lastTransactions: lastTransactions.map(t => ({
      ...t,
      amount: Number(t.amount),
    })),
  }
}
