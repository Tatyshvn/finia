'use client'

import { useState } from 'react'
import FileUpload from './_components/FileUpload'
import StatCards from './_components/StatCards'
import DataTable from './_components/DataTable'
import type { ParsedStatement } from '@/types/statements'

export default function Dashboard() {
  const [statement, setStatement] = useState<ParsedStatement | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Análisis de gastos</h1>
      <FileUpload onAnalysisComplete={setStatement} />
      <StatCards resumen={statement?.resumen ?? null} count={statement?.transacciones.length ?? 0} />
      <DataTable transactions={statement?.transacciones ?? []} />
    </div>
  )
}
