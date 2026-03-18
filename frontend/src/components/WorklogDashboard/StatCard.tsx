import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ReactNode
  accentClass: string
}

export function StatCard({ title, value, subtitle, icon, accentClass }: StatCardProps) {
  return (
    <Card className={`py-4 border-l-4 ${accentClass}`}>
      <CardContent className="px-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          {icon}
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </CardContent>
    </Card>
  )
}
