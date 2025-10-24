'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { motion } from 'framer-motion'

export default function RouteModal({
  open, onOpenChange, title, children, glowColor = '#7c3aed',
}: {
  open: boolean; onOpenChange: (v: boolean) => void
  title: string; children?: React.ReactNode; glowColor?: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl border-0 bg-transparent p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="rounded-2xl p-[2px]"
          style={{
            background: `radial-gradient(60% 60% at 50% 0%, ${glowColor}66 0%, transparent 70%)`,
          }}
        >
          <div className="rounded-[14px] bg-background border shadow-xl">
            <DialogHeader className="px-4 pt-4">
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4">{children}</div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
