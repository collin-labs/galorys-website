"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Users, Save, ImageIcon, Twitter, Instagram, Youtube, Twitch, Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface Team {
  id: string
  name: string
  slug: string
}

export default function NovoJogadorPage() {
  const router = useRouter()
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [loadingTeams, setLoadingTeams] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

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

  // Buscar times do banco
  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await fetch('/api/admin/teams')
        const data = await response.json()
        setTeams(data.teams || [])
      } catch (error) {
        console.error('Erro ao buscar times:', error)
      } finally {
        setLoadingTeams(false)
      }
    }
    fetchTeams()
  }, [])

  const generateSlug = (nickname: string) => {
    return nickname
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNicknameChange = (nickname: string) => {
    setFormData({
      ...formData,
      nickname,
      slug: generateSlug(nickname),
    })
  }

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
    setSaving(true)

    try {
      const response = await fetch('/api/admin/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        })
      })

      if (response.ok) {
        router.push("/admin/jogadores")
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar jogador')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao criar jogador')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/jogadores" className="text-muted-foreground hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-white">Novo Jogador</h1>
          </div>
        </div>
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
            {/* Nickname */}
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-white">
                Nickname <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nickname"
                placeholder="Ex: Nython, Didico..."
                value={formData.nickname}
                onChange={(e) => handleNicknameChange(e.target.value)}
                className="bg-[#0d0d12] border-white/10 text-white placeholder:text-muted-foreground"
                required
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Nome Real
              </Label>
              <Input
                id="name"
                placeholder="Ex: Gabriel Lino"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Slug */}
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
              <p className="text-xs text-muted-foreground">Usado na URL: /jogadores/slug</p>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">
                Função
              </Label>
              <Input
                id="role"
                placeholder="Ex: Capitão, IGL, Coach, Player..."
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Team */}
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

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white">
              Biografia
            </Label>
            <Textarea
              id="bio"
              placeholder="Uma breve descrição sobre o jogador, carreira, conquistas..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="bg-[#0d0d12] border-white/10 text-white placeholder:text-muted-foreground min-h-[100px]"
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
                placeholder="https://twitter.com/usuario"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                <Instagram className="w-5 h-5 text-pink-400" />
              </div>
              <Input
                placeholder="https://instagram.com/usuario"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Twitch className="w-5 h-5 text-purple-400" />
              </div>
              <Input
                placeholder="https://twitch.tv/usuario"
                value={formData.twitch}
                onChange={(e) => setFormData({ ...formData, twitch: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <Youtube className="w-5 h-5 text-red-400" />
              </div>
              <Input
                placeholder="https://youtube.com/@usuario"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </div>
              <Input
                placeholder="https://tiktok.com/@usuario"
                value={formData.tiktok}
                onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Active */}
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
          <Button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700">
            {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
            {saving ? "Criando..." : "Criar Jogador"}
          </Button>
          <Link href="/admin/jogadores">
            <Button type="button" variant="ghost" className="text-muted-foreground hover:text-white">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
