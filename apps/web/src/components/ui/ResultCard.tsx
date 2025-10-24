import { Card } from '@/components/ui/card'

export default function ResultCard({
  title,
  subtitle,
}: { title: string; subtitle?: string }) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="font-medium">{title}</div>
      {subtitle && (
        <div className="text-sm text-muted-foreground">{subtitle}</div>
      )}
    </Card>
  )
}
