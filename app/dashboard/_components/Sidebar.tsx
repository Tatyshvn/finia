'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, BarChart2, Zap } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Resumen', icon: LayoutDashboard },
  { href: '/dashboard/gastos', label: 'Gastos', icon: Receipt },
  { href: '/dashboard/reportes', label: 'Reportes', icon: BarChart2 },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 shrink-0 flex flex-col bg-white text-neutral-100 min-h-screen">
      <div className="px-6 py-5">
        <a href='/' className="text-3xl font-bold tracking-tight text-violet-800">finia</a>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/dashboard' ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-md transition-colors ${isActive
                ? 'bg-violet-200 text-violet-800 font-semibold'
                : 'text-neutral-600 hover:bg-violet-100 hover:text-violet-800'
                }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 pb-3">
        <div className="rounded-xl bg-violet-700 p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={13} className="text-violet-200" />
            <p className="text-sm font-semibold text-white">Mejora tu plan</p>
          </div>
          <p className="text-xs text-violet-200 leading-relaxed mb-3">
            Más análisis y funciones avanzadas para tus finanzas
          </p>
          <Link
            href="/upgrade"
            className="block text-center text-xs font-semibold bg-white text-violet-700 rounded-lg py-1.5 hover:bg-violet-50 transition-colors"
          >
            Ver planes →
          </Link>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-200 flex items-center justify-center text-sm text-violet-900 font-semibold">
            TH
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-md font-medium text-neutral-900 truncate">Tatiana</p>
            <p className="text-sm text-neutral-400 truncate">tatyshv@finia.app</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
