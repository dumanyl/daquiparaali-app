import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function PinterestGrid({
  items,
}: {
  items: { title: string; subtitle?: string; tag?: string }[]
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map((it, i) => (
        <Card key={i} className="p-3 hover:shadow-lg transition-shadow">
          <div className="font-medium">{it.title}</div>
          {it.subtitle && (
            <div className="text-sm text-muted-foreground">{it.subtitle}</div>
          )}
          {it.tag && <Badge className="mt-2">{it.tag}</Badge>}
        </Card>
      ))}
    </div>
  )
}
