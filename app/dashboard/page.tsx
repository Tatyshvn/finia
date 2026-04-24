'use client'

import Link from 'next/link'
import { ScanText } from 'lucide-react'
import { useAnalysis } from '@/lib/context/analysis'
import StatCards from './_components/StatCards'
import RecentTransactions from './_components/RecentTransactions'

export default function Dashboard() {
  const { statement, loading } = useAnalysis()

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-8 w-56 rounded-xl bg-neutral-200" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-neutral-200" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-neutral-200" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Resumen</h1>
        {statement && (
          <span className="text-xs text-neutral-400">
            {statement.resumen.banco} · {statement.resumen.periodo_inicio} — {statement.resumen.periodo_fin}
          </span>
        )}
      </div>

      {!statement ? (
        <EmptyState />
      ) : (
        <>
          <StatCards
            resumen={statement.resumen}
            count={statement.transacciones.length}
          />
          <RecentTransactions transactions={statement.transacciones} />
        </>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white p-16 shadow-sm text-center">
      <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center">
        <ScanText size={28} className="text-violet-600" />
      </div>
      <div>
        <p className="text-base font-semibold text-neutral-900">Aún no tienes análisis</p>
        <p className="text-sm text-neutral-400 mt-1 max-w-xs">
          Sube tu primer estado de cuenta y Finia hará el resto
        </p>
      </div>
      <Link
        href="/dashboard/analizar"
        className="px-5 py-2.5 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 transition-colors"
      >
        Analizar estado de cuenta
      </Link>
    </div>
  )
}
