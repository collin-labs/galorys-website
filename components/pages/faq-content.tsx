"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "O que é a Galorys?",
    answer: "A Galorys é uma organização de eSports brasileira que compete em diversas modalidades como Counter-Strike 2, Call of Duty Mobile, Gran Turismo, entre outros. Também mantemos comunidades ativas no Roblox e servidores de GTA RP. Nosso objetivo é representar o Brasil nas principais competições de jogos eletrônicos."
  },
  {
    question: "Como posso me tornar um jogador da Galorys?",
    answer: "Para se tornar um jogador da Galorys, você pode entrar em contato conosco através da página de contato ou acompanhar nossas redes sociais para ficar por dentro de tryouts e seletivas que realizamos periodicamente."
  },
  {
    question: "Quais são os times e comunidades da Galorys?",
    answer: "Temos times competitivos em Counter-Strike 2 (time principal), CS2 Galorynhos (primeira equipe de atletas com nanismo), Call of Duty Mobile, e Gran Turismo. Também mantemos comunidades no Roblox e servidores de GTA RP (KUSH e FLOW)."
  },
  {
    question: "O que é o projeto Galorynhos?",
    answer: "O projeto Galorynhos é um marco histórico nos eSports brasileiros. É a primeira equipe profissional de Counter-Strike 2 formada exclusivamente por atletas com nanismo, demonstrando que os eSports são verdadeiramente inclusivos."
  },
  {
    question: "Como posso ser parceiro da Galorys?",
    answer: "Se você representa uma empresa interessada em patrocinar ou fazer parceria com a Galorys, entre em contato conosco através da página de contato ou envie um email para parcerias@galorys.gg."
  },
  {
    question: "Os wallpapers são gratuitos?",
    answer: "Sim! Todos os wallpapers disponíveis na nossa página de downloads são gratuitos para uso pessoal."
  },
  {
    question: "O que são as comunidades Roblox e GTA RP?",
    answer: "Além dos times competitivos, a Galorys mantém comunidades de jogadores no Roblox e servidores de GTA RP (KUSH PVP e FLOW RP). São espaços para fãs se divertirem e interagirem com outros membros da comunidade."
  },
]

export function FaqContent() {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-galorys-purple/10 border border-galorys-purple/20 text-galorys-purple text-sm font-medium mb-4">
            Dúvidas Frequentes
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            PERGUNTAS <span className="gradient-text">FREQUENTES</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre a Galorys
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass rounded-xl border border-border px-6"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-galorys-purple">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Não encontrou o que procurava?
          </p>
          <a
            href="/contato"
            className="inline-flex items-center gap-2 text-galorys-purple hover:text-galorys-pink transition-colors"
          >
            Entre em contato conosco →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
