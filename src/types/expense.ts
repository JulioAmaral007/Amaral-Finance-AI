export type ExpenseType = 'fixo' | 'variavel' | 'parcelado'

export interface Parcel {
  number: number
  totalParcels: number
  value: number
  dueDate: Date
}

export interface Expense {
  id: string
  name: string
  type: ExpenseType
  totalValue: number
  startDate: Date
  parcels?: Parcel[]
  isActive: boolean
  isSalary?: boolean
}

export interface MonthExpenses {
  month: string
  monthNumber: number
  fixedExpenses: number
  activeParcels: number
  totalProjected: number
  salary: number
  expenses: Expense[]
  percentages: {
    bills: number
    investment: number
    savings: number
  }
}
