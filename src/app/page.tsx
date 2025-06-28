'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ExpenseCard from '@/components/ExpenseCard'
import { Expense } from '@/types'
type RawTransaction = {
  id: number
  amount: number | string
  timestamp: string
  note: string
  category?: { name?: string }
}

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042',
  '#a4de6c', '#d0ed57', '#8dd1e1', '#83a6ed'
]

function PageContent() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('user_id')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!userId) return
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('id, amount, timestamp, note, category:categories(name)')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(20)

      if (error) {
        console.error(error)
        return
      }

      const normalized: Expense[] = (data as RawTransaction[]).map(t => ({
        id: String(t.id),
        amount: parseFloat(String(t.amount)),
        date: t.timestamp,
        category: t.category?.name || 'Неизвестно',
        note: t.note || '',
        user_id: String(userId)
      }))



      setExpenses(normalized)

      // Сумма за текущий месяц
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      const monthly = normalized.filter(e => {
        const d = new Date(e.date)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
      })
      const totalSum = monthly.reduce((sum, e) => sum + e.amount, 0)
      setTotal(totalSum)

      // Данные по категориям
      const grouped = monthly.reduce((acc: Record<string, number>, curr) => {
        if (curr.category) {
          const key = String(curr.category)
          acc[key] = (acc[key] || 0) + curr.amount
        }
        return acc
      }, {})

      const chartData = Object.entries(grouped).map(([name, value]) => ({ name, value }))
      setCategoryData(chartData)
    }

    fetchData()
  }, [userId])

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">💸 Общая сумма за месяц: {total.toFixed(2)} ₽</h1>

      {categoryData.length > 0 && (
        <div className="mb-8 h-72">
          <h2 className="text-lg font-semibold mb-2">📊 Диаграмма по категориям</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <h2 className="text-lg font-semibold mb-2">🧾 Последние траты</h2>
      {expenses.map(exp => (
        <ExpenseCard key={exp.id} expense={exp} />
      ))}

      {expenses.length === 0 && <p>Записей пока нет.</p>}

      <div className="mt-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded shadow-md">
          ➕ Добавить трату
        </button>
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <PageContent />
    </Suspense>
  )
}
