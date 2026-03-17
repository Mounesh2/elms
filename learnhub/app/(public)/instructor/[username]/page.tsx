import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, Button } from '@/components/ui'
import CourseCard from '@/components/course/CourseCard'
import { User, Users, Star, PlayCircle, Globe, Twitter, Linkedin, MapPin, GraduationCap } from 'lucide-react'
import type { Course } from '@/types'

// Fetch instructor data directly in the server component
async function getInstructorData(username: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/instructor/${username}`, {
    next: { revalidate: 60 } // Cache for 1 minute
  })
  
  if (!res.ok) return null
  return res.json()
}

export default async function InstructorProfilePage({ params }: { params: { username: string } }) {
  const data = await getInstructorData(params.username)
  
  if (!data) return notFound()

  const { profile, stats, courses } = data

  return (
    <div className="min-h-screen bg-surface-950 pb-20">
      
      {/* ── Banner/Header Area ── */}
      <div className="h-48 w-full bg-gradient-to-r from-primary-900 to-indigo-900 relative">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8 relative -mt-20">
          
          {/* ── Left Sidebar (Sticky) ── */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <Card className="p-6 sticky top-24 shadow-2xl bg-surface-900/90 backdrop-blur border-surface-800">
              
              <div className="relative mx-auto h-32 w-32 -mt-16 mb-4 overflow-hidden rounded-full border-4 border-surface-900 bg-surface-800">
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-surface-400">
                    <User size={48} />
                  </div>
                )}
              </div>

              <div className="text-center mb-6">
                <h1 className="font-heading text-xl font-bold text-white">{profile.full_name}</h1>
                <p className="text-primary-400 text-sm font-medium mb-2">@{profile.username}</p>
                {profile.headline && <p className="text-surface-300 text-sm">{profile.headline}</p>}
              </div>

              <div className="space-y-4 mb-6 pt-4 border-t border-surface-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-surface-400 flex items-center gap-2"><Users className="w-4 h-4" /> Students</span>
                  <span className="font-medium text-white">{stats.totalStudents.toLocaleString('en-US')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-surface-400 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500" /> Reviews</span>
                  <span className="font-medium text-white">{stats.totalReviews.toLocaleString('en-US')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-surface-400 flex items-center gap-2"><PlayCircle className="w-4 h-4" /> Courses</span>
                  <span className="font-medium text-white">{stats.courseCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-surface-400 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Taught Since</span>
                  <span className="font-medium text-white">{new Date(profile.created_at).getFullYear()}</span>
                </div>
              </div>

              {/* Social Links */}
              {(profile.website_url || profile.twitter_url || profile.linkedin_url) && (
                <div className="flex justify-center gap-4 pt-4 border-t border-surface-800">
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noreferrer" className="text-surface-400 hover:text-white transition-colors">
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                  {profile.twitter_url && (
                    <a href={profile.twitter_url} target="_blank" rel="noreferrer" className="text-surface-400 hover:text-blue-400 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-surface-400 hover:text-blue-600 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}

            </Card>
          </div>

          {/* ── Right Content Area ── */}
          <div className="w-full md:w-2/3 lg:w-3/4 pt-24 md:pt-4">
            
            {/* About Section */}
            {profile.bio && (
              <section className="mb-12">
                <h2 className="text-2xl font-heading font-bold text-white mb-4">About the Instructor</h2>
                <div className="prose prose-invert prose-surface max-w-none text-surface-300 bg-surface-900/50 p-6 rounded-2xl border border-surface-800/50 leading-relaxed whitespace-pre-wrap">
                  {profile.bio}
                </div>
              </section>
            )}

            {/* Courses Grid */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-6">Courses by {profile.full_name?.split(' ')[0] || 'Instructor'}</h2>
              
              {courses.length === 0 ? (
                <div className="text-center py-12 bg-surface-900/30 rounded-2xl border border-surface-800 border-dashed">
                  <GraduationCap className="w-12 h-12 text-surface-600 mx-auto mb-3" />
                  <p className="text-surface-400">No courses published yet.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {courses.map((course: Record<string, unknown>) => (
                    <CourseCard
                      key={course.id as string}
                      course={{
                        id: course.id as string,
                        title: course.title as string,
                        slug: course.slug as string,
                        thumbnailUrl: (course.thumbnail_url || course.thumbnailUrl) as string,
                        price: course.price,
                        averageRating: (course.average_rating || course.averageRating || 0),
                        totalReviews: (course.total_reviews || course.totalReviews || 0) as number,
                        instructor: {
                          name: profile.full_name,
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </section>

          </div>

        </div>
      </div>
    </div>
  )
}
