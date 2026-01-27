"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Handshake, Plus, Search, Pencil, Trash2, Loader2, Eye, EyeOff, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Interface para os dados do parceiro
interface Partner {
  id: string
  name: string
  logo: string | null
  website: string | null
  order: number
  active: boolean
}

export default function ParceirosPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  // Buscar parceiros do banco de dados
  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/admin/partners')
      const data = await response.json()
      setPartners(data.partners || [])
    } catch (error) {
      console.error('Erro ao buscar parceiros:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPartners = partners.filter((partner) => 
    partner.name.toLowerCase().includes(search.toLowerCase())
  )

  // Toggle ativar/desativar
  const toggleActive = async (partner: Partner) => {
    try {
      const response = await fetch(`/api/admin/partners/${partner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !partner.active })
      })
      if (response.ok) {
        fetchPartners()
      }
    } catch (error) {
      console.error('Erro ao atualizar parceiro:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este parceiro?")) {
      try {
        const response = await fetch(`/api/admin/partners/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setPartners(partners.filter((p) => p.id !== id))
        }
      } catch (error) {
        console.error('Erro ao excluir parceiro:', error)
      }
    }
  }

  const activeCount = partners.filter(p => p.active).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <Handshake className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Gerenciar Parceiros</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {activeCount} ativos de {partners.length} parceiros
            </p>
          </div>
        </div>
        <Link href="/admin/parceiros/novo">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-1" /> Novo Parceiro
          </Button>
        </Link>
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-sm text-blue-200">
          <strong>Dica:</strong> Parceiros desativados não aparecem na home. 
          Se não houver nenhum parceiro ativo, apenas o card "Quer ser parceiro?" será exibido.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
      /* Table */
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Logo</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Parceiro</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Website</th>
              <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Ordem</th>
              <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  Nenhum parceiro encontrado.
                </td>
              </tr>
            ) : (
              filteredPartners.map((partner) => (
                <tr 
                  key={partner.id} 
                  className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
                    !partner.active ? 'opacity-60' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="w-12 h-12 rounded-lg bg-muted/50 border border-border flex items-center justify-center overflow-hidden">
                      {partner.logo ? (
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-foreground font-medium">{partner.name}</span>
                  </td>
                  <td className="py-4 px-4">
                    {partner.website ? (
                      <a 
                        href={partner.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        {partner.website.replace('https://', '').replace('http://', '')}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center text-muted-foreground">{partner.order}</td>
                  <td className="py-4 px-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(partner)}
                      className={`h-8 gap-1.5 ${
                        partner.active 
                          ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {partner.active ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          Inativo
                        </>
                      )}
                    </Button>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/parceiros/${partner.id}/editar`}
                        className="p-1.5 rounded-lg hover:bg-muted text-primary transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(partner.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  )
}
