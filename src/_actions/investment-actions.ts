'use server'

import { db } from '@/_lib/prisma'
import { type IncomeInput, incomeSchema } from '@/_lib/validations/schemas'
import { revalidatePath } from 'next/cache'

export async function createIncome(userId: string, data: IncomeInput) {
  try {
    const validatedData = incomeSchema.parse(data)

    const income = await db.income.create({
      data: {
        ...validatedData,
        userId,
      },
    })

    revalidatePath('/entradas')
    revalidatePath('/')

    return { success: true, income }
  } catch (error) {
    console.error('Erro ao criar renda:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function updateIncome(incomeId: string, data: IncomeInput) {
  try {
    const validatedData = incomeSchema.parse(data)

    const income = await db.income.update({
      where: { id: incomeId },
      data: validatedData,
    })

    revalidatePath('/entradas')
    revalidatePath('/')

    return { success: true, income }
  } catch (error) {
    console.error('Erro ao atualizar renda:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function deleteIncome(incomeId: string) {
  try {
    await db.income.update({
      where: { id: incomeId },
      data: { isActive: false },
    })

    revalidatePath('/entradas')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar renda:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function getIncomesByUser(userId: string) {
  try {
    const incomes = await db.income.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, incomes }
  } catch (error) {
    console.error('Erro ao buscar rendas:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}
