"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import ExpenseCard from "@/components/ExpenseCard"
import { Expense } from "@/types"

export default function Page() {
  const params = useSearchParams()
  const userId = params.get("user_id")
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    if (!userId) return

    supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .then(({ data }) => {
        if (data) setExpenses(data)
      })
  }, [userId])

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Мои траты</h1>
      {expenses.map((e) => <ExpenseCard key={e.id} expense={e} />)}
    </main>
  )
}
