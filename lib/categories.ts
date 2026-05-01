export interface CategoryMeta {
  label: string
  emoji: string
  /** Tailwind classes for pill/badge — "bg-X-light text-X" pattern */
  badgeClasses: string
  /** Hex color for charts and inline styles */
  color: string
}

export const CATEGORIES: Record<string, CategoryMeta> = {
  alimentacion:         { label: 'Alimentación',  emoji: '🍽️', badgeClasses: 'bg-ambar-light text-ambar',     color: '#E05A2B' },
  transporte:           { label: 'Transporte',    emoji: '🚗', badgeClasses: 'bg-celeste-light text-celeste',  color: '#0D9488' },
  entretenimiento:      { label: 'Ocio',          emoji: '🎬', badgeClasses: 'bg-ambar-light text-ambar',     color: '#D97706' },
  salud:                { label: 'Salud',         emoji: '🩺', badgeClasses: 'bg-durazno-light text-durazno', color: '#DC2626' },
  educacion:            { label: 'Educación',     emoji: '📚', badgeClasses: 'bg-lavanda-light text-lavanda', color: '#7C3AED' },
  servicios:            { label: 'Servicios',     emoji: '💻', badgeClasses: 'bg-celeste-light text-celeste',  color: '#4F46E5' },
  vestimenta:           { label: 'Vestimenta',    emoji: '👕', badgeClasses: 'bg-rosa-light text-rosa',       color: '#BE185D' },
  ropa_calzado:         { label: 'Vestimenta',    emoji: '🥾', badgeClasses: 'bg-rosa-light text-rosa',       color: '#BE185D' },
  hogar:                { label: 'Hogar',         emoji: '🏠', badgeClasses: 'bg-celeste-light text-celeste',  color: '#2563EB' },
  viajes:               { label: 'Viajes',        emoji: '✈️', badgeClasses: 'bg-celeste-light text-celeste',  color: '#0891B2' },
  nomina:               { label: 'Nómina',        emoji: '💵', badgeClasses: 'bg-menta-light text-menta',     color: '#059669' },
  nomina_ingreso:       { label: 'Nómina',        emoji: '💵', badgeClasses: 'bg-menta-light text-menta',     color: '#059669' },
  transferencia:        { label: 'Transferencia', emoji: '🔄', badgeClasses: 'bg-lavanda-light text-lavanda', color: '#7C3AED' },
  inversiones:          { label: 'Ahorro',        emoji: '💰', badgeClasses: 'bg-menta-light text-menta',     color: '#059669' },
  impuestos:            { label: 'Impuestos',     emoji: '🧾', badgeClasses: 'bg-durazno-light text-durazno', color: '#E05A2B' },
  seguros:              { label: 'Seguros',       emoji: '🛡️', badgeClasses: 'bg-celeste-light text-celeste',  color: '#2563EB' },
  comisiones:           { label: 'Comisiones',    emoji: '💳', badgeClasses: 'bg-durazno-light text-durazno', color: '#E05A2B' },
  comisiones_bancarias: { label: 'Comisiones',    emoji: '💳', badgeClasses: 'bg-durazno-light text-durazno', color: '#E05A2B' },
  otros:                { label: 'Otros',         emoji: '📦', badgeClasses: 'bg-neutral-100 text-neutral-400', color: '#78716C' },
}

export const FALLBACK_CATEGORY: CategoryMeta = {
  label: 'Otros', emoji: '📦', badgeClasses: 'bg-neutral-100 text-neutral-400', color: '#78716C',
}

export function getCategoryMeta(key: string): CategoryMeta {
  return CATEGORIES[key] ?? FALLBACK_CATEGORY
}
