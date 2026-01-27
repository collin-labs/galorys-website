"use client"

import type React from "react"

import { useState, use, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileText, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function EditarNoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    date: "",
    category: "",
    author: "",
    summary: "",
    content: "",
    featured: false,
    published: true,
  })

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch(`/api/admin/news/${id}`)
        if (response.ok) {
          const data = await response.json()
          const n = data.news
          setFormData({
            title: n.title || "",
            slug: n.slug || "",
            date: n.publishedAt ? new Date(n.publishedAt).toISOString().split("T")[0] : "",
            category: n.category || "",
            author: n.author || "",
            summary: n.excerpt || "",
            content: n.content || "",
            featured: n.featured ?? false,
            published: n.active ?? true,
          })
        }
      } catch (error) {
        console.error("Erro ao buscar notícia:", error)
      } finally {
        setLoadingData(false)
      }
    }
    fetchNews()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.summary,
          content: formData.content,
          category: formData.category,
          author: formData.author,
          featured: formData.featured,
          active: formData.published,
          publishedAt: formData.date,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao atualizar notícia")
      }

      router.push("/admin/noticias")
    } catch (error: any) {
      alert(error.message || "Erro ao atualizar notícia")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta notícia?")) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/news/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Erro ao excluir notícia")
      router.push("/admin/noticias")
    } catch (error: any) {
      alert(error.message || "Erro ao excluir notícia")
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
          <Link href="/admin/noticias" className="text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-white">Editar Notícia</h1>
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

          {/* Slug and Date */}
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="date" className="text-white">
                Data de Publicação
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white"
              />
            </div>
          </div>

          {/* Category and Author */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-white">
                Categoria
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author" className="text-white">
                Autor
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-white">
              Resumo
            </Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="bg-[#0d0d12] border-white/10 text-white min-h-[80px]"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-white">
              Conteúdo <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="bg-[#0d0d12] border-white/10 text-white min-h-[200px]"
              required
            />
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
                className="border-white/20 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
              />
              <Label htmlFor="featured" className="text-white cursor-pointer">
                Destaque
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked as boolean })}
                className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="published" className="text-white cursor-pointer">
                Publicado
              </Label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
            <Save className="w-4 h-4 mr-1" /> {loading ? "Salvando..." : "Salvar"}
          </Button>
          <Link href="/admin/noticias">
            <Button type="button" variant="ghost" className="text-muted-foreground hover:text-white" disabled={loading}>
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}