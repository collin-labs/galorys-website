import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WallpapersContent } from "@/components/pages/wallpapers-content"

export const metadata = {
  title: "Wallpapers | Galorys eSports",
  description: "Baixe wallpapers exclusivos da Galorys para personalizar seu desktop e celular.",
}

export default function WallpapersPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <Header />
      <div className="flex-1">
        <WallpapersContent />
      </div>
      <Footer />
    </main>
  )
}
