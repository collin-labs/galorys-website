"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

interface Team {
  id: string
  name: string
  game: string
}

export default function NovaPartidaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    opponent: "",
    dateTime: "",
    teamId: "",
    streamLink: "",
    result: "",
    isLive: false,
  })

  // Buscar times da API
  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await fetch("/api/admin/teams")
        const data = await response.json()
        
        if (data.teams) {
          setTeams(data.teams)
        }
      } catch (error) {
        console.error("Erro ao buscar times:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.teamId || !formData.opponent || !formData.dateTime) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    try {
      setSaving(true)
      
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: formData.teamId,
          opponent: formData.opponent,
          date: formData.dateTime,
          streamUrl: formData.streamLink || null,
          result: formData.result || null,
          isLive: formData.isLive,
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso!",
          description: "Partida criada com sucesso"
        })
        router.push("/admin/partidas")
      } else {
        toast({
          title: "Erro",
          description: data.error || "Falha ao criar partida",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao conectar com o servidor",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/partidas" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Nova Partida</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="opponent" className="text-foreground">
                Adversário <span className="text-red-500">*</span>
              </Label>
              <Input
                id="opponent"
                placeholder="Nome do adversário"
                value={formData.opponent}
                onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTime" className="text-foreground">
                Data/Hora <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                className="bg-muted/50 border-border text-foreground"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team" className="text-foreground">
              Time <span className="text-red-500">*</span>
            </Label>
            {loading ? (
              <div className="flex items-center gap-2 py-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Carregando times...
              </div>
            ) : (
              <Select value={formData.teamId} onValueChange={(value) => setFormData({ ...formData, teamId: value })}>
                <SelectTrigger className="bg-muted/50 border-border text-foreground">
                  <SelectValue placeholder="Selecione o time" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id} className="text-foreground hover:bg-muted">
                      {team.name} ({team.game})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="streamLink" className="text-foreground">
              Link da Stream (opcional)
            </Label>
            <Input
              id="streamLink"
              placeholder="https://twitch.tv/..."
              value={formData.streamLink}
              onChange={(e) => setFormData({ ...formData, streamLink: e.target.value })}
              className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="space-y-2 flex-1 w-full sm:w-auto">
              <Label htmlFor="result" className="text-foreground">
                Torneio/Competição
              </Label>
              <Input
                id="result"
                placeholder="Ex: ESL Pro League, World Championship..."
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center gap-2 pt-0 sm:pt-6">
              <Checkbox
                id="isLive"
                checked={formData.isLive}
                onCheckedChange={(checked) => setFormData({ ...formData, isLive: checked as boolean })}
                className="border-border data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
              />
              <Label htmlFor="isLive" className="text-foreground cursor-pointer flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Partida ao vivo
              </Label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6">
          <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1" />
                Criar Partida
              </>
            )}
          </Button>
          <Link href="/admin/partidas">
            <Button type="button" variant="ghost" className="w-full sm:w-auto text-muted-foreground hover:text-foreground">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
