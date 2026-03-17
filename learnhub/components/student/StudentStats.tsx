import { Card } from "@/components/ui"
import { BookOpen, CheckCircle, Award } from "lucide-react"

export function StudentStats() {
  const stats = [
    { label: "In Progress", value: "4", icon: <BookOpen className="w-5 h-5 text-primary-400" /> },
    { label: "Completed", value: "12", icon: <CheckCircle className="w-5 h-5 text-green-400" /> },
    { label: "Certificates", value: "3", icon: <Award className="w-5 h-5 text-yellow-400" /> },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <Card key={i} className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-800 flex items-center justify-center">
            {stat.icon}
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-surface-400 text-sm font-medium">{stat.label}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}
