import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RobloxPageContent } from "@/components/pages/roblox-page-content"

export const metadata = {
  title: "Roblox | Galorys eSports",
  description: "Explore os jogos parceiros e acompanhe as estatísticas em tempo real. Faça parte da nossa comunidade!",
}

export default function RobloxPage() {
  return (
    <main className="min-h-screen bg-[#1A1A2E] overflow-x-hidden">
      <Header />
      <RobloxPageContent />
      <Footer />
    </main>
  )
}
