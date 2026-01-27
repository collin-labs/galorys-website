import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ContatoContent } from "@/components/pages/contato-content"

export const metadata = {
  title: "Contato | Galorys eSports",
  description: "Entre em contato com a Galorys. Estamos prontos para atender você.",
}

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <Header />
      <div className="flex-1">
        <ContatoContent />
      </div>
      <Footer />
    </main>
  )
}
