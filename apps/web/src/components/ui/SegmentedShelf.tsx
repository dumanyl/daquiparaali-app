'use client'

import { useMemo } from 'react'
import clsx from 'clsx'

export type ShelfItem = {
  id: string
  label: string
  color?: string
  hint?: string
  // optional: who added it; not used for UI logic
  kind?: 'route' | 'bus' | 'ad'
}

type Mode = 'routes' | 'buses'

type Props = {
  /** Current segment (left toggle) */
  segment: Mode
  onSegmentChange: (m: Mode) => void

  /** Chips collected as you scroll */
  items: ShelfItem[]
  /** Called when a chip is clicked */
  onChipClick?: (id: string) => void

  /** Left-side “Hide” action */
  onHide?: () => void

  className?: string
}

/**
 * SegmentedShelf
 * - Left: Hide pill button.
 * - Center: Segmented control (Routes | Buses) with animated thumb.
 * - Right (fills remaining space): horizontally scrollable capsule that
 *   holds “collected” items as oval chips.
 */
export default function SegmentedShelf({
  segment,
  onSegmentChange,
  items,
  onChipClick,
  onHide,
  className,
}: Props) {
  const segIndex = useMemo(() => (segment === 'routes' ? 0 : 1), [segment])

  return (
    <div
      className={clsx(
        'flex items-center gap-3 w-full',
        className
      )}
      role="toolbar"
      aria-label="Results control"
    >
      {/* Hide button (left) */}
      <button
        type="button"
        onClick={onHide}
        className="px-3 py-1.5 rounded-full text-sm border bg-background hover:bg-accent"
        aria-label="Hide panel"
      >
        Hide
      </button>

      {/* Segmented control (center) */}
      <div
        className="relative flex items-center rounded-full border overflow-hidden select-none"
        role="tablist"
        aria-label="Result type"
      >
        {/* thumb */}
        <span
          className={clsx(
            'absolute top-1 bottom-1 w-1/2 rounded-full bg-foreground/90',
            'transition-transform duration-300 ease-out'
          )}
          style={{ transform: `translateX(${segIndex * 100}%)` }}
          aria-hidden
        />
        {/* tabs */}
        <button
          type="button"
          role="tab"
          aria-selected={segment === 'routes'}
          className={clsx(
            'relative z-[1] px-4 py-2 text-sm w-32 text-center',
            segment === 'routes' ? 'text-background' : 'text-foreground/70'
          )}
          onClick={() => onSegmentChange('routes')}
        >
          Routes
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={segment === 'buses'}
          className={clsx(
            'relative z-[1] px-4 py-2 text-sm w-32 text-center',
            segment === 'buses' ? 'text-background' : 'text-foreground/70'
          )}
          onClick={() => onSegmentChange('buses')}
        >
          Buses
        </button>
      </div>

      {/* Chips panel (right) */}
      <div
        className={clsx(
          'flex-1 min-w-0',
          'border rounded-full px-2 py-1.5 bg-background'
        )}
        aria-label="Collected items"
      >
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {items.length === 0 ? (
            <span className="text-xs text-muted-foreground px-2">
              Items you scroll past will collect here
            </span>
          ) : (
            items.map((it) => (
              <button
                key={it.id}
                type="button"
                onClick={() => onChipClick?.(it.id)}
                className="shrink-0 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 bg-background hover:bg-accent transition"
                title={it.hint}
              >
                {/* color dot (optional) */}
                {it.color && (
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ background: it.color }}
                    aria-hidden
                  />
                )}
                <span className="text-sm">{it.label}</span>
                {it.hint && (
                  <span className="text-[11px] text-muted-foreground">• {it.hint}</span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
