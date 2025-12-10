import { z } from 'zod'

// Schema para usuário
export const userUpdateSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  monthlyIncome: z.number().min(0, 'Renda deve ser positiva'),
  emergencyReserve: z.number().min(0, 'Reserva deve ser positiva'),
  emergencyGoal: z.number().min(0, 'Meta deve ser positiva'),
  expenseAlerts: z.boolean().default(true),
  goalReminders: z.boolean().default(true),
  aiSuggestions: z.boolean().default(true),
  monthlyReports: z.boolean().default(false),
  theme: z.enum(['LIGHT', 'DARK', 'SYSTEM']).default('SYSTEM'),
  currency: z.string().default('BRL'),
  animationsEnabled: z.boolean().default(true),
})

// Schema para renda
export const incomeSchema = z.object({
  type: z.enum(['FIXED', 'VARIABLE']),
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  frequency: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']),
  description: z.string().optional(),
})

// Schema para despesa fixa
export const fixedExpenseSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  frequency: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']).default('MONTHLY'),
  description: z.string().optional(),
  dueDay: z.number().min(1).max(31).optional(),
})

// Schema para despesa variável
export const variableExpenseSchema = z.object({
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  description: z.string().optional(),
  date: z.date(),
})

// Schema para compra parcelada
export const installmentPurchaseSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  totalAmount: z.number().min(0.01, 'Valor total deve ser maior que zero'),
  totalInstallments: z.number().min(1, 'Deve ter pelo menos 1 parcela'),
  paidInstallments: z.number().min(0).default(0),
  startDate: z.date(),
})

// Schema para investimento
export const investmentSchema = z.object({
  type: z.enum(['FIXED_INCOME', 'VARIABLE_INCOME', 'EMERGENCY_RESERVE', 'REAL_ESTATE', 'CRYPTO']),
  name: z.string().min(1, 'Nome é obrigatório'),
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  platform: z.string().optional(),
  purchaseDate: z.date(),
  currentValue: z.number().min(0).optional(),
})

// Schema para meta
export const goalSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  targetAmount: z.number().min(0.01, 'Valor meta deve ser maior que zero'),
  currentAmount: z.number().min(0).default(0),
  targetDate: z.date(),
  category: z.enum(['TRAVEL', 'CAR', 'HOUSE', 'EDUCATION', 'EMERGENCY', 'RETIREMENT', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
})

// Schema para categoria
export const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato hexadecimal'),
  icon: z.string().default('DollarSign'),
})

// Schema para simulação da IA
export const aiSimulationSchema = z.object({
  monthlyIncome: z.number().min(0, 'Renda deve ser positiva'),
  monthlyExpenses: z.number().min(0, 'Gastos devem ser positivos'),
  monthlyInvestment: z.number().min(0, 'Investimento deve ser positivo'),
  emergencyGoal: z.number().min(0, 'Meta de reserva deve ser positiva'),
  currentEmergencyReserve: z.number().min(0, 'Reserva atual deve ser positiva'),
})

export type UserUpdate = z.infer<typeof userUpdateSchema>
export type IncomeInput = z.infer<typeof incomeSchema>
export type FixedExpenseInput = z.infer<typeof fixedExpenseSchema>
export type VariableExpenseInput = z.infer<typeof variableExpenseSchema>
export type InstallmentPurchaseInput = z.infer<typeof installmentPurchaseSchema>
export type InvestmentInput = z.infer<typeof investmentSchema>
export type GoalInput = z.infer<typeof goalSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type AISimulationInput = z.infer<typeof aiSimulationSchema>
