import { TransactionCategory, TransactionType } from '@prisma/client'

export const TRANSACTION_CATEGORY_LABELS = {
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

export const TRANSACTION_TYPE_OPTIONS = [
  {
    value: TransactionType.EXPENSE,
    label: 'Despesa',
  },
  {
    value: TransactionType.DEPOSIT,
    label: 'Depósito',
  },
  {
    value: TransactionType.INVESTMENT,
    label: 'Investimento',
  },
]

export const TRANSACTION_CATEGORY_OPTIONS = [
  {
    value: TransactionCategory.EDUCATION,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.EDUCATION],
  },
  {
    value: TransactionCategory.ENTERTAINMENT,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.ENTERTAINMENT],
  },
  {
    value: TransactionCategory.FOOD,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.FOOD],
  },
  {
    value: TransactionCategory.HEALTH,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.HEALTH],
  },
  {
    value: TransactionCategory.HOUSING,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.HOUSING],
  },
  {
    value: TransactionCategory.OTHER,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.OTHER],
  },
  {
    value: TransactionCategory.SALARY,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.SALARY],
  },
  {
    value: TransactionCategory.TRANSPORTATION,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.TRANSPORTATION],
  },
  {
    value: TransactionCategory.UTILITY,
    label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.UTILITY],
  },
]
