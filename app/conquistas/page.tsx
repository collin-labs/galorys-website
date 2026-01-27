import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ConquistasContent } from "@/components/pages/conquistas-content"

export const metadata = {
  title: "Conquistas | Galorys eSports",
  description: "Nosso legado de vitórias, recordes e momentos históricos no cenário de eSports.",
}

export default function ConquistasPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <Header />
      <div className="flex-1">
        <ConquistasContent />
      </div>
      <Footer />
    </main>
  )
}
