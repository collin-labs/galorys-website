import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GtaRpPageContent } from "@/components/pages/gtarp-page-content"

export const metadata = {
  title: "GTA RP | Galorys eSports",
  description: "Entre nos servidores de GTA RP da Galorys. KUSH PVP e Flow RP - Ação, roleplay e diversão garantidos!",
}

export default function GtaRpPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <GtaRpPageContent />
      <Footer />
    </main>
  )
}
