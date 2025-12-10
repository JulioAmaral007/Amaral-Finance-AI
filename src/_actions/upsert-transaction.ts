'use server'

import { requireUser } from '@/_lib/auth'
import { createClient } from '@/_lib/supabase/server'
import type {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from '@/types/database'
import { revalidatePath } from 'next/cache'

interface UpsertTransactionData {
  id?: string
  name: string
  amount: number
  type: TransactionType
  category: TransactionCategory
  paymentMethod?: TransactionPaymentMethod | null
  date: Date
}

export async function upsertTransaction(data: UpsertTransactionData) {
  const user = await requireUser()
  const supabase = await createClient()

  try {
    if (data.id) {
      // Atualização
      const { data: transaction, error } = await supabase
        .from('transactions')
        .update({
          name: data.name,
          amount: data.amount,
          type: data.type,
          category: data.category,
          payment_method: data.paymentMethod,
          date: data.date.toISOString(),
        })
        .eq('id', data.id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      revalidatePath('/')
      revalidatePath('/transactions')

      return transaction
    }

    // Criação
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        name: data.name,
        amount: data.amount,
        type: data.type,
        category: data.category,
        payment_method: data.paymentMethod,
        date: data.date.toISOString(),
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/transactions')

    return transaction
  } catch (error) {
    console.error('Erro ao salvar transação:', error)
    throw new Error('Falha ao salvar transação')
  }
}
