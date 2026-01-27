import { HeroSectionV3 } from "@/components/sections/v3/hero-section-v3"
import { TeamsSectionV2 } from "@/components/sections/v2/teams-section-v2"
import { AchievementsSection } from "@/components/sections/achievements-section"
import { PlayersSection } from "@/components/sections/players-section"
import { GamesSection } from "@/components/sections/games-section"
import { MatchesSection } from "@/components/sections/matches-section"
import { PartnersSection } from "@/components/sections/partners-section"
import { CtaSection } from "@/components/sections/cta-section"
import { LiveCounter } from "@/components/sections/live-counter"

export function HomeV3() {
  return (
    <>
      <LiveCounter />
      <HeroSectionV3 />
      <TeamsSectionV2 />
      <AchievementsSection />
      <PlayersSection />
      <GamesSection />
      <MatchesSection />
      <PartnersSection />
      <CtaSection />
    </>
  )
}
