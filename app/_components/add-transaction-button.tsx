'use client'

import { ArrowDownUpIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { UpsertTransactionDialog } from './upsert-transaction-dialog'

interface AddTransactionButtonProps {
  userCanAddTransaction?: boolean
}

export function AddTransactionButton({
  userCanAddTransaction,
}: AddTransactionButtonProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  userCanAddTransaction = true

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full font-bold"
              onClick={() => setDialogIsOpen(true)}
              disabled={!userCanAddTransaction}
            >
              <p className="hidden md:flex">Adicionar transação</p>
              <ArrowDownUpIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {!userCanAddTransaction &&
              'Você atingiu o limite de transações. Atualize seu plano para criar transações ilimitadas.'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <UpsertTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  )
}
