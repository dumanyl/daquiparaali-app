'use client'
import { motion } from 'framer-motion'

export type RouteTileData = {
  id: string
  title: string
  subtitle: string
  color: string
}
export type BusTileData = {
  id: string
  name: string
  etaMin: number
  crowd: 'Low' | 'Med' | 'High'
  color: string
}
export type AdTileData = {
  id: string
  title: string
  subtitle?: string
  tag?: string
}

const cardCls =
  'w-full rounded-xl border bg-background p-4 shadow-sm hover:shadow-md transition-colors'

export function RouteTile({
  data,
  onClick,
}: {
  data: RouteTileData
  onClick?: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cardCls + ' text-left'}
      layout
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
    >
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full" style={{ background: data.color }} />
        <div className="font-semibold">{data.title}</div>
      </div>
      <div className="text-sm text-muted-foreground mt-1">{data.subtitle}</div>
    </motion.button>
  )
}

export function BusTile({ data }: { data: BusTileData }) {
  return (
    <div className="rounded-xl border p-4 bg-background/70 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: data.color }} />
          <div className="font-semibold">{data.id}</div>
        </div>
        <div className="text-sm font-medium text-blue-600">{data.etaMin} min</div>
      </div>
      {/* extra details can fade in on hover */}
      <div className="mt-2 text-sm text-muted-foreground line-clamp-1 opacity-0 group-hover:opacity-100 transition">
        {data.name} · Crowd {data.crowd}
      </div>
    </div>
  )
}

export function AdTile({ data }: { data: AdTileData }) {
  return (
    <motion.div
      className={cardCls}
      layout
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
    >
      <div className="font-medium">{data.title}</div>
      {data.subtitle && <div className="text-sm text-muted-foreground mt-1">{data.subtitle}</div>}
      {data.tag && (
        <div className="inline-flex mt-2 text-xs px-2 py-0.5 rounded-full bg-accent">{data.tag}</div>
      )}
    </motion.div>
  )
}
