import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { TeamPageContent } from "@/components/teams/team-page-content"
import { getTeamBySlug, teams } from "@/lib/data/teams"
import { notFound } from "next/navigation"

interface TeamPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return teams.map((team) => ({
    slug: team.slug,
  }))
}

export async function generateMetadata({ params }: TeamPageProps) {
  const { slug } = await params
  const team = getTeamBySlug(slug)

  if (!team) {
    return {
      title: "Time não encontrado | Galorys eSports",
    }
  }

  return {
    title: `${team.name} | Galorys eSports`,
    description: team.description,
  }
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params
  const team = getTeamBySlug(slug)

  if (!team) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <Header />
      <div className="flex-1">
        <TeamPageContent team={team} />
      </div>
      <Footer />
    </main>
  )
}
