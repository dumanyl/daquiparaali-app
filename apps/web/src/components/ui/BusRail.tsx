// apps/web/src/components/ui/BusRail.tsx
'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import clsx from 'clsx'

export type BusItem = {
  id: string
  name: string
  etaMin: number
  crowd: 'Low' | 'Med' | 'High'
  color: string
}

function etaClass(eta: number) {
  if (eta <= 5) return 'text-emerald-600'
  if (eta <= 10) return 'text-amber-600'
  return 'text-rose-600'
}

/**
 * Left “hover-to-open” rail:
 * • Collapsed: 56px wide (dot + number + ETA only).
 * • Expanded on rail hover (not item hover): 300px wide and reveals name & crowd.
 * • Absolutely no text peeking when collapsed (we force width=0/opacity=0 on the hidden row).
 */
export default function BusRail({
  items,
  onPick,
  onExpandView,
}: {
  items: BusItem[]
  onPick?: (b: BusItem) => void
  onExpandView?: () => void
}) {
  return (
    <div className="absolute top-0 left-0 h-full z-30 group/rail pointer-events-none">
      {/* hot zone to trigger open while still allowing map clicks elsewhere */}
      <div className="absolute inset-y-0 left-0 w-2 bg-transparent pointer-events-auto" />

      <div
        className={clsx(
          'h-full bg-background/85 backdrop-blur border-r overflow-hidden pointer-events-auto',
          'transition-[width] duration-300 ease-out',
          'w-14 group-hover/rail:w-[300px]',
          // avoid accidental text peeking on some fonts
          '[mask-image:linear-gradient(to_right,black_92%,transparent)] group-hover/rail:[mask-image:none]'
        )}
      >
        <ScrollArea className="h-full p-2">
          <div className="px-1 pb-2 text-xs text-muted-foreground select-none">
            <span className="hidden group-hover/rail:inline">Nearby buses</span>
          </div>

          {items.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                onPick?.(b)
                onExpandView?.()
              }}
              className={clsx(
                'w-full text-left px-2 py-2 rounded-lg hover:bg-accent/50',
                'flex items-center gap-2 transition-transform duration-150',
                'hover:translate-x-0.5'
              )}
            >
              {/* colored dot */}
              <span
                aria-hidden
                className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: b.color }}
              />

              {/* always-visible number + ETA */}
              <div className="min-w-0 flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <div className="font-semibold">{b.id}</div>
                  <div className={clsx('text-[11px] font-semibold', etaClass(b.etaMin))}>
                    {b.etaMin}m
                  </div>
                </div>

                {/* name + crowd only when expanded — absolutely no peeking */}
                <div
                  className={clsx(
                    'items-center gap-2 text-xs text-muted-foreground',
                    'opacity-0 max-w-0 overflow-hidden h-0',
                    'group-hover/rail:opacity-100 group-hover/rail:max-w-full group-hover/rail:h-5',
                    'transition-[opacity,max-width,height] duration-200 ease-out'
                  )}
                >
                  <div className="truncate">{b.name}</div>
                  <Badge variant="secondary" className="shrink-0">
                    {b.crowd}
                  </Badge>
                </div>
              </div>
            </button>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}
