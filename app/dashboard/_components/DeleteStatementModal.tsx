'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
  bankName: string
  totalTransactions: number
  periodLabel: string
}

export default function DeleteStatementModal({
  open,
  onClose,
  onConfirm,
  loading,
  bankName,
  totalTransactions,
  periodLabel,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !loading) onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose, loading])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === overlayRef.current && !loading) onClose() }}
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle size={16} className="text-red-500" />
            </div>
            <p className="text-sm font-bold text-neutral-900">Eliminar estado de cuenta</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-4">
          <p className="text-sm text-neutral-600 leading-relaxed">
            Esta acción es permanente. Se eliminarán todas las transacciones asociadas a este estado de cuenta y los totales de tu dashboard se recalcularán.
          </p>

          <div className="rounded-xl bg-neutral-50 border border-neutral-100 px-4 py-3 flex flex-col gap-1">
            <p className="text-sm font-semibold text-neutral-900">{bankName}</p>
            <p className="text-xs text-neutral-400">{periodLabel}</p>
            <p className="text-xs text-neutral-400">
              {totalTransactions} transacción{totalTransactions === 1 ? '' : 'es'}
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
