import { TrendingUp, TrendingDown, Scale, Hash } from 'lucide-react'

const stats = [
  {
    label: 'Ingresos totales',
    value: '$0.00',
    icon: TrendingUp,
    badgeClass: 'bg-menta-light text-menta-dark',
    iconClass: 'text-menta',
  },
  {
    label: 'Gastos totales',
    value: '$0.00',
    icon: TrendingDown,
    badgeClass: 'bg-durazno-light text-durazno-dark',
    iconClass: 'text-durazno',
  },
  {
    label: 'Balance neto',
    value: '$0.00',
    icon: Scale,
    badgeClass: 'bg-lavanda-light text-lavanda-dark',
    iconClass: 'text-lavanda',
  },
  {
    label: 'Transacciones',
    value: '0',
    icon: Hash,
    badgeClass: 'bg-celeste-light text-celeste-dark',
    iconClass: 'text-celeste',
  },
]

export default function StatCards() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Resumen</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, badgeClass, iconClass }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <span className={`self-start text-sm font-semibold px-2.5 py-1 rounded-full ${iconClass}`}>
                {label}
              </span>
              <p className="text-2xl font-bold text-neutral-900">{value}</p>
            </div>
            <div className={`flex items-center justify-center ${badgeClass} rounded-xl w-12 h-12 shrink-0`}>
              <Icon size={24} className={iconClass} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
