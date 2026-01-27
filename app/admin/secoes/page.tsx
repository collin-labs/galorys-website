"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Layers, RefreshCw, GripVertical, Eye, EyeOff, AlertCircle, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Section {
  id: string
  name: string
  slug: string
  description: string | null
  active: boolean
  order: number
}

// Seções padrão para seed inicial
const defaultSections = [
  { name: "Banner Principal", slug: "hero", description: 'Seção principal com "SOMOS GALORYS"', order: 1 },
  { name: "Pioneiros Roblox", slug: "pioneers", description: 'Primeira empresa gamer do Brasil a projetar jogos de Roblox', order: 2 },
  { name: "Times de Elite", slug: "teams", description: "Grid de times/modalidades", order: 3 },
  { name: "Conquistas", slug: "achievements", description: "Contadores de conquistas", order: 4 },
  { name: "Jogadores em Destaque", slug: "players", description: "Jogadores destacados", order: 5 },
  { name: "Roblox", slug: "roblox", description: "Integração com Roblox", order: 6 },
  { name: "Partidas", slug: "matches", description: "Próximas partidas", order: 7 },
  { name: "Nossos Parceiros", slug: "partners", description: "Logos dos parceiros/patrocinadores", order: 8 },
  { name: "Call to Action", slug: "cta", description: "Seção final de engajamento", order: 9 },
]

export default function SecoesPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)

  // Buscar seções do banco
  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const response = await fetch("/api/admin/home-sections")
      const data = await response.json()
      if (data.success) {
        setSections(data.sections || [])
      }
    } catch (error) {
      console.error("Erro ao buscar seções:", error)
    } finally {
      setLoading(false)
    }
  }

  // Toggle visibilidade
  const toggleVisibility = async (section: Section) => {
    try {
      const response = await fetch("/api/admin/home-sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: section.id, active: !section.active }),
      })
      if (response.ok) {
        setSections(sections.map((s) => 
          s.id === section.id ? { ...s, active: !s.active } : s
        ))
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error)
    }
  }

  // Mover para cima
  const moveUp = async (index: number) => {
    if (index === 0) return
    const newList = [...sections]
    ;[newList[index - 1], newList[index]] = [newList[index], newList[index - 1]]
    
    // Atualizar ordem
    const updatedSections = newList.map((s, i) => ({ ...s, order: i + 1 }))
    setSections(updatedSections)

    // Salvar no banco
    await fetch("/api/admin/home-sections", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        sections: updatedSections.map(s => ({ id: s.id, order: s.order }))
      }),
    })
  }

  // Mover para baixo
  const moveDown = async (index: number) => {
    if (index === sections.length - 1) return
    const newList = [...sections]
    ;[newList[index], newList[index + 1]] = [newList[index + 1], newList[index]]
    
    // Atualizar ordem
    const updatedSections = newList.map((s, i) => ({ ...s, order: i + 1 }))
    setSections(updatedSections)

    // Salvar no banco
    await fetch("/api/admin/home-sections", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        sections: updatedSections.map(s => ({ id: s.id, order: s.order }))
      }),
    })
  }

  // Seed inicial - popular com seções padrão
  const seedSections = async () => {
    setSeeding(true)
    try {
      for (const section of defaultSections) {
        await fetch("/api/admin/home-sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(section),
        })
      }
      await fetchSections()
    } catch (error) {
      console.error("Erro ao criar seções:", error)
    } finally {
      setSeeding(false)
    }
  }

  // Atualizar (recarregar)
  const handleRefresh = async () => {
    setSaving(true)
    await fetchSections()
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Seções do Site</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Gerencie quais seções aparecem na página inicial</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} variant="outline" className="border-border text-foreground bg-transparent" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Atualizar
          </Button>
          <Link href="/admin/secoes/novo">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Seção
            </Button>
          </Link>
        </div>
      </div>

      {/* Dica */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-200">
          <span className="font-medium text-yellow-400">Dica:</span> Desative seções que você não quer mostrar na home.
          Por exemplo, desative &quot;Nossos Parceiros&quot; até ter parceiros cadastrados.
        </p>
      </div>

      {/* Se não houver seções, mostrar botão de seed */}
      {sections.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <Layers className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma seção cadastrada</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Clique abaixo para criar as seções padrão da home.
          </p>
          <Button onClick={seedSections} disabled={seeding} className="bg-primary hover:bg-primary/90">
            {seeding ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Criar Seções Padrão
              </>
            )}
          </Button>
        </div>
      ) : (
        /* Lista de Seções */
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {sections.map((section, index) => (
              <div key={section.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                {/* Drag handle com setas */}
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-muted-foreground hover:text-foreground"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                  >
                    <span className="text-xs">▲</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-muted-foreground hover:text-foreground"
                    onClick={() => moveDown(index)}
                    disabled={index === sections.length - 1}
                  >
                    <span className="text-xs">▼</span>
                  </Button>
                </div>

                <div className="cursor-grab text-muted-foreground hover:text-foreground">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-foreground font-medium">{section.name}</h3>
                    <span className="px-2 py-0.5 text-xs font-mono rounded bg-muted text-muted-foreground">
                      {section.slug}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{section.description || "Sem descrição"}</p>
                </div>

                {/* Toggle */}
                <Button
                  onClick={() => toggleVisibility(section)}
                  className={`min-w-[100px] ${
                    section.active
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                  }`}
                >
                  {section.active ? (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Visível
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Oculto
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
