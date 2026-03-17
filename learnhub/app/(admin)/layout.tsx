'use client'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import { LayoutDashboard, Users, BookOpen, Tag, DollarSign, FileBarChart } from 'lucide-react'

const adminNav = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Courses', href: '/admin/courses', icon: BookOpen },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
  { label: 'Revenue', href: '/admin/revenue', icon: DollarSign },
  { label: 'Reports', href: '/admin/reports', icon: FileBarChart },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-950">
      <Header />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <Sidebar items={adminNav} className="hidden lg:flex" />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
