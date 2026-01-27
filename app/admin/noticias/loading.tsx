import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="w-5 h-5 rounded" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-6 h-6 rounded" />
            <div>
              <Skeleton className="w-48 h-6 mb-1" />
              <Skeleton className="w-32 h-4" />
            </div>
          </div>
        </div>
        <Skeleton className="w-36 h-10 rounded-lg" />
      </div>
      <Skeleton className="w-80 h-10 rounded-lg" />
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="bg-white/5 border-b border-white/10 p-3">
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#14141b] p-4 border-b border-white/5">
            <div className="flex gap-4 items-center">
              {[1, 2, 3, 4, 5].map((j) => (
                <Skeleton key={j} className="h-8 flex-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
