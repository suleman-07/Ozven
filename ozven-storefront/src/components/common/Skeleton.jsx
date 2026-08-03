export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-sm bg-gradient-to-r from-charcoal/10 via-charcoal/5 to-charcoal/10 bg-[length:200%_100%] animate-shimmer ${className}`}
      aria-hidden="true"
    />
  )
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border border-gold-hairline/20 bg-base">
          <Skeleton className="aspect-[4/5] w-full rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function CategoryGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden border border-gold-hairline/20">
          <Skeleton className="aspect-[16/10] w-full rounded-none" />
          <div className="p-5">
            <Skeleton className="h-5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
