import { Suspense } from "react"
import { FavoritosContent } from "@/components/dashboard/favoritos-content"

export default function FavoritosPage() {
  return (
    <Suspense fallback={null}>
      <FavoritosContent />
    </Suspense>
  )
}
