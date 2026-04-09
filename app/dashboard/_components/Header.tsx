export default function Header() {
  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-neutral-200 bg-white">
      <div className="flex items-center gap-2">
        <input
          type="search"
          placeholder="Search..."
          className="w-64 text-sm px-3 py-1.5 rounded-md border border-neutral-300 bg-neutral-50 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors"
        >
          <span className="text-lg">🔔</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-white text-sm font-semibold">
          U
        </div>
      </div>
    </header>
  )
}
