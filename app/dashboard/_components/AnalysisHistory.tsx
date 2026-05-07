'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { ChevronDown, ChevronUp, Trash2, FileText, Building2, CalendarRange, Receipt } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAnalysis } from '@/lib/context/analysis'
import { CATEGORIES, getCategoryMeta } from '@/lib/categories'
import type { Category, StatementSummary, Transaction } from '@/types/statements'
import DeleteStatementModal from './DeleteStatementModal'

interface AnalysisRow {
  id: string
  created_at: string
  filename: string
  resumen: StatementSummary
  transacciones: Transaction[]
}

const CATEGORY_OPTIONS: Category[] = [
  'alimentacion', 'transporte', 'entretenimiento', 'salud', 'educacion',
  'servicios', 'vestimenta', 'hogar', 'viajes', 'nomina', 'transferencia',
  'inversiones', 'impuestos', 'seguros', 'comisiones', 'otros',
]

function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatPeriod(s: StatementSummary | undefined): string {
  if (!s) return '—'
  const inicio = formatDate(s.periodo_inicio)
  const fin = formatDate(s.periodo_fin)
  return `${inicio} — ${fin}`
}

function formatMoney(value: number, currency: string = 'MXN'): string {
  return value.toLocaleString('es-MX', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  })
}

export default function AnalysisHistory() {
  const { refresh } = useAnalysis()
  const [rows, setRows] = useState<AnalysisRow[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AnalysisRow | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setRows([])
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('analyses')
      .select('id, created_at, filename, resumen, transacciones')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setRows((data ?? []) as unknown as AnalysisRow[])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/statements/${pendingDelete.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar')
      setPendingDelete(null)
      if (expandedId === pendingDelete.id) setExpandedId(null)
      await load()
      await refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-lg font-semibold text-neutral-900">Historial de análisis</h2>
        <p className="text-xs text-neutral-400">{rows.length} estado{rows.length === 1 ? '' : 's'} de cuenta</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3 animate-pulse flex-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-neutral-100" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 text-center flex-1">
          <FileText size={28} className="text-neutral-300" />
          <p className="text-sm text-neutral-400">Aún no tienes estados de cuenta cargados</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1 -mr-1 min-h-0">
          {rows.map((row) => (
            <AnalysisCard
              key={row.id}
              row={row}
              expanded={expandedId === row.id}
              onToggle={() => setExpandedId(prev => prev === row.id ? null : row.id)}
              onAskDelete={() => setPendingDelete(row)}
              onCategoryUpdated={(index, categoria) => {
                setRows(prev => prev.map(r =>
                  r.id === row.id
                    ? { ...r, transacciones: r.transacciones.map((tx, i) => i === index ? { ...tx, categoria, confianza: 1 } : tx) }
                    : r
                ))
                refresh()
              }}
            />
          ))}
        </div>
      )}

      <DeleteStatementModal
        open={!!pendingDelete}
        onClose={() => { if (!deleting) setPendingDelete(null) }}
        onConfirm={handleDelete}
        loading={deleting}
        bankName={pendingDelete?.resumen?.banco ?? '—'}
        totalTransactions={pendingDelete?.transacciones?.length ?? 0}
        periodLabel={formatPeriod(pendingDelete?.resumen)}
      />
    </section>
  )
}

interface CardProps {
  row: AnalysisRow
  expanded: boolean
  onToggle: () => void
  onAskDelete: () => void
  onCategoryUpdated: (index: number, categoria: Category) => void
}

function AnalysisCard({ row, expanded, onToggle, onAskDelete, onCategoryUpdated }: CardProps) {
  const total = row.transacciones?.length ?? 0
  const banco = row.resumen?.banco?.trim() || '—'

  return (
    <div className="rounded-xl border border-violet-300 transition-all hover:shadow-lg hover:shadow-violet-200/60 hover:border-violet-400">
      <div className="flex items-center gap-4 p-4">
        <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
          <Building2 size={25} className="text-violet-700" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-base font-semibold text-neutral-900 truncate">{banco}</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-sm font-medium">
              <Receipt size={12} />
              {total} transacción{total === 1 ? '' : 'es'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-neutral-500">
            <CalendarRange size={12} />
            <span>{formatPeriod(row.resumen)}</span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5 truncate">
            {row.filename} · cargado {formatDate(row.created_at)}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggle}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-violet-700 hover:bg-violet-50 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp size={14} />
                Ocultar
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Ver transacciones
              </>
            )}
          </button>
          <button
            onClick={onAskDelete}
            aria-label="Eliminar estado de cuenta"
            className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-neutral-100">
          <TransactionList
            statementId={row.id}
            transactions={row.transacciones ?? []}
            currency={row.resumen?.moneda ?? 'MXN'}
            onCategoryUpdated={onCategoryUpdated}
          />
        </div>
      )}
    </div>
  )
}

interface TxListProps {
  statementId: string
  transactions: Transaction[]
  currency: string
  onCategoryUpdated: (index: number, categoria: Category) => void
}

function TransactionList({ statementId, transactions, currency, onCategoryUpdated }: TxListProps) {
  const [savingIndex, setSavingIndex] = useState<number | null>(null)
  const [errorIndex, setErrorIndex] = useState<number | null>(null)

  const ordered = useMemo(() => {
    return transactions
      .map((tx, originalIndex) => ({ tx, originalIndex }))
      .sort((a, b) => b.tx.fecha.localeCompare(a.tx.fecha))
  }, [transactions])

  if (transactions.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-sm text-neutral-400">
        Sin transacciones en este estado de cuenta
      </p>
    )
  }

  const handleChange = async (index: number, next: Category) => {
    setSavingIndex(index)
    setErrorIndex(null)
    try {
      const res = await fetch(`/api/statements/${statementId}/transaction`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index, categoria: next }),
      })
      if (!res.ok) throw new Error('patch failed')
      onCategoryUpdated(index, next)
    } catch {
      setErrorIndex(index)
    } finally {
      setSavingIndex(null)
    }
  }

  return (
    <div className="min-h-1 overflow-y-auto divide-y divide-neutral-100">
      {ordered.map(({ tx, originalIndex }) => {
        const meta = getCategoryMeta(tx.categoria)
        const isSaving = savingIndex === originalIndex
        const hasError = errorIndex === originalIndex
        const isIncome = tx.tipo === 'abono' || tx.tipo === 'deposito' || tx.tipo === 'transferencia_recibida' || tx.tipo === 'interes'

        return (
          <div key={`${statementId}-${originalIndex}`} className="grid grid-cols-12 gap-3 items-center px-4 py-3">
            <div className="col-span-2 text-xs text-neutral-500">
              {formatDate(tx.fecha)}
            </div>
            <div className="col-span-5 min-w-0">
              <p className="text-sm text-neutral-900 truncate">{tx.descripcion}</p>
              {tx.comercio && (
                <p className="text-xs text-neutral-400 truncate">{tx.comercio}</p>
              )}
            </div>
            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-md text-xl ${meta.badgeClasses}`}
                  aria-hidden
                >
                  {meta.emoji}
                </span>
                <select
                  value={tx.categoria}
                  disabled={isSaving}
                  onChange={(e) => handleChange(originalIndex, e.target.value as Category)}
                  className="flex-1 min-w-0 text-xs bg-transparent border border-neutral-200 rounded-md py-1 px-2 hover:border-violet-400 focus:outline-none focus:border-violet-600 transition-colors disabled:opacity-50"
                >
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>
                      {CATEGORIES[opt]?.label ?? opt}
                    </option>
                  ))}
                </select>
              </div>
              {hasError && <p className="text-[10px] text-red-500 mt-0.5">Error al guardar</p>}
            </div>
            <div className={`col-span-2 text-right text-sm font-medium ${isIncome ? 'text-menta' : 'text-neutral-900'}`}>
              {isIncome ? '+' : '−'}{formatMoney(tx.monto, currency)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
