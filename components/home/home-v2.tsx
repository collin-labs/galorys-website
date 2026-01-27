import { HeroSectionV2 } from "@/components/sections/v2/hero-section-v2"
import { TeamsSectionV2 } from "@/components/sections/v2/teams-section-v2"
import { AchievementsSection } from "@/components/sections/achievements-section"
import { PlayersSection } from "@/components/sections/players-section"
import { GamesSection } from "@/components/sections/games-section"
import { MatchesSection } from "@/components/sections/matches-section"
import { PartnersSection } from "@/components/sections/partners-section"
import { CtaSection } from "@/components/sections/cta-section"
import { LiveCounter } from "@/components/sections/live-counter"
import { prisma } from "@/lib/prisma"

// Mapear slug para componente (V2 usa componentes diferentes para hero e teams)
// Inclui slugs antigos (do seed.ts) e novos (do admin) para compatibilidade
const sectionComponents: Record<string, React.ComponentType> = {
  hero: HeroSectionV2,
  teams: TeamsSectionV2,
  "elite-teams": TeamsSectionV2,  // slug antigo do seed
  achievements: AchievementsSection,
  players: PlayersSection,
  "featured-players": PlayersSection,  // slug antigo do seed
  roblox: GamesSection,  // GamesSection tem abas: Roblox + GTA
  gtarp: GamesSection,   // slug antigo do seed (separado)
  matches: MatchesSection,
  partners: PartnersSection,
  cta: CtaSection,
}

export async function HomeV2() {
  // Buscar seções ativas do banco, ordenadas
  let sections: { slug: string; active: boolean; order: number }[] = []
  
  try {
    sections = await prisma.homeSection.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: { slug: true, active: true, order: true }
    })
    console.log('🏠 [V2] Seções do banco:', sections.map(s => s.slug))
  } catch (error) {
    console.error('❌ [V2] Erro ao buscar seções:', error)
    // Fallback com slugs do seed.ts (antigos)
    sections = [
      { slug: 'hero', active: true, order: 1 },
      { slug: 'elite-teams', active: true, order: 2 },
      { slug: 'featured-players', active: true, order: 3 },
      { slug: 'matches', active: true, order: 4 },
      { slug: 'achievements', active: true, order: 5 },
      { slug: 'roblox', active: true, order: 6 },
      { slug: 'partners', active: true, order: 7 },
    ]
  }

  if (sections.length === 0) {
    console.log('⚠️ [V2] Nenhuma seção no banco, usando fallback')
    sections = [
      { slug: 'hero', active: true, order: 1 },
      { slug: 'elite-teams', active: true, order: 2 },
      { slug: 'featured-players', active: true, order: 3 },
      { slug: 'matches', active: true, order: 4 },
      { slug: 'achievements', active: true, order: 5 },
      { slug: 'roblox', active: true, order: 6 },
      { slug: 'partners', active: true, order: 7 },
    ]
  }

  // Filtrar gtarp se roblox já existir (GamesSection já tem as duas abas)
  const hasRoblox = sections.some(s => s.slug === 'roblox')
  if (hasRoblox) {
    sections = sections.filter(s => s.slug !== 'gtarp')
  }

  console.log('🔄 [V2] Renderizando seções:', sections.map(s => `${s.slug} -> ${sectionComponents[s.slug] ? '✅' : '❌'}`))

  return (
    <>
      <LiveCounter />
      {sections.map((section) => {
        const Component = sectionComponents[section.slug]
        if (!Component) {
          console.log(`❌ [V2] Componente não encontrado para slug: ${section.slug}`)
          return null
        }
        return <Component key={section.slug} />
      })}
    </>
  )
}
