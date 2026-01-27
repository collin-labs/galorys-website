"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Plus, ImageIcon, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/admin/status-badge"

// Interface para os dados do banner
interface Banner {
  id: string
  title: string
  subtitle: string | null
  image: string
  link: string | null
  order: number
  active: boolean
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  // Buscar banners do banco de dados
  useEffect(() => {
    async function fetchBanners() {
      try {
        const response = await fetch('/api/admin/banners')
        const data = await response.json()
        setBanners(data.banners || [])
      } catch (error) {
        console.error('Erro ao buscar banners:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este banner?")) {
      try {
        const response = await fetch(`/api/admin/banners/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setBanners(banners.filter((b) => b.id !== id))
        }
      } catch (error) {
        console.error('Erro ao excluir banner:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Gerenciar Banners</h1>
              <p className="text-sm text-muted-foreground">{banners.length} banners cadastrados</p>
            </div>
          </div>
        </div>
        <Link href="/admin/banners/novo">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-1" /> Novo Banner
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
      /* Grid of Cards - Using theme-aware colors */
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-card border border-border rounded-xl overflow-hidden group">
            {/* Image Preview */}
            <div className="aspect-video relative bg-muted">
              <Image
                src={banner.image || "/placeholder.svg?height=200&width=400&query=banner"}
                alt={banner.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-foreground font-semibold mb-1">{banner.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{banner.subtitle || '-'}</p>

              <div className="flex items-center justify-between">
                <StatusBadge status={banner.active ? "active" : "hidden"} />
                <div className="flex items-center gap-2">
                  <Link href={`/admin/banners/${banner.id}/editar`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(banner.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}
