import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getCourseBySlug } from '@/lib/db/queries'
import { Button, StarRating } from '@/components/ui'
import { VideoPlayer } from '@/components/course/VideoPlayer'
import { formatPrice, formatCourseDuration, formatCount, calcDiscountPercent } from '@/lib/utils'
import { 
  Check, PlayCircle, FileText, HelpCircle, FileDown,
  MonitorPlay, Smartphone, Award, Infinity as AllTime,
  Globe, Clock, ChevronRight, Play, Heart,
  Share2, Award as BadgeCheck, User, Star
} from 'lucide-react'
import CourseLandingClient from './CourseLandingClient'
import EnrollButton from './EnrollButton'

export default async function CourseLandingPage({ params }: { params: { slug: string } }) {
  const session = await auth()
  const course = await getCourseBySlug(params.slug)

  if (!course) {
     return <div className="min-h-screen flex items-center justify-center bg-surface-950 text-white">Course not found</div>
  }

  // Check enrollment if logged in
  let isEnrolled = false
  if (session?.user?.id) {
    const enrollment = await prisma.enrollment.findFirst({
        where: {
            userId: session.user.id,
            courseId: course.id
        }
    })
    isEnrolled = !!enrollment
  }

  const discount = course.originalPrice ? calcDiscountPercent(course.originalPrice.toNumber(), course.price.toNumber()) : 0

  return (
    <div className="min-h-screen bg-surface-950 pb-24 relative">
      
      {/* Passing data to a client component for interactive parts like Accordion and Sticky Bar */}
      <CourseLandingClient course={course as any} isEnrolled={isEnrolled} />

      <div className="container mx-auto px-4 lg:px-8 py-8 xl:py-10 grid xl:grid-cols-[1fr_400px] gap-12 relative items-start">
        
        {/* MAIN CONTENT (LEFT SIDE) */}
        <div className="space-y-12">
          
          {/* HEADER & HERO */}
          <div className="space-y-6">
             {/* Breadcrumb */}
             <div className="flex items-center flex-wrap gap-2 text-sm font-medium text-surface-400">
               <Link href="/courses" className="hover:text-primary-400 transition-colors">Courses</Link>
               <ChevronRight className="w-3.5 h-3.5" />
               <Link href={`/category/${course.category?.slug}`} className="hover:text-primary-400 transition-colors capitalize">{course.category?.name || 'Category'}</Link>
               <ChevronRight className="w-3.5 h-3.5" />
               <span className="text-surface-200 capitalize">{course.level.replace('-', ' ')}</span>
             </div>

             <h1 className="text-3xl sm:text-4xl xl:text-5xl font-heading font-bold text-white leading-tight">
               {course.title}
             </h1>
             
             {course.subtitle && (
               <p className="text-lg text-surface-300 leading-relaxed font-medium">
                 {course.subtitle}
               </p>
             )}

             <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
                <div className="flex items-center gap-1.5 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                  <span className="font-bold text-yellow-400">{Number(course.averageRating || 0).toFixed(1)}</span>
                  <StarRating rating={Number(course.averageRating || 0)} />
                  <span className="text-surface-300">({formatCount(course.totalReviews || 0)} ratings)</span>
                </div>
                <div className="text-surface-300">
                  <strong className="text-white">{formatCount(course.totalStudents || 0)}</strong> students
                </div>
             </div>

             <div className="flex flex-wrap items-center gap-6 text-sm text-surface-400">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4" />
                  Created by <Link href={`/instructor/${course.instructor?.id}`} className="text-primary-400 hover:underline font-medium ml-1">{course.instructor?.name}</Link>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Last updated {new Date(course.updatedAt || course.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" /> {course.language.charAt(0).toUpperCase() + course.language.slice(1)}
                </div>
             </div>
          </div>

          <div className="xl:hidden w-full relative aspect-video rounded-xl overflow-hidden bg-surface-800 border-2 border-surface-700 shadow-2xl mb-8">
              {course.previewVideoUrl ? (
                <VideoPlayer 
                  url={course.previewVideoUrl} 
                  thumbnailUrl={course.thumbnailUrl || undefined} 
                />
              ) : course.thumbnailUrl ? (
                <Image src={course.thumbnailUrl} alt="Course Preview" fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-surface-800"><MonitorPlay className="w-16 h-16 text-surface-600" /></div>
              )}
          </div>

          {/* WHAT YOU WILL LEARN */}
          {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
            <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold font-heading text-white mb-6">What you&apos;ll learn</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {course.whatYouWillLearn.map((item, i) => (
                  <div key={i} className="flex gap-3 text-surface-200 text-sm sm:text-base">
                    <Check className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REQUIREMENTS */}
          {course.requirements && course.requirements.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold font-heading text-white mb-4">Requirements</h2>
              <ul className="space-y-2 list-inside list-disc text-surface-300">
                {course.requirements.map((req, i) => (
                   <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* DESCRIPTION */}
          <div>
            <h2 className="text-2xl font-bold font-heading text-white mb-4">Description</h2>
            <div 
               className="prose prose-invert prose-surface max-w-none text-surface-300 leading-relaxed"
               dangerouslySetInnerHTML={{ __html: course.description || '' }}
            />
          </div>

          {/* CURRICULUM ISLAND */}
          <div id="curriculum">
             <h2 className="text-2xl font-bold font-heading text-white mb-6">Course content</h2>
             {/* This could also be passed to CourseLandingClient for full interactivity */}
             <div className="border border-surface-800 rounded-2xl overflow-hidden bg-surface-900">
                {course.sections.map((section: any, idx: number) => (
                    <div key={section.id} className="border-b border-surface-800 last:border-0 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Section {idx+1}: {section.title}</h3>
                            <span className="text-surface-400 text-sm">{section.lectures.length} lectures</span>
                        </div>
                        <div className="space-y-3">
                            {section.lectures.map((lecture: any) => (
                                <div key={lecture.id} className="flex items-center gap-3 text-surface-300">
                                    <PlayCircle className="w-4 h-4 text-surface-500" />
                                    <span>{lecture.title}</span>
                                    {lecture.isFreePreview && <span className="ml-auto text-xs text-primary-400 font-bold uppercase">Preview</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
             </div>
          </div>

          {/* INSTRUCTOR CARD */}
          <div>
            <h2 className="text-2xl font-bold font-heading text-white mb-6">Instructor</h2>
            <div className="flex gap-4 mb-4">
               <div className="w-20 h-20 rounded-full bg-surface-800 border-2 border-surface-700 overflow-hidden relative shrink-0">
                 {course.instructor?.image ? (
                   <Image src={course.instructor.image!} alt={course.instructor.name || ''} fill className="object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-surface-800 text-surface-500"><User className="w-8 h-8" /></div>
                 )}
               </div>
               <div>
                  <Link href={`/instructor/${course.instructor?.id}`} className="text-primary-400 hover:text-primary-300 transition-colors font-bold text-lg block hover:underline">
                    {course.instructor?.name}
                  </Link>
                  <p className="text-surface-400 text-sm font-medium mb-2">{course.instructor?.profile?.headline || 'Expert Instructor'}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-surface-300">
                    <div className="flex items-center gap-1.5"><Star className="w-4 h-4 text-primary-400" /> 4.8 Instructor Rating</div>
                    <div className="flex items-center gap-1.5"><Award className="w-4 h-4 text-primary-400" /> 145,231 Reviews</div>
                    <div className="flex items-center gap-1.5"><User className="w-4 h-4 text-primary-400" /> 750,000+ Students</div>
                    <div className="flex items-center gap-1.5"><PlayCircle className="w-4 h-4 text-primary-400" /> 12 Courses</div>
                  </div>
               </div>
            </div>
            {course.instructor?.profile?.bio && (
               <p className="text-surface-300 leading-relaxed text-sm sm:text-base line-clamp-4">
                 {course.instructor.profile.bio}
               </p>
            )}
            <Button variant="outline" className="mt-4">View Profile</Button>
          </div>

        </div>

        {/* RIGHT FULL SIDEBAR (STICKY ON LARGE SCREENS) */}
        <div className="relative w-full xl:w-[380px] shrink-0 transition-all hidden xl:block z-40">
           <div className="sticky top-24 bg-surface-900 border border-surface-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              
              {/* Video Preview */}
              <div className="relative aspect-video bg-black group cursor-pointer border-b border-surface-800">
                {course.previewVideoUrl ? (
                  <VideoPlayer 
                    url={course.previewVideoUrl} 
                    thumbnailUrl={course.thumbnailUrl || undefined} 
                  />
                ) : course.thumbnailUrl ? (
                  <Image src={course.thumbnailUrl} alt="Course Preview" fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-surface-800"><MonitorPlay className="w-12 h-12 text-surface-600" /></div>
                )}
              </div>

              {/* Purchase Card Body */}
              <div className="p-6">
                <div className="flex items-end gap-3 mb-2">
                   <span className="text-3xl font-heading font-bold text-white leading-none">
                     {course.isFree ? 'Free' : formatPrice(course.price.toNumber())}
                   </span>
                   {discount > 0 && (
                     <>
                        <span className="text-surface-400 line-through text-lg">{formatPrice(course.originalPrice!.toNumber())}</span>
                        <span className="text-white font-semibold flex items-center justify-center bg-accent-600 text-xs px-2 py-0.5 rounded-md self-center">{discount}% off</span>
                     </>
                   )}
                </div>
                
                <div className="flex items-center gap-2 text-error text-sm font-bold mb-6 flex-wrap">
                   <Clock className="w-4 h-4" /> 
                   {discount > 0 ? 'Discount ends in 5 hours!' : 'Lifetime access'}
                </div>

                <div className="space-y-3">
                   <EnrollButton courseId={course.id} courseSlug={params.slug} isEnrolled={isEnrolled} isFree={course.isFree} />
                   <p className="text-center text-xs text-surface-500 mt-2">30-Day Money-Back Guarantee</p>
                </div>

                <div className="mt-8 space-y-4">
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider">This course includes:</h4>
                  <ul className="space-y-3 text-sm text-surface-300">
                    <li className="flex items-center gap-3"><MonitorPlay className="w-4 h-4" /> On-demand video</li>
                    <li className="flex items-center gap-3"><FileDown className="w-4 h-4" /> Downloadable resources</li>
                    <li className="flex items-center gap-3"><Smartphone className="w-4 h-4" /> Access on mobile and TV</li>
                    <li className="flex items-center gap-3"><AllTime className="w-4 h-4" /> Full lifetime access</li>
                    <li className="flex items-center gap-3"><Award className="w-4 h-4" /> Certificate of completion</li>
                  </ul>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-surface-800 pt-6">
                  <button className="text-sm font-bold text-white underline hover:text-primary-400 transition-colors">Apply Coupon</button>
                  <div className="flex items-center gap-2">
                    <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-surface-800 text-surface-400 hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-surface-800 text-surface-400 hover:text-white transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
           </div>
        </div>

      </div>

      {/* MOBILE BOTTOM STICKY PURCHASE BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-surface-800 bg-surface-900/90 backdrop-blur-md z-50 xl:hidden">
         <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
            <div>
              <div className="text-2xl font-bold text-white leading-none">{course.isFree ? 'Free' : formatPrice(course.price.toNumber())}</div>
              {discount > 0 && <div className="text-sm line-through text-surface-400">{formatPrice(course.originalPrice!.toNumber())}</div>}
            </div>
            <div className="flex-1 max-w-sm">
              <EnrollButton courseId={course.id} courseSlug={params.slug} isEnrolled={isEnrolled} isFree={course.isFree} />
            </div>
         </div>
      </div>

    </div>
  )
}
