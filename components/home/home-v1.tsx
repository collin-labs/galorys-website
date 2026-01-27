import { HeroSection } from "@/components/sections/hero-section"
import { TeamsSection } from "@/components/sections/teams-section"
import { AchievementsSection } from "@/components/sections/achievements-section"
import { PlayersSection } from "@/components/sections/players-section"
import { GamesSection } from "@/components/sections/games-section"
import { MatchesSection } from "@/components/sections/matches-section"
import { PartnersSection } from "@/components/sections/partners-section"
import { CtaSection } from "@/components/sections/cta-section"
import { LiveCounter } from "@/components/sections/live-counter"

export function HomeV1() {
  return (
    <>
      <LiveCounter />
      <HeroSection />
      <TeamsSection />
      <AchievementsSection />
      <PlayersSection />
      <GamesSection />
      <MatchesSection />
      <PartnersSection />
      <CtaSection />
    </>
  )
}
