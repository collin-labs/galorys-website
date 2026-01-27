"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  HelpCircle,
  TrendingUp,
  Download,
  Award,
  Package,
  Sparkles,
  Star,
  Heart,
  Share2,
  MessageSquare,
  Trophy,
  LogIn,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RewardsGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

type TabType = "como-funciona" | "ganhar-pontos" | "wallpapers" | "badges" | "premios-fisicos"

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "como-funciona", label: "Como Funciona", icon: HelpCircle },
  { id: "ganhar-pontos", label: "Ganhar Pontos", icon: TrendingUp },
  { id: "wallpapers", label: "Wallpapers", icon: Download },
  { id: "badges", label: "Badges", icon: Award },
  { id: "premios-fisicos", label: "Prêmios Físicos", icon: Package },
]

const pointsActions = [
  { icon: Star, action: "Criar conta", points: 100 },
  { icon: LogIn, action: "Login diário", points: 10 },
  { icon: Heart, action: "Favoritar time", points: 20 },
  { icon: Share2, action: "Compartilhar nas redes", points: 15 },
  { icon: MessageSquare, action: "Comentar", points: 5 },
  { icon: Trophy, action: "Assistir partida ao vivo", points: 25 },
]

const wallpapers = [
  { name: "Wallpaper Básico", description: "Pack com 3 wallpapers em alta resolução", points: 200 },
  { name: "Wallpaper Premium", description: "Pack exclusivo com 5 wallpapers premium dos times", points: 500 },
  { name: "Pack Completo", description: "Todos os wallpapers disponíveis (10+)", points: 1000 },
]

const badges = [
  {
    name: "Badge Fã Roxo",
    description: "Badge roxo que aparece ao lado do seu nome",
    points: 1500,
    color: "bg-purple-500",
  },
  {
    name: "Badge Fã Estrela",
    description: "Badge estrela premium com destaque especial",
    points: 2000,
    color: "bg-yellow-400",
  },
]

const physicalPrizes = [
  { name: "Mousepad Galorys", description: "Mousepad oficial 40x30cm", points: 6000, stock: 50 },
  { name: "Camiseta Oficial", description: "Camiseta oficial da Galorys", points: 10000, stock: 30 },
]

export function RewardsGuideModal({ isOpen, onClose }: RewardsGuideModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("como-funciona")

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 lg:inset-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-2xl lg:max-h-[85vh] bg-card rounded-2xl border border-border shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-galorys-purple/20 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-galorys-purple" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Guia de Recompensas</h2>
                  <p className="text-sm text-muted-foreground">Entenda como funciona o programa de fidelidade</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-1 p-2 border-b border-border shrink-0 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                    activeTab === tab.id
                      ? "bg-galorys-purple text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              <AnimatePresence mode="wait">
                {activeTab === "como-funciona" && <ComoFuncionaTab key="como-funciona" />}
                {activeTab === "ganhar-pontos" && <GanharPontosTab key="ganhar-pontos" />}
                {activeTab === "wallpapers" && <WallpapersTab key="wallpapers" />}
                {activeTab === "badges" && <BadgesTab key="badges" />}
                {activeTab === "premios-fisicos" && <PremiosFisicosTab key="premios-fisicos" />}
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-muted shrink-0">
              <div
                className="h-full bg-gradient-to-r from-galorys-purple to-galorys-pink transition-all"
                style={{ width: `${((tabs.findIndex((t) => t.id === activeTab) + 1) / tabs.length) * 100}%` }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Gift(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  )
}

function ComoFuncionaTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-galorys-purple/20 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-galorys-purple" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Programa de Fidelidade Galorys</h3>
        <p className="text-muted-foreground">Ganhe pontos, troque por recompensas exclusivas!</p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            step: 1,
            title: "Interaja",
            description: "Faça login, favorite times, participe da comunidade",
            color: "bg-galorys-purple",
          },
          {
            step: 2,
            title: "Acumule",
            description: "Ganhe pontos a cada interação com a Galorys",
            color: "bg-green-500",
          },
          {
            step: 3,
            title: "Resgate",
            description: "Troque seus pontos por recompensas incríveis",
            color: "bg-yellow-500",
          },
        ].map((item) => (
          <div key={item.step} className="text-center space-y-2">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mx-auto text-white font-bold",
                item.color,
              )}
            >
              {item.step}
            </div>
            <h4 className="font-semibold text-foreground">{item.title}</h4>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Reward Types */}
      <div className="rounded-xl bg-muted/30 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h4 className="font-semibold text-foreground">Tipos de Recompensas</h4>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-galorys-purple" />
            <span className="text-muted-foreground">
              <strong className="text-foreground">Digitais:</strong> Wallpapers, badges - resgate instantâneo!
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-yellow-400" />
            <span className="text-muted-foreground">
              <strong className="text-foreground">Acessos:</strong> Discord VIP, canais exclusivos
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-400" />
            <span className="text-muted-foreground">
              <strong className="text-foreground">Físicos:</strong> Camisetas, mousepads - enviamos para você!
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Key(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  )
}

function GanharPontosTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-foreground">Como Ganhar Pontos</h3>
        <p className="text-muted-foreground">Cada interação vale pontos!</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {pointsActions.map((item, index) => (
          <motion.div
            key={item.action}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border hover:border-galorys-purple/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <item.icon className="w-4 h-4 text-galorys-purple" />
              <span className="text-sm text-foreground">{item.action}</span>
            </div>
            <span className="text-sm font-bold text-green-400">+{item.points} pts</span>
          </motion.div>
        ))}
      </div>

      {/* Tip */}
      <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4">
        <div className="flex items-start gap-2">
          <span className="text-yellow-400 shrink-0">💡</span>
          <div className="text-sm">
            <p className="font-semibold text-yellow-400">Dica</p>
            <p className="text-muted-foreground">
              Faça login todos os dias para acumular pontos! Em 30 dias de login consecutivo, você já terá 300 pontos só
              com isso.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function WallpapersTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-galorys-purple/20 flex items-center justify-center mx-auto">
          <Download className="w-7 h-7 text-galorys-purple" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Wallpapers Exclusivos</h3>
        <p className="text-muted-foreground">Papéis de parede oficiais da Galorys em alta resolução</p>
      </div>

      <div className="space-y-3">
        {wallpapers.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border"
          >
            <div>
              <h4 className="font-semibold text-foreground">{item.name}</h4>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <span className="text-lg font-bold text-galorys-purple shrink-0">{item.points} pts</span>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
        <div className="flex items-start gap-2">
          <span className="text-blue-400 shrink-0">📥</span>
          <div className="text-sm">
            <p className="font-semibold text-blue-400">Como funciona</p>
            <p className="text-muted-foreground">
              Ao resgatar, o download é liberado <strong className="text-foreground">instantaneamente</strong>. Você
              recebe um link para baixar seus wallpapers em alta qualidade.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function BadgesTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center mx-auto">
          <Award className="w-7 h-7 text-yellow-400" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Badges Exclusivos</h3>
        <p className="text-muted-foreground">Medalhas que aparecem ao lado do seu nome</p>
      </div>

      {/* Example */}
      <div className="rounded-xl bg-galorys-purple/10 border border-galorys-purple/30 p-4 text-center">
        <p className="text-sm text-muted-foreground mb-2">Exemplo de como fica:</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-bold text-foreground">João Silva</span>
          <div className="w-5 h-5 rounded-full bg-purple-500" />
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">Os badges aparecem ao lado do nome em todo o site!</p>
      </div>

      {/* Badges list */}
      <div className="space-y-3">
        {badges.map((badge) => (
          <div
            key={badge.name}
            className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border"
          >
            <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-full", badge.color)} />
              <div>
                <h4 className="font-semibold text-foreground">{badge.name}</h4>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </div>
            </div>
            <span className="text-lg font-bold text-galorys-purple shrink-0">{badge.points} pts</span>
          </div>
        ))}
      </div>

      {/* Auto Info */}
      <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4">
        <div className="flex items-start gap-2">
          <span className="text-green-400 shrink-0">✨</span>
          <div className="text-sm">
            <p className="font-semibold text-green-400">Automático!</p>
            <p className="text-muted-foreground">
              Ao resgatar um badge, ele aparece <strong className="text-foreground">imediatamente</strong> ao lado do
              seu nome no dashboard, no menu lateral e nas configurações. Nenhuma ação extra necessária!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PremiosFisicosTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center mx-auto">
          <Package className="w-7 h-7 text-orange-400" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Prêmios Físicos</h3>
        <p className="text-muted-foreground">Produtos oficiais entregues na sua casa!</p>
      </div>

      {/* Prizes list */}
      <div className="space-y-3">
        {physicalPrizes.map((prize) => (
          <div
            key={prize.name}
            className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border"
          >
            <div>
              <h4 className="font-semibold text-foreground">{prize.name}</h4>
              <p className="text-sm text-muted-foreground">{prize.description}</p>
              <p className="text-xs text-muted-foreground mt-1">Estoque: {prize.stock} unidades</p>
            </div>
            <span className="text-lg font-bold text-orange-400 shrink-0">{prize.points.toLocaleString()} pts</span>
          </div>
        ))}
      </div>

      {/* Delivery Info */}
      <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-4">
        <div className="flex items-start gap-2">
          <span className="text-orange-400 shrink-0">📦</span>
          <div className="text-sm">
            <p className="font-semibold text-orange-400">Como funciona a entrega</p>
            <ol className="text-muted-foreground mt-2 space-y-1">
              <li>1. Ao resgatar, você preenche seus dados de entrega</li>
              <li>2. Nossa equipe prepara o envio</li>
              <li>3. Você recebe notificação quando for enviado</li>
              <li>4. Produto chega na sua casa!</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2">* Frete grátis para todo o Brasil</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
