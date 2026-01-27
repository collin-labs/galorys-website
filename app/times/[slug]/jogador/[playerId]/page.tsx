import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PlayerProfile } from "@/components/teams/player-profile"
import { getTeamBySlug, teams } from "@/lib/data/teams"
import { getPlayerById, getTeammates, getPlayersByTeam } from "@/lib/data/players"
import { notFound } from "next/navigation"

interface PlayerPageProps {
  params: Promise<{ slug: string; playerId: string }>
}

export async function generateStaticParams() {
  const paths: { slug: string; playerId: string }[] = []

  teams.forEach((team) => {
    const teamPlayers = getPlayersByTeam(team.slug)
    teamPlayers.forEach((player) => {
      paths.push({
        slug: team.slug,
        playerId: player.id,
      })
    })
  })

  return paths
}

export async function generateMetadata({ params }: PlayerPageProps) {
  const { slug, playerId } = await params
  const team = getTeamBySlug(slug)
  const player = getPlayerById(playerId)

  if (!team || !player) {
    return {
      title: "Jogador não encontrado | Galorys eSports",
    }
  }

  return {
    title: `${player.nickname} - ${team.name} | Galorys eSports`,
    description: `Conheça ${player.nickname} (${player.realName}), ${player.role} do time ${team.name} da Galorys.`,
  }
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { slug, playerId } = await params
  const team = getTeamBySlug(slug)
  const player = getPlayerById(playerId)

  if (!team || !player) {
    notFound()
  }

  const teammates = getTeammates(slug, playerId)

  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <Header />
      <div className="flex-1">
        <PlayerProfile player={player} team={team} teammates={teammates} />
      </div>
      <Footer />
    </main>
  )
}
