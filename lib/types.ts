// ============================================
// TIPOS TYPESCRIPT - GALORYS ESPORTS
// ============================================

// Tipos base do Prisma (re-exportados para uso nos componentes)
export type { 
  Team, 
  Player, 
  Achievement, 
  Match, 
  Banner, 
  Partner,
  GameLink,
  User,
  FeaturedPlayer,
  EliteTeam,
  MenuItem,
  FooterColumn,
  FooterItem,
  SocialLink,
  HomeSection,
} from '@prisma/client'

// ============================================
// TIPOS COMPOSTOS (com relações)
// ============================================

import type { 
  Team as PrismaTeam, 
  Player as PrismaPlayer, 
  Achievement as PrismaAchievement,
  FeaturedPlayer as PrismaFeaturedPlayer,
  EliteTeam as PrismaEliteTeam,
  FooterColumn as PrismaFooterColumn,
  FooterItem as PrismaFooterItem,
  MenuItem as PrismaMenuItem,
} from '@prisma/client'

// Time com jogadores e conquistas
export interface TeamWithRelations extends PrismaTeam {
  players: PrismaPlayer[]
  achievements: PrismaAchievement[]
  _count?: {
    players: number
    achievements: number
  }
}

// Jogador com time
export interface PlayerWithTeam extends PrismaPlayer {
  team: PrismaTeam
}

// Conquista com time
export interface AchievementWithTeam extends PrismaAchievement {
  team: PrismaTeam
}

// Jogador em destaque com dados do jogador e time
export interface FeaturedPlayerWithRelations extends PrismaFeaturedPlayer {
  player: PlayerWithTeam
}

// Time de elite com dados do time
export interface EliteTeamWithRelations extends PrismaEliteTeam {
  team: TeamWithRelations
}

// Menu item com filhos (dropdown)
export interface MenuItemWithChildren extends PrismaMenuItem {
  children: PrismaMenuItem[]
}

// Coluna do rodapé com itens
export interface FooterColumnWithItems extends PrismaFooterColumn {
  items: PrismaFooterItem[]
}

// ============================================
// TIPOS PARA FORMULÁRIOS
// ============================================

export interface TeamFormData {
  name: string
  slug: string
  game: string
  description?: string
  logo?: string
  banner?: string
  active: boolean
  order: number
}

export interface PlayerFormData {
  nickname: string
  realName?: string
  slug: string
  photo?: string
  role?: string
  bio?: string
  teamId: string
  active: boolean
  twitter?: string
  instagram?: string
  twitch?: string
  youtube?: string
  tiktok?: string
}

export interface AchievementFormData {
  title: string
  description?: string
  placement: string
  tournament: string
  date: Date
  image?: string
  teamId: string
  featured: boolean
  featuredOrder?: number
  active: boolean
}

export interface PartnerFormData {
  name: string
  logo?: string
  website?: string
  order: number
  active: boolean
}

export interface BannerFormData {
  title: string
  subtitle?: string
  image: string
  link?: string
  order: number
  active: boolean
}

export interface MenuItemFormData {
  label: string
  href: string
  order: number
  active: boolean
  parentId?: string
}

export interface FooterItemFormData {
  label: string
  href: string
  order: number
  active: boolean
  columnId: string
}

export interface SocialLinkFormData {
  platform: string
  url: string
  icon?: string
  active: boolean
  order: number
}

// ============================================
// TIPOS PARA API RESPONSES
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ============================================
// TIPOS PARA ESTATÍSTICAS DO DASHBOARD
// ============================================

export interface DashboardStats {
  teamsCount: number
  activeTeamsCount: number
  playersCount: number
  achievementsCount: number
  partnersCount: number
  bannersCount: number
  contactsCount: number
  newsletterCount: number
  usersCount: number
}

// ============================================
// TIPOS PARA SEÇÕES DA HOME
// ============================================

export interface HomeSectionData {
  slug: string
  name: string
  order: number
  active: boolean
}

export interface HomeData {
  eliteTeams: EliteTeamWithRelations[]
  featuredPlayers: FeaturedPlayerWithRelations[]
  featuredAchievements: AchievementWithTeam[]
  sections: HomeSectionData[]
}

// ============================================
// STATUS TYPES
// ============================================

export type TeamStatus = 'active' | 'hidden' | 'inactive'

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'cancelled'

export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR'

// ============================================
// UTILITY TYPES
// ============================================

// Torna todos os campos opcionais exceto os especificados
export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>

// Remove campos de uma interface
export type Without<T, K extends keyof T> = Omit<T, K>

// Adiciona campos a uma interface
export type With<T, K> = T & K
