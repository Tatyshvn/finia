'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ParsedStatement, StatementSummary, Transaction } from '@/types/statements'

interface AnalysisContextValue {
  statement: ParsedStatement | null
  setStatement: (s: ParsedStatement | null) => void
  loading: boolean
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null)

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [statement, setStatement] = useState<ParsedStatement | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLatest() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('analyses')
        .select('resumen, transacciones, advertencias')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (data && data.length > 0) {
        const row = data[0]
        setStatement({
          resumen: row.resumen as unknown as StatementSummary,
          transacciones: row.transacciones as unknown as Transaction[],
          advertencias: (row.advertencias ?? []) as unknown as string[],
        })
      }
      setLoading(false)
    }
    loadLatest()
  }, [])

  return (
    <AnalysisContext.Provider value={{ statement, setStatement, loading }}>
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis(): AnalysisContextValue {
  const ctx = useContext(AnalysisContext)
  if (!ctx) throw new Error('useAnalysis must be used inside AnalysisProvider')
  return ctx
}
