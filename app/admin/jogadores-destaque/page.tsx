"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Star, Plus, Trash2, GripVertical, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Player {
  id: string
  nickname: string
  realName: string | null
  slug: string
  photo: string | null
  role: string | null
  team: {
    id: string
    name: string
    slug: string
  }
}

interface FeaturedPlayer {
  id: string
  playerId: string
  order: number
  player: Player
}

export default function JogadoresDestaquePage() {
  const [featuredPlayers, setFeaturedPlayers] = useState<FeaturedPlayer[]>([])
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlayer, setSelectedPlayer] = useState<string>("")

  // Buscar dados
  useEffect(() => {
    async function fetchData() {
      try {
        // Buscar jogadores em destaque
        const featuredRes = await fetch('/api/admin/featured-players')
        const featuredData = await featuredRes.json()
        setFeaturedPlayers(featuredData.featuredPlayers || [])

        // Buscar todos os jogadores
        const playersRes = await fetch('/api/admin/players')
        const playersData = await playersRes.json()
        setAllPlayers(playersData.players || [])
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Jogadores disponíveis (que não estão na lista de destaque)
  const availablePlayers = allPlayers.filter(
    player => !featuredPlayers.some(fp => fp.playerId === player.id)
  )

  // Adicionar jogador em destaque
  const handleAdd = async () => {
    if (!selectedPlayer) return

    try {
      const response = await fetch('/api/admin/featured-players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: selectedPlayer, order: featuredPlayers.length + 1 })
      })

      if (response.ok) {
        const data = await response.json()
        setFeaturedPlayers([...featuredPlayers, data.featuredPlayer])
        setSelectedPlayer("")
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao adicionar')
      }
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  // Remover jogador em destaque
  const handleRemove = async (id: string) => {
    if (!confirm('Remover este jogador dos destaques?')) return

    try {
      const response = await fetch(`/api/admin/featured-players?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setFeaturedPlayers(featuredPlayers.filter(fp => fp.id !== id))
      }
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  // Mover para cima
  const moveUp = async (index: number) => {
    if (index === 0) return
    const newList = [...featuredPlayers]
    ;[newList[index - 1], newList[index]] = [newList[index], newList[index - 1]]
    
    const items = newList.map((item, i) => ({ id: item.id, order: i + 1 }))
    await fetch('/api/admin/featured-players', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    })
    
    setFeaturedPlayers(newList.map((item, i) => ({ ...item, order: i + 1 })))
  }

  // Mover para baixo
  const moveDown = async (index: number) => {
    if (index === featuredPlayers.length - 1) return
    const newList = [...featuredPlayers]
    ;[newList[index], newList[index + 1]] = [newList[index + 1], newList[index]]
    
    const items = newList.map((item, i) => ({ id: item.id, order: i + 1 }))
    await fetch('/api/admin/featured-players', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    })
    
    setFeaturedPlayers(newList.map((item, i) => ({ ...item, order: i + 1 })))
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
            <Star className="w-6 h-6 text-yellow-500" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Jogadores em Destaque</h1>
              <p className="text-sm text-muted-foreground">
                {featuredPlayers.length}/3 jogadores na seção da home
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
        <p className="text-sm text-purple-200">
          <strong>Dica:</strong> Os Jogadores em Destaque aparecem em uma seção especial da Home. 
          Máximo de 3 jogadores. Use as setas para reordenar.
        </p>
      </div>

      {/* Adicionar novo */}
      {featuredPlayers.length < 3 && (
        <div className="flex gap-3">
          <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
            <SelectTrigger className="flex-1 bg-card border-border">
              <SelectValue placeholder="Selecione um jogador para destacar..." />
            </SelectTrigger>
            <SelectContent>
              {availablePlayers.map(player => (
                <SelectItem key={player.id} value={player.id}>
                  {player.nickname} - {player.team?.name || 'Sem time'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAdd} 
            disabled={!selectedPlayer}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-1" /> Adicionar
          </Button>
        </div>
      )}

      {/* Lista de jogadores em destaque */}
      <div className="space-y-3">
        {featuredPlayers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum jogador em destaque configurado.</p>
            <p className="text-sm">A seção não aparecerá na home.</p>
          </div>
        ) : (
          featuredPlayers.map((featured, index) => (
            <div 
              key={featured.id}
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
                  disabled={index === featuredPlayers.length - 1}
                >
                  <span className="text-xs">▼</span>
                </Button>
              </div>

              {/* Grip */}
              <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />

              {/* Avatar */}
              <Avatar className="w-14 h-14">
                <AvatarImage src={featured.player.photo || ''} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg">
                  {featured.player.nickname.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{featured.player.nickname}</h3>
                <p className="text-sm text-muted-foreground">{featured.player.realName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                    {featured.player.role || 'Jogador'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {featured.player.team?.name}
                  </span>
                </div>
              </div>

              {/* Ações */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(featured.id)}
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
          <li>• <strong>0 jogadores:</strong> Seção não aparece</li>
          <li>• <strong>1 jogador:</strong> Layout centralizado grande</li>
          <li>• <strong>2 jogadores:</strong> Layout em 2 colunas</li>
          <li>• <strong>3 jogadores:</strong> Layout completo (1 grande + 2 menores)</li>
        </ul>
      </div>
    </div>
  )
}
