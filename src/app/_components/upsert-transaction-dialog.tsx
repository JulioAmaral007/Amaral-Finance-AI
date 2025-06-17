import { upsertTransaction } from '@/_actions/upsert-transaction'
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
import { TRANSACTION_CATEGORY_OPTIONS, TRANSACTION_TYPE_OPTIONS } from '@/_constants/transactions'
import { zodResolver } from '@hookform/resolvers/zod'
import { TransactionCategory, TransactionType } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { MoneyInput } from './money-input'

interface UpsertTransactionDialogProps {
  isOpen: boolean
  defaultValues?: FormSchema
  transactionId?: string
  setIsOpen: (isOpen: boolean) => void
}

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
  date: z.date({
    required_error: 'A data é obrigatória.',
  }),
})

type FormSchema = z.infer<typeof formSchema>

export function UpsertTransactionDialog({
  isOpen,
  defaultValues,
  transactionId,
  setIsOpen,
}: UpsertTransactionDialogProps) {
  const router = useRouter()
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          date: defaultValues.date ? new Date(defaultValues.date) : new Date(),
        }
      : {
          amount: 50,
          category: TransactionCategory.OTHER,
          date: new Date(),
          name: '',
          type: TransactionType.EXPENSE,
        },
  })

  const onSubmit = async (data: FormSchema) => {
    try {
      await upsertTransaction({ ...data, id: transactionId })

      setIsOpen(false)
      form.reset()

      router.refresh()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Erro ao salvar transação:', error)
    }
  }

  const isUpdate = Boolean(transactionId)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        setIsOpen(open)
        if (!open) {
          form.reset()
        }
      }}
    >
      <DialogTrigger asChild />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Atualizar' : 'Criar'} transação</DialogTitle>
          <DialogDescription>Insira as informações abaixo</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <MoneyInput
                      placeholder="Digite o valor..."
                      value={field.value}
                      onValueChange={({ floatValue }) => field.onChange(floatValue ?? 0)}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRANSACTION_TYPE_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRANSACTION_CATEGORY_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">{isUpdate ? 'Atualizar' : 'Adicionar'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
