"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui"
import { Users, Video, DollarSign, CheckCircle, ArrowRight, Play, Star, ChevronDown } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function TeachPage() {
  const { user, refreshProfile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleBecomeInstructor = async () => {
    if (!user) {
        router.push("/login?callbackUrl=/teach")
        return
    }

    setIsLoading(true)
    try {
        const res = await fetch("/api/instructor/become", { method: "POST" })
        if (!res.ok) throw new Error("Failed to upgrade account")
        
        toast.success("Welcome to the instructor team!")
        await refreshProfile()
        router.push("/instructor")
    } catch (error) {
        toast.error("Something went wrong. Please try again.")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center bg-[#1c1d1f] overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2000" 
            alt="Teaching" 
            className="w-full h-full object-cover"
           />
        </div>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-xl text-white space-y-6">
            <h1 className="text-5xl font-bold leading-tight font-heading">
                Come teach <br /> with us
            </h1>
            <p className="text-xl">
                Become an instructor and change lives — including your own.
            </p>
            <Button 
                onClick={handleBecomeInstructor}
                disabled={isLoading}
                className="h-14 px-10 bg-white text-[#1c1d1f] hover:bg-surface-100 font-bold text-lg rounded-none transition-all"
            >
                {isLoading ? "Processing..." : "Get Started"}
            </Button>
          </div>
        </div>
      </section>

      {/* Reasons Section */}
      <section className="py-24 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-[#1c1d1f] mb-16">So many reasons to start</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
                    <Video className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1c1d1f]">Teach your way</h3>
                <p className="text-surface-600">Publish the course you want, in the way you want, and always have control of your own content.</p>
            </div>
            <div className="space-y-4">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1c1d1f]">Inspire learners</h3>
                <p className="text-surface-600">Teach what you know and help learners explore their interests, gain new skills, and advance their careers.</p>
            </div>
            <div className="space-y-4">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
                    <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1c1d1f]">Get rewarded</h3>
                <p className="text-surface-600">Expand your professional network, build your brand, and earn money on each paid enrollment.</p>
            </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-surface-50 py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
                <p className="text-4xl font-bold text-[#1c1d1f]">62M</p>
                <p className="text-sm font-medium text-surface-500 uppercase mt-2">Learners</p>
            </div>
            <div>
                <p className="text-4xl font-bold text-[#1c1d1f]">75+</p>
                <p className="text-sm font-medium text-surface-500 uppercase mt-2">Languages</p>
            </div>
            <div>
                <p className="text-4xl font-bold text-[#1c1d1f]">830M</p>
                <p className="text-sm font-medium text-surface-500 uppercase mt-2">Enrollments</p>
            </div>
            <div>
                <p className="text-4xl font-bold text-[#1c1d1f]">180+</p>
                <p className="text-sm font-medium text-surface-500 uppercase mt-2">Countries</p>
            </div>
        </div>
      </section>

      {/* How to Begin */}
      <section className="py-24 max-w-4xl mx-auto px-4 text-center space-y-12">
        <h2 className="text-4xl font-bold text-[#1c1d1f]">How to begin</h2>
        <div className="flex flex-col gap-12">
            <div className="flex items-center gap-8 text-left group">
                <div className="w-20 h-20 shrink-0 bg-surface-100 rounded-full flex items-center justify-center text-2xl font-bold text-surface-400 group-hover:bg-[#1c1d1f] group-hover:text-white transition-all">1</div>
                <div>
                    <h4 className="text-xl font-bold text-[#1c1d1f]">Plan your curriculum</h4>
                    <p className="text-surface-600 mt-2">You start with your passion and knowledge. Then choose a promising topic with the help of our tools.</p>
                </div>
            </div>
            <div className="flex items-center gap-8 text-left group">
                <div className="w-20 h-20 shrink-0 bg-surface-100 rounded-full flex items-center justify-center text-2xl font-bold text-surface-400 group-hover:bg-[#1c1d1f] group-hover:text-white transition-all">2</div>
                <div>
                    <h4 className="text-xl font-bold text-[#1c1d1f]">Record your video</h4>
                    <p className="text-surface-600 mt-2">Use basic equipment like a smartphone or a DSLR camera. Add a good microphone and you&apos;re ready to go.</p>
                </div>
            </div>
            <div className="flex items-center gap-8 text-left group">
                <div className="w-20 h-20 shrink-0 bg-surface-100 rounded-full flex items-center justify-center text-2xl font-bold text-surface-400 group-hover:bg-[#1c1d1f] group-hover:text-white transition-all">3</div>
                <div>
                    <h4 className="text-xl font-bold text-[#1c1d1f]">Launch your course</h4>
                    <p className="text-surface-600 mt-2">Gather your first ratings and reviews by promoting your course through social media and your network.</p>
                </div>
            </div>
        </div>
      </section>

      {/* CTÀ Section */}
      <section className="py-24 bg-surface-50 text-center space-y-8">
        <h2 className="text-4xl font-bold text-[#1c1d1f]">Become an instructor today</h2>
        <p className="text-xl text-surface-600 max-w-2xl mx-auto">Join one of the world&apos;s largest online learning marketplaces.</p>
        <Button 
            onClick={handleBecomeInstructor}
            disabled={isLoading}
            className="h-14 px-10 bg-[#1c1d1f] hover:bg-surface-800 text-white font-bold text-lg rounded-none transition-all"
        >
             {isLoading ? "Processing..." : "Get Started"}
        </Button>
      </section>
    </div>
  )
}
