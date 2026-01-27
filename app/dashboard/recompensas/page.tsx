"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Gift, Download, Lock, Sparkles, HelpCircle, Key, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { RewardsGuideModal } from "@/components/dashboard/rewards-guide-modal"

interface Reward {
  id: string
  name: string
  description: string
  points: number
  type: "download" | "access" | "physical"
  isHighlight?: boolean
  stock?: number
}

const downloadRewards: Reward[] = [
  {
    id: "1",
    name: "Wallpaper Básico",
    description: "Pack com 3 wallpapers em alta resolução",
    points: 200,
    type: "download",
  },
  {
    id: "2",
    name: "Wallpaper Premium",
    description: "Pack exclusivo com 5 wallpapers premium",
    points: 500,
    type: "download",
    isHighlight: true,
  },
  {
    id: "3",
    name: "Pack Wallpapers Completo",
    description: "Todos os wallpapers disponíveis (10+)",
    points: 1000,
    type: "download",
  },
  {
    id: "4",
    name: "Badge Fã Roxo",
    description: "Badge exclusivo que aparece no seu perfil",
    points: 1500,
    type: "download",
  },
  {
    id: "5",
    name: "Badge Fã Estrela",
    description: "Badge premium com animação especial",
    points: 2000,
    type: "download",
    isHighlight: true,
  },
]

const accessRewards: Reward[] = [
  {
    id: "6",
    name: "Acesso Discord VIP",
    description: "Acesso ao canal exclusivo no Discord da Galorys",
    points: 3000,
    type: "access",
    isHighlight: true,
  },
]

const physicalRewards: Reward[] = [
  {
    id: "7",
    name: "Mousepad Galorys",
    description: "Mousepad oficial da Galorys (40x30cm)",
    points: 6000,
    type: "physical",
    stock: 50,
  },
  {
    id: "8",
    name: "Camiseta Oficial",
    description: "Camiseta oficial da Galorys (escolha o tamanho)",
    points: 10000,
    type: "physical",
    stock: 30,
    isHighlight: true,
  },
]

const userPoints = 100

export default function RecompensasPage() {
  const [isGuideOpen, setIsGuideOpen] = useState(false)

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-galorys-purple" />
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Recompensas</h1>
          </div>
          <p className="text-muted-foreground">Troque seus pontos por recompensas exclusivas!</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsGuideOpen(true)}
          className="border-galorys-purple/50 hover:bg-galorys-purple/20 bg-transparent"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Ver Recompensas
        </Button>
      </motion.div>

      {/* Points Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-galorys-purple/20 via-card to-galorys-pink/20 border border-galorys-purple/30 p-6"
      >
        <div className="absolute top-4 right-4">
          <Sparkles className="w-8 h-8 text-galorys-purple/30 animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground mb-1">Seus pontos</p>
        <p className="text-4xl lg:text-5xl font-bold text-foreground">{userPoints}</p>
      </motion.div>

      {/* Downloads Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center gap-2 mb-4">
          <Download className="w-5 h-5 text-galorys-purple" />
          <h2 className="text-lg font-semibold text-foreground">Downloads</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {downloadRewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} userPoints={userPoints} />
          ))}
        </div>
      </motion.div>

      {/* Access Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold text-foreground">Acessos Exclusivos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accessRewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} userPoints={userPoints} />
          ))}
        </div>
      </motion.div>

      {/* Physical Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg font-semibold text-foreground">Produtos Físicos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {physicalRewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} userPoints={userPoints} />
          ))}
        </div>
      </motion.div>

      {/* Rewards Guide Modal */}
      <RewardsGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  )
}

function RewardCard({ reward, userPoints }: { reward: Reward; userPoints: number }) {
  const canRedeem = userPoints >= reward.points
  const typeLabel = reward.type === "download" ? "Download" : reward.type === "access" ? "Acesso" : "Entrega"
  const typeBgColor =
    reward.type === "download"
      ? "bg-galorys-purple/20 text-galorys-purple"
      : reward.type === "access"
        ? "bg-yellow-500/20 text-yellow-400"
        : "bg-orange-500/20 text-orange-400"

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative overflow-hidden rounded-xl bg-card/50 backdrop-blur-sm border border-border",
        "hover:border-galorys-purple/50 hover:shadow-lg hover:shadow-galorys-purple/10 transition-all",
        "flex flex-col",
      )}
    >
      {/* Image placeholder with lock */}
      <div className="relative aspect-video bg-muted/30 flex items-center justify-center">
        {reward.isHighlight && (
          <Badge className="absolute top-3 left-3 bg-green-500/20 text-green-400 border-green-500/30">Destaque</Badge>
        )}
        <Lock className="w-10 h-10 text-muted-foreground/50" />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground">{reward.name}</h3>
          <Badge variant="secondary" className={typeBgColor}>
            {typeLabel}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3 flex-1">{reward.description}</p>

        {reward.stock && <p className="text-xs text-muted-foreground mb-2">Estoque: {reward.stock} unidades</p>}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <span className="text-lg font-bold text-galorys-purple">{reward.points.toLocaleString()} pts</span>
          <Button
            size="sm"
            disabled={!canRedeem}
            className={cn(
              canRedeem
                ? "bg-gradient-to-r from-galorys-purple to-galorys-pink hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed",
            )}
          >
            {canRedeem ? "Resgatar" : "Bloqueado"}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
