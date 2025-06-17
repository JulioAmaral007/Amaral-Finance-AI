import { generateParcels } from '@/_lib/installment-utils'
import type { Expense, ExpenseType } from '@/types/expense'
import { useState } from 'react'

interface ExpenseFormProps {
  onSubmit: (expense: Expense) => void
  onClose: () => void
}

export function ExpenseForm({ onSubmit, onClose }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    type: 'fixo' as ExpenseType,
    parcels: '1',
    startDate: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const expense: Expense = {
      id: crypto.randomUUID(),
      name: formData.name,
      type: formData.type,
      totalValue: Number(formData.value),
      startDate: new Date(formData.startDate),
      isActive: true,
    }

    if (formData.type === 'parcelado') {
      expense.parcels = generateParcels(
        Number(formData.value),
        Number(formData.parcels),
        new Date(formData.startDate)
      )
    }

    onSubmit(expense)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Nova Despesa</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Despesa
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
              Valor Total
            </label>
            <input
              type="number"
              id="value"
              required
              min="0"
              step="0.01"
              value={formData.value}
              onChange={e => setFormData({ ...formData, value: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              id="type"
              required
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as ExpenseType })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="fixo">Fixo</option>
              <option value="variavel">Variável</option>
              <option value="parcelado">Parcelado</option>
            </select>
          </div>

          {formData.type === 'parcelado' && (
            <div>
              <label htmlFor="parcels" className="block text-sm font-medium text-gray-700 mb-1">
                Número de Parcelas
              </label>
              <input
                type="number"
                id="parcels"
                required
                min="2"
                max="48"
                value={formData.parcels}
                onChange={e => setFormData({ ...formData, parcels: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              id="startDate"
              required
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
