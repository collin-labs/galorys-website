import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SobreContent } from "@/components/pages/sobre-content"

export const metadata = {
  title: "Sobre | Galorys eSports",
  description: "Conheça a história da Galorys, nossa missão, visão e valores.",
}

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <Header />
      <div className="flex-1">
        <SobreContent />
      </div>
      <Footer />
    </main>
  )
}
