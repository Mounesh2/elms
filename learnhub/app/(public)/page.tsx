import { Suspense } from 'react'
import HeroBanner from '@/components/home/HeroBanner'
import TrustedCompanies from '@/components/home/TrustedCompanies'
import TopicTabs from '@/components/home/TopicTabs'
import PartnerBlock from '@/components/home/PartnerBlock'
import SubscriptionBanner from '@/components/home/SubscriptionBanner'
import CertificationBanner from '@/components/home/CertificationBanner'
import TestimonialGrid from '@/components/home/TestimonialGrid'
import CareerAccelerators from '@/components/home/CareerAccelerators'
import CourseCarousel from '@/components/home/CourseCarousel'
import YoutubeChannels from '@/components/home/YoutubeChannels'
import { getCourses } from '@/lib/db/queries'
import { Spinner } from '@/components/ui'

export const metadata = {
  title: 'Online Courses - Learn Anything, On Your Schedule | LearnHub',
  description: 'LearnHub is an online learning and teaching marketplace with over 213,000 courses and 62 million students. Learn programming, marketing, data science and more.',
}

export default async function LandingPage() {
  const trendingCourses = await getCourses({ limit: 12 })

  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Trusted Companies Strip */}
      <TrustedCompanies />

      {/* 3. Main Topic Tabs Area */}
      <TopicTabs />

      {/* 4. Partner Promo Block */}
      <PartnerBlock />

      {/* 5. Trending Courses Section */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <CourseCarousel 
                courses={trendingCourses} 
                title="Learners are viewing" 
            />
        </div>
      </section>

      {/* 6. YouTube Free Courses */}
      <YoutubeChannels />

      {/* 7. Subscription Promo Banner */}
      <SubscriptionBanner />

      {/* 7. Career Accelerators Section */}
      <CareerAccelerators />

      {/* 8. Get Certified Banner */}
      <CertificationBanner />

      {/* 9. Trending topics this week / Popular Skills */}
      <section className="py-16 bg-[#f7f8fa]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1c1d1f] mb-8">Popular skills on LearnHub</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {['Python', 'Excel', 'Web Development', 'JavaScript', 'Data Science', 'AWS Certification', 'Drawing', 'SQL'].map(skill => (
                    <a key={skill} href={`/search?q=${skill}`} className="flex items-center justify-between p-4 bg-white border border-surface-200 hover:bg-surface-50 transition-colors group">
                        <span className="font-bold text-[#1c1d1f]">{skill}</span>
                        <span className="text-surface-400 group-hover:text-primary-700">→</span>
                    </a>
                ))}
            </div>
        </div>
      </section>

      {/* 10. Student Testimonials */}
      <TestimonialGrid />

      {/* 11. Final CTA for Instructors */}
      <section className="py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
             <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-24">
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl">
                    <img 
                        src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800" 
                        alt="Instructor" 
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="flex flex-col gap-6">
                    <h2 className="text-4xl font-bold text-[#1c1d1f]">Become an instructor</h2>
                    <p className="text-lg text-surface-600 leading-relaxed">
                        Instructors from around the world teach millions of learners on LearnHub. We provide the tools and platform to teach what you love.
                    </p>
                    <a href="/instructor/setup" className="w-fit px-8 py-4 bg-[#1c1d1f] text-white font-bold hover:bg-surface-800 transition-colors">
                        Start teaching today
                    </a>
                </div>
             </div>
        </div>
      </section>
    </main>
  )
}
