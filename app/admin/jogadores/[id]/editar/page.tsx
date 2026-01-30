"use client"

import type React from "react"

import { useState, use, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Users, Save, ImageIcon, Twitter, Instagram, Youtube, Twitch, Trash2, Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function EditarJogadorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([])

  const [formData, setFormData] = useState({
    nickname: "",
    name: "",
    slug: "",
    role: "",
    teamId: "",
    bio: "",
    photo: "",
    twitter: "",
    instagram: "",
    twitch: "",
    youtube: "",
    tiktok: "",
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

        // Buscar jogador
        const playerRes = await fetch(`/api/admin/players/${id}`)
        if (playerRes.ok) {
          const data = await playerRes.json()
          const p = data.player
          setFormData({
            nickname: p.nickname || "",
            name: p.realName || "",
            slug: p.slug || "",
            role: p.role || "",
            teamId: p.teamId || "",
            bio: p.bio || "",
            photo: p.photo || "",
            twitter: p.twitter || "",
            instagram: p.instagram || "",
            twitch: p.twitch || "",
            youtube: p.youtube || "",
            tiktok: p.tiktok || "",
            isActive: p.active ?? true,
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

  // Upload de Foto
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('folder', 'players')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      const data = await response.json()
      if (data.success) {
        setFormData({ ...formData, photo: data.path })
      } else {
        alert(data.error || 'Erro no upload')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload da imagem')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const removePhoto = () => {
    setFormData({ ...formData, photo: "" })
    if (photoInputRef.current) photoInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/players/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: formData.nickname,
          realName: formData.name,
          slug: formData.slug,
          role: formData.role,
          teamId: formData.teamId,
          bio: formData.bio,
          photo: formData.photo || null,
          twitter: formData.twitter,
          instagram: formData.instagram,
          twitch: formData.twitch,
          youtube: formData.youtube,
          tiktok: formData.tiktok,
          active: formData.isActive,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao atualizar jogador")
      }

      router.push("/admin/jogadores")
    } catch (error: any) {
      alert(error.message || "Erro ao atualizar jogador")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este jogador?")) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/players/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Erro ao excluir jogador")
      router.push("/admin/jogadores")
    } catch (error: any) {
      alert(error.message || "Erro ao excluir jogador")
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
          <Link href="/admin/jogadores" className="text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-white">Editar Jogador</h1>
              <p className="text-sm text-muted-foreground">{formData.nickname}</p>
            </div>
          </div>
        </div>
        <Button onClick={handleDelete} variant="destructive" className="bg-red-600 hover:bg-red-700" disabled={loading}>
          <Trash2 className="w-4 h-4 mr-1" /> {loading ? "Excluindo..." : "Excluir"}
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl">
        {/* Dados Básicos */}
        <div className="bg-[#14141b] border border-white/10 rounded-xl p-6 space-y-6 mb-6">
          <div className="flex items-center gap-2 text-white mb-4">
            <Users className="w-5 h-5 text-purple-400" />
            <h2 className="font-semibold">Dados Básicos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-white">
                Nickname <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nickname"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Nome Real
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-white">
                Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">
                Função
              </Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white"
              />
            </div>
          </div>

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
        </div>

        {/* Foto do Jogador */}
        <div className="bg-[#14141b] border border-white/10 rounded-xl p-6 space-y-6 mb-6">
          <div className="flex items-center gap-2 text-white mb-4">
            <ImageIcon className="w-5 h-5 text-green-400" />
            <h2 className="font-semibold">Foto do Jogador</h2>
          </div>

          <div className="flex items-start gap-4">
            {/* Preview */}
            <div className="w-24 h-24 rounded-xl bg-[#0d0d12] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative">
              {formData.photo ? (
                <>
                  <Image src={formData.photo} alt="Foto" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <Users className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            {/* Upload Button */}
            <div className="flex-1">
              <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              <Button
                type="button"
                variant="outline"
                onClick={() => photoInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="w-full border-white/10 bg-transparent text-white hover:bg-white/10"
              >
                {uploadingPhoto ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
                ) : (
                  <><Upload className="w-4 h-4 mr-2" /> Escolher Foto</>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">PNG, JPG ou WEBP. Recomendado: 400x400px</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white">
              Biografia
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="bg-[#0d0d12] border-white/10 text-white min-h-[100px]"
            />
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="bg-[#14141b] border border-white/10 rounded-xl p-6 space-y-6 mb-6">
          <div className="flex items-center gap-2 text-white mb-4">
            <Twitter className="w-5 h-5 text-blue-400" />
            <h2 className="font-semibold">Redes Sociais</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Twitter className="w-5 h-5 text-blue-400" />
              </div>
              <Input
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                <Instagram className="w-5 h-5 text-pink-400" />
              </div>
              <Input
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Twitch className="w-5 h-5 text-purple-400" />
              </div>
              <Input
                value={formData.twitch}
                onChange={(e) => setFormData({ ...formData, twitch: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <Youtube className="w-5 h-5 text-red-400" />
              </div>
              <Input
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
              className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="isActive" className="text-white cursor-pointer">
              Jogador ativo no time
            </Label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
            <Save className="w-4 h-4 mr-1" /> {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Link href="/admin/jogadores">
            <Button type="button" variant="ghost" className="text-muted-foreground hover:text-white" disabled={loading}>
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
