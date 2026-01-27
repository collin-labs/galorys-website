"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Search, FileText, Pencil, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/admin/status-badge"

// Mock data
const initialNews = [
  {
    id: 1,
    title: "COD Mobile: Tetracampeões do Stage 4",
    slug: "cod-mobile-tetra-stage-4",
    category: "Conquistas",
    date: "11/01/2026",
    status: "active" as const,
    featured: true,
  },
  {
    id: 2,
    title: "Galorynhos: inclusão e representatividade nos eSports",
    slug: "galorynhos-inclusao-esports",
    category: "Histórias",
    date: "11/01/2026",
    status: "active" as const,
    featured: true,
  },
  {
    id: 3,
    title: "Dídico conquista 4º lugar nas Olimpíadas Virtuais",
    slug: "didico-olimpiadas-virtuais-singapura",
    category: "Conquistas",
    date: "11/01/2026",
    status: "active" as const,
    featured: true,
  },
]

export default function NoticiasPage() {
  const [news, setNews] = useState(initialNews)
  const [search, setSearch] = useState("")

  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta notícia?")) {
      setNews(news.filter((n) => n.id !== id))
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
            <FileText className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Gerenciar Notícias</h1>
              <p className="text-sm text-muted-foreground">{news.length} notícias cadastradas</p>
            </div>
          </div>
        </div>
        <Link href="/admin/noticias/novo">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-1" /> Nova Notícia
          </Button>
        </Link>
      </div>

      {/* Search - Using theme-aware colors */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Table - Using theme-aware colors */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Título</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Categoria</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Data</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredNews.map((item) => (
              <tr key={item.id} className="bg-card hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      {item.title}
                      {item.featured && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />}
                    </p>
                    <p className="text-xs text-muted-foreground">/{item.slug}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    {item.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{item.date}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/admin/noticias/${item.id}/editar`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
