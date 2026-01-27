import { HeroSectionV3 } from "@/components/sections/v3/hero-section-v3"
import { TeamsSectionV2 } from "@/components/sections/v2/teams-section-v2"
import { AchievementsSection } from "@/components/sections/achievements-section"
import { PlayersSection } from "@/components/sections/players-section"
import { GamesSection } from "@/components/sections/games-section"
import { MatchesSection } from "@/components/sections/matches-section"
import { PartnersSection } from "@/components/sections/partners-section"
import { CtaSection } from "@/components/sections/cta-section"
import { LiveCounter } from "@/components/sections/live-counter"
import { prisma } from "@/lib/prisma"

// Mapear slug para componente (V3 usa HeroV3 e TeamsV2)
const sectionComponents: Record<string, React.ComponentType> = {
  hero: HeroSectionV3,
  teams: TeamsSectionV2,
  achievements: AchievementsSection,
  players: PlayersSection,
  roblox: GamesSection,  // GamesSection tem abas: Roblox + GTA
  matches: MatchesSection,
  partners: PartnersSection,
  cta: CtaSection,
}

export async function HomeV3() {
  // Buscar seções ativas do banco, ordenadas
  let sections: { slug: string; active: boolean; order: number }[] = []
  
  try {
    sections = await prisma.homeSection.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: { slug: true, active: true, order: true }
    })
  } catch (error) {
    console.error('Erro ao buscar seções:', error)
    sections = [
      { slug: 'hero', active: true, order: 1 },
      { slug: 'teams', active: true, order: 2 },
      { slug: 'achievements', active: true, order: 3 },
      { slug: 'players', active: true, order: 4 },
      { slug: 'roblox', active: true, order: 5 },
      { slug: 'matches', active: true, order: 6 },
      { slug: 'partners', active: true, order: 7 },
      { slug: 'cta', active: true, order: 8 },
    ]
  }

  if (sections.length === 0) {
    sections = [
      { slug: 'hero', active: true, order: 1 },
      { slug: 'teams', active: true, order: 2 },
      { slug: 'achievements', active: true, order: 3 },
      { slug: 'players', active: true, order: 4 },
      { slug: 'roblox', active: true, order: 5 },
      { slug: 'matches', active: true, order: 6 },
      { slug: 'partners', active: true, order: 7 },
      { slug: 'cta', active: true, order: 8 },
    ]
  }

  return (
    <>
      <LiveCounter />
      {sections.map((section) => {
        const Component = sectionComponents[section.slug]
        if (!Component) return null
        return <Component key={section.slug} />
      })}
    </>
  )
}
