'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, Menu, X, Globe, ShoppingCart } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn, getInitials } from '@/lib/utils'
import { Button } from '@/components/ui'
import { AuthNav } from './AuthNav'
import { SearchBar } from '../search/SearchBar'

const NAV_LINKS = [
  { label: 'LearnHub Business', href: '/business' },
  { label: 'Teach on LearnHub', href: '/teach' },
  { label: 'Resources', href: '/resources/hugging-face' },
]

const CATEGORIES = [
  'Development', 'Business', 'Finance & Accounting',
  'IT & Software', 'Office Productivity', 'Personal Development', 'Design', 'Marketing'
]

export default function Header() {
  const { user, profile } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-surface-200 bg-white h-[72px] flex items-center shadow-sm">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center gap-4 py-3">
          {/* Logo */}
          <Link href={user ? "/home" : "/"} className="flex items-center gap-2 shrink-0">
            <span className="font-heading text-2xl font-bold text-primary-700">LearnHub</span>
          </Link>

          {/* Explore Dropdown */}
          <div className="relative hidden lg:block group">
            <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-surface-700 hover:text-primary-700 transition-colors font-medium">
              Explore <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute left-0 top-full pt-2 w-64 animate-fade-in z-50 invisible group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all opacity-0 group-hover:opacity-100">
              <div className="rounded-sm border border-surface-200 bg-white shadow-xl p-2 py-4">
                  {CATEGORIES.map((cat) => (
                  <Link key={cat} href={`/category/${cat.toLowerCase().replace(/ /g, '-')}`}
                      className="flex items-center justify-between rounded-sm px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 hover:text-primary-700 transition-colors">
                      {cat}
                      <ChevronDown className="h-4 w-4 -rotate-90 opacity-50" />
                  </Link>
                  ))}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-3xl hidden sm:block mx-2">
            <SearchBar />
          </div>

          {/* Desktop Nav - Hidden for logged in */}
          {!user && (
            <nav className="hidden xl:flex items-center gap-2">
                <Link href="/subscribe" className="rounded-md px-3 py-2 text-sm text-surface-700 hover:text-primary-700 transition-colors whitespace-nowrap">
                Subscribe
                </Link>
                <Link href="/business" className="hidden 2xl:block rounded-md px-3 py-2 text-sm text-surface-700 hover:text-primary-700 transition-colors whitespace-nowrap">
                LearnHub Business
                </Link>
                <Link href="/teach" className="hidden 2xl:block rounded-md px-3 py-2 text-sm text-surface-700 hover:text-primary-700 transition-colors whitespace-nowrap">
                Teach on LearnHub
                </Link>
                <Link href="/resources/hugging-face" className="rounded-md px-3 py-2 text-sm font-bold text-primary-700 hover:bg-primary-50 transition-colors whitespace-nowrap">
                Resources
                </Link>
            </nav>
          )}

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-3">
            {user ? (
              <AuthNav user={user} profile={profile} />
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/cart" className="relative p-2 text-surface-700 hover:text-primary-700 transition-colors mr-2">
                    <ShoppingCart className="h-6 w-6" />
                </Link>
                <Link href="/login">
                    <Button variant="outline" className="h-10 border-[#1c1d1f] rounded-none px-5 text-sm font-bold text-[#1c1d1f] hover:bg-surface-50">
                        Log in
                    </Button>
                </Link>
                <Link href="/register">
                    <Button className="h-10 bg-[#1c1d1f] hover:bg-surface-800 text-white rounded-none px-5 text-sm font-bold border-none">
                        Sign up
                    </Button>
                </Link>
                <button className="p-2 border border-[#1c1d1f] rounded-none hover:bg-surface-50 transition-colors ml-1">
                    <Globe className="h-5 w-5 text-[#1c1d1f]" />
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-surface-700 lg:hidden">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full border-t border-surface-200 bg-white px-4 py-6 space-y-4 animate-fade-in shadow-xl z-50">
          <SearchBar />
          <div className="space-y-3">
             <Link href="/business" className="block py-2 text-sm font-bold text-surface-700">LearnHub Business</Link>
             <Link href="/teach" className="block py-2 text-sm font-bold text-surface-700">Teach on LearnHub</Link>
             <Link href="/resources/hugging-face" className="block py-2 text-sm font-bold text-primary-700">Resources</Link>
          </div>
          <hr className="border-surface-100" />
          {!user && (
            <div className="flex flex-col gap-3">
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full h-12 border-surface-900 rounded-none font-bold">
                    Log in
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button className="w-full h-12 bg-surface-900 text-white rounded-none font-bold">
                    Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
