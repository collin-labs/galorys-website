import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { TimesContent } from "@/components/pages/times-content"

export const metadata = {
  title: "Times | Galorys eSports",
  description: "Conheça nossos times profissionais de Counter Strike 2, Call of Duty Mobile, Gran Turismo e mais.",
}

export default function TimesPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <Header />
      <div className="flex-1">
        <TimesContent />
      </div>
      <Footer />
    </main>
  )
}
