'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '◈' },
  { href: '/dashboard/accounts', label: 'Accounts', icon: '◉' },
  { href: '/dashboard/transactions', label: 'Transactions', icon: '◎' },
  { href: '/dashboard/budgets', label: 'Budgets', icon: '◐' },
  { href: '/dashboard/reports', label: 'Reports', icon: '◑' },
  { href: '/dashboard/settings', label: 'Settings', icon: '◌' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 shrink-0 flex flex-col bg-neutral-100 text-neutral-100 min-h-screen">
      <div className="px-6 py-5 border-b border-neutral-700">
        <a href='/' className="text-xl font-bold tracking-tight text-black">finia</a>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon }) => {
          const isActive =
            href === '/dashboard' ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                ? 'bg-neutral-700 text-white'
                : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neutral-600 flex items-center justify-center text-sm font-semibold">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">User</p>
            <p className="text-xs text-neutral-400 truncate">user@finia.app</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
