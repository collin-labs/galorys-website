// ==========================================
// DADOS DOS TIMES - FONTE ÚNICA DE VERDADE
// Baseado em: Screenshots reais do site galorys.gg
// ==========================================

export type GameType = 'CS2' | 'CS2_GALORYNHOS' | 'CODM' | 'GRAN_TURISMO'

export interface Team {
  id: string
  name: string
  slug: string
  shortName: string
  game: GameType
  gameLabel: string
  description: string
  longDescription: string
  color: string // Tailwind gradient classes
  bgColor: string // Background color for cards
  textColor: string // Text accent color
  logo: string
  banner: string
  achievements: string[]
  stats: {
    players: number
    titles: number
    since: string
  }
  badge?: string
  featured: boolean
  order: number
}

export const teams: Team[] = [
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    slug: 'cs2',
    shortName: 'CS2',
    game: 'CS2',
    gameLabel: 'Counter-Strike 2',
    description: 'Time principal de CS2 competindo nas principais ligas brasileiras.',
    longDescription: `A equipe de Counter-Strike 2 da Galorys representa a organização nas principais competições do cenário brasileiro. 
    
Com uma lineup competitiva e experiente formada em 2025, o time busca consolidar sua posição entre as principais equipes do Brasil.

O time compete regularmente em torneios como GamersClub Liga, ESEA, e qualificatórias para eventos nacionais.`,
    color: 'from-orange-500 to-yellow-500',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-500',
    logo: '/images/teams/cs2.png',
    banner: '/images/teams/fundo-geral.webp',
    achievements: [
      'Participante GamersClub Liga',
    ],
    stats: {
      players: 5,
      titles: 0,
      since: '2025',
    },
    featured: true,
    order: 1,
  },
  {
    id: 'cs2-galorynhos',
    name: 'CS2 Galorynhos',
    slug: 'cs2-galorynhos',
    shortName: 'Galorynhos',
    game: 'CS2_GALORYNHOS',
    gameLabel: 'Counter-Strike 2',
    description: 'Primeira equipe de CS2 formada exclusivamente por atletas com nanismo no cenário competitivo brasileiro.',
    longDescription: `O projeto Galorynhos é um marco histórico nos eSports brasileiros e mundiais. 

A Galorys criou a primeira equipe profissional de Counter-Strike 2 formada exclusivamente por atletas com nanismo, demonstrando que os eSports são verdadeiramente inclusivos.

Liderados por Mateus "Anãozera" Pesarini, o time conta com 6 jogadores talentosos que representam não apenas a organização, mas toda uma comunidade que busca representatividade no cenário competitivo.

Os Galorynhos são a prova de que habilidade não tem tamanho e que os eSports podem ser uma plataforma de transformação social.`,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500',
    logo: '/images/teams/cs2-kids-logo.png',
    banner: '/images/teams/fundo-geral.webp',
    achievements: [
      'Primeira equipe de atletas com nanismo de CS2 do Brasil',
      'Marco de inclusão nos eSports',
    ],
    stats: {
      players: 6,
      titles: 0,
      since: '2023',
    },
    badge: 'INCLUSÃO',
    featured: true,
    order: 2,
  },
  {
    id: 'cod-mobile',
    name: 'Call of Duty Mobile',
    slug: 'cod-mobile',
    shortName: 'COD:M',
    game: 'CODM',
    gameLabel: 'Call of Duty Mobile',
    description: 'Equipe competitiva de Call of Duty Mobile com jogadores experientes no cenário nacional.',
    longDescription: `A equipe de Call of Duty Mobile da Galorys é uma das mais experientes do cenário brasileiro.

Com jogadores veteranos como YgorCoach (desde 2023), o time se consolidou como uma força competitiva no cenário mobile nacional.

A lineup é reconhecida pela consistência e trabalho em equipe, representando a Galorys nos principais torneios de Call of Duty Mobile do Brasil.`,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
    logo: '/images/teams/cod-mobile.jpg',
    banner: '/images/teams/fundo-geral.webp',
    achievements: [
      'Participantes de torneios nacionais',
    ],
    stats: {
      players: 6,
      titles: 0,
      since: '2023',
    },
    featured: true,
    order: 3,
  },
  {
    id: 'gran-turismo',
    name: 'Gran Turismo',
    slug: 'gran-turismo',
    shortName: 'GT',
    game: 'GRAN_TURISMO',
    gameLabel: 'Gran Turismo 7',
    description: 'Atleta de automobilismo virtual representando a Galorys nas competições de Gran Turismo.',
    longDescription: `A Galorys é representada no Gran Turismo por Adriano Carrazza, conhecido como "Didico", um piloto virtual experiente.

Didico compete nas principais competições de Gran Turismo, representando a Galorys no cenário do automobilismo virtual brasileiro desde 2022.

Sua trajetória inclui participações em competições de alto nível do Gran Turismo, onde representa a organização no cenário nacional.`,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    logo: '/images/teams/gran-turismo.webp',
    banner: '/images/teams/fundo-geral.webp',
    achievements: [
      'Piloto de Gran Turismo desde 2022',
    ],
    stats: {
      players: 1,
      titles: 0,
      since: '2022',
    },
    featured: true,
    order: 4,
  },
]

// Helpers
export const getTeamBySlug = (slug: string): Team | undefined => {
  return teams.find(team => team.slug === slug)
}

export const getTeamsByGame = (game: GameType): Team[] => {
  return teams.filter(team => team.game === game)
}

export const getFeaturedTeams = (): Team[] => {
  return teams.filter(team => team.featured).sort((a, b) => a.order - b.order)
}

export const getAllTeams = (): Team[] => {
  return teams.sort((a, b) => a.order - b.order)
}

// Mapeamento de cores por jogo
export const gameColors: Record<GameType, { gradient: string; bg: string; text: string }> = {
  CS2: { gradient: 'from-orange-500 to-yellow-500', bg: 'bg-orange-500/10', text: 'text-orange-500' },
  CS2_GALORYNHOS: { gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10', text: 'text-purple-500' },
  CODM: { gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10', text: 'text-green-500' },
  GRAN_TURISMO: { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', text: 'text-blue-500' },
}

// Labels amigáveis para os jogos
export const gameLabels: Record<GameType, string> = {
  CS2: 'Counter-Strike 2',
  CS2_GALORYNHOS: 'CS2 Galorynhos',
  CODM: 'Call of Duty Mobile',
  GRAN_TURISMO: 'Gran Turismo',
}

// Ícones/Emojis por jogo (para uso em badges)
export const gameIcons: Record<GameType, string> = {
  CS2: '🎮',
  CS2_GALORYNHOS: '💜',
  CODM: '📱',
  GRAN_TURISMO: '🏎️',
}
