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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#14141b] border border-white/10 rounded-xl overflow-hidden">
            <Skeleton className="aspect-video" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
