"use client"

import type React from "react"

import { useState, use, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trophy, Save, Trash2, Upload, X, Loader2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function EditarConquistaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([])

  const [formData, setFormData] = useState({
    title: "",
    placement: "",
    date: "",
    tournament: "",
    teamId: "",
    description: "",
    image: "",
    featured: false,
    featuredOrder: 0,
    isActive: true,
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

        // Buscar conquista
        const achievementRes = await fetch(`/api/admin/achievements/${id}`)
        if (achievementRes.ok) {
          const data = await achievementRes.json()
          const a = data.achievement
          setFormData({
            title: a.title || "",
            placement: a.placement || "",
            date: a.date ? new Date(a.date).toISOString().split("T")[0] : "",
            tournament: a.tournament || "",
            teamId: a.teamId || "",
            description: a.description || "",
            image: a.image || "",
            featured: a.featured ?? false,
            featuredOrder: a.featuredOrder || 0,
            isActive: a.active ?? true,
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

  // Upload de Imagem
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('folder', 'achievements')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      const data = await response.json()
      if (data.success) {
        setFormData({ ...formData, image: data.path })
      } else {
        alert(data.error || 'Erro no upload')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload da imagem')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, image: "" })
    if (imageInputRef.current) imageInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/achievements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          placement: formData.placement,
          date: formData.date,
          tournament: formData.tournament,
          teamId: formData.teamId,
          description: formData.description,
          image: formData.image || null,
          featured: formData.featured,
          featuredOrder: formData.featuredOrder,
          active: formData.isActive,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao atualizar conquista")
      }

      router.push("/admin/conquistas")
    } catch (error: any) {
      alert(error.message || "Erro ao atualizar conquista")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta conquista?")) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/achievements/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Erro ao excluir conquista")
      router.push("/admin/conquistas")
    } catch (error: any) {
      alert(error.message || "Erro ao excluir conquista")
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
          <Link href="/admin/conquistas" className="text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Editar Conquista</h1>
              <p className="text-sm text-muted-foreground">{formData.title}</p>
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
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Título <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-[#0d0d12] border-white/10 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Placement */}
            <div className="space-y-2">
              <Label htmlFor="placement" className="text-white">
                Colocação <span className="text-red-500">*</span>
              </Label>
              <Input
                id="placement"
                value={formData.placement}
                onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white"
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-white">
                Data <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white"
                required
              />
            </div>
          </div>

          {/* Tournament */}
          <div className="space-y-2">
            <Label htmlFor="tournament" className="text-white">
              Torneio <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tournament"
              value={formData.tournament}
              onChange={(e) => setFormData({ ...formData, tournament: e.target.value })}
              className="bg-[#0d0d12] border-white/10 text-white"
              required
            />
          </div>

          {/* Team */}
          <div className="space-y-2">
            <Label htmlFor="team" className="text-white">
              Time <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.teamId} onValueChange={(value) => setFormData({ ...formData, teamId: value })}>
              <SelectTrigger className="bg-[#0d0d12] border-white/10 text-white">
                <SelectValue />
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

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-white">Imagem da Conquista</Label>
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="w-24 h-24 rounded-xl bg-[#0d0d12] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative">
                {formData.image ? (
                  <>
                    <Image src={formData.image} alt="Imagem" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              {/* Upload Button */}
              <div className="flex-1">
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="w-full border-white/10 bg-transparent text-white hover:bg-white/10"
                >
                  {uploadingImage ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
                  ) : (
                    <><Upload className="w-4 h-4 mr-2" /> Escolher Imagem</>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">PNG, JPG ou WEBP. Troféu ou banner do evento.</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-[#0d0d12] border-white/10 text-white min-h-[100px]"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
                className="border-white/20 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
              />
              <Label htmlFor="featured" className="text-white cursor-pointer">
                Destaque na Home
              </Label>
            </div>

            {formData.featured && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="featuredOrder" className="text-white text-sm">
                  Ordem na Home (1-4)
                </Label>
                <Input
                  id="featuredOrder"
                  type="number"
                  min="1"
                  max="4"
                  value={formData.featuredOrder || ""}
                  onChange={(e) => setFormData({ ...formData, featuredOrder: parseInt(e.target.value) || 0 })}
                  className="bg-[#0d0d12] border-white/10 text-white w-20"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="isActive" className="text-white cursor-pointer">
                Ativo
              </Label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
            <Save className="w-4 h-4 mr-1" /> {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Link href="/admin/conquistas">
            <Button type="button" variant="ghost" className="text-muted-foreground hover:text-white" disabled={loading}>
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
