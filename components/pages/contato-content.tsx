"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/ui/page-header"
import {
  Mail,
  MessageSquare,
  Clock,
  MapPin,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Twitch,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "contato@galorys.com",
    color: "text-galorys-purple",
  },
  {
    icon: MessageSquare,
    title: "Discord",
    value: "discord.gg/galorys",
    color: "text-indigo-500",
  },
  {
    icon: Clock,
    title: "Horário de Atendimento",
    value: "Segunda a Sexta, 9h às 18h",
    color: "text-green-500",
  },
  {
    icon: MapPin,
    title: "Localização",
    value: "Brasil",
    color: "text-red-500",
  },
]

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "YouTube", icon: Youtube, href: "#" },
  { name: "Twitch", icon: Twitch, href: "#" },
]

export function ContatoContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError("")

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSent(true)
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        setError(data.error || 'Erro ao enviar mensagem')
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <PageHeader
          badge="Fale Conosco"
          title="ENTRE EM"
          highlightedText="CONTATO"
          description="Tem alguma dúvida, sugestão ou proposta? Entre em contato conosco! Nossa equipe está pronta para atender você."
        />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-muted border-border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-muted border-border"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Assunto <span className="text-red-500">*</span>
                </label>
                <Select onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue placeholder="Selecione um assunto" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="parceria">Parceria</SelectItem>
                    <SelectItem value="patrocinio">Patrocínio</SelectItem>
                    <SelectItem value="imprensa">Imprensa</SelectItem>
                    <SelectItem value="suporte">Suporte</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mensagem <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Escreva sua mensagem..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-muted border-border min-h-[150px]"
                  required
                />
              </div>

              {sent && (
                <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400">
                  ✓ Mensagem enviada com sucesso! Responderemos em até 48 horas.
                </div>
              )}

              {error && (
                <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-gradient-to-r from-galorys-purple to-galorys-pink hover:opacity-90 disabled:opacity-50"
              >
                {sending ? (
                  <>Enviando...</>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Info Card */}
            <div className="glass rounded-2xl p-6 border border-border">
              <h3 className="font-bold text-foreground text-lg mb-6">Informações de Contato</h3>
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-muted-foreground text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="glass rounded-2xl p-6 border border-border">
              <h3 className="font-bold text-foreground text-lg mb-4">Redes Sociais</h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <social.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ Link */}
            <div className="glass rounded-2xl p-6 border border-galorys-purple/30 bg-galorys-purple/5">
              <h3 className="font-bold text-foreground text-lg mb-2">Perguntas Frequentes</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Antes de entrar em contato, confira se sua dúvida já foi respondida em nossa página de FAQ.
              </p>
              <Link href="/faq">
                <Button variant="outline" className="border-border bg-transparent">
                  Ver FAQ
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
