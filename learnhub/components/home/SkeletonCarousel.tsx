"use client"

export function SkeletonCarousel() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-[240px] min-w-[240px] space-y-3">
          <div className="aspect-video bg-surface-100 animate-shimmer rounded-sm" />
          <div className="h-4 w-3/4 bg-surface-100 animate-shimmer rounded-sm" />
          <div className="h-3 w-1/2 bg-surface-100 animate-shimmer rounded-sm" />
          <div className="flex items-center gap-2">
            <div className="h-3 w-12 bg-surface-100 animate-shimmer rounded-sm" />
            <div className="h-3 w-20 bg-surface-100 animate-shimmer rounded-sm" />
          </div>
          <div className="h-4 w-16 bg-surface-100 animate-shimmer rounded-sm" />
        </div>
      ))}
    </div>
  )
}
