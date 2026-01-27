import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import type { Metadata } from "next"
import { FaqContent } from "@/components/pages/faq-content"

export const metadata: Metadata = {
  title: "FAQ | Galorys eSports",
  description: "Perguntas frequentes sobre a Galorys eSports.",
}

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <Header />
      <div className="flex-1">
        <FaqContent />
      </div>
      <Footer />
    </main>
  )
}
