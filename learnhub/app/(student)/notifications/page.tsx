"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Trash2, Clock, Info, CheckCircle, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?limit=100")
      const data = await res.json()
      setNotifications(data.notifications)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (e) {
      console.error(e)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" })
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.isRead
    return true
  })

  const getIcon = (type: string) => {
    switch (type) {
      case "course_enrollment": return <CheckCircle className="h-5 w-5 text-green-500" />
      case "lecture_complete": return <Info className="h-5 w-5 text-blue-500" />
      case "system_alert": return <AlertCircle className="h-5 w-5 text-red-500" />
      default: return <Bell className="h-5 w-5 text-surface-400" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-[#1c1d1f]">Notifications</h1>
            <p className="text-surface-500 mt-2">Manage your alerts and activity updates.</p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={markAllAsRead}
                className="flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800 transition-colors"
            >
                <Check className="h-4 w-4" /> Mark all as read
            </button>
        </div>
      </div>

      <div className="bg-white border border-surface-200 rounded-sm shadow-sm overflow-hidden">
        <div className="flex border-b border-surface-200">
            <button 
                onClick={() => setFilter("all")}
                className={cn("px-6 py-4 text-sm font-bold border-b-2 transition-all", filter === "all" ? "border-primary-600 text-primary-700" : "border-transparent text-surface-500")}
            >
                All
            </button>
            <button 
                onClick={() => setFilter("unread")}
                className={cn("px-6 py-4 text-sm font-bold border-b-2 transition-all", filter === "unread" ? "border-primary-600 text-primary-700" : "border-transparent text-surface-500")}
            >
                Unread
            </button>
        </div>

        <div className="divide-y divide-surface-100">
            {isLoading ? (
                <div className="p-20 text-center text-surface-400">Loading notifications...</div>
            ) : filtered.length === 0 ? (
                <div className="p-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-surface-50 rounded-full flex items-center justify-center mx-auto">
                        <Bell className="h-8 w-8 text-surface-300" />
                    </div>
                    <p className="text-surface-500 font-medium">No notifications yet.</p>
                </div>
            ) : (
                filtered.map((n) => (
                    <div key={n.id} className={cn("p-6 flex items-start gap-4 hover:bg-surface-50 transition-colors group relative", !n.isRead && "bg-primary-50/30")}>
                        <div className="mt-1">{getIcon(n.type)}</div>
                        <div className="flex-1 space-y-1">
                            <p className={cn("text-sm text-[#1c1d1f]", !n.isRead && "font-bold")}>{n.title}</p>
                            <p className="text-sm text-surface-600 leading-relaxed">{n.message}</p>
                            <div className="flex items-center gap-3 pt-1">
                                <span className="text-[10px] uppercase font-bold text-surface-400 flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(n.createdAt))} ago
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={() => deleteNotification(n.id)}
                            className="p-2 text-surface-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        {!n.isRead && (
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-600" />
                        )}
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  )
}
