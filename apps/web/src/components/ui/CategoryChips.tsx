'use client'
import { useState } from 'react'

/** ──────────────────────────────────────────────────────────────
 * CategoryChips
 * - shows selectable category pills (one active at a time)
 * - calls onPick with the selected key, or null to clear
 * ────────────────────────────────────────────────────────────── */
type CategoryChipsProps = {
  selected?: string | null
  onPick?: (key: string | null) => void
}

const CATEGORIES: { key: string; label: string; icon?: string }[] = [
  { key: 'Cafés',       label: 'Cafés',       icon: '☕' },
  { key: 'Bookstores',  label: 'Bookstores',  icon: '📚' },
  { key: 'Gyms',        label: 'Gyms',        icon: '🏋️' },
  { key: 'Schools',     label: 'Schools',     icon: '🏫' },
  { key: 'Groceries',   label: 'Groceries',   icon: '🛒' },
  { key: 'Restaurants', label: 'Restaurants', icon: '🍽️' },
]

export function CategoryChips({ selected = null, onPick }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(({ key, label, icon }) => {
        const active = selected === key
        return (
          <button
            key={key}
            aria-pressed={active}
            onClick={() => onPick?.(active ? null : key)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition
              ${active
                ? 'bg-primary/10 border-primary text-primary font-semibold'
                : 'bg-background hover:bg-accent'}`}
            title={label}
          >
            {icon && <span className="text-base leading-none">{icon}</span>}
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}

/** ──────────────────────────────────────────────────────────────
 * RouteQuickFilters
 * - “Fastest”, “Cheapest”, “Fewest transfers” pills
 * - keeps local selection for styling and calls onPick
 * ────────────────────────────────────────────────────────────── */
type Quick = 'fastest' | 'cheapest' | 'fewest'
type RouteQuickFiltersProps = { onPick?: (k: Quick) => void }

export function RouteQuickFilters({ onPick }: RouteQuickFiltersProps) {
  const [sel, setSel] = useState<Quick | null>(null)

  const Btn = ({ keyName, label }: { keyName: Quick; label: string }) => {
    const active = sel === keyName
    return (
      <button
        onClick={() => {
          setSel(keyName)
          onPick?.(keyName)
        }}
        aria-pressed={active}
        className={`px-3 py-1.5 rounded-full text-sm border transition
          ${active
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background hover:bg-accent'}`}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="flex gap-2">
      <Btn keyName="fastest"  label="Fastest" />
      <Btn keyName="cheapest" label="Cheapest" />
      <Btn keyName="fewest"   label="Fewest transfers" />
    </div>
  )
}

export default CategoryChips
