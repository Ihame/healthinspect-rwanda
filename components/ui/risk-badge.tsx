import { cn } from "@/lib/utils"

interface RiskBadgeProps {
  score: number
  className?: string
}

export function RiskBadge({ score, className }: RiskBadgeProps) {
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Low", color: "bg-green-100 text-green-800" }
    if (score >= 60) return { level: "Medium", color: "bg-yellow-100 text-yellow-800" }
    return { level: "High", color: "bg-red-100 text-red-800" }
  }

  const { level, color } = getRiskLevel(score)

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", color, className)}>
      {level} Risk
    </span>
  )
}
