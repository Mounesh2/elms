'use client'
import Header from '@/components/layout/Header'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, LayoutDashboard, Award, Heart, ShoppingCart, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const studentNav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Courses', href: '/my-courses', icon: BookOpen },
  { label: 'Certificates', href: '/certificates', icon: Award },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
  { label: 'Cart', href: '/cart', icon: ShoppingCart },
  { label: 'Profile', href: '/profile', icon: User },
]

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Header />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-1 w-56 shrink-0">
          {studentNav.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-white text-[#1c1d1f] font-bold shadow-sm border border-surface-200'
                    : 'text-surface-600 hover:bg-white hover:text-[#1c1d1f] hover:shadow-sm'
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary-600' : 'text-surface-400')} />
                {item.label}
              </Link>
            )
          })}
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
