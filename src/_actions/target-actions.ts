'use server'

import {
  calculateGoalProgress,
  calculateMonthsToGoal,
  calculateRequiredMonthlySaving,
} from '@/_lib/calculations'
import { db } from '@/_lib/prisma'
import { type GoalInput, goalSchema } from '@/_lib/validations/schemas'
import { revalidatePath } from 'next/cache'

export async function createGoal(userId: string, data: GoalInput) {
  try {
    const validatedData = goalSchema.parse(data)

    const goal = await db.goal.create({
      data: {
        ...validatedData,
        userId,
      },
    })

    revalidatePath('/metas')
    revalidatePath('/')

    return { success: true, goal }
  } catch (error) {
    console.error('Erro ao criar meta:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function updateGoal(goalId: string, data: GoalInput) {
  try {
    const validatedData = goalSchema.parse(data)

    const isCompleted = validatedData.currentAmount >= validatedData.targetAmount

    const goal = await db.goal.update({
      where: { id: goalId },
      data: {
        ...validatedData,
        isCompleted,
      },
    })

    revalidatePath('/metas')
    revalidatePath('/')

    return { success: true, goal }
  } catch (error) {
    console.error('Erro ao atualizar meta:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function updateGoalProgress(goalId: string, amount: number) {
  try {
    if (amount < 0) {
      return { success: false, error: 'Valor deve ser positivo' }
    }

    const goal = await db.goal.findUnique({
      where: { id: goalId },
    })

    if (!goal) {
      return { success: false, error: 'Meta não encontrada' }
    }

    const newCurrentAmount = goal.currentAmount + amount
    const isCompleted = newCurrentAmount >= goal.targetAmount

    const updatedGoal = await db.goal.update({
      where: { id: goalId },
      data: {
        currentAmount: newCurrentAmount,
        isCompleted,
      },
    })

    revalidatePath('/metas')
    revalidatePath('/')

    return { success: true, goal: updatedGoal }
  } catch (error) {
    console.error('Erro ao atualizar progresso da meta:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function deleteGoal(goalId: string) {
  try {
    await db.goal.delete({
      where: { id: goalId },
    })

    revalidatePath('/metas')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar meta:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function getGoalsByUser(userId: string) {
  try {
    const goals = await db.goal.findMany({
      where: { userId },
      orderBy: [{ isCompleted: 'asc' }, { priority: 'desc' }, { targetDate: 'asc' }],
    })

    // Calcular métricas para cada meta
    const goalsWithMetrics = goals.map(goal => {
      const progress = calculateGoalProgress(goal.currentAmount, goal.targetAmount)
      const monthsRemaining = calculateMonthsToGoal(goal.targetDate)
      const requiredMonthlySaving = calculateRequiredMonthlySaving(
        goal.currentAmount,
        goal.targetAmount,
        monthsRemaining
      )

      return {
        ...goal,
        progress,
        monthsRemaining,
        requiredMonthlySaving,
      }
    })

    return { success: true, goals: goalsWithMetrics }
  } catch (error) {
    console.error('Erro ao buscar metas:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function getGoalsSummary(userId: string) {
  try {
    const goals = await db.goal.findMany({
      where: { userId },
    })

    const summary = goals.reduce(
      (acc, goal) => {
        acc.total += 1
        acc.totalTargetAmount += goal.targetAmount
        acc.totalCurrentAmount += goal.currentAmount

        if (goal.isCompleted) {
          acc.completed += 1
        }

        const progress = calculateGoalProgress(goal.currentAmount, goal.targetAmount)
        acc.averageProgress += progress

        return acc
      },
      {
        total: 0,
        completed: 0,
        totalTargetAmount: 0,
        totalCurrentAmount: 0,
        averageProgress: 0,
      }
    ) 

    if (summary.total > 0) {
      summary.averageProgress = summary.averageProgress / summary.total
    }

    return { success: true, summary }
  } catch (error) {
    console.error('Erro ao calcular resumo de metas:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}
