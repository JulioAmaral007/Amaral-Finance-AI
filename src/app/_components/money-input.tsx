'use client'

import { Input } from '@/_components/ui/input'
import { forwardRef } from 'react'
import type { NumericFormatProps } from 'react-number-format'
import { NumericFormat } from 'react-number-format'

interface MoneyInputProps
  extends Omit<NumericFormatProps<React.InputHTMLAttributes<HTMLInputElement>>, 'onValueChange'> {
  onValueChange?: (value: { floatValue: number | undefined }) => void
}

/**
 * Componente de input para valores monetários em Reais (R$)
 *
 * @example
 * ```tsx
 * <MoneyInput
 *   value={1000}
 *   onValueChange={(value) => console.log(value)}
 *   placeholder="R$ 0,00"
 * />
 * ```
 */
export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ onValueChange, ...props }, ref) => {
    return (
      <NumericFormat
        {...props}
        thousandSeparator="."
        decimalSeparator=","
        prefix="R$ "
        allowNegative={false}
        decimalScale={2}
        fixedDecimalScale
        customInput={Input}
        getInputRef={ref}
        onValueChange={onValueChange}
      />
    )
  }
)

MoneyInput.displayName = 'MoneyInput'
