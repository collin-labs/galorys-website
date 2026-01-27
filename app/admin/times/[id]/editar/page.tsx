"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Gamepad2, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Interface para jogos do banco
interface Game {
  id: string
  name: string
  slug: string
  active: boolean
}

export default function EditarTimePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [games, setGames] = useState<Game[]>([])
  const [loadingGames, setLoadingGames] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    game: "",
    description: "",
    logo: "",
    banner: "",
    order: 0,
    isActive: true,
  })

  // Buscar jogos da API
  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch("/api/admin/games")
        const data = await response.json()
        if (data.success) {
          setGames(data.games.filter((g: Game) => g.active))
        }
      } catch (error) {
        console.error("Erro ao buscar jogos:", error)
      } finally {
        setLoadingGames(false)
      }
    }
    fetchGames()
  }, [])

  // Buscar dados do time do banco
  useEffect(() => {
    async function fetchTeam() {
      try {
        const response = await fetch(`/api/admin/teams/${id}`)
        if (response.ok) {
          const data = await response.json()
          const team = data.team
          setFormData({
            name: team.name || "",
            slug: team.slug || "",
            game: team.game || "",
            description: team.description || "",
            logo: team.logo || "",
            banner: team.banner || "",
            order: team.order || 0,
            isActive: team.active ?? true,
          })
        }
      } catch (error) {
        console.error('Erro ao buscar time:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/teams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          game: formData.game,
          description: formData.description,
          logo: formData.logo,
          banner: formData.banner,
          order: formData.order,
          active: formData.isActive,
        })
      })

      if (response.ok) {
        router.push("/admin/times")
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao salvar')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar time')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/times" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Editar Time</h1>
            <p className="text-sm text-muted-foreground">{formData.name}</p>
          </div>
        </div>
      </div>

      {/* Form - Using theme-aware colors */}
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Nome do Time <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-background border-border text-foreground"
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-foreground">
              Slug (URL) <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">/times/</span>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="bg-background border-border text-foreground"
                required
              />
            </div>
          </div>

          {/* Game */}
          <div className="space-y-2">
            <Label htmlFor="game" className="text-foreground">
              Jogo <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.game} onValueChange={(value) => setFormData({ ...formData, game: value })}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder={loadingGames ? "Carregando jogos..." : "Selecione o jogo"} />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {loadingGames ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                ) : games.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    Nenhum jogo cadastrado.
                    <br />
                    <Link href="/admin/jogos" className="text-primary hover:underline">
                      Cadastre jogos primeiro
                    </Link>
                  </div>
                ) : (
                  games.map((game) => (
                    <SelectItem key={game.id} value={game.name} className="text-foreground hover:bg-muted">
                      {game.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-background border-border text-foreground min-h-[100px]"
            />
          </div>

          {/* Logo */}
          <div className="space-y-2">
            <Label htmlFor="logo" className="text-foreground">
              Logo (caminho da imagem)
            </Label>
            <Input
              id="logo"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              placeholder="/images/teams/logo.png"
              className="bg-background border-border text-foreground"
            />
            {formData.logo && (
              <div className="mt-2 p-2 bg-muted/30 rounded-lg inline-block">
                <img 
                  src={formData.logo} 
                  alt="Preview Logo" 
                  className="w-16 h-16 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}
          </div>

          {/* Banner */}
          <div className="space-y-2">
            <Label htmlFor="banner" className="text-foreground">
              Banner (caminho da imagem)
            </Label>
            <Input
              id="banner"
              value={formData.banner}
              onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
              placeholder="/images/teams/banner.jpg"
              className="bg-background border-border text-foreground"
            />
            {formData.banner && (
              <div className="mt-2 p-2 bg-muted/30 rounded-lg">
                <img 
                  src={formData.banner} 
                  alt="Preview Banner" 
                  className="w-full max-w-xs h-20 object-cover rounded"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label htmlFor="order" className="text-foreground">
              Ordem de exibição
            </Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) || 0 })}
              className="bg-background border-border text-foreground w-24"
            />
            <p className="text-xs text-muted-foreground">Menor número = aparece primeiro</p>
          </div>

          {/* Active */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="isActive" className="text-foreground cursor-pointer">
              Time ativo (visível no site)
            </Label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <Button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
            {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Link href="/admin/times">
            <Button type="button" variant="ghost" className="text-muted-foreground hover:text-foreground">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
