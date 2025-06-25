import { Expense } from '@/types'

export default function ExpenseCard({ expense }: { expense: Expense }) {
  return (
    <div className="p-4 border rounded-xl shadow-sm mb-4">
      <div className="text-lg font-semibold">{expense.amount} ₽</div>
      <div className="text-sm text-gray-600">{expense.category} / {expense.shop}</div>
      <div className="text-xs text-gray-400">{new Date(expense.date).toLocaleDateString()}</div>
    </div>
  )
}