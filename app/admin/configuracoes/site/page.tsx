"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Globe,
  Search,
  Twitter,
  Mail,
  MapPin,
  Image,
  Save,
  Loader2,
  CheckCircle2,
  BarChart3,
  Link2,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface SiteConfig {
  site_name: string
  site_description: string
  site_keywords: string
  site_url: string
  site_logo: string
  og_image: string
  twitter_handle: string
  contact_email: string
  address: string
  google_analytics: string
}

const defaultConfig: SiteConfig = {
  site_name: 'Galorys eSports',
  site_description: '',
  site_keywords: '',
  site_url: '',
  site_logo: '/images/logo/logo.png',
  og_image: '/images/og-image.png',
  twitter_handle: '@galorys',
  contact_email: 'contato@galorys.com',
  address: '',
  google_analytics: ''
}

export default function SiteConfigPage() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/site-config')
      if (response.ok) {
        const data = await response.json()
        setConfig({ ...defaultConfig, ...data.config })
      }
    } catch (error) {
      console.error('Erro ao carregar:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/admin/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (key: keyof SiteConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/configuracoes" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Configurações do Site
            </h1>
            <p className="text-sm text-muted-foreground">SEO, informações gerais e integrações</p>
          </div>
        </div>
        <Button onClick={saveConfig} disabled={saving} className="bg-primary hover:bg-primary/90">
          {saving ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</>
          ) : saved ? (
            <><CheckCircle2 className="w-4 h-4 mr-2" />Salvo!</>
          ) : (
            <><Save className="w-4 h-4 mr-2" />Salvar</>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Informações Básicas
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Site</Label>
              <Input
                value={config.site_name}
                onChange={(e) => updateConfig('site_name', e.target.value)}
                placeholder="Galorys eSports"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>URL do Site</Label>
              <Input
                value={config.site_url}
                onChange={(e) => updateConfig('site_url', e.target.value)}
                placeholder="https://galorys.com"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Email de Contato</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={config.contact_email}
                  onChange={(e) => updateConfig('contact_email', e.target.value)}
                  placeholder="contato@galorys.com"
                  className="bg-background pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Endereço / Localização</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={config.address}
                  onChange={(e) => updateConfig('address', e.target.value)}
                  placeholder="São Paulo, SP - Brasil"
                  className="bg-background pl-10"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* SEO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-green-400" />
            SEO (Otimização para Buscadores)
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Descrição do Site</Label>
              <Textarea
                value={config.site_description}
                onChange={(e) => updateConfig('site_description', e.target.value)}
                placeholder="Organização brasileira de eSports competindo nos maiores torneios do mundo."
                className="bg-background min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">Aparece nos resultados do Google (máx. 160 caracteres)</p>
            </div>

            <div className="space-y-2">
              <Label>Palavras-chave</Label>
              <Input
                value={config.site_keywords}
                onChange={(e) => updateConfig('site_keywords', e.target.value)}
                placeholder="esports, galorys, gaming, cs2, valorant"
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">Separadas por vírgula</p>
            </div>
          </div>
        </motion.div>

        {/* Redes Sociais */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Twitter className="w-5 h-5 text-sky-400" />
            Redes Sociais
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Twitter/X Handle</Label>
              <Input
                value={config.twitter_handle}
                onChange={(e) => updateConfig('twitter_handle', e.target.value)}
                placeholder="@galorys"
                className="bg-background"
              />
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">
                💡 Para gerenciar todas as redes sociais, acesse{' '}
                <Link href="/admin/redes-sociais" className="text-primary hover:underline">
                  Redes Sociais
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Imagens */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Image className="w-5 h-5 text-pink-400" />
            Imagens
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Logo do Site</Label>
              <Input
                value={config.site_logo}
                onChange={(e) => updateConfig('site_logo', e.target.value)}
                placeholder="/images/logo/logo.png"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Imagem Open Graph</Label>
              <Input
                value={config.og_image}
                onChange={(e) => updateConfig('og_image', e.target.value)}
                placeholder="/images/og-image.png"
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">Imagem que aparece ao compartilhar o site (1200x630px)</p>
            </div>
          </div>
        </motion.div>

        {/* Analytics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-400" />
            Analytics e Integrações
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Google Analytics ID</Label>
              <Input
                value={config.google_analytics}
                onChange={(e) => updateConfig('google_analytics', e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">ID de medição do Google Analytics 4</p>
            </div>

            <div className="space-y-2">
              <Label>Links Úteis</Label>
              <div className="flex flex-wrap gap-2">
                <Link href="/sitemap.xml" target="_blank" className="inline-flex items-center gap-1 px-3 py-1.5 bg-muted rounded-lg text-sm hover:bg-muted/80">
                  <Link2 className="w-3 h-3" /> Sitemap
                </Link>
                <Link href="/robots.txt" target="_blank" className="inline-flex items-center gap-1 px-3 py-1.5 bg-muted rounded-lg text-sm hover:bg-muted/80">
                  <Link2 className="w-3 h-3" /> Robots.txt
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Preview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-400" />
          Preview no Google
        </h2>
        
        <div className="p-4 bg-white rounded-lg">
          <div className="text-blue-600 text-lg hover:underline cursor-pointer">
            {config.site_name || 'Galorys eSports'}
          </div>
          <div className="text-green-700 text-sm">
            {config.site_url || 'https://galorys.com'}
          </div>
          <div className="text-gray-600 text-sm mt-1">
            {config.site_description || 'Descrição do site aparecerá aqui...'}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
