"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  User,
  Lock,
  Bell,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  LogOut,
  Trash2,
  Save,
  Instagram,
  Star,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Mock user data
const userData = {
  name: "Bruno",
  email: "bruvinca@hotmail.com",
  avatar: "B",
  role: "Administrador",
  badges: ["purple", "star"] as const,
}

const BadgeIcon = ({ type }: { type: "purple" | "star" }) => {
  if (type === "purple") {
    return (
      <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-purple-300" />
      </div>
    )
  }
  return <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
}

export default function ConfiguracoesPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    partidas: true,
    novidades: true,
    recompensas: true,
  })

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showFavorites: true,
    showPoints: false,
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie seu perfil e preferências da conta.</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <SettingsCard icon={User} title="Perfil" iconColor="text-galorys-purple">
          <div className="space-y-6">
            {/* Avatar and Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-galorys-purple to-galorys-pink flex items-center justify-center text-white font-bold text-2xl">
                  {userData.avatar}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-galorys-purple flex items-center justify-center text-white hover:bg-galorys-purple-dark transition-colors">
                  <Instagram className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-lg">{userData.name}</span>
                  {userData.badges.map((badge, i) => (
                    <BadgeIcon key={i} type={badge} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
                <span className="text-xs text-galorys-purple">{userData.role}</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" defaultValue={userData.name} className="bg-muted/50 border-border" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  defaultValue={userData.email}
                  disabled
                  className="bg-muted/50 border-border opacity-60"
                />
                <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
              </div>

              <Button className="bg-gradient-to-r from-galorys-pink to-galorys-purple hover:opacity-90">
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </SettingsCard>
      </motion.div>

      {/* Password Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <SettingsCard icon={Lock} title="Alterar Senha" iconColor="text-yellow-400">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPassword ? "text" : "password"}
                  className="bg-muted/50 border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  className="bg-muted/50 border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input id="confirm-password" type="password" className="bg-muted/50 border-border" />
            </div>

            <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
              <Lock className="w-4 h-4 mr-2" />
              Alterar Senha
            </Button>
          </div>
        </SettingsCard>
      </motion.div>

      {/* Notifications Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <SettingsCard icon={Bell} title="Notificações" iconColor="text-blue-400">
          <div className="space-y-4">
            <ToggleItem
              title="Notificações por Email"
              description="Receba atualizações no seu email"
              checked={notifications.email}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
            />
            <ToggleItem
              title="Notificações Push"
              description="Alertas no navegador"
              checked={notifications.push}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
            />
            <ToggleItem
              title="Partidas"
              description="Avisos sobre partidas dos seus times favoritos"
              checked={notifications.partidas}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, partidas: checked }))}
            />
            <ToggleItem
              title="Novidades"
              description="Notícias e atualizações da Galorys"
              checked={notifications.novidades}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, novidades: checked }))}
            />
            <ToggleItem
              title="Recompensas"
              description="Novas recompensas e promoções"
              checked={notifications.recompensas}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, recompensas: checked }))}
            />

            <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
              <Save className="w-4 h-4 mr-2" />
              Salvar Preferências
            </Button>
          </div>
        </SettingsCard>
      </motion.div>

      {/* Privacy Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <SettingsCard icon={Shield} title="Privacidade" iconColor="text-green-400">
          <div className="space-y-4">
            <ToggleItem
              title="Perfil Público"
              description="Outros usuários podem ver seu perfil"
              checked={privacy.publicProfile}
              onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, publicProfile: checked }))}
            />
            <ToggleItem
              title="Mostrar Favoritos"
              description="Exibir seus times favoritos publicamente"
              checked={privacy.showFavorites}
              onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, showFavorites: checked }))}
            />
            <ToggleItem
              title="Mostrar Pontos"
              description="Exibir sua pontuação no perfil"
              checked={privacy.showPoints}
              onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, showPoints: checked }))}
            />
          </div>
        </SettingsCard>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <SettingsCard icon={AlertTriangle} title="Zona de Perigo" iconColor="text-red-400" variant="danger">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div>
                <h4 className="font-medium text-foreground">Sair da Conta</h4>
                <p className="text-sm text-muted-foreground">Encerrar sua sessão atual</p>
              </div>
              <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div>
                <h4 className="font-medium text-foreground">Excluir Conta</h4>
                <p className="text-sm text-muted-foreground">Remover permanentemente sua conta e todos os dados</p>
              </div>
              <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </SettingsCard>
      </motion.div>
    </div>
  )
}

interface SettingsCardProps {
  icon: React.ElementType
  title: string
  iconColor?: string
  variant?: "default" | "danger"
  children: React.ReactNode
}

function SettingsCard({
  icon: Icon,
  title,
  iconColor = "text-galorys-purple",
  variant = "default",
  children,
}: SettingsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-card/50 backdrop-blur-sm border overflow-hidden",
        variant === "danger" ? "border-red-500/30" : "border-border",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-3 border-b",
          variant === "danger" ? "border-red-500/30" : "border-border",
        )}
      >
        <Icon className={cn("w-5 h-5", variant === "danger" ? "text-red-400" : iconColor)} />
        <h2 className={cn("font-semibold", variant === "danger" ? "text-red-400" : "text-foreground")}>{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

interface ToggleItemProps {
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

function ToggleItem({ title, description, checked, onCheckedChange }: ToggleItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <h4 className="font-medium text-foreground text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
