"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { PageHeader } from "@/components/ui/page-header"
import { Users, Trophy, Calendar, ArrowRight } from "lucide-react"

const teams = [
  {
    id: "gran-turismo",
    name: "Gran Turismo",
    description:
      "Didico (Adriano Carrazza) representa a Galorys no automobilismo virtual desde 2022, sendo 15x Campeão Brasileiro de Gran Turismo...",
    players: 1,
    achievements: 4,
    since: 2026,
    color: "from-blue-500 to-cyan-500",
    badge: null,
  },
  {
    id: "cod-mobile",
    name: "Call of Duty Mobile",
    description:
      "Call of Duty: Mobile conquistou um espaço significativo na arena de jogos mobile. Este jogo de tiro em primeira pessoa (FPS) online traz...",
    players: 6,
    achievements: 3,
    since: 2026,
    color: "from-orange-500 to-red-500",
    badge: null,
  },
  {
    id: "cs2-galorynhos",
    name: "CS2 Galorynhos",
    description:
      "A Galorys apresenta a primeira equipe de Counter-Strike 2 (CS2) formada exclusivamente por atletas com nanismo no cenário...",
    players: 6,
    achievements: 2,
    since: 2026,
    color: "from-galorys-purple to-galorys-pink",
    badge: "INCLUSÃO",
  },
  {
    id: "cs2",
    name: "Counter Strike 2",
    description:
      "Counter Strike 2 é a continuação altamente antecipada do lendário Counter Strike, desenvolvido pela Valve Corporation. Este jogo é um...",
    players: 5,
    achievements: 2,
    since: 2026,
    color: "from-yellow-500 to-orange-500",
    badge: null,
  },
]

export function TimesContent() {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <PageHeader
          badge="Nossas Equipes"
          title="TIMES DE"
          highlightedText="ELITE"
          description="A Galorys possui times profissionais competindo em múltiplas modalidades, desde FPS até simuladores de corrida. Conheça cada uma de nossas equipes e seus atletas."
        />

        {/* Teams Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="glass rounded-2xl p-6 md:p-8 border border-border hover:border-galorys-purple/50 transition-all h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">{team.name}</h3>
                  {team.badge && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-galorys-pink/20 text-galorys-pink border border-galorys-pink/30">
                      {team.badge}
                    </span>
                  )}
                </div>

                <p className="text-muted-foreground text-sm mb-6 flex-1">{team.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="glass rounded-xl p-4 text-center border border-border">
                    <Users className="w-5 h-5 mx-auto mb-2 text-galorys-purple" />
                    <p className="text-xl font-bold text-foreground">{team.players}</p>
                    <p className="text-xs text-muted-foreground">Jogadores</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center border border-border">
                    <Trophy className="w-5 h-5 mx-auto mb-2 text-galorys-pink" />
                    <p className="text-xl font-bold text-foreground">{team.achievements}</p>
                    <p className="text-xs text-muted-foreground">Conquistas</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center border border-border">
                    <Calendar className="w-5 h-5 mx-auto mb-2 text-galorys-purple" />
                    <p className="text-xl font-bold text-foreground">{team.since}</p>
                    <p className="text-xs text-muted-foreground">Desde</p>
                  </div>
                </div>

                <Link
                  href={`/times/${team.id}`}
                  className="flex items-center justify-between text-muted-foreground hover:text-galorys-purple transition-colors group/link"
                >
                  <span className="text-sm">Ver time completo</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
