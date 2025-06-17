import { Button } from '@/_components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/_components/ui/card'
import { Input } from '@/_components/ui/input'
import { Label } from '@/_components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/_components/ui/select'
import type { MonthExpenses } from '@/types/expense'
import { useState } from 'react'

interface ScenarioSimulatorProps {
  months: MonthExpenses[]
  onAddScenario: (scenario: {
    name: string
    value: number
    installments: number
    startMonth: number
  }) => void
}

export function ScenarioSimulator({ months, onAddScenario }: ScenarioSimulatorProps) {
  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [installments, setInstallments] = useState('1')
  const [startMonth, setStartMonth] = useState(months[0].monthNumber.toString())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddScenario({
      name,
      value: Number(value),
      installments: Number(installments),
      startMonth: Number(startMonth),
    })
    setName('')
    setValue('')
    setInstallments('1')
    setStartMonth(months[0].monthNumber.toString())
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simular Cenário</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Cenário</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Nova TV"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Valor Total</Label>
            <Input
              id="value"
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="0,00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="installments">Número de Parcelas</Label>
            <Select value={installments} onValueChange={setInstallments}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o número de parcelas" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}x
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startMonth">Mês de Início</Label>
            <Select value={startMonth} onValueChange={setStartMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o mês de início" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month.monthNumber} value={month.monthNumber.toString()}>
                    {month.month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Simular
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
