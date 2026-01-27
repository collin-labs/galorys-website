"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Handshake, Save, Upload, X, Loader2, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function NovoParceiro() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    website: "",
    order: 0,
    active: true,
  })

  // Upload de imagem
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('folder', 'partners')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      const data = await response.json()
      if (data.success) {
        setFormData({ ...formData, logo: data.path })
      } else {
        alert(data.error || 'Erro no upload')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
    }
  }

  const removeLogo = () => {
    setFormData({ ...formData, logo: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Nome é obrigatório')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          logo: formData.logo || null,
          website: formData.website || null,
          order: formData.order,
          active: formData.active,
        })
      })

      if (response.ok) {
        router.push("/admin/parceiros")
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao criar parceiro')
      }
    } catch (error) {
      console.error('Erro ao criar parceiro:', error)
      alert('Erro ao criar parceiro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/parceiros" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <Handshake className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Novo Parceiro</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          {/* Upload de Logo */}
          <div className="space-y-2">
            <Label className="text-foreground">Logo do Parceiro</Label>
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="w-24 h-24 rounded-xl bg-muted/50 border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative">
                {formData.logo ? (
                  <>
                    <Image
                      src={formData.logo}
                      alt="Logo"
                      fill
                      className="object-contain p-2"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <Building2 className="w-8 h-8 text-muted-foreground" />
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full border-border"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Escolher Imagem
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, WEBP ou SVG. Máximo 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Nome <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Nome do parceiro"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-background border-border"
              required
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-foreground">
              Website
            </Label>
            <Input
              id="website"
              placeholder="https://exemplo.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="bg-background border-border"
            />
          </div>

          {/* Ordem e Ativo */}
          <div className="flex items-center gap-6">
            <div className="space-y-2">
              <Label htmlFor="order" className="text-foreground">
                Ordem
              </Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) || 0 })}
                className="bg-background border-border w-24"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <Checkbox
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked as boolean })}
              />
              <Label htmlFor="active" className="text-foreground cursor-pointer">
                Ativo (visível na home)
              </Label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1" />
                Criar Parceiro
              </>
            )}
          </Button>
          <Link href="/admin/parceiros">
            <Button type="button" variant="ghost" className="text-muted-foreground hover:text-foreground">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
