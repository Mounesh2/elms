'use client'
import { GraduationCap, Search, Star, MessageSquare } from 'lucide-react'
import { Card, Button, Input } from '@/components/ui'
import Image from 'next/image'

const INSTRUCTORS = [
  { id: 1, name: 'Dr. Angela Yu', role: 'Full Stack Developer', students: '2.5M+', courses: 7, rating: 4.8, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
  { id: 2, name: 'Maximilian Schwarzmüller', role: 'Professional Web Developer', students: '2.1M+', courses: 32, rating: 4.7, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop' },
  { id: 3, name: 'Jose Portilla', role: 'Data Scientist', students: '3.2M+', courses: 25, rating: 4.9, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' },
]

export default function InstructorsPage() {
  return (
    <div className="min-h-screen bg-surface-950 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-heading font-bold text-white sm:text-6xl mb-4">Learn from the <span className="text-primary-400">Best</span></h1>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">Our instructors are industry experts with years of real-world experience and a passion for teaching.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INSTRUCTORS.map(inst => (
            <Card key={inst.id} className="p-8 bg-surface-900 border-surface-800 text-center hover:border-primary-500/50 transition-all group">
              <div className="relative mx-auto w-32 h-32 mb-6">
                <Image src={inst.avatar} alt={inst.name} fill className="rounded-full object-cover border-4 border-surface-800 group-hover:border-primary-500/30 transition-all" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{inst.name}</h3>
              <p className="text-primary-400 font-medium mb-6">{inst.role}</p>
              
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-surface-800 mb-8">
                <div>
                  <p className="text-white font-bold">{inst.rating}</p>
                  <p className="text-[10px] uppercase tracking-widest text-surface-500">Rating</p>
                </div>
                <div>
                  <p className="text-white font-bold">{inst.students}</p>
                  <p className="text-[10px] uppercase tracking-widest text-surface-500">Students</p>
                </div>
                <div>
                  <p className="text-white font-bold">{inst.courses}</p>
                  <p className="text-[10px] uppercase tracking-widest text-surface-500">Courses</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">View Profile</Button>
                <Button variant="outline" className="px-3"><MessageSquare className="w-4 h-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
