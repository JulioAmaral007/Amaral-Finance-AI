'use server'

import { db } from '@/_lib/prisma'
import { type UserUpdate, userUpdateSchema } from '@/_lib/validations/schemas'
import { revalidatePath } from 'next/cache'

export async function updateUser(userId: string, data: UserUpdate) {
  try {
    const validatedData = userUpdateSchema.parse(data)

    const user = await db.user.update({
      where: { id: userId },
      data: validatedData,
    })

    revalidatePath('/configuracoes')
    revalidatePath('/')

    return { success: true, user }
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function getUserById(userId: string) {
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
          include: { category: true },
        },
        investments: { where: { isActive: true } },
        goals: { where: { isCompleted: false } },
        _count: {
          select: {
            incomes: { where: { isActive: true } },
            fixedExpenses: { where: { isActive: true } },
            variableExpenses: true,
            investments: { where: { isActive: true } },
            goals: true,
          },
        },
      },
    })

    return { success: true, user }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function deleteUser(userId: string) {
  try {
    await db.user.delete({
      where: { id: userId },
    })

    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}
