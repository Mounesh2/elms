"use client"

import { useState } from "react"
import Link from "next/link"
import { LogOut, GraduationCap, Settings, CreditCard, History, Heart, User, HelpCircle } from "lucide-react"
import { getInitials } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

interface UserMenuProps {
  user: any
  profile: any
}

export function UserMenu({ user, profile }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { signOut } = useAuth()

  const initials = getInitials(profile?.fullName || user?.name || user?.email || "")

  const menuItems = [
    { label: "My Learning", href: "/my-courses", icon: GraduationCap },
    { label: "My Cart", href: "/cart", icon: User }, // Placeholder icon
    { label: "Wishlist", href: "/wishlist", icon: Heart },
  ]

  const settingsItems = [
    { label: "Notifications", href: "/notifications" },
    { label: "Account Settings", href: "/settings/account" },
    { label: "Payment Methods", href: "/settings/payments" },
    { label: "Purchase History", href: "/settings/purchase-history" },
  ]

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1c1d1f] text-sm font-bold text-white transition-transform hover:scale-105 overflow-hidden">
        {profile?.avatarUrl ? (
          <img src={profile.avatarUrl} alt={profile.fullName || "User"} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full pt-2 w-64 animate-fade-in z-50">
          <div className="rounded-sm border border-surface-200 bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-surface-100 group">
                <div className="h-12 w-12 rounded-full bg-[#1c1d1f] flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
                     {profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} alt={initials} className="h-full w-full object-cover" />
                     ) : initials}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1c1d1f] truncate group-hover:text-primary-700 transition-colors">
                        {profile?.fullName || user?.name || "Learner"}
                    </p>
                    <p className="text-xs text-surface-500 truncate">{user?.email}</p>
                </div>
            </div>

            {/* Main Links */}
            <div className="py-2">
                {menuItems.map(item => (
                    <Link key={item.label} href={item.href} className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-primary-700 transition-colors">
                        {item.label}
                    </Link>
                ))}
            </div>
            
            <hr className="border-surface-100" />
            
            {/* Settings Links */}
            <div className="py-2">
                {settingsItems.map(item => (
                    <Link key={item.label} href={item.href} className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-primary-700 transition-colors">
                        {item.label}
                    </Link>
                ))}
            </div>

            <hr className="border-surface-100" />

            {/* Instructor Links */}
            <div className="py-2">
                {user.isInstructor ? (
                    <Link href="/instructor" className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-primary-700 transition-colors">
                        Instructor Dashboard
                    </Link>
                ) : (
                    <Link href="/teach" className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-primary-700 transition-colors">
                        Become an Instructor
                    </Link>
                )}
            </div>

            <hr className="border-surface-100" />

            {/* Footer Links */}
            <div className="py-2">
                <Link href="/help" className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-primary-700 transition-colors font-bold">
                    Help and Support
                </Link>
            </div>

            <button 
                onClick={() => signOut()}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-bold text-surface-700 hover:bg-surface-50 hover:text-primary-700 transition-colors border-t border-surface-100"
            >
                Log out
                <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
