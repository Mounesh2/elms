'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Code, Smartphone, BarChart } from 'lucide-react'

const ACCELERATORS = [
    {
        title: "Full Stack Web Developer",
        rating: 4.9,
        reviews: "45k",
        hours: "120",
        icon: Code,
        bgColor: "bg-orange-50",
        iconColor: "text-orange-600",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
    },
    {
        title: "Digital Marketer",
        rating: 4.8,
        reviews: "32k",
        hours: "85",
        icon: Smartphone,
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
        image: "https://images.unsplash.com/photo-1580894732444-8ecbc2ae0bd6?auto=format&fit=crop&q=80&w=400"
    },
    {
        title: "Data Scientist",
        rating: 4.9,
        reviews: "28k",
        hours: "110",
        icon: BarChart,
        bgColor: "bg-pink-50",
        iconColor: "text-pink-600",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"
    }
]

export default function CareerAccelerators() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#1c1d1f] mb-2 text-center lg:text-left">Ready to reimagine your career?</h2>
        <p className="text-lg text-surface-500 mb-12 text-center lg:text-left">Gain expertise in these high-demand fields with intensive career programs.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ACCELERATORS.map((acc) => (
                <div key={acc.title} className={cn("group rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-xl", acc.bgColor)}>
                    <div className="p-8 pb-0">
                         <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center mb-6 bg-white shadow-sm", acc.iconColor)}>
                            <acc.icon className="h-6 w-6" />
                         </div>
                         <h3 className="text-2xl font-bold text-[#1c1d1f] mb-4">{acc.title}</h3>
                         <div className="flex items-center gap-3 text-sm mb-6">
                            <span className="font-bold">★ {acc.rating}</span>
                            <span className="text-surface-500">({acc.reviews} ratings)</span>
                            <span className="text-surface-300">|</span>
                            <span className="text-surface-500 font-medium">{acc.hours} total hours</span>
                         </div>
                    </div>
                    <div className="relative h-64 mt-4 origin-bottom transition-transform duration-500 group-hover:scale-105">
                         <Image src={acc.image} alt={acc.title} fill className="object-cover object-top" />
                         <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-12 text-center">
            <Link href="/accelerators" className="text-primary-700 font-bold hover:underline">
                All Career Accelerators →
            </Link>
        </div>
      </div>
    </section>
  )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
