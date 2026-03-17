"use client"

import { useState, useEffect } from "react"
import { Bell, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: string
  title: string
  body: string
  link: string | null
  isRead: boolean
  createdAt: string
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/notifications?limit=5")
      const data = await res.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Polling every 60 seconds
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (e) {}
  }

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="p-2 text-surface-700 hover:text-primary-700 transition-colors relative">
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full pt-2 w-80 animate-fade-in z-50">
          <div className="rounded-sm border border-surface-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[480px]">
            <div className="flex items-center justify-between p-4 border-b border-surface-100">
              <h3 className="font-bold text-[#1c1d1f]">Notifications</h3>
              <button 
                onClick={markAllAsRead}
                className="text-xs font-bold text-primary-700 hover:text-primary-800 transition-colors"
                disabled={unreadCount === 0}
              >
                Mark all as read
              </button>
            </div>

            <div className="flex-grow overflow-y-auto">
              {isLoading && notifications.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-surface-400" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-surface-500 font-medium whitespace-pre-wrap">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <Link 
                    key={n.id} 
                    href={n.link || "/notifications"}
                    className={cn(
                        "block p-4 hover:bg-surface-50 transition-colors border-b border-surface-50 last:border-0",
                        !n.isRead && "bg-primary-50/50"
                    )}
                  >
                    <p className="text-sm font-bold text-[#1c1d1f] mb-1">{n.title}</p>
                    <p className="text-xs text-surface-600 line-clamp-2 mb-2">{n.body}</p>
                    <p className="text-[10px] font-medium text-surface-400">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </Link>
                ))
              )}
            </div>

            <Link 
              href="/notifications" 
              className="p-4 text-center text-sm font-bold text-primary-700 hover:bg-surface-50 transition-colors border-t border-surface-100"
            >
              See all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
