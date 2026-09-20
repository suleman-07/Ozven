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

export function CategoryGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="text-center">
          <Skeleton className="aspect-square w-full rounded-md" />
          <Skeleton className="mx-auto mt-4 h-3 w-2/3" />
        </div>
      ))}
    </div>
  )
}
