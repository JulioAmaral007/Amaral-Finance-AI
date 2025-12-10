export function calculateMonthlyAmount(amount: number, frequency: string): number {
  switch (frequency) {
    case 'WEEKLY':
      return amount * 4.33
    case 'BIWEEKLY':
      return amount * 2.17
    case 'MONTHLY':
      return amount
    case 'QUARTERLY':
      return amount / 3
    case 'YEARLY':
      return amount / 12
    default:
      return amount
  }
}

export function calculateGoalProgress(currentAmount: number, targetAmount: number): number {
  if (targetAmount === 0) return 0
  return Math.min((currentAmount / targetAmount) * 100, 100)
}

export function calculateMonthsToGoal(targetDate: Date): number {
  const now = new Date()
  const diffTime = targetDate.getTime() - now.getTime()
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
  return Math.max(diffMonths, 0)
}

export function calculateRequiredMonthlySaving(
  currentAmount: number,
  targetAmount: number,
  monthsRemaining: number
): number {
  if (monthsRemaining <= 0) return 0
  return Math.max((targetAmount - currentAmount) / monthsRemaining, 0)
}

export function calculateSavingsRate(income: number, expenses: number): number {
  if (income === 0) return 0
  return ((income - expenses) / income) * 100
}

export function calculateEmergencyReserveMonths(reserve: number, monthlyExpenses: number): number {
  if (monthlyExpenses === 0) return 0
  return reserve / monthlyExpenses
}

export function calculateInvestmentGrowth(
  monthlyInvestment: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 12 / 100
  const months = years * 12

  if (monthlyRate === 0) return monthlyInvestment * months

  return monthlyInvestment * (((1 + monthlyRate) ** months - 1) / monthlyRate)
}
