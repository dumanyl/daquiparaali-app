'use client'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function AdsStrip() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {['Travel Card Promo', 'Coffee near you', 'Bike Share'].map((t, i) => (
        <Card key={i} className="p-3 text-sm flex items-center justify-between">
          <span>{t}</span><Badge>Ad</Badge>
        </Card>
      ))}
    </div>
  )
}

export function OtherRoutes({ items }: { items: { title: string; subtitle: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((r, i) => (
        <Card key={i} className="p-3">
          <div className="font-medium">{r.title}</div>
          <div className="text-sm text-muted-foreground">{r.subtitle}</div>
        </Card>
      ))}
    </div>
  )
}
