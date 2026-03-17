'use client'
import Image from 'next/image'
import { Sparkles, Target, Award, TrendingUp } from 'lucide-react'

const FEATURES = [
  { icon: Sparkles, text: 'Learn AI and more', color: 'bg-purple-500' },
  { icon: Target, text: 'Practice with AI coaching', color: 'bg-blue-500' },
  { icon: Award, text: 'Prep for a certification', color: 'bg-green-500' },
  { icon: TrendingUp, text: 'Advance your career', color: 'bg-orange-500' },
]

export default function SubscriptionBanner() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1c1d1f] rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[500px]">
          
          {/* Left Content Area */}
          <div className="w-full lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                Reimagine your career in the AI era
            </h2>
            <p className="text-gray-300 text-lg mb-8">
                Get job-ready for the world’s most in-demand careers. Subscription starting at just ₹500/month.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                {FEATURES.map((feature) => (
                    <div key={feature.text} className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${feature.color} bg-opacity-20`}>
                             <feature.icon className={`h-6 w-6 ${feature.color.replace('bg-', 'text-')}`} />
                        </div>
                        <span className="text-sm font-medium">{feature.text}</span>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
                <button className="w-full sm:w-fit px-8 py-3 bg-white text-[#1c1d1f] font-bold hover:bg-gray-100 transition-colors">
                    Learn more
                </button>
                <span className="text-gray-400 font-medium">Starting at ₹500/month</span>
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="relative flex-1 bg-gradient-to-br from-[#7C3AED]/20 to-[#1c1d1f] p-12 flex items-center justify-center overflow-hidden">
             {/* Decorative Circles */}
             <div className="absolute top-1/4 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
             <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />

             <div className="relative w-full max-w-md aspect-square">
                 {/* Stacked Panels */}
                 <div className="absolute top-0 right-0 w-3/4 aspect-[4/5] bg-surface-800 rounded-xl rotate-6 shadow-2xl border border-white/10 overflow-hidden transform hover:rotate-0 transition-transform duration-500">
                    <Image src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800" alt="Learning" fill className="object-cover" />
                 </div>
                 <div className="absolute bottom-0 left-0 w-3/4 aspect-[4/5] bg-surface-700 rounded-xl -rotate-6 shadow-2xl border border-white/10 overflow-hidden transform hover:rotate-0 transition-transform duration-500">
                    <Image src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800" alt="Skills" fill className="object-cover" />
                 </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  )
}
