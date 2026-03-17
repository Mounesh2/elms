'use client'
import Link from 'next/link'
import { Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

const TESTIMONIALS = [
    {
        text: "LearnHub was the best investment I ever made. I went from having zero coding knowledge to landing a job at a top tech company.",
        name: "James Martinez",
        course: "The Complete 2024 Web Development Bootcamp",
        initials: "JM"
    },
    {
        text: "The data science curriculum is world-class. The projects are practical and helped me build a portfolio that stood out.",
        name: "Sarah Chen",
        course: "Python for Data Science and Machine Learning",
        initials: "SC"
    },
    {
        text: "I was able to learn at my own pace and juggle my studies with a full-time job. The instructors are clearly experts.",
        name: "David Smith",
        course: "Project Management Professional (PMP)",
        initials: "DS"
    },
    {
        text: "The diversity of courses is amazing. I can learn everything from creative writing to cloud architecture on one platform.",
        name: "Elena Rodriguez",
        course: "Ultimate AWS Certified Cloud Practitioner",
        initials: "ER"
    }
]

export default function TestimonialGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
                <div key={i} className="flex flex-col p-8 border border-surface-200 bg-white">
                    <Quote className="h-8 w-8 text-surface-200 mb-4 fill-surface-200" />
                    <p className="text-base text-[#1c1d1f] mb-8 flex-1 leading-relaxed italic">
                        &quot;{t.text}&quot;
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#1c1d1f] text-white flex items-center justify-center font-bold">
                            {t.initials}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-[#1c1d1f] truncate">{t.name}</p>
                            <Link href="/courses" className="text-xs text-primary-700 font-bold hover:underline truncate block">
                                View this course →
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-8 text-center">
            <Link href="/stories" className="text-primary-700 font-bold hover:underline flex items-center justify-center gap-2">
                View all stories <span className="text-xl">→</span>
            </Link>
        </div>
      </div>
    </section>
  )
}
