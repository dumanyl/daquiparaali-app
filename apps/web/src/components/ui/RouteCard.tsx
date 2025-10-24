'use client'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'

export type RouteSummary = {
  id: string
  title: string
  subtitle: string
  color?: string
}

export default function RouteCard({
  data, onClick,
}: { data: RouteSummary; onClick?: (r: RouteSummary) => void }) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(data)}
      className="cursor-pointer"
    >
      <Card className="p-4 overflow-hidden relative">
        {/* soft color tag */}
        {data.color && <div className="absolute inset-x-0 -top-1 h-1" style={{ background: data.color }} />}
        <div className="font-medium">{data.title}</div>
        <div className="text-sm text-muted-foreground">{data.subtitle}</div>
      </Card>
    </motion.div>
  )
}
