import Link from 'next/link'
import type { Transaction } from '@/types/statements'

const CARGO_TYPES = new Set(['cargo', 'transferencia_enviada', 'retiro', 'comision'])

const CATEGORY_LABEL: Record<string, string> = {
  alimentacion: 'Alimentación', transporte: 'Transporte',
  entretenimiento: 'Ocio',      salud: 'Salud',
  educacion: 'Educación',       servicios: 'Servicios',
  vestimenta: 'Moda',           ropa_calzado: 'Moda',
  hogar: 'Hogar',               viajes: 'Viajes',
  nomina: 'Nómina',             nomina_ingreso: 'Nómina',
  transferencia: 'Transferencia', inversiones: 'Ahorro',
  impuestos: 'Impuestos',       seguros: 'Seguros',
  comisiones: 'Comisiones',     comisiones_bancarias: 'Comisiones',
  otros: 'Otros',
}

const CATEGORY_CLASS: Record<string, string> = {
  alimentacion: 'bg-ambar-light text-ambar',
  transporte: 'bg-celeste-light text-celeste',
  entretenimiento: 'bg-rosa-light text-rosa',
  salud: 'bg-menta-light text-menta',
  educacion: 'bg-lavanda-light text-lavanda',
  servicios: 'bg-celeste-light text-celeste',
  vestimenta: 'bg-rosa-light text-rosa',
  ropa_calzado: 'bg-rosa-light text-rosa',
  hogar: 'bg-ambar-light text-ambar',
  inversiones: 'bg-menta-light text-menta',
}

interface Props {
  transactions: Transaction[]
}

export default function RecentTransactions({ transactions }: Props) {
  const recent = [...transactions]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 5)

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold tracking-widest text-violet-700 uppercase">
          Últimas transacciones
        </h2>
        <Link
          href="/dashboard/transacciones"
          className="text-xs text-violet-600 hover:text-violet-800 underline underline-offset-2 transition-colors"
        >
          Ver todas
        </Link>
      </div>

      <div className="divide-y divide-neutral-100">
        {recent.map((tx, i) => {
          const esCargo = CARGO_TYPES.has(tx.tipo)
          const catClass = CATEGORY_CLASS[tx.categoria] ?? 'bg-neutral-100 text-neutral-400'
          const label = CATEGORY_LABEL[tx.categoria] ?? tx.categoria
          return (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {tx.comercio ?? tx.descripcion}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">{tx.fecha}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${catClass}`}>
                {label}
              </span>
              <span className={`text-sm font-semibold shrink-0 ${esCargo ? 'text-neutral-600' : 'text-menta'}`}>
                {esCargo ? '-' : '+'}${tx.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
