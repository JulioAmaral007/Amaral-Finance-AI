'use client'

import { getTransactions } from '@/_actions/get-transactions'
import { getMonthName, getMonthNumber } from '@/_lib/installment-utils'
import { BalanceChart } from '@/app/planning/_components/BalanceChart'
import { ExpenseDetail } from '@/app/planning/_components/ExpenseDetail'
import { MonthCard } from '@/app/planning/_components/MonthCard'
import { ScenarioSimulator } from '@/app/planning/_components/ScenarioSimulator'
import type { Expense, MonthExpenses } from '@/types/expense'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Sidebar } from '../_components/sidebar'

export default function PlanningPage() {
  const router = useRouter()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [selectedMonth, setSelectedMonth] = useState<MonthExpenses | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [scenarios, setScenarios] = useState<Expense[]>([])

  const loadTransactions = useCallback(async () => {
    try {
      const transactions = await getTransactions()

      // Converter transações do banco para o formato de Expense
      const formattedExpenses: Expense[] = transactions.map(transaction => {
        const isFixed = transaction.isFixed || transaction.type === 'EXPENSE'
        const isInstallment = transaction.isInstallment || false
        const isSalary = transaction.category === 'SALARY'
        const isDeposit = transaction.type === 'DEPOSIT'

        // Se for um depósito, trata como receita fixa
        if (isDeposit) {
          return {
            id: transaction.id,
            name: transaction.name,
            type: 'fixo',
            totalValue: transaction.amount,
            startDate: transaction.date,
            isActive: true,
            isSalary: true,
            parcels: undefined,
          }
        }

        return {
          id: transaction.id,
          name: transaction.name,
          type: isFixed ? 'fixo' : isInstallment ? 'parcelado' : 'variavel',
          totalValue: transaction.amount,
          startDate: transaction.date,
          isActive: true,
          isSalary,
          parcels: isInstallment
            ? [
                {
                  number: transaction.currentInstallment || 1,
                  totalParcels: transaction.totalInstallments || 1,
                  value: transaction.amount,
                  dueDate: transaction.date,
                },
              ]
            : undefined,
        }
      })

      setExpenses(formattedExpenses)
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  useEffect(() => {
    const handleRouteChange = () => {
      loadTransactions()
    }

    window.addEventListener('popstate', handleRouteChange)
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [loadTransactions])

  // Função para calcular as despesas de cada mês
  const calculateMonthExpenses = (): MonthExpenses[] => {
    const months: MonthExpenses[] = []
    const currentDate = new Date()

    // Inicializa os 12 meses
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate)
      date.setMonth(currentDate.getMonth() + i)

      months.push({
        month: getMonthName(date),
        monthNumber: getMonthNumber(date),
        fixedExpenses: 0,
        activeParcels: 0,
        totalProjected: 0,
        salary: 0,
        expenses: [],
      })
    }

    // Distribui as despesas pelos meses
    const allExpenses = [...expenses, ...scenarios]

    for (const expense of allExpenses) {
      const startMonth = getMonthNumber(expense.startDate)
      const monthIndex = months.findIndex(m => m.monthNumber === startMonth)

      if (monthIndex !== -1) {
        if (expense.isSalary) {
          // Se for salário ou depósito, adiciona ao salário do mês
          months[monthIndex].salary += expense.totalValue
          months[monthIndex].expenses.push(expense)
        } else if (expense.type === 'fixo') {
          months[monthIndex].fixedExpenses += expense.totalValue
          months[monthIndex].expenses.push(expense)
        } else if (expense.type === 'parcelado' && expense.parcels) {
          for (const parcel of expense.parcels) {
            const parcelMonth = getMonthNumber(parcel.dueDate)
            const parcelMonthIndex = months.findIndex(m => m.monthNumber === parcelMonth)

            if (parcelMonthIndex !== -1) {
              months[parcelMonthIndex].activeParcels += parcel.value
              months[parcelMonthIndex].expenses.push({
                ...expense,
                totalValue: parcel.value,
              })
            }
          }
        }
      }
    }

    // Calcula o total projetado para cada mês
    for (const month of months) {
      month.totalProjected = month.fixedExpenses + month.activeParcels
    }

    return months
  }

  const handleAddScenario = (scenario: {
    name: string
    value: number
    installments: number
    startMonth: number
  }) => {
    const newScenario: Expense = {
      id: `scenario-${Date.now()}`,
      name: scenario.name,
      type: 'parcelado',
      totalValue: scenario.value,
      startDate: new Date(new Date().getFullYear(), scenario.startMonth - 1, 1),
      isActive: true,
      isSalary: false,
      parcels: Array.from({ length: scenario.installments }, (_, i) => ({
        number: i + 1,
        totalParcels: scenario.installments,
        value: scenario.value / scenario.installments,
        dueDate: new Date(new Date().getFullYear(), scenario.startMonth - 1 + i, 1),
      })),
    }

    setScenarios(prev => [...prev, newScenario])
  }

  const months = calculateMonthExpenses()

  if (isLoading) {
    return (
      <div className="flex bg-background">
        <Sidebar />
        <main className="h-dvh w-full max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex bg-background">
      <Sidebar />
      <main className="h-dvh w-full max-w-screen-2xl mx-auto overflow-y-auto">
        <div className="flex flex-col space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Planejamento</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BalanceChart months={months} />
            <ScenarioSimulator months={months} onAddScenario={handleAddScenario} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {months.map(month => (
              <MonthCard key={month.month} data={month} onClick={() => setSelectedMonth(month)} />
            ))}
          </div>

          {selectedMonth && (
            <ExpenseDetail
              expenses={selectedMonth.expenses}
              onClose={() => setSelectedMonth(null)}
            />
          )}
        </div>
      </main>
    </div>
  )
}
