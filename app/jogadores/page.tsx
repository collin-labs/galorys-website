import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { JogadoresContent } from "@/components/pages/jogadores-content"

export const metadata = {
  title: "Jogadores | Galorys eSports",
  description:
    "Conheça nossos atletas profissionais que representam a Galorys nos principais cenários competitivos do mundo.",
}

export default function JogadoresPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <Header />
      <div className="flex-1">
        <JogadoresContent />
      </div>
      <Footer />
    </main>
  )
}
