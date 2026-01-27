"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Crown, Plus, Trash2, GripVertical, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Team {
  id: string
  name: string
  slug: string
  game: string
  logo: string | null
  active: boolean
}

interface EliteTeam {
  id: string
  teamId: string
  order: number
  team: Team
}

export default function TimesElitePage() {
  const [eliteTeams, setEliteTeams] = useState<EliteTeam[]>([])
  const [allTeams, setAllTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState<string>("")

  // Buscar dados
  useEffect(() => {
    async function fetchData() {
      try {
        // Buscar times de elite
        const eliteRes = await fetch('/api/admin/elite-teams')
        const eliteData = await eliteRes.json()
        setEliteTeams(eliteData.eliteTeams || [])

        // Buscar todos os times
        const teamsRes = await fetch('/api/admin/teams')
        const teamsData = await teamsRes.json()
        setAllTeams(teamsData.teams || [])
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Times disponíveis (que não estão na lista de elite)
  const availableTeams = allTeams.filter(
    team => team.active && !eliteTeams.some(et => et.teamId === team.id)
  )

  // Adicionar time de elite
  const handleAdd = async () => {
    if (!selectedTeam) return

    try {
      const response = await fetch('/api/admin/elite-teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: selectedTeam, order: eliteTeams.length + 1 })
      })

      if (response.ok) {
        const data = await response.json()
        setEliteTeams([...eliteTeams, data.eliteTeam])
        setSelectedTeam("")
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao adicionar')
      }
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  // Remover time de elite
  const handleRemove = async (id: string) => {
    if (!confirm('Remover este time da lista de elite?')) return

    try {
      const response = await fetch(`/api/admin/elite-teams?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setEliteTeams(eliteTeams.filter(et => et.id !== id))
      }
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  // Mover para cima
  const moveUp = async (index: number) => {
    if (index === 0) return
    const newList = [...eliteTeams]
    ;[newList[index - 1], newList[index]] = [newList[index], newList[index - 1]]
    
    // Atualizar ordem
    const items = newList.map((item, i) => ({ id: item.id, order: i + 1 }))
    await fetch('/api/admin/elite-teams', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    })
    
    setEliteTeams(newList.map((item, i) => ({ ...item, order: i + 1 })))
  }

  // Mover para baixo
  const moveDown = async (index: number) => {
    if (index === eliteTeams.length - 1) return
    const newList = [...eliteTeams]
    ;[newList[index], newList[index + 1]] = [newList[index + 1], newList[index]]
    
    // Atualizar ordem
    const items = newList.map((item, i) => ({ id: item.id, order: i + 1 }))
    await fetch('/api/admin/elite-teams', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    })
    
    setEliteTeams(newList.map((item, i) => ({ ...item, order: i + 1 })))
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
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-yellow-500" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Times de Elite</h1>
              <p className="text-sm text-muted-foreground">
                {eliteTeams.length}/4 times na seção da home
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-sm text-yellow-200">
          <strong>Dica:</strong> Os Times de Elite aparecem na seção principal da Home. 
          Máximo de 4 times. Arraste para reordenar.
        </p>
      </div>

      {/* Adicionar novo */}
      {eliteTeams.length < 4 && (
        <div className="flex gap-3">
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="flex-1 bg-card border-border">
              <SelectValue placeholder="Selecione um time para adicionar..." />
            </SelectTrigger>
            <SelectContent>
              {availableTeams.map(team => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name} ({team.game})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAdd} 
            disabled={!selectedTeam}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-1" /> Adicionar
          </Button>
        </div>
      )}

      {/* Lista de times de elite */}
      <div className="space-y-3">
        {eliteTeams.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Crown className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum time de elite configurado.</p>
            <p className="text-sm">A seção não aparecerá na home.</p>
          </div>
        ) : (
          eliteTeams.map((elite, index) => (
            <div 
              key={elite.id}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl"
            >
              {/* Posição */}
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                >
                  <span className="text-xs">▲</span>
                </Button>
                <span className="text-center text-lg font-bold text-primary">
                  {index + 1}º
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveDown(index)}
                  disabled={index === eliteTeams.length - 1}
                >
                  <span className="text-xs">▼</span>
                </Button>
              </div>

              {/* Grip */}
              <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />

              {/* Avatar */}
              <Avatar className="w-12 h-12">
                <AvatarImage src={elite.team.logo || ''} />
                <AvatarFallback className="bg-muted text-foreground">
                  {elite.team.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{elite.team.name}</h3>
                <p className="text-sm text-muted-foreground">{elite.team.game}</p>
              </div>

              {/* Ações */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(elite.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Preview info */}
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-2">Preview na Home:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>0 times:</strong> Seção não aparece</li>
          <li>• <strong>1 time:</strong> Layout centralizado</li>
          <li>• <strong>2 times:</strong> Layout em 2 colunas</li>
          <li>• <strong>3 times:</strong> Layout em 3 colunas</li>
          <li>• <strong>4 times:</strong> Layout completo (2x2)</li>
        </ul>
      </div>
    </div>
  )
}
