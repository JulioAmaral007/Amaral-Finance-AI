'use client'

import { addTransaction } from '@/_actions/add-transaction'
import { Button } from '@/_components/ui/button'
import { DatePicker } from '@/_components/ui/date-picker'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form'
import { Input } from '@/_components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/_components/ui/select'
import {
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from '@/_constants/transactions'
import { zodResolver } from '@hookform/resolvers/zod'
import { TransactionCategory, TransactionPaymentMethod, TransactionType } from '@prisma/client'
import { ArrowDownUpIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { MoneyInput } from './money-input'

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: 'O nome é obrigatório.',
  }),
  amount: z
    .number({
      required_error: 'O valor é obrigatório.',
    })
    .positive({
      message: 'O valor deve ser positivo.',
    }),
  type: z.nativeEnum(TransactionType, {
    required_error: 'O tipo é obrigatório.',
  }),
  category: z.nativeEnum(TransactionCategory, {
    required_error: 'A categoria é obrigatória.',
  }),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod, {
    required_error: 'O método de pagamento é obrigatório.',
  }),
  date: z.date({
    required_error: 'A data é obrigatória.',
  }),
})

type FormSchema = z.infer<typeof formSchema>

export default function AddTransactionButton() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 50,
      category: TransactionCategory.OTHER,
      date: new Date(),
      name: '',
      paymentMethod: TransactionPaymentMethod.CASH,
      type: TransactionType.EXPENSE,
    },
  })
  const onSubmit = async (data: FormSchema) => {
    try {
      await addTransaction(data)
      setDialogIsOpen(false)
      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog
      open={dialogIsOpen}
      onOpenChange={open => {
        setDialogIsOpen(open)
        if (!open) {
          form.reset()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="rounded-full bg-primary font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md">
          Adicionar transação
          <ArrowDownUpIcon className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Adicionar transação
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Insira as informações abaixo
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o nome..."
                      {...field}
                      className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Valor</FormLabel>
                  <FormControl>
                    <MoneyInput
                      placeholder="Digite o valor..."
                      value={field.value}
                      onValueChange={value => field.onChange(value)}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <SelectValue placeholder="Selecione o tipo..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRANSACTION_TYPE_OPTIONS.map(option => (
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
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <SelectValue placeholder="Selecione a categoria..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRANSACTION_CATEGORY_OPTIONS.map(option => (
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
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Método de pagamento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <SelectValue placeholder="Selecione um método de pagamento..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRANSACTION_PAYMENT_METHOD_OPTIONS.map(option => (
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
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Data</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} />
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" className="w-full sm:w-auto">
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
