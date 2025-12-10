'use client'

import { Badge } from '@/_components/ui/badge'
import { Button } from '@/_components/ui/button'
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
  TRANSACTION_TYPE_LABELS,
} from '@/_constants/transactions'
import { formatCurrency } from '@/_lib/utils'
import type { Transaction } from '@/types/database'
import { ExternalLink, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { AddTransactionButton } from '@/app/_components/add-transaction-button'
import { UpsertTransactionDialog } from '@/app/_components/upsert-transaction-dialog'
import { DeleteTransactionDialog } from './delete-transaction-dialog'

interface TransactionsTableProps {
  transactions: Transaction[]
}

const TYPE_BADGE_STYLES = {
  DEPOSIT: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20',
  EXPENSE: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
  INVESTMENT: 'bg-white/10 text-white hover:bg-white/20',
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setEditDialogOpen(true)
  }

  const handleDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setDeleteDialogOpen(true)
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transações</h1>
        <AddTransactionButton />
      </div>

      <div className="rounded-xl border border-border/40 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40">
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Nome
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Categoria
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Método
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Valor
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr
                  key={transaction.id}
                  className="border-b border-border/40 transition-colors hover:bg-muted/30"
                >
                  <td className="px-6 py-4 text-sm font-medium">{transaction.name}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="secondary"
                      className={`font-medium ${TYPE_BADGE_STYLES[transaction.type]}`}
                    >
                      <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
                        transaction.type === 'DEPOSIT' ? 'bg-emerald-500' :
                        transaction.type === 'EXPENSE' ? 'bg-red-500' : 'bg-white'
                      }`} />
                      {TRANSACTION_TYPE_LABELS[transaction.type]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {TRANSACTION_CATEGORY_LABELS[transaction.category]}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {transaction.payment_method
                      ? TRANSACTION_PAYMENT_METHOD_LABELS[transaction.payment_method]
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => handleEdit(transaction)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-500"
                        onClick={() => handleDelete(transaction)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
          </div>
        )}
      </div>

      {selectedTransaction && (
        <>
          <UpsertTransactionDialog
            isOpen={editDialogOpen}
            setIsOpen={setEditDialogOpen}
            transactionId={selectedTransaction.id}
            defaultValues={{
              name: selectedTransaction.name,
              amount: selectedTransaction.amount,
              type: selectedTransaction.type,
              category: selectedTransaction.category,
              paymentMethod: selectedTransaction.payment_method ?? undefined,
              date: new Date(selectedTransaction.date),
            }}
          />
          <DeleteTransactionDialog
            isOpen={deleteDialogOpen}
            setIsOpen={setDeleteDialogOpen}
            transactionId={selectedTransaction.id}
            transactionName={selectedTransaction.name}
          />
        </>
      )}
    </>
  )
}
