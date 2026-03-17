'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SidebarItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
}

interface SidebarProps {
  items: SidebarItem[]
  className?: string
  activePath?: string
}

export default function Sidebar({ items, className, activePath }: SidebarProps) {
  return (
    <aside className={cn('flex flex-col gap-1 w-64 shrink-0', className)}>
      {items.map((item) => {
        const Icon = item.icon
        const isActive = activePath === item.href
        return (
          <Link key={item.href} href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
              isActive
                ? 'bg-primary-700/20 text-primary-400 shadow-sm'
                : 'text-surface-400 hover:bg-surface-800 hover:text-white'
            )}>
            <Icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-primary-400' : '')} />
            <span className="flex-1">{item.label}</span>
            {item.badge !== undefined && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-700 px-1.5 text-xs font-bold text-white">
                {item.badge}
              </span>
            )}
          </Link>
        )
      })}
    </aside>
  )
}
