import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PlayerProfileDynamic } from "@/components/teams/player-profile-dynamic"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface PlayerPageProps {
  params: Promise<{ slug: string; playerId: string }>
}

export async function generateMetadata({ params }: PlayerPageProps) {
  const { slug, playerId } = await params
  
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: { team: true }
  })

  if (!player || player.team.slug !== slug) {
    return {
      title: "Jogador não encontrado | Galorys eSports",
    }
  }

  return {
    title: `${player.nickname} - ${player.team.name} | Galorys eSports`,
    description: `Conheça ${player.nickname}${player.realName ? ` (${player.realName})` : ''}, ${player.role || 'jogador'} do time ${player.team.name} da Galorys.`,
  }
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { slug, playerId } = await params
  
  // Buscar jogador com time
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: { team: true }
  })

  if (!player || player.team.slug !== slug) {
    notFound()
  }

  // Buscar colegas de time (ativos, excluindo o jogador atual)
  const teammates = await prisma.player.findMany({
    where: {
      teamId: player.teamId,
      active: true,
      id: { not: playerId }
    },
    take: 4
  })

  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <Header />
      <div className="flex-1">
        <PlayerProfileDynamic 
          player={player} 
          team={player.team} 
          teammates={teammates} 
        />
      </div>
      <Footer />
    </main>
  )
}
