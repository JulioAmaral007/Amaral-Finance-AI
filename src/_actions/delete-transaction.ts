'use server'

import { requireUser } from '@/_lib/auth'
import { createClient } from '@/_lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteTransaction(id: string) {
  const user = await requireUser()
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/transactions')

    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir transação:', error)
    throw new Error('Falha ao excluir transação')
  }
}
