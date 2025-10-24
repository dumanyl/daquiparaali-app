// apps/web/src/components/ui/AnimatedMasonry.tsx
'use client'
import { useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion'
import clsx from 'clsx'

type BaseItem = { id: string }

type Columns =
  | number
  | {
      base: number
      md?: number
      lg?: number
    }

type Props<T extends BaseItem> = {
  items: T[]
  render: (item: T) => React.ReactNode
  seed?: number
  gap?: number
  columns?: Columns
  /** if provided, use this element as IntersectionObserver root (e.g., your BottomDrawer scroll body) */
  scrollRootRef?: React.RefObject<HTMLElement | null>

  /** notify when a tile’s bottom has moved above the top edge of the root */
  onPassedTop?: (item: T) => void

  /** optional: subtle shape/scale morph based on scroll visibility */
  morphOnScroll?: boolean

  /** optional: independent, randomized XY jitter (kept small so cards never touch) */
  randomJitter?: boolean
}

function seededRand(seed: number, i: number) {
  const x = Math.sin(seed * 1337 + i * 97.3) * 10000
  return x - Math.floor(x)
}

export default function AnimatedMasonry<T extends BaseItem>({
  items,
  render,
  seed = 0,
  gap = 12,
  columns = { base: 2, md: 2, lg: 3 },
  scrollRootRef,
  onPassedTop,
  morphOnScroll = false,
  randomJitter = false,
}: Props<T>) {
  const gridRef = useRef<HTMLDivElement | null>(null)

  // Build responsive grid classes
  const gridClass = useMemo(() => {
    if (typeof columns === 'number') {
      return clsx('grid', `grid-cols-1`, columns >= 2 && `sm:grid-cols-2`, columns >= 3 && `lg:grid-cols-3`)
    }
    const { base, md, lg } = columns
    return clsx(
      'grid',
      `grid-cols-${Math.max(1, base)}`,
      md && `md:grid-cols-${md}`,
      lg && `lg:grid-cols-${lg}`,
    )
  }, [columns])

  // IntersectionObserver for "passed top" (collection to shelf)
  useEffect(() => {
    const rootEl = scrollRootRef?.current ?? gridRef.current?.parentElement ?? undefined
    if (!rootEl) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          const node = en.target as HTMLElement
          const id = node.dataset.id
          if (!id) continue

          // when card is NOT intersecting and its bottom is above the top of the root → passed top
          const rootTop = en.rootBounds?.top ?? 0
          const isAbove = en.boundingClientRect.bottom < rootTop
          if (!en.isIntersecting && isAbove) {
            const index = Number(node.dataset.index ?? -1)
            const item = items[index]
            if (item) onPassedTop?.(item)
          }
        }
      },
      {
        root: rootEl,
        threshold: [0, 0.05, 0.25, 0.5, 0.75, 1],
      },
    )

    const nodes = gridRef.current?.querySelectorAll<HTMLElement>('[data-masonry-card="1"]') ?? []
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [items, scrollRootRef, onPassedTop])

  return (
    <div ref={gridRef} className={gridClass} style={{ gap }}>
      <AnimatePresence initial={false}>
        {items.map((item, i) => {
          const r = seededRand(seed, i)

          // Morph: choose a base height tier then let framer morph around it
          const heightTier = r < 0.33 ? 112 : r < 0.66 ? 148 : 184 // ~ h-28 / h-36 / h-46

          // Random jitter recipe (kept small so cards never collide)
          const jx = Math.round(1 + seededRand(seed + 1, i) * 6) // 1..7px
          const jy = Math.round(1 + seededRand(seed + 2, i) * 6) // 1..7px
          const dx = 1.1 + seededRand(seed + 3, i) * 1.0 // 1.1..2.1s
          const dy = 1.2 + seededRand(seed + 4, i) * 1.2 // 1.2..2.4s
          const delay = seededRand(seed + 5, i) * 1.6

          return (
            <CardWrapper<T>
              key={item.id}
              item={item}
              index={i}
              baseH={heightTier}
              render={render}
              morphOnScroll={morphOnScroll}
              randomJitter={randomJitter}
              jitter={{ jx, jy, dx, dy, delay }}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}

/** Isolated card with its own visibility-driven morph & jitter animations */
function CardWrapper<T extends BaseItem>({
  item,
  index,
  baseH,
  render,
  morphOnScroll,
  randomJitter,
  jitter,
}: {
  item: T
  index: number
  baseH: number
  render: (item: T) => React.ReactNode
  morphOnScroll: boolean
  randomJitter: boolean
  jitter: { jx: number; jy: number; dx: number; dy: number; delay: number }
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { margin: '-10% 0px -10% 0px', amount: 0.2 })
  const controls = useAnimation()

  useEffect(() => {
    // morph: scale + radius + slight parallax when entering/leaving
    if (!morphOnScroll) return
    if (inView) {
      controls.start({
        scale: 1,
        borderRadius: 14,
        y: 0,
        transition: { type: 'spring', stiffness: 260, damping: 22 },
      })
    } else {
      controls.start({
        scale: 0.985,
        borderRadius: 24,
        y: 8,
        transition: { type: 'spring', stiffness: 260, damping: 22 },
      })
    }
  }, [inView, morphOnScroll, controls])

  return (
    <motion.div
      ref={ref}
      data-masonry-card="1"
      data-id={item.id}
      data-index={index}
      layout
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 8 }}
      transition={{ type: 'spring', stiffness: 250, damping: 24 }}
      className="relative"
    >
      <motion.div
        animate={controls}
        className="rounded-xl border bg-background p-4 shadow-sm overflow-hidden"
        style={{ height: baseH, willChange: 'transform' }}
        {...(randomJitter && {
          animate: {
            x: [0, jitter.jx, -jitter.jx, 0],
            y: [0, -jitter.jy, jitter.jy, 0],
          },
          transition: {
            x: { duration: jitter.dx, delay: jitter.delay, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
            y: { duration: jitter.dy, delay: jitter.delay / 2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
          },
        })}
      >
        {render(item)}
      </motion.div>
    </motion.div>
  )
}
