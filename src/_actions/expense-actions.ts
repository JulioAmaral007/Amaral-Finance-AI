'use server'

import { db } from '@/_lib/prisma'
import {
  type FixedExpenseInput,
  type InstallmentPurchaseInput,
  type VariableExpenseInput,
  fixedExpenseSchema,
  installmentPurchaseSchema,
  variableExpenseSchema,
} from '@/_lib/validations/schemas'
import { revalidatePath } from 'next/cache'

// DESPESAS FIXAS
export async function createFixedExpense(userId: string, data: FixedExpenseInput) {
  try {
    const validatedData = fixedExpenseSchema.parse(data)

    const expense = await db.fixedExpense.create({
      data: {
        ...validatedData,
        userId,
      },
    })

    revalidatePath('/entradas')
    revalidatePath('/')

    return { success: true, expense }
  } catch (error) {
    console.error('Erro ao criar despesa fixa:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function updateFixedExpense(expenseId: string, data: FixedExpenseInput) {
  try {
    const validatedData = fixedExpenseSchema.parse(data)

    const expense = await db.fixedExpense.update({
      where: { id: expenseId },
      data: validatedData,
    })

    revalidatePath('/entradas')
    revalidatePath('/')

    return { success: true, expense }
  } catch (error) {
    console.error('Erro ao atualizar despesa fixa:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function deleteFixedExpense(expenseId: string) {
  try {
    await db.fixedExpense.update({
      where: { id: expenseId },
      data: { isActive: false },
    })

    revalidatePath('/entradas')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar despesa fixa:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function getFixedExpensesByUser(userId: string) {
  try {
    const expenses = await db.fixedExpense.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, expenses }
  } catch (error) {
    console.error('Erro ao buscar despesas fixas:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

// DESPESAS VARIÁVEIS
export async function createVariableExpense(userId: string, data: VariableExpenseInput) {
  try {
    const validatedData = variableExpenseSchema.parse(data)

    const expense = await db.variableExpense.create({
      data: {
        ...validatedData,
        userId,
      },
      include: {
        category: true,
      },
    })

    revalidatePath('/entradas')
    revalidatePath('/')

    return { success: true, expense }
  } catch (error) {
    console.error('Erro ao criar despesa variável:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function updateVariableExpense(expenseId: string, data: VariableExpenseInput) {
  try {
    const validatedData = variableExpenseSchema.parse(data)

    const expense = await db.variableExpense.update({
      where: { id: expenseId },
      data: validatedData,
      include: {
        category: true,
      },
    })

    revalidatePath('/entradas')
    revalidatePath('/')

    return { success: true, expense }
  } catch (error) {
    console.error('Erro ao atualizar despesa variável:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function deleteVariableExpense(expenseId: string) {
  try {
    await db.variableExpense.delete({
      where: { id: expenseId },
    })

    revalidatePath('/entradas')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar despesa variável:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function getVariableExpensesByUser(userId: string, startDate?: Date, endDate?: Date) {
  try {
    const whereClause: {
      userId: string
      date?: {
        gte?: Date
        lte?: Date
      }
    } = { userId }

    if (startDate || endDate) {
      whereClause.date = {}
      if (startDate) whereClause.date.gte = startDate
      if (endDate) whereClause.date.lte = endDate
    }

    const expenses = await db.variableExpense.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
    })

    return { success: true, expenses }
  } catch (error) {
    console.error('Erro ao buscar despesas variáveis:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

// COMPRAS PARCELADAS
export async function createInstallmentPurchase(userId: string, data: InstallmentPurchaseInput) {
  try {
    const validatedData = installmentPurchaseSchema.parse(data)

    const installmentAmount = validatedData.totalAmount / validatedData.totalInstallments

    const purchase = await db.installmentPurchase.create({
      data: {
        ...validatedData,
        installmentAmount,
        userId,
      },
    })

    revalidatePath('/entradas')
    revalidatePath('/')

    return { success: true, purchase }
  } catch (error) {
    console.error('Erro ao criar compra parcelada:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function updateInstallmentPurchase(
  purchaseId: string,
  data: InstallmentPurchaseInput
) {
  try {
    const validatedData = installmentPurchaseSchema.parse(data)

    const installmentAmount = validatedData.totalAmount / validatedData.totalInstallments
    const isCompleted = validatedData.paidInstallments >= validatedData.totalInstallments

    const purchase = await db.installmentPurchase.update({
      where: { id: purchaseId },
      data: {
        ...validatedData,
        installmentAmount,
        isCompleted,
      },
    })

    revalidatePath('/entradas')
    revalidatePath('/')

    return { success: true, purchase }
  } catch (error) {
    console.error('Erro ao atualizar compra parcelada:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function payInstallment(purchaseId: string) {
  try {
    const purchase = await db.installmentPurchase.findUnique({
      where: { id: purchaseId },
    })

    if (!purchase) {
      return { success: false, error: 'Compra não encontrada' }
    }

    if (purchase.paidInstallments >= purchase.totalInstallments) {
      return { success: false, error: 'Todas as parcelas já foram pagas' }
    }

    const newPaidInstallments = purchase.paidInstallments + 1
    const isCompleted = newPaidInstallments >= purchase.totalInstallments

    const updatedPurchase = await db.installmentPurchase.update({
      where: { id: purchaseId },
      data: {
        paidInstallments: newPaidInstallments,
        isCompleted,
      },
    })

    revalidatePath('/entradas')
    revalidatePath('/')

    return { success: true, purchase: updatedPurchase }
  } catch (error) {
    console.error('Erro ao pagar parcela:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

export async function getInstallmentPurchasesByUser(userId: string) {
  try {
    const purchases = await db.installmentPurchase.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, purchases }
  } catch (error) {
    console.error('Erro ao buscar compras parceladas:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

// CATEGORIAS
export async function getCategories() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' },
    })

    return { success: true, categories }
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}
