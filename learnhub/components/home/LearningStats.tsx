"use client"

import { Clock, BookOpen, CheckCircle, Flame, Target } from "lucide-react"
import Link from "next/link"

interface LearningStatsProps {
  stats: {
    minutesLearned: number
    completedCourses: number
    activeCourses: number
    streak: number
  }
}

export function LearningStats({ stats }: LearningStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Time Spent */}
      <div className="bg-white border border-surface-200 p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Clock className="h-6 w-6" />
          </div>
          {stats.streak >= 3 && (
            <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
               <Flame className="h-3 w-3 fill-current" /> {stats.streak} Day Streak
            </div>
          )}
        </div>
        <div>
          <p className="text-3xl font-bold text-[#1c1d1f] tabular-nums">{stats.minutesLearned}</p>
          <p className="text-sm font-medium text-surface-500">Minutes learned this month</p>
        </div>
      </div>

      {/* In Progress */}
      <div className="bg-white border border-surface-200 p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-purple-50 text-purple-600 p-3 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold text-[#1c1d1f] tabular-nums">{stats.activeCourses}</p>
          <p className="text-sm font-medium text-surface-500">Courses in progress</p>
        </div>
      </div>

      {/* Completed */}
      <div className="bg-white border border-surface-200 p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-green-50 text-green-600 p-3 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold text-[#1c1d1f] tabular-nums">{stats.completedCourses}</p>
          <p className="text-sm font-medium text-surface-500">Certificates earned</p>
        </div>
      </div>

      {/* Goals */}
      <Link href="/settings/goals" className="bg-surface-900 border border-surface-900 p-6 rounded-sm shadow-sm hover:bg-surface-800 transition-colors group">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white/10 text-white p-3 rounded-lg">
            <Target className="h-6 w-6" />
          </div>
        </div>
        <div>
          <p className="text-lg font-bold text-white mb-1">Set a learning goal</p>
          <p className="text-sm font-medium text-white/60">Achieve more every day</p>
        </div>
      </Link>
    </div>
  )
}
