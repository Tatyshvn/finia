import type { Transaction } from '@/types/statements'

const CARGO_TYPES = new Set(['cargo', 'transferencia_enviada', 'retiro', 'comision'])

interface Props {
  transactions: Transaction[]
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 })
}

function conceptName(tx: Transaction): string {
  if (tx.comercio && tx.comercio.trim()) return tx.comercio.trim()
  return tx.descripcion.trim()
}

export default function SpendingByConcept({ transactions }: Props) {
  const totals = new Map<string, { total: number; count: number }>()

  for (const tx of transactions) {
    if (!CARGO_TYPES.has(tx.tipo)) continue
    const key = conceptName(tx)
    const prev = totals.get(key) ?? { total: 0, count: 0 }
    totals.set(key, { total: prev.total + tx.monto, count: prev.count + 1 })
  }

  const sorted = [...totals.entries()]
    .map(([name, { total, count }]) => ({ name, total, count }))
    .sort((a, b) => b.total - a.total)

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-sm font-bold tracking-widest text-violet-700 uppercase mb-6">
        Gasto por concepto
      </h2>

      {sorted.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-400">
          Sin gastos registrados para este período
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs text-neutral-400 uppercase tracking-wider">
                <th className="pb-3 pr-4 w-8">#</th>
                <th className="pb-3 pr-4">Concepto</th>
                <th className="pb-3 pr-4 text-center w-24">Transacciones</th>
                <th className="pb-3 text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(({ name, total, count }, i) => (
                <tr
                  key={name}
                  className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors"
                >
                  <td className="py-3 pr-4 text-neutral-300 font-medium tabular-nums">{i + 1}</td>
                  <td className="py-3 pr-4">
                    <span className="font-medium text-neutral-800 truncate block max-w-xs">{name}</span>
                  </td>
                  <td className="py-3 pr-4 text-center tabular-nums text-neutral-500">{count}</td>
                  <td className="py-3 text-right tabular-nums font-semibold text-neutral-800">
                    {formatCurrency(total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
