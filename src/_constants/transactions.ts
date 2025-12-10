import type {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from '@/types/database'

export const TRANSACTION_CATEGORY_LABELS: Record<TransactionCategory, string> = {
  EDUCATION: 'Educação',
  ENTERTAINMENT: 'Entretenimento',
  FOOD: 'Alimentação',
  HEALTH: 'Saúde',
  HOUSING: 'Moradia',
  OTHER: 'Outros',
  SALARY: 'Salário',
  TRANSPORTATION: 'Transporte',
  UTILITY: 'Utilidades',
}

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  DEPOSIT: 'Ganho',
  EXPENSE: 'Gasto',
  INVESTMENT: 'Investimento',
}

export const TRANSACTION_PAYMENT_METHOD_LABELS: Record<TransactionPaymentMethod, string> = {
  CREDIT_CARD: 'Cartão',
  DEBIT_CARD: 'Débito',
  BANK_TRANSFER: 'Transferência',
  BANK_SLIP: 'Boleto',
  CASH: 'Dinheiro',
  PIX: 'Pix',
  OTHER: 'Outro',
}

export const TRANSACTION_TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  {
    value: 'DEPOSIT',
    label: 'Ganho',
  },
  {
    value: 'EXPENSE',
    label: 'Gasto',
  },
  {
    value: 'INVESTMENT',
    label: 'Investimento',
  },
]

export const TRANSACTION_PAYMENT_METHOD_OPTIONS: { value: TransactionPaymentMethod; label: string }[] = [
  {
    value: 'PIX',
    label: 'Pix',
  },
  {
    value: 'CREDIT_CARD',
    label: 'Cartão',
  },
  {
    value: 'DEBIT_CARD',
    label: 'Débito',
  },
  {
    value: 'BANK_TRANSFER',
    label: 'Transferência',
  },
  {
    value: 'BANK_SLIP',
    label: 'Boleto',
  },
  {
    value: 'CASH',
    label: 'Dinheiro',
  },
  {
    value: 'OTHER',
    label: 'Outro',
  },
]

export const TRANSACTION_CATEGORY_OPTIONS: { value: TransactionCategory; label: string }[] = [
  {
    value: 'HOUSING',
    label: TRANSACTION_CATEGORY_LABELS.HOUSING,
  },
  {
    value: 'TRANSPORTATION',
    label: TRANSACTION_CATEGORY_LABELS.TRANSPORTATION,
  },
  {
    value: 'FOOD',
    label: TRANSACTION_CATEGORY_LABELS.FOOD,
  },
  {
    value: 'ENTERTAINMENT',
    label: TRANSACTION_CATEGORY_LABELS.ENTERTAINMENT,
  },
  {
    value: 'HEALTH',
    label: TRANSACTION_CATEGORY_LABELS.HEALTH,
  },
  {
    value: 'EDUCATION',
    label: TRANSACTION_CATEGORY_LABELS.EDUCATION,
  },
  {
    value: 'SALARY',
    label: TRANSACTION_CATEGORY_LABELS.SALARY,
  },
  {
    value: 'UTILITY',
    label: TRANSACTION_CATEGORY_LABELS.UTILITY,
  },
  {
    value: 'OTHER',
    label: TRANSACTION_CATEGORY_LABELS.OTHER,
  },
]
