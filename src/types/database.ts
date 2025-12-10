export type TransactionType = 'DEPOSIT' | 'EXPENSE' | 'INVESTMENT'

export type TransactionCategory =
  | 'HOUSING'
  | 'TRANSPORTATION'
  | 'FOOD'
  | 'ENTERTAINMENT'
  | 'HEALTH'
  | 'UTILITY'
  | 'SALARY'
  | 'EDUCATION'
  | 'OTHER'

export type TransactionPaymentMethod =
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'BANK_TRANSFER'
  | 'BANK_SLIP'
  | 'CASH'
  | 'PIX'
  | 'OTHER'

export interface Transaction {
  id: string
  name: string
  type: TransactionType
  amount: number
  category: TransactionCategory
  payment_method: TransactionPaymentMethod | null
  date: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface TransactionInsert {
  name: string
  type: TransactionType
  amount: number
  category: TransactionCategory
  payment_method?: TransactionPaymentMethod | null
  date: string
  user_id: string
}

export interface TransactionUpdate {
  name?: string
  type?: TransactionType
  amount?: number
  category?: TransactionCategory
  payment_method?: TransactionPaymentMethod | null
  date?: string
}

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: Transaction
        Insert: TransactionInsert
        Update: TransactionUpdate
      }
    }
  }
}

