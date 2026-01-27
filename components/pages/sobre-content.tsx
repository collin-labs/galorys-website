"use client"

import { motion } from "framer-motion"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Trophy, Users, Gamepad2, Heart, Target, Lightbulb, Sparkles } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Excelência",
    description:
      "Buscamos a excelência em tudo que fazemos, desde o competitivo até o relacionamento com fãs e parceiros.",
  },
  {
    icon: Heart,
    title: "Paixão",
    description: "Somos movidos pela paixão pelos games e pelo competitivo, transmitindo isso em cada partida.",
  },
  {
    icon: Users,
    title: "Inclusão",
    description: "Acreditamos que os eSports são para todos, como demonstrado pelo projeto Galorynhos.",
  },
  {
    icon: Lightbulb,
    title: "Inovação",
    description: "Sempre buscando novas formas de revolucionar o cenário de eSports brasileiro.",
  },
]

const timeline = [
  {
    year: "2019",
    title: "Fundação",
    description: "Nasce a Galorys com a visão de ser uma organização multilateral no cenário de games.",
    position: "right",
  },
  {
    year: "2020",
    title: "COD Mobile",
    description: "Entrada no cenário competitivo de Call of Duty Mobile, conquistando títulos rapidamente.",
    position: "left",
  },
  {
    year: "2021",
    title: "Expansão",
    description: "Abertura de times em Valorant e Free Fire, expandindo a presença nos principais títulos.",
    position: "right",
  },
  {
    year: "2022",
    title: "Gran Turismo",
    description: "Adriano Carrazza se junta à organização, trazendo credibilidade no automobilismo virtual.",
    position: "left",
  },
  {
    year: "2023",
    title: "Counter-Strike 2",
    description: "Formação do time principal de CS2, competindo nas principais ligas brasileiras.",
    position: "right",
  },
  {
    year: "2024",
    title: "Galorynhos",
    description: "Lançamento do projeto inclusivo Galorynhos, primeira equipe de CS2 com atletas com nanismo.",
    position: "left",
  },
  {
    year: "2025",
    title: "Consolidação",
    description: "TOP 2 Mundial em COD Mobile, campeão da Série B de CS2 e expansão contínua.",
    position: "right",
  },
]

const stats = [
  { icon: Trophy, value: "50+", label: "Títulos Conquistados" },
  { icon: Users, value: "25+", label: "Atletas Profissionais" },
  { icon: Gamepad2, value: "5", label: "Modalidades Ativas" },
  { icon: Sparkles, value: "100K+", label: "Seguidores" },
]

export function SobreContent() {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <PageHeader
          badge="Nossa História"
          title="SOMOS"
          highlightedText="GALORYS"
          description="A Galorys é uma empresa que visa se inserir em mercados promissores na área de games e conteúdo digital. Nosso intuito é sermos revolucionários e multilaterais no segmento de jogos, notícias, conteúdo digital e publicidade, sendo referência no mercado brasileiro."
        />

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 border border-border hover:border-galorys-purple/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-galorys-purple/20 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-galorys-purple" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Missão</h3>
            <p className="text-muted-foreground">
              Posicionar nossos atletas e nossos conteúdos junto a um público exigente, oferecendo produtos e serviços
              que atendam suas necessidades e busquem um mundo mais inclusivo e divertido.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 border border-border hover:border-galorys-pink/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-galorys-pink/20 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-galorys-pink" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Visão</h3>
            <p className="text-muted-foreground">
              Ser referência como marca multilateral no cenário de games do Brasil, alcançando comunidades ao redor do
              mundo e fazendo a diferença no cenário de eSports e entretenimento digital.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8"
          >
            Nossos Valores
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-center mb-8 max-w-xl mx-auto"
          >
            Os princípios que guiam cada decisão e ação da nossa organização.
          </motion.p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-6 border border-border hover:border-galorys-purple/50 transition-all text-center"
              >
                <value.icon className="w-10 h-10 mx-auto mb-4 text-galorys-purple" />
                <h3 className="font-bold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-center text-foreground mb-4"
          >
            Nossa Trajetória
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
          >
            Uma jornada de conquistas, inovação e crescimento constante.
          </motion.p>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-galorys-purple via-galorys-pink to-galorys-purple hidden md:block" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: item.position === "left" ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 md:gap-8 ${
                    item.position === "left" ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className={`flex-1 ${item.position === "left" ? "md:text-right" : ""}`}>
                    <div className="glass rounded-2xl p-6 border border-border hover:border-galorys-purple/50 transition-all">
                      <span className="text-galorys-purple font-bold">{item.year}</span>
                      <h3 className="font-bold text-foreground mt-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm mt-2">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-4 h-4 rounded-full bg-gradient-to-r from-galorys-purple to-galorys-pink z-10" />
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
