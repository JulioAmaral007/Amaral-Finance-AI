'use client'

import { getTransactions } from '@/_actions/get-transactions'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/_components/ui/select'
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
  const [customPercentages, setCustomPercentages] = useState<
    Record<string, { bills: number; investment: number; savings: number }>
  >({})
  const [months, setMonths] = useState<MonthExpenses[]>([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

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

  const handleUpdatePercentages = (
    monthNumber: number,
    percentages: { bills: number; investment: number; savings: number }
  ) => {
    setCustomPercentages(prev => ({
      ...prev,
      [monthNumber]: percentages,
    }))

    // Atualiza os meses com as novas porcentagens
    setMonths(prevMonths =>
      prevMonths.map(month =>
        month.monthNumber === monthNumber ? { ...month, percentages } : month
      )
    )
  }

  const calculateMonthExpenses = useCallback((): MonthExpenses[] => {
    const calculatedMonths: MonthExpenses[] = []

    // Inicializa os 12 meses do ano selecionado
    for (let i = 0; i < 12; i++) {
      const date = new Date(selectedYear, i, 1)
      const monthNumber = getMonthNumber(date)

      calculatedMonths.push({
        month: getMonthName(date),
        monthNumber,
        fixedExpenses: 0,
        activeParcels: 0,
        totalProjected: 0,
        salary: 0,
        expenses: [],
        percentages: customPercentages[monthNumber] || {
          bills: 50,
          investment: 30,
          savings: 20,
        },
      })
    }

    // Filtra as despesas e cenários pelo ano selecionado
    const allExpenses = [...expenses, ...scenarios].filter(expense => {
      const expenseYear = new Date(expense.startDate).getFullYear()
      return expenseYear === selectedYear
    })

    for (const expense of allExpenses) {
      const startMonth = getMonthNumber(expense.startDate)
      const monthIndex = calculatedMonths.findIndex(m => m.monthNumber === startMonth)

      if (monthIndex !== -1) {
        if (expense.isSalary) {
          calculatedMonths[monthIndex].salary += expense.totalValue
          calculatedMonths[monthIndex].expenses.push(expense)
        } else if (expense.type === 'fixo') {
          calculatedMonths[monthIndex].fixedExpenses += expense.totalValue
          calculatedMonths[monthIndex].expenses.push(expense)
        } else if (expense.type === 'parcelado' && expense.parcels) {
          for (const parcel of expense.parcels) {
            const parcelMonth = getMonthNumber(parcel.dueDate)
            const parcelMonthIndex = calculatedMonths.findIndex(m => m.monthNumber === parcelMonth)

            if (parcelMonthIndex !== -1) {
              calculatedMonths[parcelMonthIndex].activeParcels += parcel.value
              calculatedMonths[parcelMonthIndex].expenses.push({
                ...expense,
                totalValue: parcel.value,
              })
            }
          }
        }
      }
    }

    // Calcula o total projetado e ajusta as porcentagens para cada mês
    for (const month of calculatedMonths) {
      month.totalProjected = month.fixedExpenses + month.activeParcels

      if (month.salary > 0) {
        // Calcula o percentual necessário para cobrir as despesas
        const requiredPercentage = (month.totalProjected / month.salary) * 100

        // Se o percentual necessário for maior que o definido, ajusta
        if (requiredPercentage > month.percentages.bills) {
          const excess = requiredPercentage - month.percentages.bills

          // Ajusta o percentual de contas para cobrir todas as despesas
          month.percentages.bills = requiredPercentage

          // Reduz proporcionalmente investimento e reserva
          const totalOther = month.percentages.investment + month.percentages.savings
          if (totalOther > 0) {
            const investmentProportion = month.percentages.investment / totalOther
            const savingsProportion = month.percentages.savings / totalOther

            month.percentages.investment = Math.max(
              0,
              month.percentages.investment - excess * investmentProportion
            )
            month.percentages.savings = Math.max(
              0,
              month.percentages.savings - excess * savingsProportion
            )
          } else {
            month.percentages.investment = 0
            month.percentages.savings = 0
          }
        }
      }
    }

    return calculatedMonths
  }, [expenses, scenarios, customPercentages, selectedYear])

  useEffect(() => {
    const calculatedMonths = calculateMonthExpenses()
    setMonths(calculatedMonths)
  }, [calculateMonthExpenses])

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
      startDate: new Date(new Date().getFullYear(), scenario.startMonth, 1),
      isActive: true,
      isSalary: false,
      parcels: Array.from({ length: scenario.installments }, (_, i) => ({
        number: i + 1,
        totalParcels: scenario.installments,
        value: scenario.value / scenario.installments,
        dueDate: new Date(new Date().getFullYear(), scenario.startMonth + i, 1),
      })),
    }

    setScenarios(prev => [...prev, newScenario])
  }

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Planejamento</h1>
              <p className="text-muted-foreground">Planeje suas finanças</p>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Planejamento</h1>
            <p className="text-muted-foreground">Planeje suas finanças</p>
          </div>
          <Select
            value={selectedYear.toString()}
            onValueChange={value => setSelectedYear(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BalanceChart months={months} />
            <ScenarioSimulator months={months} onAddScenario={handleAddScenario} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {months.map(month => (
              <MonthCard
                key={month.month}
                data={month}
                onClick={() => setSelectedMonth(month)}
                onUpdatePercentages={percentages =>
                  handleUpdatePercentages(month.monthNumber, percentages)
                }
              />
            ))}
          </div>

          {selectedMonth && (
            <ExpenseDetail
              expenses={selectedMonth.expenses}
              onClose={() => setSelectedMonth(null)}
            />
          )}
        </main>
      </div>
    </div>
  )
}
