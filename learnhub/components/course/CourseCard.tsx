import { Card } from "@/components/ui"
import { PlayCircle, Clock, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CourseCardProps {
  course: {
    id: string
    title: string
    instructor?: { name: string }
    thumbnailUrl?: string
    price: any // Prisma.Decimal serialized as string/number
    averageRating: any
    totalReviews: number
    slug: string
  }
  variant?: 'default' | 'horizontal'
}

export default function CourseCard({ course }: CourseCardProps) {
  const price = Number(course.price || 0)
  const rating = Number(course.averageRating || 0)

  return (
    <Link href={`/courses/${course.slug}`}>
      <Card className="group overflow-hidden hover:border-primary-500 transition-all border-surface-800 bg-surface-900">
        <div className="aspect-video relative overflow-hidden">
          <Image 
            src={course.thumbnailUrl || "/placeholder-course.png"} 
            alt={course.title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-white line-clamp-2 min-h-12 group-hover:text-primary-400 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-surface-400 truncate">{course.instructor?.name || "LearnHub Instructor"}</p>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500 font-bold text-sm">{rating.toFixed(1)}</span>
            <div className="flex text-yellow-500 text-xs">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-current' : 'text-surface-700'}`} />
              ))}
            </div>
            <span className="text-surface-500 text-xs">({(course.totalReviews || 0).toLocaleString('en-US')})</span>
          </div>
          <div className="font-bold text-white text-lg">
            {price === 0 ? 'Free' : `$${price.toFixed(2)}`}
          </div>
        </div>
      </Card>
    </Link>
  )
}
