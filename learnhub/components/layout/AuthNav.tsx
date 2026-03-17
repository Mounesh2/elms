"use client"

import Link from "next/link"
import { GraduationCap, Heart, Globe } from "lucide-react"
import { NotificationBell } from "./NotificationBell"
import { UserMenu } from "./UserMenu"
import { useCart } from "@/hooks/useCart"
import { ShoppingCart } from "lucide-react"

interface AuthNavProps {
  user: any
  profile: any
}

export function AuthNav({ user, profile }: AuthNavProps) {
  const { itemCount } = useCart()

  return (
    <div className="flex items-center gap-4">
      <Link href="/my-courses" className="hidden md:block text-sm font-medium text-surface-700 hover:text-primary-700 transition-colors whitespace-nowrap">
        My Learning
      </Link>
      
      <Link href="/wishlist" className="hidden md:block p-2 text-surface-700 hover:text-primary-700 transition-colors">
        <Heart className="h-6 w-6" />
      </Link>

      <Link href="/cart" className="relative p-2 text-surface-700 hover:text-primary-700 transition-colors group">
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {itemCount}
          </span>
        )}
      </Link>

      <NotificationBell />

      <UserMenu user={user} profile={profile} />
    </div>
  )
}
