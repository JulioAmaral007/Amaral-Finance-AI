'use client'

import { Button } from '@/_components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/_components/ui/dialog'
import { deleteTransaction } from '@/_actions/delete-transaction'
import { useRouter } from 'next/navigation'

interface DeleteTransactionDialogProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  transactionId: string
  transactionName: string
}

export function DeleteTransactionDialog({
  isOpen,
  setIsOpen,
  transactionId,
  transactionName,
}: DeleteTransactionDialogProps) {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await deleteTransaction(transactionId)
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Erro ao excluir transação:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir transação</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a transação &quot;{transactionName}&quot;? Esta ação não
            pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

