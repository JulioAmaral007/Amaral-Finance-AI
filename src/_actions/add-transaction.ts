'use server'

import { db } from '@/_lib/prisma'
import { TransactionCategory, TransactionPaymentMethod, TransactionType } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const addTransactionSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number().positive(),
  type: z.nativeEnum(TransactionType),
  category: z.nativeEnum(TransactionCategory),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod),
  date: z.date(),
})

interface AddTransactionParams {
  name: string
  amount: number
  type: TransactionType
  category: TransactionCategory
  paymentMethod: TransactionPaymentMethod
  date: Date
}

export const addTransaction = async (params: AddTransactionParams) => {
  addTransactionSchema.parse(params)
  // const { userId } = await auth()
  // if (!userId) {
  //   throw new Error('Unauthorized')
  // }
  await db.transaction.create({
    data: { ...params, userId: '1' },
  })
  revalidatePath('/transactions')
}
