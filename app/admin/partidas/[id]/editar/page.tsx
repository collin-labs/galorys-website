"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Calendar, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function EditarPartidaPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([])

  const [formData, setFormData] = useState({
    opponent: "",
    dateTime: "",
    teamId: "",
    streamLink: "",
    result: "",
    isLive: false,
  })

  useEffect(() => {
    async function fetchData() {
      try {
        // Buscar times
        const teamsRes = await fetch("/api/admin/teams")
        if (teamsRes.ok) {
          const teamsData = await teamsRes.json()
          setTeams(teamsData.teams || [])
        }

        // Buscar partida
        const matchRes = await fetch(`/api/admin/matches/${id}`)
        if (matchRes.ok) {
          const data = await matchRes.json()
          const m = data.match
          setFormData({
            opponent: m.opponent || "",
            dateTime: m.scheduledAt ? new Date(m.scheduledAt).toISOString().slice(0, 16) : "",
            teamId: m.teamId || "",
            streamLink: m.streamUrl || "",
            result: m.result || "",
            isLive: m.isLive ?? false,
          })
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/matches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opponent: formData.opponent,
          scheduledAt: formData.dateTime,
          teamId: formData.teamId,
          streamUrl: formData.streamLink,
          result: formData.result,
          isLive: formData.isLive,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao atualizar partida")
      }

      router.push("/admin/partidas")
    } catch (error: any) {
      alert(error.message || "Erro ao atualizar partida")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta partida?")) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/matches/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Erro ao excluir partida")
      router.push("/admin/partidas")
    } catch (error: any) {
      alert(error.message || "Erro ao excluir partida")
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/partidas" className="text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-white">Editar Partida</h1>
              <p className="text-sm text-muted-foreground">Editando: vs {formData.opponent}</p>
            </div>
          </div>
        </div>
        <Button onClick={handleDelete} variant="destructive" className="bg-red-600 hover:bg-red-700" disabled={loading}>
          <Trash2 className="w-4 h-4 mr-1" /> {loading ? "Excluindo..." : "Excluir"}
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-[#14141b] border border-white/10 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="opponent" className="text-white">
                Adversário <span className="text-red-500">*</span>
              </Label>
              <Input
                id="opponent"
                placeholder="Nome do adversário"
                value={formData.opponent}
                onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTime" className="text-white">
                Data/Hora <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team" className="text-white">
              Time <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.teamId} onValueChange={(value) => setFormData({ ...formData, teamId: value })}>
              <SelectTrigger className="bg-[#0d0d12] border-white/10 text-white">
                <SelectValue placeholder="Selecione o time" />
              </SelectTrigger>
              <SelectContent className="bg-[#14141b] border-white/10">
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id} className="text-white hover:bg-white/10">
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="streamLink" className="text-white">
              Link da Stream
            </Label>
            <Input
              id="streamLink"
              placeholder="https://twitch.tv/..."
              value={formData.streamLink}
              onChange={(e) => setFormData({ ...formData, streamLink: e.target.value })}
              className="bg-[#0d0d12] border-white/10 text-white placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="result" className="text-white">
                Resultado
              </Label>
              <Input
                id="result"
                placeholder="2-0, 16-14..."
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <Checkbox
                id="isLive"
                checked={formData.isLive}
                onCheckedChange={(checked) => setFormData({ ...formData, isLive: checked as boolean })}
                className="border-white/20 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
              />
              <Label htmlFor="isLive" className="text-white cursor-pointer flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Partida ao vivo
              </Label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
            <Save className="w-4 h-4 mr-1" /> {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Link href="/admin/partidas">
            <Button type="button" variant="ghost" className="text-muted-foreground hover:text-white" disabled={loading}>
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}