import { type LucideIcon, FileText, MessageSquare, Code, Coffee, Lightbulb, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

const iconMap: Record<string, LucideIcon> = {
  FileText,
  MessageSquare,
  'Code Debug': Code,
  'Normal Chat': Coffee,
  'Creative Ideas': Lightbulb,
  'Quick Answers': Zap,
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  const Icon = iconMap[icon] || MessageSquare

  return (
    <Card className="bg-muted">
      <CardContent className="p-6 space-y-2">
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

