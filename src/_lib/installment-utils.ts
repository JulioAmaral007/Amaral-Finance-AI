import type { Parcel } from '@/types/expense'

export function generateParcels(
  totalValue: number,
  numberOfParcels: number,
  startDate: Date
): Parcel[] {
  const parcels: Parcel[] = []
  const parcelValue = totalValue / numberOfParcels

  for (let i = 0; i < numberOfParcels; i++) {
    const dueDate = new Date(startDate)
    dueDate.setMonth(dueDate.getMonth() + i)

    parcels.push({
      number: i + 1,
      totalParcels: numberOfParcels,
      value: parcelValue,
      dueDate,
    })
  }

  return parcels
}

export function getMonthName(date: Date): string {
  return date.toLocaleString('pt-BR', { month: 'long' })
}

export function getMonthNumber(date: Date): number {
  return date.getMonth()
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
