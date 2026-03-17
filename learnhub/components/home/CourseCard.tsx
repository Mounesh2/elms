'use client'
import Image from 'next/image'
import Link from 'next/link'
import { StarRating } from '@/components/ui'
import { cn } from '@/lib/utils'

interface CourseCardProps {
  course: {
    id: string
    title: string
    slug: string
    thumbnail_url: string
    average_rating: number
    total_reviews: number
    price: number
    original_price?: number
    instructor: {
        full_name: string
    }
    is_featured?: boolean
    total_students?: number
  }
  className?: string
}

export default function CourseCard({ course, className }: CourseCardProps) {
  const isBestseller = course.total_students && course.total_students > 100

  return (
    <Link 
        href={`/courses/${course.slug}`}
        className={cn(
            "group flex flex-col gap-2 w-full min-w-[200px] transition-all duration-300 hover:scale-[1.02]",
            className
        )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden border border-surface-200 bg-surface-100">
        <Image
          src={course.thumbnail_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800'}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-2 text-base font-bold text-[#1c1d1f] transition-colors group-hover:text-primary-700">
          {course.title}
        </h3>
        <p className="text-xs text-surface-500 truncate">
          {course.instructor?.full_name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-[#b4690e]">{course.average_rating.toFixed(1)}</span>
            <StarRating rating={course.average_rating} className="!gap-0.5" />
            <span className="text-xs text-surface-500 lowercase">({course.total_reviews.toLocaleString('en-US')})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-bold text-[#1c1d1f]">₹{course.price.toLocaleString('en-IN')}</span>
            {course.original_price && course.original_price > course.price && (
                <span className="text-sm text-surface-400 line-through">₹{course.original_price.toLocaleString('en-IN')}</span>
            )}
        </div>

        {/* Bestseller Badge */}
        {isBestseller && (
            <div className="mt-1">
                <span className="inline-block bg-[#eceb98] text-[#3d3c0a] text-[10px] font-bold px-2 py-0.5 rounded-sm">
                    Bestseller
                </span>
            </div>
        )}
      </div>
    </Link>
  )
}
