import { Bell } from 'lucide-react'

export default function Header() {
  return (
    <header className="h-14 shrink-0 flex items-center justify-end px-6 bg-white">

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 rounded-md text-neutral-500 hover:bg-violet-100 hover:cursor-point transition-colors"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  )
}
