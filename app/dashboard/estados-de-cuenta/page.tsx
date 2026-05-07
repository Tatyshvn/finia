'use client'

import { useRouter } from 'next/navigation'
import { useAnalysis } from '@/lib/context/analysis'
import FileUpload from '../_components/FileUpload'
import AnalysisHistory from '../_components/AnalysisHistory'
import type { ParsedStatement } from '@/types/statements'

export default function EstadosDeCuentaPage() {
  const router = useRouter()
  const { addStatement } = useAnalysis()

  function handleAnalysisComplete(data: ParsedStatement) {
    addStatement(data)
    router.push('/dashboard')
  }

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-neutral-900">Estados de cuenta</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Sube nuevos estados de cuenta y administra los que ya analizaste. Cada análisis consume 1 crédito.
        </p>
      </div>

      <div className="shrink-0">
        <FileUpload onAnalysisComplete={handleAnalysisComplete} />
      </div>

      <AnalysisHistory />
    </div>
  )
}
