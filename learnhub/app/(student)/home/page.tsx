import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getLoggedInHomepageData, getLearningStats } from "@/lib/queries/home"
import { ContinueLearningBar } from "@/components/home/ContinueLearningBar"
import { LearningStats } from "@/components/home/LearningStats"
import { TopicTabSection } from "@/components/home/TopicTabSection"
import CourseCarousel from "@/components/home/CourseCarousel"
import { AIRecommendations } from "@/components/home/AIRecommendations"
import { Sparkles } from "lucide-react"

export default async function StudentHomePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const [homeData, stats] = await Promise.all([
    getLoggedInHomepageData(session.user.id),
    getLearningStats(session.user.id)
  ])

  const firstName = session.user.name?.split(" ")[0] || "Learner"

  return (
    <div className="pb-20 bg-white">
      {/* Continue Learning Bar */}
      {homeData.lastAccessed && (
        <ContinueLearningBar data={homeData.lastAccessed} />
      )}

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-16">
        {/* Welcome Greeting */}
        <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#1c1d1f]">Welcome back, {firstName}!</h1>
            <p className="text-surface-600 text-lg">What would you like to learn today?</p>
        </div>

        {/* Learning Stats */}
        <section>
            <LearningStats stats={stats} />
        </section>

        {/* Let's start learning row */}
        {homeData.enrolled.length > 0 && (
            <section>
                <CourseCarousel 
                    title={`Let's start learning, ${firstName}`} 
                    courses={homeData.enrolled} 
                />
            </section>
        )}

        {/* AI Powered Recommendations */}
        <AIRecommendations />

        {/* Because you viewed */}
        {homeData.recentlyViewed && (
            <section>
                <CourseCarousel 
                    title={`Because you viewed "${homeData.recentlyViewed.title}"`} 
                    courses={[homeData.recentlyViewed]} 
                />
            </section>
        )}

        {/* Students are viewing */}
        <section>
            <CourseCarousel 
                title="Students are viewing" 
                subtitle="Top courses this week"
                courses={homeData.trending} 
            />
        </section>

        {/* Topics Tab Section */}
        <section>
            <TopicTabSection initialCategories={homeData.categories} />
        </section>

        {/* Wishlist Preview */}
        {homeData.wishlist.length > 0 && (
            <section className="border-t border-surface-100 pt-16">
                <CourseCarousel 
                    title="Your wishlist" 
                    courses={homeData.wishlist} 
                />
            </section>
        )}

        {/* Top Categories */}
        <section className="space-y-6">
            <h2 className="text-2xl font-bold text-[#1c1d1f]">Top categories for you</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {homeData.categories.map((cat: any) => (
                    <div key={cat.id} className="p-6 border border-surface-200 rounded-sm hover:border-[#1c1d1f] transition-all cursor-pointer group">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                            {cat.icon || "🎓"}
                        </div>
                        <h3 className="font-bold text-[#1c1d1f]">{cat.name}</h3>
                        <p className="text-sm text-surface-500 mt-1">{cat.courseCount} courses</p>
                    </div>
                ))}
            </div>
        </section>
      </main>
    </div>
  )
}
