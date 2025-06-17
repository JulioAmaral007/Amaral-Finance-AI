'use server'

import { db } from '@/_lib/prisma'
import type { TransactionCategory, TransactionType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

interface UpsertTransactionData {
  id?: string
  name: string
  amount: number
  type: TransactionType
  category: TransactionCategory
  date: Date
  isFixed?: boolean
  isInstallment?: boolean
  currentInstallment?: number
  totalInstallments?: number
  isSalary?: boolean
}

export async function upsertTransaction(data: UpsertTransactionData) {
  try {
    console.log('Dados recebidos:', data)
    console.log('Data da transação:', data.date)

    if (data.id) {
      // Atualização
      const transaction = await db.transaction.update({
        where: {
          id: data.id,
        },
        data: {
          name: data.name,
          amount: data.amount,
          type: data.type,
          category: data.category,
          date: data.date,
          isFixed: data.isFixed ?? false,
          isInstallment: data.isInstallment ?? false,
          currentInstallment: data.currentInstallment,
          totalInstallments: data.totalInstallments,
        },
      })
      console.log('Transação atualizada:', transaction)
      console.log('Data da transação atualizada:', transaction.date)

      // Forçar atualização da página
      revalidatePath('/')
      revalidatePath('/planning')

      return {
        ...transaction,
        amount: Number(transaction.amount),
      }
    }

    // Criação
    const transaction = await db.transaction.create({
      data: {
        name: data.name,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date,
        isFixed: data.isFixed ?? false,
        isInstallment: data.isInstallment ?? false,
        currentInstallment: data.currentInstallment,
        totalInstallments: data.totalInstallments,
        userId: '1', // TODO: Implementar autenticação
      },
    })
    console.log('Transação criada:', transaction)
    console.log('Data da transação criada:', transaction.date)

    // Forçar atualização da página
    revalidatePath('/')
    revalidatePath('/planning')

    return {
      ...transaction,
      amount: Number(transaction.amount),
    }
  } catch (error) {
    console.error('Erro ao salvar transação:', error)
    throw new Error('Falha ao salvar transação')
  }
}
