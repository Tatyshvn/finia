'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UseCreditsResult {
  balance: number | null
  loading: boolean
}

export function useCredits(): UseCreditsResult {
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchBalance() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setBalance(null)
        setLoading(false)
        return
      }
      const { data } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', user.id)
        .single()
      setBalance(data?.balance ?? null)
      setLoading(false)
    }

    fetchBalance()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setLoading(true)
      fetchBalance()
    })

    return () => subscription.unsubscribe()
  }, [])

  return { balance, loading }
}
