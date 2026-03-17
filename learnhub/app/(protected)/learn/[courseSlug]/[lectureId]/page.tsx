'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, CheckCircle, Circle, ChevronDown, ChevronUp,
  PlayCircle, FileText, HelpCircle, Bell, MessageSquare, Clock
} from 'lucide-react'
import { Button, StarRating } from '@/components/ui'

interface Lecture {
  id: string
  title: string
  type: string
  durationSeconds: number
  videoUrl: string | null
  articleContent: string | null
}

interface Section {
  id: string
  title: string
  lectures: Lecture[]
}

interface CourseData {
  id: string
  title: string
  slug: string
  sections: Section[]
  instructor: { name: string; image: string | null }
}

interface ProgressMap {
  [lectureId: string]: { completed: boolean; lastPositionSeconds: number }
}

function fmtDur(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
}

function getYoutubeEmbedUrl(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url
}

export default function LearnPage({ params }: { params: { courseSlug: string; lectureId: string } }) {
  const router = useRouter()
  const [course, setCourse] = useState<CourseData | null>(null)
  const [progress, setProgress] = useState<ProgressMap>({})
  const [activeLectureId, setActiveLectureId] = useState(params.lectureId)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'qa' | 'announcements' | 'reviews'>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const courseRes = await fetch(`/api/courses/${params.courseSlug}/content`)
        if (!courseRes.ok) {
          const err = await courseRes.json()
          setError(err.error || 'Failed to load course')
          setLoading(false)
          return
        }
        const courseData: CourseData = await courseRes.json()
        setCourse(courseData)

        // Fetch progress using the real course UUID
        const progressRes = await fetch(`/api/progress?courseId=${courseData.id}`)
        if (progressRes.ok) {
          const progressData: any[] = await progressRes.json()
          const map: ProgressMap = {}
          progressData.forEach(p => {
            map[p.lectureId] = { completed: p.completed, lastPositionSeconds: p.lastPositionSeconds }
          })
          setProgress(map)
        }

        // Auto-expand section of active lecture
        const allSections = courseData.sections ?? []
        allSections.forEach(s => {
          if (s.lectures.some(l => l.id === params.lectureId)) {
            setExpandedSections(prev => {
              const next = new Set(prev)
              next.add(s.id)
              return next
            })
          }
        })

        // If 'default', redirect to first lecture
        if (params.lectureId === 'default' && allSections[0]?.lectures[0]) {
          const firstId = allSections[0].lectures[0].id
          setActiveLectureId(firstId)
          router.replace(`/learn/${params.courseSlug}/${firstId}`)
        }
      } catch (e) {
        setError('Something went wrong loading the course.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.courseSlug, params.lectureId, router])

  const allLectures = course?.sections.flatMap(s => s.lectures) ?? []
  const activeLecture = allLectures.find(l => l.id === activeLectureId)
  const currentIndex = allLectures.findIndex(l => l.id === activeLectureId)
  const prevLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null
  const nextLecture = currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null
  const completedCount = Object.values(progress).filter(p => p.completed).length
  const overallProgress = allLectures.length > 0 ? Math.round((completedCount / allLectures.length) * 100) : 0

  const goToLecture = (lecture: Lecture) => {
    setActiveLectureId(lecture.id)
    router.push(`/learn/${params.courseSlug}/${lecture.id}`)
    course?.sections.forEach(s => {
      if (s.lectures.some(l => l.id === lecture.id)) {
        setExpandedSections(prev => {
          const next = new Set(prev)
          next.add(s.id)
          return next
        })
      }
    })
  }

  const markComplete = useCallback(async (lectureId: string, completed: boolean) => {
    setProgress(prev => ({ ...prev, [lectureId]: { ...prev[lectureId], completed } }))
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lectureId, courseId: course?.id, completed, lastPositionSeconds: progress[lectureId]?.lastPositionSeconds ?? 0 })
    })
  }, [course?.id, progress])

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  if (loading) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="text-white text-lg animate-pulse">Loading course...</div>
    </div>
  )

  if (error || !course) return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-white text-xl">{error || 'Course not found or you are not enrolled.'}</p>
      <Link href="/my-courses"><Button>Go to My Courses</Button></Link>
    </div>
  )

  return (
    <div className="h-screen bg-surface-950 flex flex-col overflow-hidden">

      {/* TOP BAR */}
      <header className="shrink-0 z-30 bg-[#1c1d1f] border-b border-surface-800 flex items-center gap-3 px-4 h-14">
        <Link href="/my-courses" className="w-9 h-9 flex items-center justify-center rounded hover:bg-surface-800 text-surface-400 hover:text-white transition-colors shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-white font-bold text-sm truncate flex-1">{course.title}</h1>
        <div className="hidden sm:flex items-center gap-2 text-xs text-surface-400 shrink-0">
          <div className="w-32 h-1.5 bg-surface-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all" style={{ width: `${overallProgress}%` }} />
          </div>
          <span className="text-white font-bold">{overallProgress}% complete</span>
        </div>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="ml-3 px-3 py-1.5 text-xs font-bold border border-surface-600 text-surface-300 hover:text-white hover:border-surface-400 rounded transition-colors shrink-0"
        >
          {sidebarOpen ? 'Hide' : 'Show'} content
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* MAIN */}
        <main className="flex-1 flex flex-col overflow-y-auto min-w-0">

          {/* Video */}
          <div className="bg-black w-full shrink-0">
            {activeLecture?.videoUrl ? (
              <div className="aspect-video w-full">
                <iframe
                  key={activeLecture.id}
                  src={
                    activeLecture.videoUrl.includes('youtube.com') || activeLecture.videoUrl.includes('youtu.be')
                      ? getYoutubeEmbedUrl(activeLecture.videoUrl)
                      : activeLecture.videoUrl
                  }
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            ) : activeLecture?.type === 'article' ? (
              <div className="max-w-3xl mx-auto px-6 py-10 text-surface-200 prose prose-invert"
                dangerouslySetInnerHTML={{ __html: activeLecture.articleContent || '<p>No content.</p>' }}
              />
            ) : (
              <div className="aspect-video flex items-center justify-center text-surface-600">
                <PlayCircle className="w-16 h-16" />
              </div>
            )}
          </div>

          {/* Prev / Mark Complete / Next */}
          <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-surface-800 bg-surface-950 gap-2">
            <button
              disabled={!prevLecture}
              onClick={() => prevLecture && goToLecture(prevLecture)}
              className="px-4 py-2 text-sm font-bold border border-surface-700 text-surface-300 hover:text-white hover:border-surface-500 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>

            <button
              onClick={() => activeLecture && markComplete(activeLecture.id, !progress[activeLecture.id]?.completed)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded transition-all ${
                progress[activeLecture?.id ?? '']?.completed
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'border border-surface-600 text-surface-300 hover:border-green-500 hover:text-green-400'
              }`}
            >
              {progress[activeLecture?.id ?? '']?.completed
                ? <><CheckCircle className="w-4 h-4" /> Completed</>
                : <><Circle className="w-4 h-4" /> Mark complete</>
              }
            </button>

            <button
              disabled={!nextLecture}
              onClick={() => nextLecture && goToLecture(nextLecture)}
              className="px-4 py-2 text-sm font-bold border border-surface-700 text-surface-300 hover:text-white hover:border-surface-500 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>

          {/* Tabs */}
          <div className="shrink-0 px-6 border-b border-surface-800 flex gap-6 overflow-x-auto no-scrollbar bg-surface-950">
            {(['overview', 'notes', 'qa', 'announcements', 'reviews'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-sm font-bold capitalize whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab ? 'border-primary-500 text-white' : 'border-transparent text-surface-400 hover:text-surface-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="px-6 py-6 max-w-3xl">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">{activeLecture?.title}</h2>
                <div className="flex items-center gap-3 text-sm text-surface-400">
                  {activeLecture?.durationSeconds ? <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{fmtDur(activeLecture.durationSeconds)}</span> : null}
                  <span className="capitalize px-2 py-0.5 bg-surface-800 rounded text-xs">{activeLecture?.type}</span>
                </div>
                <div className="pt-4 border-t border-surface-800 flex items-center gap-3">
                  {course.instructor.image && <img src={course.instructor.image} alt="" className="w-9 h-9 rounded-full object-cover" />}
                  <span className="text-surface-300 text-sm font-medium">{course.instructor.name}</span>
                </div>
              </div>
            )}
            {activeTab === 'notes' && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-white">My Notes</h2>
                <textarea placeholder="Take notes for this lecture..." className="w-full h-32 bg-surface-900 border border-surface-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary-500 resize-none placeholder:text-surface-600" />
                <Button size="sm">Save Note</Button>
              </div>
            )}
            {activeTab === 'qa' && (
              <div className="text-center py-10 text-surface-500">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>Q&A coming soon.</p>
              </div>
            )}
            {activeTab === 'announcements' && (
              <div className="text-center py-10 text-surface-500">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No announcements yet.</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-white">Leave a Review</h2>
                <StarRating rating={0} />
                <textarea placeholder="Share your experience..." className="w-full h-24 bg-surface-900 border border-surface-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary-500 resize-none placeholder:text-surface-600" />
                <Button size="sm">Submit Review</Button>
              </div>
            )}
          </div>
        </main>

        {/* SIDEBAR */}
        {sidebarOpen && (
          <aside className="w-[320px] shrink-0 border-l border-surface-800 bg-[#1c1d1f] overflow-y-auto hidden lg:flex flex-col">
            <div className="p-4 border-b border-surface-800 shrink-0">
              <p className="font-bold text-white text-sm">Course content</p>
              <p className="text-xs text-surface-400 mt-0.5">{completedCount}/{allLectures.length} completed</p>
              <div className="mt-2 h-1 bg-surface-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>

            {course.sections.map((section, idx) => {
              const isExpanded = expandedSections.has(section.id)
              const done = section.lectures.filter(l => progress[l.id]?.completed).length
              return (
                <div key={section.id} className="border-b border-surface-800">
                  <button onClick={() => toggleSection(section.id)} className="w-full flex items-start justify-between p-4 hover:bg-surface-800 transition-colors text-left gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white leading-snug">Section {idx + 1}: {section.title}</p>
                      <p className="text-[11px] text-surface-500 mt-0.5">{done}/{section.lectures.length} lectures</p>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-surface-500 shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-surface-500 shrink-0 mt-0.5" />}
                  </button>

                  {isExpanded && section.lectures.map(lecture => {
                    const isActive = lecture.id === activeLectureId
                    const isDone = progress[lecture.id]?.completed
                    return (
                      <button
                        key={lecture.id}
                        onClick={() => goToLecture(lecture)}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-l-2 ${
                          isActive ? 'bg-surface-800 border-primary-500' : 'border-transparent hover:bg-surface-800/50'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone
                            ? <CheckCircle className="w-4 h-4 text-green-500" />
                            : lecture.type === 'article'
                              ? <FileText className="w-4 h-4 text-surface-500" />
                              : lecture.type === 'quiz'
                                ? <HelpCircle className="w-4 h-4 text-surface-500" />
                                : <PlayCircle className={`w-4 h-4 ${isActive ? 'text-primary-400' : 'text-surface-500'}`} />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs leading-snug line-clamp-2 ${isActive ? 'text-white font-bold' : 'text-surface-300'}`}>{lecture.title}</p>
                          {lecture.durationSeconds > 0 && <p className="text-[10px] text-surface-500 mt-0.5">{fmtDur(lecture.durationSeconds)}</p>}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </aside>
        )}
      </div>
    </div>
  )
}
