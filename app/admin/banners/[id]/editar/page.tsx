"use client"

import type React from "react"

import { useState, use, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, ImageIcon, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function EditarBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    link: "",
    order: 0,
    isActive: true,
  })

  useEffect(() => {
    async function fetchBanner() {
      try {
        const response = await fetch(`/api/admin/banners/${id}`)
        if (response.ok) {
          const data = await response.json()
          setFormData({
            title: data.banner.title || "",
            subtitle: data.banner.subtitle || "",
            imageUrl: data.banner.image || "",
            link: data.banner.link || "",
            order: data.banner.order || 0,
            isActive: data.banner.active ?? true,
          })
        }
      } catch (error) {
        console.error("Erro ao buscar banner:", error)
      } finally {
        setLoadingData(false)
      }
    }
    fetchBanner()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          subtitle: formData.subtitle,
          image: formData.imageUrl,
          link: formData.link,
          order: formData.order,
          active: formData.isActive,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao atualizar banner")
      }

      router.push("/admin/banners")
    } catch (error: any) {
      alert(error.message || "Erro ao atualizar banner")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este banner?")) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir banner")
      }

      router.push("/admin/banners")
    } catch (error: any) {
      alert(error.message || "Erro ao excluir banner")
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
          <Link href="/admin/banners" className="text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-white">Editar Banner</h1>
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

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle" className="text-white">
              Subtítulo
            </Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="bg-[#0d0d12] border-white/10 text-white"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-white">
              URL da Imagem <span className="text-red-500">*</span>
            </Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="bg-[#0d0d12] border-white/10 text-white"
              required
            />
          </div>

          {/* Image Preview */}
          {formData.imageUrl && (
            <div className="space-y-2">
              <Label className="text-white">Preview</Label>
              <div className="aspect-video relative bg-[#0d0d12] rounded-lg overflow-hidden max-w-md">
                <Image
                  src={formData.imageUrl || "/placeholder.svg?height=200&width=400&query=banner"}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Link */}
          <div className="space-y-2">
            <Label htmlFor="link" className="text-white">
              Link
            </Label>
            <Input
              id="link"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="bg-[#0d0d12] border-white/10 text-white"
            />
          </div>

          {/* Order and Active */}
          <div className="flex items-end gap-6">
            <div className="space-y-2">
              <Label htmlFor="order" className="text-white">
                Ordem
              </Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) || 0 })}
                className="bg-[#0d0d12] border-white/10 text-white w-24"
              />
            </div>
            <div className="flex items-center gap-2 pb-2">
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
            <Save className="w-4 h-4 mr-1" /> {loading ? "Salvando..." : "Salvar"}
          </Button>
          <Link href="/admin/banners">
            <Button type="button" variant="ghost" className="text-muted-foreground hover:text-white" disabled={loading}>
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}