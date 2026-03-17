"use client"

import { useState } from "react"
import { VideoPlayer } from "@/components/course/VideoPlayer"
import { 
  ChevronRight, 
  ChevronDown, 
  PlayCircle, 
  CheckCircle2, 
  Circle, 
  MessageSquare, 
  Info, 
  Download,
  Search,
  Send,
  Loader2
} from "lucide-react"
import { Button, Input } from "@/components/ui"
import { toast } from "react-hot-toast"

interface Lecture {
  id: string
  title: string
  videoUrl: string
  completed: boolean
  durationSeconds: number
}

interface Section {
  id: string
  title: string
  lectures: Lecture[]
}

interface CoursePlayerProps {
  course: {
    id: string
    title: string
    sections: Section[]
  }
}

export default function CoursePlayer({ course }: CoursePlayerProps) {
  const [activeLecture, setActiveLecture] = useState<Lecture>(course.sections[0]?.lectures[0])
  const [expandedSections, setExpandedSections] = useState<string[]>([course.sections[0]?.id])
  const [aiQuery, setAiQuery] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"content" | "ai" | "overview">("content")

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleProgress = async (lectureId: string, seconds: number) => {
    // Throttled progress update in a real app
  }

  const handleComplete = async (lectureId: string) => {
    try {
      await fetch("/api/courses/progress", {
        method: "POST",
        body: JSON.stringify({ courseId: course.id, lectureId, completed: true })
      })
      toast.success("Lesson completed!")
    } catch (e) {}
  }

  const askAi = async () => {
    if (!aiQuery.trim()) return
    setIsAiLoading(true)
    setAiResponse("")
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          courseId: course.id,
          question: aiQuery,
          context: activeLecture.title
        })
      })
      const data = await res.json()
      setAiResponse(data.answer)
    } catch (e) {
      toast.error("AI Assistant is temporarily unavailable")
    } finally {
      setIsAiLoading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <div className="bg-[#1c1d1f] text-white p-4 flex items-center justify-between border-b border-surface-800">
          <h1 className="font-bold truncate">{course.title}</h1>
          <div className="flex items-center gap-4 text-sm font-medium">
             <div className="flex items-center gap-2">
                <div className="w-24 bg-surface-700 h-1 rounded-full overflow-hidden">
                    <div className="bg-primary-500 h-full w-[15%]" />
                </div>
                <span>15% complete</span>
             </div>
             <button className="border border-white/20 px-3 py-1 hover:bg-white/10 transition-colors">
                Your progress
             </button>
          </div>
        </div>

        {/* Video Player Area */}
        <div className="bg-black">
          {activeLecture ? (
            <VideoPlayer 
                url={activeLecture.videoUrl} 
                onComplete={() => handleComplete(activeLecture.id)}
            />
          ) : (
            <div className="aspect-video bg-black flex items-center justify-center text-white">
                Select a lecture to start learning
            </div>
          )}
        </div>

        {/* Tabs and Info Area */}
        <div className="p-6">
            <div className="flex border-b border-surface-200 mb-6 font-bold text-[#1c1d1f]">
                {["Overview", "Q&A", "Notes", "Announcements", "AI Assistant"].map(tab => (
                    <button 
                        key={tab}
                        className={`px-6 py-3 border-b-2 transition-colors ${tab === "AI Assistant" && activeTab === "ai" ? "border-[#1c1d1f]" : "border-transparent text-surface-600 hover:text-[#1c1d1f]"}`}
                        onClick={() => tab === "AI Assistant" ? setActiveTab("ai") : setActiveTab("overview")}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "ai" ? (
                <div className="max-w-4xl space-y-6">
                    <h2 className="text-xl font-bold">In-Course AI Assistant</h2>
                    <div className="bg-surface-50 rounded-xl p-6 border border-surface-200">
                        <div className="flex gap-4">
                            <Input 
                                placeholder="Ask about the current lecture..." 
                                className="bg-white"
                                value={aiQuery}
                                onChange={(e) => setAiQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && askAi()}
                            />
                            <Button onClick={askAi} className="bg-[#1c1d1f] hover:bg-surface-800 text-white" disabled={isAiLoading}>
                                {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </div>
                        {aiResponse && (
                            <div className="mt-8 prose prose-slate max-w-none">
                                <div className="p-4 bg-white border border-primary-100 rounded-lg shadow-sm">
                                    <p className="font-bold text-primary-900 mb-2">AI Response:</p>
                                    <p className="whitespace-pre-wrap text-surface-700">{aiResponse}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl">
                    <h2 className="text-2xl font-bold mb-4">About this course</h2>
                    <p className="text-surface-700 leading-relaxed">
                        {activeLecture?.title || "Welcome to the course"}
                    </p>
                </div>
            )}
        </div>
      </div>

      {/* Curriculum Sidebar */}
      <div className="w-full lg:w-[400px] border-l border-surface-200 bg-white flex flex-col h-screen overflow-y-auto sticky top-0">
        <div className="p-4 bg-surface-50 border-b border-surface-200 font-bold text-lg">
          Course content
        </div>
        <div className="flex-grow">
          {course.sections.map((section, idx) => (
            <div key={section.id} className="border-b border-surface-200">
              <button 
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-surface-50 transition-colors"
              >
                <div className="flex flex-col items-start text-left">
                  <span className="font-bold text-[#1c1d1f]">Section {idx + 1}: {section.title}</span>
                  <span className="text-xs text-surface-500">0 / {section.lectures.length} | {section.lectures.length * 10}min</span>
                </div>
                {expandedSections.includes(section.id) ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
              
              {expandedSections.includes(section.id) && (
                <div className="bg-white">
                  {section.lectures.map((lecture, lIdx) => (
                    <button 
                      key={lecture.id}
                      onClick={() => setActiveLecture(lecture)}
                      className={`w-full flex items-start gap-4 p-4 hover:bg-surface-100 transition-colors border-l-4 ${activeLecture.id === lecture.id ? "border-primary-600 bg-primary-50" : "border-transparent"}`}
                    >
                      <div className="mt-0.5">
                        {lecture.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-primary-600 fill-current" />
                        ) : (
                          <Circle className="h-4 w-4 text-surface-300" />
                        )}
                      </div>
                      <div className="flex flex-col items-start text-left gap-1">
                        <span className={`text-sm ${activeLecture.id === lecture.id ? "font-bold text-[#1c1d1f]" : "text-surface-700"}`}>
                          {lIdx + 1}. {lecture.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-surface-500">
                            <PlayCircle className="h-3 w-3" />
                            <span>10:00</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
