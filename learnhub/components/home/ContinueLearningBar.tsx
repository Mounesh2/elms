"use client"

import Link from "next/link"
import { PlayCircle } from "lucide-react"

interface ContinueLearningBarProps {
  data: {
    course: any
    lecture: any
    progress: any
  }
}

export function ContinueLearningBar({ data }: ContinueLearningBarProps) {
  const { course, lecture, progress } = data
  const progressPercent = Math.round(progress.progressPercentage || 0)

  return (
    <div className="bg-white border-b border-surface-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-16 h-16 shrink-0 rounded-sm overflow-hidden bg-surface-100 shadow-sm border border-surface-200">
                {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1c1d1f] text-white font-bold text-xs">LH</div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-1">Continue Learning</p>
                <h3 className="text-sm font-bold text-[#1c1d1f] truncate leading-tight mb-1">{course.title}</h3>
                <p className="text-xs text-surface-600 truncate">{lecture.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-8 w-full md:w-auto">
            <div className="hidden lg:block w-48">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold text-surface-500 uppercase tracking-widest">Your progress</span>
                    <span className="text-[10px] font-bold text-[#1c1d1f]">{progressPercent}%</span>
                </div>
                <div className="h-1 bg-surface-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-primary-600 transition-all duration-500" 
                        style={{ width: `${progressPercent}%` }} 
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
                <Link href={`/learn/${course.slug}/${lecture.id}`}>
                    <button className="bg-[#1c1d1f] hover:bg-surface-800 text-white px-6 h-12 text-sm font-bold flex items-center gap-2 rounded-sm transition-all active:scale-95 shadow-lg shadow-black/5">
                        <PlayCircle className="h-5 w-5 fill-white text-[#1c1d1f]" />
                        Resume Course
                    </button>
                </Link>
                <Link href="/my-courses" className="text-sm font-bold text-surface-700 hover:text-primary-700 transition-colors hidden sm:block">
                    My Learning
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
