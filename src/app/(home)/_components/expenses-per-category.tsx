import { CardContent, CardHeader, CardTitle } from '@/_components/ui/card'
import { Progress } from '@/_components/ui/progress'
import { ScrollArea } from '@/_components/ui/scroll-area'
import { TRANSACTION_CATEGORY_LABELS } from '@/_constants/transactions'
import { formatCurrency } from '@/_lib/utils'
import type { TotalExpensePerCategory } from '@/_data/get-dashboard'

interface ExpensesPerCategoryProps {
  expensesPerCategory: TotalExpensePerCategory[]
}

export function ExpensesPerCategory({ expensesPerCategory }: ExpensesPerCategoryProps) {
  return (
    <ScrollArea className="h-full rounded-xl border border-border/40 bg-card">
      <CardHeader className="border-b border-border/40 px-6 py-4">
        <CardTitle className="text-lg font-semibold">Gastos por categoria</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 p-6">
        {expensesPerCategory.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Nenhum gasto registrado neste mês.
          </p>
        ) : (
          expensesPerCategory.map(category => (
            <div key={category.category} className="space-y-2">
              <div className="flex w-full items-center justify-between">
                <p className="text-sm font-medium">
                  {TRANSACTION_CATEGORY_LABELS[category.category]}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  {category.percentageOfTotal}%
                </p>
              </div>
              <Progress
                value={category.percentageOfTotal}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {formatCurrency(category.totalAmount)}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </ScrollArea>
  )
}
