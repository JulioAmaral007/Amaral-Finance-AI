'use client'

import { Button } from '@/_components/ui/button'
import { Calendar } from '@/_components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/_components/ui/popover'
import { cn } from '@/_lib/utils'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP') : <span>Selecione uma data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
