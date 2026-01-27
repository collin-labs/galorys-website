// ==========================================
// DADOS DOS JOGADORES - FONTE ÚNICA DE VERDADE
// Baseado em: Screenshots reais do site galorys.gg
// Total: 18 jogadores em 4 times
// ==========================================

import { GameType } from './teams'

export interface Social {
  twitter?: string
  instagram?: string
  twitch?: string
  youtube?: string
  tiktok?: string
  facebook?: string
}

export interface Player {
  id: string
  nickname: string
  realName: string
  slug: string
  teamId: string
  teamSlug: string
  game: GameType
  role: string
  bio: string
  photo: string
  achievements: string[]
  socials: Social
  featured: boolean
  order: number
  joinedAt: string
}

export const players: Player[] = [
  // ==========================================
  // GRAN TURISMO (1 jogador)
  // ==========================================
  {
    id: 'didico',
    nickname: 'Didico',
    realName: 'Adriano Carrazza',
    slug: 'didico',
    teamId: 'gran-turismo',
    teamSlug: 'gran-turismo',
    game: 'GRAN_TURISMO',
    role: 'Piloto',
    bio: `Adriano Carrazza, conhecido como "Didico", é o piloto de Gran Turismo da Galorys desde 2022.

Representando a organização no automobilismo virtual, Didico compete nas principais competições de Gran Turismo do cenário brasileiro.`,
    photo: '/images/players/didico.png',
    achievements: [
      'Piloto de Gran Turismo desde 2022',
    ],
    socials: {
      twitter: 'https://twitter.com/didico',
      instagram: 'https://instagram.com/didico',
    },
    featured: true,
    order: 1,
    joinedAt: '2022',
  },

  // ==========================================
  // CALL OF DUTY: MOBILE (6 jogadores)
  // ==========================================
  {
    id: 'zeus',
    nickname: 'Zeus',
    realName: 'Ricardo Araujo',
    slug: 'zeus',
    teamId: 'cod-mobile',
    teamSlug: 'cod-mobile',
    game: 'CODM',
    role: 'Player',
    bio: `Zeus (Ricardo Araujo) é jogador da equipe de Call of Duty Mobile da Galorys, tendo se juntado ao time em 2025.`,
    photo: '/images/players/zeus.png',
    achievements: [],
    socials: {
      twitter: 'https://twitter.com/zeus',
      instagram: 'https://instagram.com/zeus',
    },
    featured: false,
    order: 2,
    joinedAt: '2025',
  },
  {
    id: 'lucasz1n',
    nickname: 'Lucasz1n',
    realName: 'Lucas Joia Ferreira',
    slug: 'lucasz1n',
    teamId: 'cod-mobile',
    teamSlug: 'cod-mobile',
    game: 'CODM',
    role: 'Player',
    bio: `Lucasz1n (Lucas Joia Ferreira) é jogador da equipe de Call of Duty Mobile da Galorys desde 2024.`,
    photo: '/images/players/lucasz1n.png',
    achievements: [],
    socials: {
      twitter: 'https://twitter.com/lucasz1n',
      instagram: 'https://instagram.com/lucasz1n',
      youtube: 'https://youtube.com/@lucasz1n',
    },
    featured: false,
    order: 3,
    joinedAt: '2024',
  },
  {
    id: 'ygorcoach',
    nickname: 'YgorCoach',
    realName: 'Ygor Simão',
    slug: 'ygorcoach',
    teamId: 'cod-mobile',
    teamSlug: 'cod-mobile',
    game: 'CODM',
    role: 'Coach',
    bio: `YgorCoach (Ygor Simão) é coach da equipe de Call of Duty Mobile da Galorys desde 2023. Um dos membros mais experientes do time.`,
    photo: '/images/players/ygorcoach.png',
    achievements: [],
    socials: {
      twitter: 'https://twitter.com/ygorcoach',
      instagram: 'https://instagram.com/ygorcoach',
    },
    featured: false,
    order: 4,
    joinedAt: '2023',
  },
  {
    id: 'hen',
    nickname: 'Hen',
    realName: 'Henrique de Oliveira',
    slug: 'hen',
    teamId: 'cod-mobile',
    teamSlug: 'cod-mobile',
    game: 'CODM',
    role: 'Player',
    bio: `Hen (Henrique de Oliveira) é jogador da equipe de Call of Duty Mobile da Galorys desde 2023.`,
    photo: '/images/players/hen.png',
    achievements: [],
    socials: {
      twitter: 'https://twitter.com/hen',
      instagram: 'https://instagram.com/hen',
    },
    featured: false,
    order: 5,
    joinedAt: '2023',
  },
  {
    id: 'fokeey',
    nickname: 'Fokeey',
    realName: 'Allan Geraldo',
    slug: 'fokeey',
    teamId: 'cod-mobile',
    teamSlug: 'cod-mobile',
    game: 'CODM',
    role: 'Player',
    bio: `Fokeey (Allan Geraldo) é jogador da equipe de Call of Duty Mobile da Galorys desde 2023.`,
    photo: '/images/players/fokeey.png',
    achievements: [],
    socials: {
      instagram: 'https://instagram.com/fokeey',
    },
    featured: false,
    order: 6,
    joinedAt: '2023',
  },
  {
    id: 'm1hawk',
    nickname: 'M1hawk',
    realName: 'Danilo Jun',
    slug: 'm1hawk',
    teamId: 'cod-mobile',
    teamSlug: 'cod-mobile',
    game: 'CODM',
    role: 'Player',
    bio: `M1hawk (Danilo Jun) é jogador da equipe de Call of Duty Mobile da Galorys desde 2023.`,
    photo: '/images/players/m1hawk.png',
    achievements: [],
    socials: {
      twitter: 'https://twitter.com/m1hawk',
      instagram: 'https://instagram.com/m1hawk',
    },
    featured: false,
    order: 7,
    joinedAt: '2023',
  },

  // ==========================================
  // CS2 GALORYNHOS - TIME INCLUSIVO (6 jogadores)
  // Primeira equipe de CS2 formada exclusivamente
  // por atletas com nanismo no cenário brasileiro
  // ==========================================
  {
    id: 'anaozera',
    nickname: 'Anãozera',
    realName: 'Mateus Augusto Pesarini',
    slug: 'anaozera',
    teamId: 'cs2-galorynhos',
    teamSlug: 'cs2-galorynhos',
    game: 'CS2_GALORYNHOS',
    role: 'Capitão / IGL',
    bio: `Anãozera (Mateus Augusto Pesarini) é o capitão e líder do projeto Galorynhos, a primeira equipe de CS2 formada por atletas com nanismo.

Como IGL (In-Game Leader), Mateus é responsável por coordenar as estratégias do time e representa o espírito de inclusão e superação do projeto.

Sua liderança vai além do jogo, sendo uma inspiração para a comunidade de pessoas com nanismo que buscam espaço nos eSports.`,
    photo: '/images/players/anaozera.png',
    achievements: [
      'Capitão do projeto Galorynhos',
      'Pioneiro na inclusão de atletas com nanismo nos eSports',
    ],
    socials: {
      twitter: 'https://twitter.com/anaozera',
      instagram: 'https://instagram.com/anaozera',
      youtube: 'https://youtube.com/@anaozera',
      twitch: 'https://twitch.tv/anaozera',
    },
    featured: true,
    order: 8,
    joinedAt: '2023',
  },
  {
    id: 'anao-zika',
    nickname: 'Anão Zika',
    realName: 'Marcos Paulo',
    slug: 'anao-zika',
    teamId: 'cs2-galorynhos',
    teamSlug: 'cs2-galorynhos',
    game: 'CS2_GALORYNHOS',
    role: 'Player',
    bio: `Anão Zika (Marcos Paulo) é jogador do projeto Galorynhos desde 2023.`,
    photo: '/images/players/anaozika.png',
    achievements: [
      'Membro fundador do Galorynhos',
    ],
    socials: {
      instagram: 'https://instagram.com/anaozika',
    },
    featured: false,
    order: 9,
    joinedAt: '2023',
  },
  {
    id: 'minicountry',
    nickname: 'MiniCountry',
    realName: 'Linnicker David',
    slug: 'minicountry',
    teamId: 'cs2-galorynhos',
    teamSlug: 'cs2-galorynhos',
    game: 'CS2_GALORYNHOS',
    role: 'Player',
    bio: `MiniCountry (Linnicker David) é jogador do projeto Galorynhos desde 2023.`,
    photo: '/images/players/minicountry.png',
    achievements: [
      'Membro fundador do Galorynhos',
    ],
    socials: {
      twitter: 'https://twitter.com/minicountry',
      instagram: 'https://instagram.com/minicountry',
      youtube: 'https://youtube.com/@minicountry',
    },
    featured: false,
    order: 10,
    joinedAt: '2023',
  },
  {
    id: 'tequileiro',
    nickname: 'Tequileiro',
    realName: 'Leonardo Heinen',
    slug: 'tequileiro',
    teamId: 'cs2-galorynhos',
    teamSlug: 'cs2-galorynhos',
    game: 'CS2_GALORYNHOS',
    role: 'Player',
    bio: `Tequileiro (Leonardo Heinen) é jogador do projeto Galorynhos, tendo se juntado ao time em 2025.`,
    photo: '/images/players/tequileiro.png',
    achievements: [],
    socials: {
      twitter: 'https://twitter.com/tequileiro',
      instagram: 'https://instagram.com/tequileiro',
      twitch: 'https://twitch.tv/tequileiro',
    },
    featured: false,
    order: 11,
    joinedAt: '2025',
  },
  {
    id: 'minicraque',
    nickname: 'MiniCraque',
    realName: 'Henrique Saturnino',
    slug: 'minicraque',
    teamId: 'cs2-galorynhos',
    teamSlug: 'cs2-galorynhos',
    game: 'CS2_GALORYNHOS',
    role: 'Player',
    bio: `MiniCraque (Henrique Saturnino) é jogador do projeto Galorynhos desde 2023.`,
    photo: '/images/players/minicraque.png',
    achievements: [
      'Membro fundador do Galorynhos',
    ],
    socials: {
      instagram: 'https://instagram.com/minicraque',
      youtube: 'https://youtube.com/@minicraque',
    },
    featured: false,
    order: 12,
    joinedAt: '2023',
  },
  {
    id: 'murillo',
    nickname: 'Murillo',
    realName: 'Murilo Major',
    slug: 'murillo',
    teamId: 'cs2-galorynhos',
    teamSlug: 'cs2-galorynhos',
    game: 'CS2_GALORYNHOS',
    role: 'Player',
    bio: `Murillo (Murilo Major) é jogador do projeto Galorynhos desde 2024.`,
    photo: '/images/players/murillo.png',
    achievements: [],
    socials: {
      instagram: 'https://instagram.com/murillo',
    },
    featured: false,
    order: 13,
    joinedAt: '2024',
  },

  // ==========================================
  // COUNTER-STRIKE 2 - TIME PRINCIPAL (5 jogadores)
  // ==========================================
  {
    id: 'nython',
    nickname: 'Nython',
    realName: 'Gabriel Lino',
    slug: 'nython',
    teamId: 'cs2',
    teamSlug: 'cs2',
    game: 'CS2',
    role: 'Player',
    bio: `Nython (Gabriel Lino) é jogador do time principal de CS2 da Galorys, tendo se juntado em 2025.`,
    photo: '/images/players/nython.png',
    achievements: [],
    socials: {
      twitter: 'https://twitter.com/nython',
      instagram: 'https://instagram.com/nython',
    },
    featured: false,
    order: 14,
    joinedAt: '2025',
  },
  {
    id: 'tomate',
    nickname: 'Tomate',
    realName: 'Moises Lima',
    slug: 'tomate',
    teamId: 'cs2',
    teamSlug: 'cs2',
    game: 'CS2',
    role: 'Player',
    bio: `Tomate (Moises Lima) é jogador do time principal de CS2 da Galorys desde 2024.`,
    photo: '/images/players/tomate.png',
    achievements: [],
    socials: {
      twitter: 'https://twitter.com/tomate',
      instagram: 'https://instagram.com/tomate',
    },
    featured: false,
    order: 15,
    joinedAt: '2024',
  },
  {
    id: 'destiny',
    nickname: 'Destiny',
    realName: 'Lucas Bullo',
    slug: 'destiny',
    teamId: 'cs2',
    teamSlug: 'cs2',
    game: 'CS2',
    role: 'Player',
    bio: `Destiny (Lucas Bullo) é jogador do time principal de CS2 da Galorys, tendo se juntado em 2025.`,
    photo: '/images/players/destiny.png',
    achievements: [],
    socials: {
      twitter: 'https://twitter.com/destiny',
      instagram: 'https://instagram.com/destiny',
    },
    featured: false,
    order: 16,
    joinedAt: '2025',
  },
  {
    id: 'card',
    nickname: 'Card',
    realName: 'Cauã Cardoso',
    slug: 'card',
    teamId: 'cs2',
    teamSlug: 'cs2',
    game: 'CS2',
    role: 'Player',
    bio: `Card (Cauã Cardoso) é jogador do time principal de CS2 da Galorys, tendo se juntado em 2025.`,
    photo: '/images/players/card.png',
    achievements: [],
    socials: {
      twitter: 'https://twitter.com/card',
      instagram: 'https://instagram.com/card',
    },
    featured: false,
    order: 17,
    joinedAt: '2025',
  },
  {
    id: 'gbb',
    nickname: 'Gbb',
    realName: 'Gabriel Pereira',
    slug: 'gbb',
    teamId: 'cs2',
    teamSlug: 'cs2',
    game: 'CS2',
    role: 'Player',
    bio: `Gbb (Gabriel Pereira) é jogador do time principal de CS2 da Galorys, tendo se juntado em 2025.`,
    photo: '/images/players/gbb.png',
    achievements: [],
    socials: {
      twitter: 'https://twitter.com/gbb',
      instagram: 'https://instagram.com/gbb',
    },
    featured: false,
    order: 18,
    joinedAt: '2025',
  },
]

// ==========================================
// HELPERS
// ==========================================

export const getPlayerBySlug = (slug: string): Player | undefined => {
  return players.find(player => player.slug === slug)
}

export const getPlayerById = (id: string): Player | undefined => {
  return players.find(player => player.id === id)
}

export const getPlayersByTeam = (teamSlug: string): Player[] => {
  return players
    .filter(player => player.teamSlug === teamSlug)
    .sort((a, b) => a.order - b.order)
}

export const getTeammates = (teamSlug: string, excludePlayerId: string): Player[] => {
  return players
    .filter(player => player.teamSlug === teamSlug && player.id !== excludePlayerId)
    .sort((a, b) => a.order - b.order)
}

export const getPlayersByGame = (game: GameType): Player[] => {
  return players
    .filter(player => player.game === game)
    .sort((a, b) => a.order - b.order)
}

export const getFeaturedPlayers = (): Player[] => {
  return players
    .filter(player => player.featured)
    .sort((a, b) => a.order - b.order)
}

export const getAllPlayers = (): Player[] => {
  return players.sort((a, b) => a.order - b.order)
}

export const getPlayersCount = (): number => {
  return players.length
}

// Roles comuns em CS2
export const cs2Roles = [
  'IGL',
  'Entry Fragger',
  'AWPer',
  'Rifler',
  'Support',
  'Lurker',
  'Coach',
  'Player',
] as const

// Função para gerar avatar placeholder
export const getPlayerAvatar = (nickname: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nickname)}&background=9B30FF&color=fff&size=256`
}
