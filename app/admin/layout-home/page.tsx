"use client"

import { useState, useEffect } from "react"
import { Layers, Eye, Check, Monitor, Play, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { LayoutVersion } from "@/lib/layout-config"

export default function LayoutHomePage() {
  const [selectedLayout, setSelectedLayout] = useState<LayoutVersion>("v1")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Load current layout on mount
  useEffect(() => {
    const currentLayout = document.cookie
      .split("; ")
      .find((row) => row.startsWith("home-layout="))
      ?.split("=")[1] as LayoutVersion | undefined

    if (currentLayout) {
      setSelectedLayout(currentLayout)
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)

    // Set cookie for layout
    document.cookie = `home-layout=${selectedLayout}; path=/; max-age=31536000`

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setIsSaving(false)
    setSaved(true)

    setTimeout(() => setSaved(false), 2000)
  }

  const layouts = [
    {
      id: "v1" as LayoutVersion,
      name: "Layout Clássico",
      description: "Design original com animações suaves e elementos elegantes",
      icon: Monitor,
      features: ["Hero com efeito typing", "Grid de times", "Animações suaves", "Design minimalista"],
      preview: "/layout-v1-preview.jpg",
    },
    {
      id: "v2" as LayoutVersion,
      name: "Layout Animado",
      description: "Experiência rica com animações avançadas, carrossel e efeitos visuais impactantes",
      icon: Sparkles,
      features: [
        "Carrossel no Hero",
        "Seletor de times interativo",
        "Partículas animadas",
        "Efeitos parallax",
        "Transições suaves",
      ],
      preview: "/layout-v2-preview.jpg",
    },
    {
      id: "v3" as LayoutVersion,
      name: "Layout Cinematográfico",
      description: "Hero com vídeo de fundo, transições cinematográficas e experiência imersiva",
      icon: Play,
      features: [
        "Vídeo de fundo",
        "Efeitos cinematográficos",
        "Controle de áudio",
        "Animações de entrada",
        "Scan lines",
      ],
      preview: "/layout-v3-preview.jpg",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Layout da Home</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Escolha qual versão do layout será exibida na página inicial
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className={`min-w-[120px] ${saved ? "bg-green-600 hover:bg-green-600" : "bg-primary hover:bg-primary/90"}`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Salvo!
            </>
          ) : isSaving ? (
            "Salvando..."
          ) : (
            "Salvar Layout"
          )}
        </Button>
      </div>

      {/* Layout Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {layouts.map((layout) => {
          const isSelected = selectedLayout === layout.id

          return (
            <button
              key={layout.id}
              onClick={() => setSelectedLayout(layout.id)}
              className={`text-left p-0 rounded-2xl overflow-hidden transition-all duration-300 ${
                isSelected
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "hover:ring-2 hover:ring-border"
              }`}
            >
              {/* Preview Image */}
              <div className="relative aspect-video bg-muted">
                <img
                  src={layout.preview || `/placeholder.svg?height=200&width=400&query=${layout.name} preview`}
                  alt={layout.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                {/* Selection Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Selecionado
                  </div>
                )}

                {/* Icon */}
                <div className="absolute bottom-3 left-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? "bg-primary text-primary-foreground" : "bg-card/80 text-foreground backdrop-blur-sm"
                    }`}
                  >
                    <layout.icon className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 bg-card border border-border border-t-0 rounded-b-2xl">
                <h3 className={`font-semibold mb-1 ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {layout.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{layout.description}</p>

                {/* Features */}
                <div className="space-y-2">
                  {layout.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-primary" : "bg-muted-foreground"}`}
                      />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Preview Button */}
                <div className="mt-4 pt-4 border-t border-border">
                  <a
                    href={`/?layout=${layout.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye className="w-4 h-4" />
                    Visualizar Layout
                  </a>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Info Card */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
          <Layers className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-blue-200">
            <span className="font-medium text-blue-400">Dica:</span> Você pode visualizar cada layout antes de salvar
            clicando em &quot;Visualizar Layout&quot;. O layout selecionado será aplicado imediatamente após salvar.
          </p>
        </div>
      </div>
    </div>
  )
}
