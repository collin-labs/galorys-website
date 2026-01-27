export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 bg-muted animate-pulse rounded-lg" />
      <div className="h-10 w-full max-w-md bg-muted animate-pulse rounded-lg" />
      <div className="rounded-xl border border-border overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-muted/50 animate-pulse border-b border-border" />
        ))}
      </div>
    </div>
  )
}
