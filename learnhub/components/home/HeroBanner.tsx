'use client'
import Image from 'next/image'

export default function HeroBanner() {
  return (
    <div className="relative w-full bg-[#f7f4f0] py-12 lg:py-16 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative h-full min-h-[400px]">
        {/* Left Side Content Box */}
        <div className="relative z-20 w-full lg:max-w-md bg-white p-6 lg:p-12 shadow-2xl lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-8 flex flex-col gap-4 animate-fade-up">
          <h1 className="font-heading text-4xl lg:text-[44px] font-bold text-[#1c1d1f] leading-tight">
            Learning that gets you
          </h1>
          <p className="text-base lg:text-lg text-[#1c1d1f] leading-relaxed">
            Skills for your present (and your future). Get started with us.
          </p>
        </div>

        {/* Right Side Image / Graphic */}
        <div className="mt-8 lg:mt-0 lg:absolute lg:inset-y-0 lg:right-0 lg:w-3/5 flex items-center justify-end">
            <div className="relative w-full h-[300px] lg:h-[480px]">
                 {/* Teal Block Background Element */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4/5 h-[80%] bg-[#0d5c63] -z-10 rounded-l-full opacity-10 lg:opacity-100 lg:bg-[#0d5c63]" />
                
                <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-12">
                     <div className="relative h-full aspect-[4/3] rounded-sm overflow-hidden shadow-xl animate-fade-in">
                        <Image
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
                            alt="Learning"
                            fill
                            className="object-cover"
                            priority
                        />
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
