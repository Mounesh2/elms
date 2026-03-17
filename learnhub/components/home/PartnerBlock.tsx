'use client'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import CourseCard from './CourseCard'

const MOCK_PARTNER_COURSES = [
    {
        id: '1',
        title: 'Google Data Analytics Professional Certificate',
        slug: 'google-data-analytics',
        thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bbdac8a28a1e?auto=format&fit=crop&q=80&w=800',
        average_rating: 4.8,
        total_reviews: 12500,
        price: 0,
        instructor: { full_name: 'Google' },
        total_students: 500000
    },
    {
        id: '2',
        title: 'Google Project Management Professional Certificate',
        slug: 'google-project-management',
        thumbnail_url: 'https://images.unsplash.com/photo-1454165833772-d99626a4a1d8?auto=format&fit=crop&q=80&w=800',
        average_rating: 4.9,
        total_reviews: 8200,
        price: 0,
        instructor: { full_name: 'Google' },
        total_students: 320000
    },
    {
        id: '3',
        title: 'Google UX Design Professional Certificate',
        slug: 'google-ux-design',
        thumbnail_url: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800',
        average_rating: 4.8,
        total_reviews: 15000,
        price: 0,
        instructor: { full_name: 'Google' },
        total_students: 450000
    }
]

export default function PartnerBlock() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0d5c63] rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          
          {/* Left White Card Area */}
          <div className="w-full lg:w-1/3 bg-white p-12 flex flex-col justify-center gap-6">
            <div className="h-10 w-32 relative">
                <Image 
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
                    alt="Google" 
                    fill 
                    className="object-contain"
                />
            </div>
            <h2 className="text-3xl font-bold text-[#1c1d1f] leading-tight">
                Upskill with a Google Professional Certificate
            </h2>
            <p className="text-surface-600">
                Enroll in a Google Professional Certificate on LearnHub to gain job-ready skills in high-growth fields.
            </p>
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold">4.8</span>
                <div className="flex text-yellow-500">
                    {[1,2,3,4,5].map(s => <span key={s}>★</span>)}
                </div>
                <span className="text-xs text-surface-500">(1.2M ratings)</span>
            </div>
            <button className="w-fit px-6 py-3 border border-[#1c1d1f] text-[#1c1d1f] font-bold hover:bg-surface-50 transition-colors flex items-center gap-2">
                Learn more <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Right Courses Area */}
          <div className="flex-1 bg-transparent p-12 relative group">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {MOCK_PARTNER_COURSES.map((course) => (
                    <div key={course.id} className="bg-white rounded-sm p-4 shadow-lg transform transition-transform hover:-translate-y-2">
                        <div className="aspect-video relative mb-4 rounded-sm overflow-hidden border border-surface-100">
                            <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" />
                        </div>
                        <h3 className="line-clamp-2 text-sm font-bold text-[#1c1d1f] mb-2">{course.title}</h3>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-[10px] bg-surface-100 px-2 py-0.5 rounded-full text-surface-600">Course 1 of 8</span>
                            <span className="text-xs font-bold text-primary-600">Free</span>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Scroll Indication for partner courses (Visual) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <ChevronRight className="h-6 w-6 text-white" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
