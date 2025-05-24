'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/_components/ui/select'
import { useRouter, useSearchParams } from 'next/navigation'

const MONTH_OPTIONS = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
]

export function TimeSelect() {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const month = searchParams.get('month')

  const handleMonthChange = (month: string) => {
    push(`/?month=${month}`)
  }

  return (
    <Select onValueChange={handleMonthChange} defaultValue={month ?? ''}>
      <SelectTrigger className="w-[180px] rounded-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SelectValue placeholder="Selecione o mês" />
      </SelectTrigger>
      <SelectContent>
        {MONTH_OPTIONS.map(option => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="cursor-pointer transition-colors hover:bg-muted"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
