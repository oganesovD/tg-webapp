'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const params = useSearchParams()
  const userId = params.get('user_id')

  useEffect(() => {
    console.log("User ID:", userId)
  }, [userId])

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Привет, пользователь {userId}</h1>
    </main>
  )
}
