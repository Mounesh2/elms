'use client'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import { LayoutDashboard, BookOpen, Plus, DollarSign, BarChart2, Users, Tag } from 'lucide-react'

const instructorNav = [
  { label: 'Dashboard', href: '/instructor/dashboard', icon: LayoutDashboard },
  { label: 'My Courses', href: '/instructor/courses', icon: BookOpen },
  { label: 'Create Course', href: '/instructor/courses/create', icon: Plus },
  { label: 'Revenue', href: '/instructor/revenue', icon: DollarSign },
  { label: 'Analytics', href: '/instructor/analytics', icon: BarChart2 },
  { label: 'Students', href: '/instructor/students', icon: Users },
  { label: 'Coupons', href: '/instructor/coupons', icon: Tag },
]

import { usePathname } from 'next/navigation'

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-surface-950">
      <Header />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <Sidebar items={instructorNav} activePath={pathname} className="hidden lg:flex" />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
