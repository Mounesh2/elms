"use client"

import { ChevronLeft, ChevronRight, Star, Heart } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface CourseCarouselProps {
  courses: any[]
  title?: string
  subtitle?: string
}

export default function CourseCarousel({ courses, title, subtitle }: CourseCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeft(scrollLeft > 0)
    setShowRight(scrollLeft < scrollWidth - clientWidth - 5)
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [courses])

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const { clientWidth } = scrollRef.current
    const scrollAmount = direction === "left" ? -clientWidth : clientWidth
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  if (courses.length === 0) return null

  return (
    <div className="space-y-4 relative group/carousel">
      {(title || subtitle) && (
        <div className="flex items-end justify-between">
            <div>
                {title && <h2 className="text-2xl font-bold text-[#1c1d1f]">{title}</h2>}
                {subtitle && <p className="text-surface-500 text-sm mt-1">{subtitle}</p>}
            </div>
        </div>
      )}

      <div className="relative">
        {/* Navigation Buttons */}
        {showLeft && (
            <button 
                onClick={() => scroll("left")}
                className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-surface-200 shadow-xl flex items-center justify-center hover:bg-surface-50 transition-all active:scale-90"
            >
                <ChevronLeft className="h-6 w-6 text-[#1c1d1f]" />
            </button>
        )}
        {showRight && (
            <button 
                onClick={() => scroll("right")}
                className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-surface-200 shadow-xl flex items-center justify-center hover:bg-surface-50 transition-all active:scale-90"
            >
                <ChevronRight className="h-6 w-6 text-[#1c1d1f]" />
            </button>
        )}

        <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-1"
        >
            {courses.map((course) => (
                <div key={course.id} className="w-[190px] min-w-[190px] sm:w-[240px] sm:min-w-[240px] group cursor-pointer">
                    <Link href={`/courses/${course.slug}`}>
                        <div className="relative aspect-video rounded-sm overflow-hidden bg-surface-100 border border-surface-200 mb-2">
                            {course.thumbnailUrl ? (
                                <img 
                                    src={course.thumbnailUrl} 
                                    alt={course.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    onError={(e) => {
                                        const target = e.currentTarget
                                        target.style.display = 'none'
                                        if (target.nextElementSibling) {
                                            (target.nextElementSibling as HTMLElement).style.display = 'flex'
                                        }
                                    }}
                                />
                            ) : null}
                            <div className={cn("absolute inset-0 items-center justify-center text-surface-300 font-bold bg-surface-100", course.thumbnailUrl ? "hidden" : "flex")}>
                                LearnHub
                            </div>
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-white rounded-full shadow-lg hover:text-red-500 transition-colors">
                                    <Heart className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-sm font-bold text-[#1c1d1f] line-clamp-2 leading-tight h-10 mb-1 group-hover:text-primary-700 transition-colors">
                            {course.title}
                        </h3>
                        <p className="text-xs text-surface-500 truncate mb-1">{course.instructor?.name || 'LearnHub Instructor'}</p>
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-xs font-bold text-orange-700">{course.averageRating}</span>
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={cn("h-3 w-3 fill-current", i < Math.floor(parseFloat(course.averageRating)) ? "text-orange-400" : "text-surface-200")} />
                                ))}
                            </div>
                            <span className="text-[10px] text-surface-400">({course.totalReviews})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1c1d1f]">${course.price}</span>
                            {course.originalPrice && (
                                <span className="text-xs text-surface-400 line-through">${course.originalPrice}</span>
                            )}
                        </div>
                    </Link>
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}
