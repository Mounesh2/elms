'use client'
import React from 'react'
import { cn } from '@/lib/utils'

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-primary-700 text-white hover:bg-primary-600 active:bg-primary-800 shadow-sm',
    secondary: 'bg-surface-700 text-white hover:bg-surface-600',
    outline: 'border border-surface-600 text-surface-300 hover:border-primary-500 hover:text-white bg-transparent',
    ghost: 'text-surface-400 hover:text-white hover:bg-surface-800',
    danger: 'bg-error text-white hover:bg-red-600',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }
  return (
    <button {...props} disabled={disabled || loading} className={cn(base, variants[variant], sizes[size], className)}>
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps { label: string; color?: 'purple' | 'green' | 'red' | 'blue' | 'orange' | 'gray'; className?: string }
export function Badge({ label, color = 'purple', className }: BadgeProps) {
  const colors = {
    purple: 'bg-primary-900/50 text-primary-300 border border-primary-700/50',
    green: 'bg-green-900/50 text-green-300 border border-green-700/50',
    red: 'bg-red-900/50 text-red-300 border border-red-700/50',
    blue: 'bg-blue-900/50 text-blue-300 border border-blue-700/50',
    orange: 'bg-orange-900/50 text-orange-300 border border-orange-700/50',
    gray: 'bg-surface-800 text-surface-400 border border-surface-700',
  }
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', colors[color], className)}>{label}</span>
}

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps { children: React.ReactNode; className?: string; glass?: boolean }
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, glass }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          'rounded-2xl border p-6',
          glass
            ? 'border-white/10 bg-white/5 backdrop-blur-sm'
            : 'border-surface-800 bg-surface-900',
          className
        )}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; helper?: string; icon?: React.ReactNode
}
export function Input({ label, error, helper, icon, className, id, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && <label htmlFor={id} className="block text-sm font-medium text-surface-300">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">{icon}</span>}
        <input id={id} {...props} className={cn(
          'w-full rounded-xl border bg-surface-800 px-4 py-2.5 text-sm text-white placeholder-surface-500',
          'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors',
          error ? 'border-red-500' : 'border-surface-700',
          icon ? 'pl-10' : '',
          className
        )} />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {helper && !error && <p className="text-xs text-surface-500">{helper}</p>}
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }
  return <span className={cn('inline-block animate-spin rounded-full border-2 border-current border-t-transparent text-primary-500', sizes[size], className)} />
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, className }: { value: number; max?: number; className?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-surface-700', className)}>
      <div className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  )
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
export function StarRating({ rating, count, className }: { rating: number; count?: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={cn('h-4 w-4', s <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-surface-600 text-surface-600')} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {count !== undefined && <span className="text-sm text-surface-400">({count.toLocaleString()})</span>}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }: {
  icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-surface-500">{icon}</div>}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && <p className="text-sm text-surface-400 max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 text-surface-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
