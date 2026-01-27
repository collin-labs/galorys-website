import type React from "react"
import type { Metadata } from "next"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardMobileHeader } from "@/components/dashboard/mobile-header"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Área do Fã | Galorys eSports",
  description: "Gerencie seus favoritos, recompensas e acompanhe seus times favoritos",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 pt-16 lg:pt-20">
        {/* Desktop Sidebar */}
        <DashboardSidebar />

        {/* Mobile Header */}
        <DashboardMobileHeader />

        {/* Main Content */}
        <main className="flex-1 lg:ml-[260px] flex flex-col">
          <div className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  )
}
