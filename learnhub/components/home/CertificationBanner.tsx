'use client'
import React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const CERTS = [
    { 
        name: 'CompTIA', 
        skills: ['Information Technology', 'Cybersecurity', 'Cloud Computing'],
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400',
        color: 'from-[#ff6b6b] to-[#ee5253]'
    },
    { 
        name: 'AWS', 
        skills: ['Cloud Practitioner', 'Solutions Architect', 'Developer'],
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400',
        color: 'from-[#4834d4] to-[#686de0]'
    },
    { 
        name: 'PMI', 
        skills: ['Project Management', 'Business Analysis', 'Agile'],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400',
        color: 'from-[#6ab04c] to-[#badc58]'
    }
]

export default function CertificationBanner() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1c1d1f] rounded-none p-12 flex flex-col lg:flex-row gap-12">
          
          <div className="lg:w-1/3 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white mb-4">
                Get certified and get ahead in your career
            </h2>
            <p className="text-gray-300 mb-6">
                Develop job-ready skills and prepare for your certification exams with expert-led training from top partners.
            </p>
            <Link href="/certifications" className="flex items-center gap-2 text-white font-bold hover:underline">
                Explore certifications and vouchers <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {CERTS.map((cert) => (
                <div key={cert.name} className="bg-white/5 border border-white/10 p-6 flex flex-col hover:bg-white/10 transition-colors group">
                    <div className={`h-16 w-16 rounded-xl mb-6 bg-gradient-to-br ${cert.color} p-4 shadow-lg group-hover:scale-110 transition-transform`}>
                         <div className="relative w-full h-full grayscale brightness-200">
                             <Image src={cert.image} alt={cert.name} fill className="object-cover rounded" />
                         </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{cert.name}</h3>
                    <ul className="space-y-1 mb-6">
                        {cert.skills.map(skill => (
                            <li key={skill} className="text-xs text-gray-400">• {skill}</li>
                        ))}
                    </ul>
                </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
    return <a href={href} className={className}>{children}</a>
}
