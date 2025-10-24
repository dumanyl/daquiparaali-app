'use client'
import { motion, AnimatePresence } from 'framer-motion'

export type Chip = { id: string; label: string; color?: string; onClick?: () => void }

export default function PassedPanel({ chips }: { chips: Chip[] }) {
  return (
    <AnimatePresence>
      {chips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="w-full rounded-xl border bg-background/90 backdrop-blur px-3 py-2 overflow-x-auto flex gap-2"
        >
          {chips.map((c) => (
            <button
              key={c.id}
              onClick={c.onClick}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm whitespace-nowrap"
              style={{ boxShadow: '0 0 0 2px rgba(0,0,0,0.02) inset' }}
              aria-label={`Restore ${c.label}`}
            >
              {c.color && (
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
              )}
              <span className="font-medium">{c.label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
