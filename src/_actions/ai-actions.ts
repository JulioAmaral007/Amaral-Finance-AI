'use server'

import {
  calculateEmergencyReserveMonths,
  calculateMonthlyAmount,
  calculateSavingsRate,
} from '@/_lib/calculations'
import {
  type FinancialData,
  generateFinancialAnalysis,
  generateGoalSuggestions,
} from '@/_lib/gemini'
import { db } from '@/_lib/prisma'
import { type AISimulationInput, aiSimulationSchema } from '@/_lib/validations/schemas'
import { revalidatePath } from 'next/cache'

export async function generateUserAnalysis(userId: string) {
  try {
    // Buscar dados financeiros do usuário
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        incomes: { where: { isActive: true } },
        fixedExpenses: { where: { isActive: true } },
        variableExpenses: {
          where: {
            date: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
          include: { category: true },
        },
        investments: { where: { isActive: true } },
        goals: { where: { isCompleted: false } },
      },
    })

    if (!user) {
      return { success: false, error: 'Usuário não encontrado' }
    }

    // Calcular totais mensais
    const monthlyIncome = user.incomes.reduce((total, income) => {
      return total + calculateMonthlyAmount(Number(income.amount), income.frequency)
    }, 0)

    const monthlyFixedExpenses = user.fixedExpenses.reduce((total, expense) => {
      return total + calculateMonthlyAmount(Number(expense.amount), expense.frequency)
    }, 0)

    const monthlyVariableExpenses = user.variableExpenses.reduce((total, expense) => {
      return total + Number(expense.amount)
    }, 0)

    const monthlyExpenses = monthlyFixedExpenses + monthlyVariableExpenses

    // Calcular gastos por categoria
    const expensesByCategory = user.variableExpenses.reduce(
      (acc, expense) => {
        const categoryName = expense.category.name
        acc[categoryName] = (acc[categoryName] || 0) + Number(expense.amount)
        return acc
      },
      {} as Record<string, number>
    )

    // Adicionar despesas fixas como "Gastos Fixos"
    if (monthlyFixedExpenses > 0) {
      expensesByCategory['Gastos Fixos'] = monthlyFixedExpenses
    }

    // Preparar dados para a IA
    const financialData: FinancialData = {
      monthlyIncome,
      monthlyExpenses,
      monthlyInvestment: 0, // Será calculado baseado na sobra
      emergencyReserve: Number(user.emergencyReserve),
      emergencyGoal: Number(user.emergencyGoal),
      expensesByCategory,
      investments: user.investments.map(inv => ({
        type: inv.type,
        amount: Number(inv.amount),
        currentValue: inv.currentValue ? Number(inv.currentValue) : undefined,
      })),
      goals: user.goals.map(goal => ({
        name: goal.name,
        targetAmount: Number(goal.targetAmount),
        currentAmount: Number(goal.currentAmount),
        targetDate: goal.targetDate.toISOString(),
      })),
    }

    // Gerar análise com IA
    const analysis = await generateFinancialAnalysis(financialData)
    // Salvar análise no banco
    const aiAnalysis = await db.aIAnalysis.create({
      data: {
        userId,
        analysisType: 'monthly_summary',
        content: JSON.stringify({
          monthlyIncome,
          monthlyExpenses,
          expensesByCategory,
          savingsRate: analysis.savingsRate,
          riskLevel: analysis.riskLevel,
        }),
        recommendations: analysis.recommendations,
        confidence: 0.85,
      },
    })

    revalidatePath('/analise-ia')
    revalidatePath('/')

    return {
      success: true,
      analysis: {
        ...analysis,
        id: aiAnalysis.id,
        monthlyIncome,
        monthlyExpenses,
        monthlySurplus: monthlyIncome - monthlyExpenses,
      },
    }
  } catch (error) {
    console.error('Erro ao gerar análise:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function generateGoalSuggestionsForUser(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        incomes: { where: { isActive: true } },
        fixedExpenses: { where: { isActive: true } },
        variableExpenses: {
          where: {
            date: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        },
        goals: true,
      },
    })

    if (!user) {
      return { success: false, error: 'Usuário não encontrado' }
    }

    // Calcular dados financeiros
    const monthlyIncome = user.incomes.reduce((total, income) => {
      return total + calculateMonthlyAmount(Number(income.amount), income.frequency)
    }, 0)

    const monthlyExpenses =
      user.fixedExpenses.reduce((total, expense) => {
        return total + calculateMonthlyAmount(Number(expense.amount), expense.frequency)
      }, 0) +
      user.variableExpenses.reduce((total, expense) => {
        return total + Number(expense.amount)
      }, 0)

    const financialData: FinancialData = {
      monthlyIncome,
      monthlyExpenses,
      monthlyInvestment: 0,
      emergencyReserve: Number(user.emergencyReserve),
      emergencyGoal: Number(user.emergencyGoal),
      expensesByCategory: {},
      investments: [],
      goals: user.goals.map(goal => ({
        name: goal.name,
        targetAmount: Number(goal.targetAmount),
        currentAmount: Number(goal.currentAmount),
        targetDate: goal.targetDate.toISOString(),
      })),
    }

    const suggestions = await generateGoalSuggestions(financialData)

    // Salvar sugestões no banco
    const aiAnalysis = await db.aIAnalysis.create({
      data: {
        userId,
        analysisType: 'goal_suggestion',
        content: JSON.stringify(suggestions),
        recommendations: suggestions.suggestedGoals.map(
          goal =>
            `${goal.name}: ${goal.description} (R$ ${goal.estimatedAmount.toLocaleString('pt-BR')})`
        ),
        confidence: 0.8,
      },
    })

    revalidatePath('/analise-ia')
    revalidatePath('/metas')

    return { success: true, suggestions, analysisId: aiAnalysis.id }
  } catch (error) {
    console.error('Erro ao gerar sugestões de metas:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function simulateFinancialScenario(data: AISimulationInput) {
  try {
    const validatedData = aiSimulationSchema.parse(data)

    const monthlySurplus =
      validatedData.monthlyIncome - validatedData.monthlyExpenses - validatedData.monthlyInvestment
    const savingsRate = calculateSavingsRate(
      validatedData.monthlyIncome,
      validatedData.monthlyExpenses + validatedData.monthlyInvestment
    )
    const emergencyReserveMonths = calculateEmergencyReserveMonths(
      validatedData.currentEmergencyReserve,
      validatedData.monthlyExpenses
    )

    // Calcular tempo para completar reserva de emergência
    const emergencyDeficit = Math.max(
      validatedData.emergencyGoal - validatedData.currentEmergencyReserve,
      0
    )
    const monthsToCompleteEmergency =
      monthlySurplus > 0 ? Math.ceil(emergencyDeficit / monthlySurplus) : 0

    // Calcular cenários de investimento
    const investmentScenarios = [
      {
        name: 'Conservador',
        annualRate: 6,
        description: 'Renda fixa (Tesouro, CDB)',
      },
      {
        name: 'Moderado',
        annualRate: 10,
        description: 'Misto (60% renda fixa, 40% variável)',
      },
      {
        name: 'Arrojado',
        annualRate: 15,
        description: 'Renda variável (ações, fundos)',
      },
    ]

    const scenarios = investmentScenarios.map(scenario => {
      const monthlyRate = scenario.annualRate / 12 / 100
      const months = 60 // 5 anos

      let futureValue = 0
      if (validatedData.monthlyInvestment > 0) {
        futureValue =
          validatedData.monthlyInvestment * (((1 + monthlyRate) ** months - 1) / monthlyRate)
      }

      return {
        ...scenario,
        futureValue,
        totalInvested: validatedData.monthlyInvestment * months,
        profit: futureValue - validatedData.monthlyInvestment * months,
      }
    })

    const simulation = {
      monthlySurplus,
      savingsRate,
      emergencyReserveMonths,
      monthsToCompleteEmergency,
      scenarios,
      recommendations: [
        monthlySurplus < 0
          ? '⚠️ Seus gastos excedem sua renda. Revise suas despesas urgentemente.'
          : '✅ Você tem sobra mensal positiva.',
        savingsRate < 10
          ? '📈 Tente aumentar sua taxa de poupança para pelo menos 10%.'
          : '💰 Sua taxa de poupança está adequada.',
        emergencyReserveMonths < 3
          ? '🚨 Priorize completar sua reserva de emergência (3-6 meses de gastos).'
          : '🛡️ Sua reserva de emergência está adequada.',
        validatedData.monthlyInvestment === 0
          ? '📊 Considere começar a investir, mesmo que seja um valor pequeno.'
          : '🎯 Continue investindo regularmente.',
      ],
    }

    return { success: true, simulation }
  } catch (error) {
    console.error('Erro ao simular cenário:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function getAIAnalysesByUser(userId: string, limit = 10) {
  try {
    const analyses = await db.aIAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return { success: true, analyses }
  } catch (error) {
    console.error('Erro ao buscar análises da IA:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function markAnalysisAsRead(analysisId: string) {
  try {
    await db.aIAnalysis.update({
      where: { id: analysisId },
      data: { isRead: true },
    })

    revalidatePath('/analise-ia')

    return { success: true }
  } catch (error) {
    console.error('Erro ao marcar análise como lida:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}
