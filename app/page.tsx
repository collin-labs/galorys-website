import { cookies } from "next/headers"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HomeV1 } from "@/components/home/home-v1"
import { HomeV2 } from "@/components/home/home-v2"
import { HomeV3 } from "@/components/home/home-v3"
import { defaultLayout, type LayoutVersion } from "@/lib/layout-config"

export default async function HomePage() {
  // Get layout version from cookies (set by admin)
  const cookieStore = await cookies()
  const layoutVersion = (cookieStore.get("home-layout")?.value as LayoutVersion) || defaultLayout

  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <Header />
      <div className="flex-1">
        {layoutVersion === "v1" && <HomeV1 />}
        {layoutVersion === "v2" && <HomeV2 />}
        {layoutVersion === "v3" && <HomeV3 />}
      </div>
      <Footer />
    </main>
  )
}
