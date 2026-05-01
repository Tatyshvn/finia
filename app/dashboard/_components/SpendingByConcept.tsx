'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { Category, Transaction } from '@/types/statements'
import { getCategoryMeta } from '@/lib/categories'

const CARGO_TYPES = new Set(['cargo', 'transferencia_enviada', 'retiro', 'comision'])

interface Props {
  transactions: Transaction[]
}

interface ConceptRow {
  name: string
  total: number
  count: number
  category: Category
  rawNames: string[]
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 })
}

function rawConceptName(tx: Transaction): string {
  if (tx.comercio && tx.comercio.trim()) return tx.comercio.trim()
  return tx.descripcion.trim()
}

export default function SpendingByConcept({ transactions }: Props) {
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [normalizing, setNormalizing] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const rawConcepts = useMemo(() => {
    const seen = new Set<string>()
    for (const tx of transactions) {
      if (CARGO_TYPES.has(tx.tipo)) seen.add(rawConceptName(tx))
    }
    return Array.from(seen)
  }, [transactions])

  useEffect(() => {
    if (rawConcepts.length === 0) {
      setMapping({})
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setNormalizing(true)

    fetch('/api/statements/normalize-concepts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concepts: rawConcepts }),
      signal: controller.signal,
    })
      .then(res => res.json())
      .then(data => { if (data.mapping) setMapping(data.mapping) })
      .catch(err => { if (err.name !== 'AbortError') console.error('[normalize-concepts]', err) })
      .finally(() => setNormalizing(false))

    return () => controller.abort()
  }, [rawConcepts])

  const rows = useMemo<ConceptRow[]>(() => {
    const groups = new Map<string, {
      total: number
      count: number
      categoryVotes: Map<string, number>
      rawNames: Set<string>
    }>()

    for (const tx of transactions) {
      if (!CARGO_TYPES.has(tx.tipo)) continue
      const raw = rawConceptName(tx)
      const normalized = mapping[raw] ?? raw
      const prev = groups.get(normalized) ?? {
        total: 0,
        count: 0,
        categoryVotes: new Map(),
        rawNames: new Set(),
      }
      prev.total += tx.monto
      prev.count += 1
      prev.categoryVotes.set(tx.categoria, (prev.categoryVotes.get(tx.categoria) ?? 0) + 1)
      prev.rawNames.add(raw)
      groups.set(normalized, prev)
    }

    return [...groups.entries()]
      .map(([name, { total, count, categoryVotes, rawNames }]) => {
        const category = [...categoryVotes.entries()].sort((a, b) => b[1] - a[1])[0][0] as Category
        return { name, total, count, category, rawNames: Array.from(rawNames) }
      })
      .sort((a, b) => b.total - a.total)
  }, [transactions, mapping])

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold tracking-widest text-violet-700 uppercase">
          Gasto por concepto
        </h2>
        {normalizing && (
          <span className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Loader2 size={13} className="animate-spin" />
            Normalizando...
          </span>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-400">
          Sin gastos registrados para este período
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs text-neutral-400 uppercase tracking-wider">
                <th className="pb-3 pr-4 w-10">#</th>
                <th className="pb-3 pr-4">Concepto</th>
                <th className="pb-3 pr-4 w-40">Categoría</th>
                <th className="pb-3 pr-4 text-center w-36">Transacciones</th>
                <th className="pb-3 text-right w-50">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ name, total, count, category, rawNames }, i) => {
                const meta = getCategoryMeta(category)
                return (
                  <tr
                    key={name}
                    className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="py-3 pr-4 text-neutral-300 font-medium tabular-nums">{i + 1}</td>
                    <td className="py-3 pr-4">
                      <span className="font-medium text-neutral-800 block">{name}</span>
                      {rawNames.length > 0 && (
                        <span
                          className="text-xs text-neutral-400 block mt-0.5 truncate max-w-xs"
                          title={rawNames.join(' · ')}
                        >
                          {rawNames.join(' · ')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center gap-1 text-sm font-medium px-3 py-0.9 rounded-full ${meta.badgeClasses}`}>
                        <span>{meta.label}</span>
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-center tabular-nums text-neutral-500">{count}</td>
                    <td className="py-3 text-right tabular-nums font-semibold text-neutral-800">
                      {formatCurrency(total)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
