export interface Expense {
  id: string
  user_id: string
  amount: number
  date: string
  category?: string
  shop?: string
  comment?: string
  source?: string
}