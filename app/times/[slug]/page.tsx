import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { TeamPageContent } from "@/components/teams/team-page-content"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface TeamPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TeamPageProps) {
  const { slug } = await params
  
  const team = await prisma.team.findUnique({
    where: { slug }
  })

  if (!team) {
    return {
      title: "Time não encontrado | Galorys eSports",
    }
  }

  return {
    title: `${team.name} | Galorys eSports`,
    description: team.description || `Time ${team.name} da Galorys eSports`,
  }
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params
  
  const team = await prisma.team.findUnique({
    where: { slug },
    include: {
      achievements: {
        where: { active: true },
        orderBy: { date: 'desc' }
      }
    }
  })

  if (!team) {
    notFound()
  }

  // Converter para o formato esperado pelo componente
  const teamData = {
    id: team.id,
    slug: team.slug,
    name: team.name,
    game: team.game,
    description: team.description || undefined,
    longDescription: team.longDescription || undefined,
    logo: team.logo || undefined,
    banner: team.banner || undefined,
    gameLabel: team.gameLabel || team.game,
    achievements: team.achievements.map(a => `${a.placement} - ${a.tournament}`)
  }

  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <Header />
      <div className="flex-1">
        <TeamPageContent team={teamData} />
      </div>
      <Footer />
    </main>
  )
}
