import { formatCurrency } from '@/_lib/installment-utils'
import type { Expense } from '@/types/expense'

interface ExpenseDetailProps {
  expenses: Expense[]
  onClose: () => void
}

export function ExpenseDetail({ expenses, onClose }: ExpenseDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Detalhes do Mês</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhuma despesa registrada para este mês
            </p>
          ) : (
            <div className="space-y-4">
              {expenses.map(expense => (
                <div key={expense.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">{expense.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {expense.type}
                        {expense.parcels &&
                          ` • ${expense.parcels[0].number}/${expense.parcels[0].totalParcels}`}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(expense.totalValue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
