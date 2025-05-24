import { CardContent, CardHeader, CardTitle } from '@/_components/ui/card'
import { Progress } from '@/_components/ui/progress'
import { ScrollArea } from '@/_components/ui/scroll-area'
import { TRANSACTION_CATEGORY_LABELS } from '@/_constants/transactions'
import type { TotalExpensePerCategory } from '@/_data/get-dashboard'

interface ExpensesPerCategoryProps {
  expensesPerCategory: TotalExpensePerCategory[]
}

export default function ExpensesPerCategory({ expensesPerCategory }: ExpensesPerCategoryProps) {
  return (
    <ScrollArea className="col-span-2 h-full rounded-lg border border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="border-b border-border/40 px-6 py-4">
        <CardTitle className="text-lg font-semibold tracking-tight">Gastos por Categoria</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {expensesPerCategory.map(category => (
          <div key={category.category} className="space-y-2.5">
            <div className="flex w-full items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                {TRANSACTION_CATEGORY_LABELS[category.category]}
              </p>
              <p className="text-sm font-semibold text-muted-foreground">
                {category.percentageOfTotal}%
              </p>
            </div>
            <Progress
              value={category.percentageOfTotal}
              className="h-2 transition-all hover:opacity-90"
            />
          </div>
        ))}
      </CardContent>
    </ScrollArea>
  )
}
