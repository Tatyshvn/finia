'use client'

import { FileText, X } from 'lucide-react'

interface FileItemProps {
  file: File
  onRemove: () => void
}

export default function FileItem({ file, onRemove }: FileItemProps) {
  const sizeKB = (file.size / 1024).toFixed(1)

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-durazno-light shrink-0">
        <FileText size={18} className="text-durazno" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate">{file.name}</p>
        <p className="text-xs text-neutral-400">{sizeKB} KB</p>
      </div>
      <button
        onClick={onRemove}
        aria-label="Eliminar archivo"
        className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 transition-colors shrink-0"
      >
        <X size={15} />
      </button>
    </div>
  )
}
