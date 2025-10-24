'use client'
import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export default function BottomDrawer({
  expanded,
  onToggle,
  children,
}: {
  expanded: boolean
  onToggle: (v: boolean) => void
  children: React.ReactNode
}) {
  const controls = useAnimation()

  // tiny shake when collapsing
  useEffect(() => {
    if (!expanded) {
      controls.start({
        y: [0, -4, 3, 0],
        transition: { duration: 0.32 },
      })
    }
  }, [expanded, controls])

  return (
    <motion.div
      animate={{ height: expanded ? 420 : 160 }}
      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
      className="absolute bottom-0 left-0 right-0 z-10"
    >
      <motion.div
        animate={controls}
        className="mx-auto w-[min(1200px,95vw)] rounded-t-2xl bg-background/95 backdrop-blur border-t p-4 h-full overflow-hidden"
      >
        <button
          onClick={() => onToggle(!expanded)}
          className="mx-auto block mb-3 text-muted-foreground hover:text-foreground"
          title={expanded ? 'Collapse' : 'Expand'}
        >
          <div className="flex items-center gap-2">
            <ChevronUp className={`w-5 h-5 ${expanded ? 'rotate-180' : ''}`} />
            <span className="text-sm">{expanded ? 'Hide' : 'See more'}</span>
          </div>
        </button>
        <div className="h-[calc(100%-2rem)] overflow-y-auto pr-1">{children}</div>
      </motion.div>
    </motion.div>
  )
}
