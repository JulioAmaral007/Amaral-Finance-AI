import { Button } from '@/_components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog'
import { Input } from '@/_components/ui/input'
import { Label } from '@/_components/ui/label'
import { useState } from 'react'

interface PercentageEditorProps {
  month: string
  percentages: {
    bills: number
    investment: number
    savings: number
  }
  onSave: (percentages: { bills: number; investment: number; savings: number }) => void
}

export function PercentageEditor({ month, percentages, onSave }: PercentageEditorProps) {
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState(percentages)
  const [total, setTotal] = useState(
    percentages.bills + percentages.investment + percentages.savings
  )

  const handleSave = () => {
    if (total === 100) {
      onSave(values)
      setOpen(false)
    }
  }

  const adjustValues = (field: keyof typeof values, newValue: number) => {
    const oldValue = values[field]
    const difference = newValue - oldValue
    const otherFields = Object.keys(values).filter(key => key !== field) as Array<
      keyof typeof values
    >

    // Calcula a proporção dos outros campos
    const otherTotal = otherFields.reduce((sum, key) => sum + values[key], 0)
    const newValues = { ...values }

    if (otherTotal > 0) {
      // Ajusta proporcionalmente os outros campos
      otherFields.forEach(key => {
        const proportion = values[key] / otherTotal
        newValues[key] = Math.max(0, Math.min(100, values[key] - difference * proportion))
      })
    } else {
      // Se não houver outros valores, distribui igualmente
      const adjustment = difference / otherFields.length
      otherFields.forEach(key => {
        newValues[key] = Math.max(0, Math.min(100, values[key] - adjustment))
      })
    }

    newValues[field] = newValue
    setValues(newValues)
    setTotal(Object.values(newValues).reduce((sum, val) => sum + val, 0))
  }

  const handleChange = (field: keyof typeof values, value: string) => {
    const numValue = Number(value)
    if (!Number.isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      adjustValues(field, numValue)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          Editar Percentuais
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Percentuais - {month}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="bills">Contas (%)</Label>
            <Input
              id="bills"
              type="number"
              min="0"
              max="100"
              value={values.bills}
              onChange={e => handleChange('bills', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="investment">Investimento (%)</Label>
            <Input
              id="investment"
              type="number"
              min="0"
              max="100"
              value={values.investment}
              onChange={e => handleChange('investment', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="savings">Reserva (%)</Label>
            <Input
              id="savings"
              type="number"
              min="0"
              max="100"
              value={values.savings}
              onChange={e => handleChange('savings', e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total:</span>
            <span className={total === 100 ? 'text-green-500' : 'text-red-500'}>
              {total.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={total !== 100}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
