'use client'

import { Button } from '@/_components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/_components/ui/tooltip'
import { ArrowDownUpIcon } from 'lucide-react'
import { useState } from 'react'
import { UpsertTransactionDialog } from './upsert-transaction-dialog'

interface AddTransactionButtonProps {
  userCanAddTransaction?: boolean
}

export function AddTransactionButton({ userCanAddTransaction }: AddTransactionButtonProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full font-bold"
              onClick={() => setDialogIsOpen(true)}
              disabled={userCanAddTransaction}
            >
              Adicionar transação
              <ArrowDownUpIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {userCanAddTransaction &&
              'Você atingiu o limite de transações. Atualize seu plano para criar transações ilimitadas.'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <UpsertTransactionDialog isOpen={dialogIsOpen} setIsOpen={setDialogIsOpen} />
    </>
  )
}
