import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes para evitar duplicatas
  console.log('🧹 Limpando dados antigos...')
  await prisma.featuredPlayer.deleteMany()
  await prisma.eliteTeam.deleteMany()
  await prisma.footerItem.deleteMany()
  await prisma.footerColumn.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.achievement.deleteMany()
  await prisma.player.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.partner.deleteMany()
  await prisma.game.deleteMany()

  // ============================================
  // 1. USUÁRIO ADMIN
  // ============================================
  console.log('👤 Criando usuário admin...')
  const hashedPassword = await hash('123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'contato@galorys.com' },
    update: {},
    create: {
      name: 'Administrador Galorys',
      email: 'contato@galorys.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log(`   ✅ Admin criado: ${admin.email}`)

  // ============================================
  // 2. JOGOS / MODALIDADES
  // ============================================
  console.log('🎮 Criando jogos/modalidades...')
  
  const gamesData = [
    { name: 'Counter-Strike 2', slug: 'cs2', shortName: 'CS2', color: '#f59e0b', order: 1 },
    { name: 'League of Legends', slug: 'lol', shortName: 'LoL', color: '#0891b2', order: 2 },
    { name: 'VALORANT', slug: 'valorant', shortName: 'VAL', color: '#ef4444', order: 3 },
    { name: 'Fortnite', slug: 'fortnite', shortName: 'FN', color: '#8b5cf6', order: 4 },
    { name: 'Free Fire', slug: 'freefire', shortName: 'FF', color: '#f97316', order: 5 },
    { name: 'PUBG Mobile', slug: 'pubg', shortName: 'PUBG', color: '#eab308', order: 6 },
    { name: 'Rainbow Six Siege', slug: 'r6', shortName: 'R6', color: '#3b82f6', order: 7 },
    { name: 'Rocket League', slug: 'rocket-league', shortName: 'RL', color: '#06b6d4', order: 8 },
    { name: 'FIFA / EA FC', slug: 'fifa', shortName: 'FIFA', color: '#22c55e', order: 9 },
    { name: 'Gran Turismo', slug: 'gran-turismo', shortName: 'GT', color: '#6366f1', order: 10 },
    { name: 'Apex Legends', slug: 'apex', shortName: 'APEX', color: '#dc2626', order: 11 },
    { name: 'Call of Duty', slug: 'cod', shortName: 'CoD', color: '#059669', order: 12 },
    { name: 'Call of Duty Mobile', slug: 'cod-mobile', shortName: 'CODM', color: '#10b981', order: 13 },
    { name: 'Age of Empires', slug: 'aoe', shortName: 'AoE', color: '#d97706', order: 14 },
  ]

  for (const gameData of gamesData) {
    await prisma.game.upsert({
      where: { slug: gameData.slug },
      update: gameData,
      create: { ...gameData, active: true },
    })
    console.log(`   ✅ Jogo: ${gameData.name}`)
  }

  // ============================================
  // 3. TIMES (dados reais do site galorys.gg)
  // ============================================
  console.log('🎮 Criando times...')
  
  const teamsData = [
    {
      name: 'Gran Turismo',
      slug: 'gran-turismo',
      game: 'Gran Turismo',
      description: 'Equipe de simulação de corrida representando a Galorys no Gran Turismo. Nosso piloto Didico é 15x campeão brasileiro e representou o Brasil nas Olimpíadas Virtuais.',
      logo: '/images/teams/gran-turismo.webp',
      banner: '/images/teams/fundo-geral.webp',
      active: true,
      order: 1,
      // Campos novos para Home
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-500',
      badge: null,
      shortName: 'GT',
      gameLabel: 'Gran Turismo 7',
      playersCount: 1,
      titlesCount: 15,
      foundedYear: '2022',
    },
    {
      name: 'Call of Duty Mobile',
      slug: 'cod-mobile',
      game: 'Call of Duty Mobile',
      description: 'Time competitivo de Call of Duty Mobile da Galorys eSports. TOP 2 no ranking mundial e tetracampeão Stage 4.',
      logo: '/images/teams/cod-mobile.jpg',
      banner: '/images/teams/fundo-geral.webp',
      active: true,
      order: 2,
      // Campos novos para Home
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-500',
      badge: 'TOP 2 MUNDIAL',
      shortName: 'COD:M',
      gameLabel: 'Call of Duty Mobile',
      playersCount: 6,
      titlesCount: 4,
      foundedYear: '2023',
    },
    {
      name: 'CS2 Galorynhos',
      slug: 'cs2-galorynhos',
      game: 'CS2 Galorynhos',
      description: 'Primeira equipe de CS2 formada exclusivamente por atletas com nanismo no cenário brasileiro. Um marco histórico de inclusão nos eSports.',
      logo: '/images/teams/cs2-kids-logo.png',
      banner: '/images/teams/fundo-geral.webp',
      active: true,
      order: 3,
      // Campos novos para Home
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-500',
      badge: 'INCLUSÃO',
      shortName: 'Galorynhos',
      gameLabel: 'Counter-Strike 2',
      playersCount: 6,
      titlesCount: 1,
      foundedYear: '2023',
    },
    {
      name: 'Counter Strike 2',
      slug: 'cs2',
      game: 'Counter-Strike 2',
      description: 'Equipe principal de Counter-Strike 2 da Galorys. Competindo nas principais ligas e campeonatos do cenário brasileiro.',
      logo: '/images/teams/cs2-logo.png',
      banner: '/images/teams/fundo-geral.webp',
      active: true,
      order: 4,
      // Campos novos para Home
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-500',
      badge: null,
      shortName: 'CS2',
      gameLabel: 'Counter-Strike 2',
      playersCount: 5,
      titlesCount: 0,
      foundedYear: '2025',
    },
    {
      name: 'Valorant',
      slug: 'valorant',
      game: 'Valorant',
      description: 'Equipe de Valorant da Galorys eSports. Campeã do VCT Challengers Brasil.',
      logo: '/images/teams/valorant-logo.png',
      banner: '/images/teams/fundo-geral.webp',
      active: false,
      order: 5,
      // Campos novos para Home
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-500',
      badge: null,
      shortName: 'VAL',
      gameLabel: 'Valorant',
      playersCount: 5,
      titlesCount: 1,
      foundedYear: '2024',
    },
    {
      name: 'Age of Empires',
      slug: 'age-of-empires',
      game: 'Age of Empires',
      description: 'Time de estratégia em tempo real. Campeão do Red Bull Wololo Brasil.',
      logo: '/images/teams/aoe-logo.png',
      banner: '/images/teams/fundo-geral.webp',
      active: false,
      order: 6,
      // Campos novos para Home
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-500',
      badge: null,
      shortName: 'AoE',
      gameLabel: 'Age of Empires IV',
      playersCount: 2,
      titlesCount: 1,
      foundedYear: '2024',
    },
  ]

  const teams: Record<string, any> = {}
  for (const teamData of teamsData) {
    const team = await prisma.team.upsert({
      where: { slug: teamData.slug },
      update: teamData,
      create: teamData,
    })
    teams[teamData.slug] = team
    console.log(`   ✅ Time: ${team.name}`)
  }

  // ============================================
  // 3. JOGADORES (dados reais do site galorys.gg)
  // Total: 18 jogadores em 4 times ativos
  // ============================================
  console.log('👥 Criando jogadores...')

  const playersData = [
    // ==========================================
    // GRAN TURISMO (1 jogador)
    // ==========================================
    {
      nickname: 'Didico',
      realName: 'Adriano Carrazza',
      slug: 'didico',
      photo: '/images/players/didico.png',
      role: 'Piloto',
      bio: 'Adriano Carrazza, conhecido como "Didico", é o piloto de Gran Turismo da Galorys desde 2022. Representando a organização no automobilismo virtual, Didico compete nas principais competições de Gran Turismo do cenário brasileiro. 15x campeão brasileiro e representou o Brasil no 4º lugar das Olimpíadas Virtuais.',
      teamSlug: 'gran-turismo',
      twitter: 'https://twitter.com/didico',
      instagram: 'https://instagram.com/didico',
    },

    // ==========================================
    // CALL OF DUTY MOBILE (6 jogadores)
    // ==========================================
    {
      nickname: 'Zeus',
      realName: 'Ricardo Araujo',
      slug: 'zeus',
      photo: '/images/players/zeus.png',
      role: 'Player',
      bio: 'Zeus (Ricardo Araujo) é jogador da equipe de Call of Duty Mobile da Galorys, tendo se juntado ao time em 2025.',
      teamSlug: 'cod-mobile',
      twitter: 'https://twitter.com/zeus',
      instagram: 'https://instagram.com/zeus',
    },
    {
      nickname: 'Lucasz1n',
      realName: 'Lucas Joia Ferreira',
      slug: 'lucasz1n',
      photo: '/images/players/lucasz1n.png',
      role: 'Player',
      bio: 'Lucasz1n (Lucas Joia Ferreira) é jogador da equipe de Call of Duty Mobile da Galorys desde 2024.',
      teamSlug: 'cod-mobile',
      twitter: 'https://twitter.com/lucasz1n',
      instagram: 'https://instagram.com/lucasz1n',
      youtube: 'https://youtube.com/@lucasz1n',
    },
    {
      nickname: 'YgorCoach',
      realName: 'Ygor Simão',
      slug: 'ygorcoach',
      photo: '/images/players/ygorcoach.png',
      role: 'Coach',
      bio: 'YgorCoach (Ygor Simão) é coach da equipe de Call of Duty Mobile da Galorys desde 2023. Um dos membros mais experientes do time.',
      teamSlug: 'cod-mobile',
      twitter: 'https://twitter.com/ygorcoach',
      instagram: 'https://instagram.com/ygorcoach',
    },
    {
      nickname: 'Hen',
      realName: 'Henrique de Oliveira',
      slug: 'hen',
      photo: '/images/players/hen.png',
      role: 'Player',
      bio: 'Hen (Henrique de Oliveira) é jogador da equipe de Call of Duty Mobile da Galorys desde 2023.',
      teamSlug: 'cod-mobile',
      twitter: 'https://twitter.com/hen',
      instagram: 'https://instagram.com/hen',
    },
    {
      nickname: 'Fokeey',
      realName: 'Allan Geraldo',
      slug: 'fokeey',
      photo: '/images/players/fokeey.png',
      role: 'Player',
      bio: 'Fokeey (Allan Geraldo) é jogador da equipe de Call of Duty Mobile da Galorys desde 2023.',
      teamSlug: 'cod-mobile',
      instagram: 'https://instagram.com/fokeey',
    },
    {
      nickname: 'M1hawk',
      realName: 'Danilo Jun',
      slug: 'm1hawk',
      photo: '/images/players/m1hawk.png',
      role: 'Player',
      bio: 'M1hawk (Danilo Jun) é jogador da equipe de Call of Duty Mobile da Galorys desde 2023.',
      teamSlug: 'cod-mobile',
      twitter: 'https://twitter.com/m1hawk',
      instagram: 'https://instagram.com/m1hawk',
    },

    // ==========================================
    // CS2 GALORYNHOS - TIME INCLUSIVO (6 jogadores)
    // Primeira equipe de CS2 formada exclusivamente
    // por atletas com nanismo no cenário brasileiro
    // ==========================================
    {
      nickname: 'Anãozera',
      realName: 'Mateus Augusto Pesarini',
      slug: 'anaozera',
      photo: '/images/players/anaozera.png',
      role: 'Capitão / IGL',
      bio: 'Anãozera (Mateus Augusto Pesarini) é o capitão e líder do projeto Galorynhos, a primeira equipe de CS2 formada por atletas com nanismo. Como IGL (In-Game Leader), Mateus é responsável por coordenar as estratégias do time e representa o espírito de inclusão e superação do projeto.',
      teamSlug: 'cs2-galorynhos',
      twitter: 'https://twitter.com/anaozera',
      instagram: 'https://instagram.com/anaozera',
      youtube: 'https://youtube.com/@anaozera',
      twitch: 'https://twitch.tv/anaozera',
    },
    {
      nickname: 'Anão Zika',
      realName: 'Marcos Paulo',
      slug: 'anao-zika',
      photo: '/images/players/anaozika.png',
      role: 'Player',
      bio: 'Anão Zika (Marcos Paulo) é jogador do projeto Galorynhos desde 2023. Membro fundador do time.',
      teamSlug: 'cs2-galorynhos',
      instagram: 'https://instagram.com/anaozika',
    },
    {
      nickname: 'MiniCountry',
      realName: 'Linnicker David',
      slug: 'minicountry',
      photo: '/images/players/minicountry.png',
      role: 'Player',
      bio: 'MiniCountry (Linnicker David) é jogador do projeto Galorynhos desde 2023. Membro fundador do time.',
      teamSlug: 'cs2-galorynhos',
      twitter: 'https://twitter.com/minicountry',
      instagram: 'https://instagram.com/minicountry',
      youtube: 'https://youtube.com/@minicountry',
    },
    {
      nickname: 'Tequileiro',
      realName: 'Leonardo Heinen',
      slug: 'tequileiro',
      photo: '/images/players/tequileiro.png',
      role: 'Player',
      bio: 'Tequileiro (Leonardo Heinen) é jogador do projeto Galorynhos, tendo se juntado ao time em 2025.',
      teamSlug: 'cs2-galorynhos',
      twitter: 'https://twitter.com/tequileiro',
      instagram: 'https://instagram.com/tequileiro',
      twitch: 'https://twitch.tv/tequileiro',
    },
    {
      nickname: 'MiniCraque',
      realName: 'Henrique Saturnino',
      slug: 'minicraque',
      photo: '/images/players/minicraque.png',
      role: 'Player',
      bio: 'MiniCraque (Henrique Saturnino) é jogador do projeto Galorynhos desde 2023. Membro fundador do time.',
      teamSlug: 'cs2-galorynhos',
      instagram: 'https://instagram.com/minicraque',
      youtube: 'https://youtube.com/@minicraque',
    },
    {
      nickname: 'Murillo',
      realName: 'Murilo Major',
      slug: 'murillo',
      photo: '/images/players/murillo.png',
      role: 'Player',
      bio: 'Murillo (Murilo Major) é jogador do projeto Galorynhos desde 2024.',
      teamSlug: 'cs2-galorynhos',
      instagram: 'https://instagram.com/murillo',
    },

    // ==========================================
    // COUNTER-STRIKE 2 - TIME PRINCIPAL (5 jogadores)
    // ==========================================
    {
      nickname: 'Nython',
      realName: 'Gabriel Lino',
      slug: 'nython',
      photo: '/images/players/nython.png',
      role: 'Player',
      bio: 'Nython (Gabriel Lino) é jogador do time principal de CS2 da Galorys, tendo se juntado em 2025.',
      teamSlug: 'cs2',
      twitter: 'https://twitter.com/nython',
      instagram: 'https://instagram.com/nython',
    },
    {
      nickname: 'Tomate',
      realName: 'Moises Lima',
      slug: 'tomate',
      photo: '/images/players/tomate.png',
      role: 'Player',
      bio: 'Tomate (Moises Lima) é jogador do time principal de CS2 da Galorys desde 2024.',
      teamSlug: 'cs2',
      twitter: 'https://twitter.com/tomate',
      instagram: 'https://instagram.com/tomate',
    },
    {
      nickname: 'Destiny',
      realName: 'Lucas Bullo',
      slug: 'destiny',
      photo: '/images/players/destiny.png',
      role: 'Player',
      bio: 'Destiny (Lucas Bullo) é jogador do time principal de CS2 da Galorys, tendo se juntado em 2025.',
      teamSlug: 'cs2',
      twitter: 'https://twitter.com/destiny',
      instagram: 'https://instagram.com/destiny',
    },
    {
      nickname: 'Card',
      realName: 'Cauã Cardoso',
      slug: 'card',
      photo: '/images/players/card.png',
      role: 'Player',
      bio: 'Card (Cauã Cardoso) é jogador do time principal de CS2 da Galorys, tendo se juntado em 2025.',
      teamSlug: 'cs2',
      twitter: 'https://twitter.com/card',
      instagram: 'https://instagram.com/card',
    },
    {
      nickname: 'Gbb',
      realName: 'Gabriel Pereira',
      slug: 'gbb',
      photo: '/images/players/gbb.png',
      role: 'Player',
      bio: 'Gbb (Gabriel Pereira) é jogador do time principal de CS2 da Galorys, tendo se juntado em 2025.',
      teamSlug: 'cs2',
      twitter: 'https://twitter.com/gbb',
      instagram: 'https://instagram.com/gbb',
    },
  ]

  const players: Record<string, any> = {}
  for (const playerData of playersData) {
    const { teamSlug, twitter, instagram, youtube, twitch, tiktok, ...data } = playerData
    const team = teams[teamSlug]
    if (team) {
      const player = await prisma.player.upsert({
        where: { slug: data.slug },
        update: { ...data, teamId: team.id, twitter, instagram, youtube, twitch, tiktok },
        create: { ...data, teamId: team.id, twitter, instagram, youtube, twitch, tiktok },
      })
      players[data.slug] = player
      console.log(`   ✅ Jogador: ${player.nickname} (${team.name})`)
    }
  }

  // ============================================
  // 4. CONQUISTAS (dados reais)
  // ============================================
  console.log('🏆 Criando conquistas...')

  const achievementsData = [
    // Gran Turismo
    {
      title: '15x Campeão Brasileiro',
      description: 'Campeonato Brasileiro Gran Turismo - Maior vencedor da história',
      teamSlug: 'gran-turismo',
      placement: '1º',
      tournament: 'Campeonato Brasileiro Gran Turismo',
      date: new Date('2024-11-30'),
      featured: true,
      featuredOrder: 1,
    },
    {
      title: '4º Lugar Olimpíadas Virtuais',
      description: 'Representando o Brasil nas Olimpíadas Virtuais de Gran Turismo',
      teamSlug: 'gran-turismo',
      placement: 'TOP 4',
      tournament: 'Olimpíadas Virtuais',
      date: new Date('2024-07-31'),
      featured: true,
      featuredOrder: 2,
    },
    {
      title: '20+ Recordes Mundiais',
      description: 'Recordes de volta em diversos circuitos do Gran Turismo',
      teamSlug: 'gran-turismo',
      placement: 'Recorde',
      tournament: 'Gran Turismo World Records',
      date: new Date('2024-05-31'),
      featured: false,
    },

    // Call of Duty Mobile
    {
      title: 'TOP 2 Ranking Mundial',
      description: 'Segunda melhor equipe do mundo no ranking global de COD Mobile',
      teamSlug: 'cod-mobile',
      placement: '2º',
      tournament: 'Ranking Mundial COD Mobile',
      date: new Date('2024-10-31'),
      featured: true,
      featuredOrder: 3,
    },
    {
      title: 'Tetracampeão Stage 4',
      description: 'Quatro títulos consecutivos no Stage 4 do campeonato',
      teamSlug: 'cod-mobile',
      placement: '1º',
      tournament: 'BR Series COD Mobile Stage 4',
      date: new Date('2024-08-31'),
      featured: true,
      featuredOrder: 4,
    },
    {
      title: 'Vice-campeão LBFF',
      description: 'Segundo lugar na Liga Brasileira de Free Fire',
      teamSlug: 'cod-mobile',
      placement: '2º',
      tournament: 'LBFF 2024',
      date: new Date('2024-06-30'),
      featured: false,
    },

    // CS2
    {
      title: 'Classificado Gamers Club',
      description: 'Classificação para a divisão principal da Gamers Club Liga',
      teamSlug: 'cs2',
      placement: 'Classificado',
      tournament: 'Gamers Club Liga',
      date: new Date('2024-09-30'),
      featured: false,
    },
    {
      title: 'TOP 8 Eliminatórias',
      description: 'Top 8 nas Eliminatórias Regionais de CS2',
      teamSlug: 'cs2',
      placement: 'TOP 8',
      tournament: 'Eliminatórias Regionais CS2',
      date: new Date('2024-07-31'),
      featured: false,
    },

    // CS2 Galorynhos
    {
      title: 'Marco de Inclusão nos eSports',
      description: 'Primeira equipe de CS2 formada exclusivamente por atletas com nanismo no cenário brasileiro',
      teamSlug: 'cs2-galorynhos',
      placement: 'Marco Histórico',
      tournament: 'Cenário Competitivo Brasileiro',
      date: new Date('2023-05-31'),
      featured: true,
      featuredOrder: 5,
    },
    {
      title: 'Campeão Torneio Inclusivo',
      description: 'Primeiro lugar no Torneio Inclusivo de CS2',
      teamSlug: 'cs2-galorynhos',
      placement: '1º',
      tournament: 'Torneio Inclusivo CS2',
      date: new Date('2024-02-29'),
      featured: false,
    },

    // Valorant (inativo)
    {
      title: 'TOP 4 VCT Americas',
      description: 'Quarto lugar no VCT Americas',
      teamSlug: 'valorant',
      placement: 'TOP 4',
      tournament: 'VCT Americas',
      date: new Date('2024-06-30'),
      featured: false,
    },
    {
      title: 'Campeão VCT Challengers',
      description: 'Primeiro lugar no VCT Challengers Brasil',
      teamSlug: 'valorant',
      placement: '1º',
      tournament: 'VCT Challengers Brasil',
      date: new Date('2024-04-30'),
      featured: false,
    },

    // Age of Empires (inativo)
    {
      title: 'Campeão Red Bull Wololo',
      description: 'Primeiro lugar no Red Bull Wololo Brasil',
      teamSlug: 'age-of-empires',
      placement: '1º',
      tournament: 'Red Bull Wololo Brasil',
      date: new Date('2024-03-31'),
      featured: false,
    },
    {
      title: 'Vice-campeão NAC',
      description: 'Segundo lugar no NAC de Age of Empires',
      teamSlug: 'age-of-empires',
      placement: '2º',
      tournament: 'NAC AoE',
      date: new Date('2024-05-31'),
      featured: false,
    },
  ]

  for (const achievementData of achievementsData) {
    const { teamSlug, ...data } = achievementData
    const team = teams[teamSlug]
    if (team) {
      await prisma.achievement.create({
        data: { ...data, teamId: team.id },
      })
      console.log(`   ✅ Conquista: ${data.title}`)
    }
  }

  // ============================================
  // 5. BANNERS
  // ============================================
  console.log('🖼️ Criando banners...')

  const bannersData = [
    {
      title: 'Adriano Carrazza - Dídico',
      subtitle: '15x Campeão Brasileiro e 4º Lugar nas Olimpíadas Virtuais de Gran Turismo',
      image: '/images/teams/gran-turismo.webp',
      link: '/times/gran-turismo',
      order: 1,
      active: true,
    },
    {
      title: 'TOP 2 Mundial COD Mobile',
      subtitle: 'Tetracampeão Stage 4 - A elite do mobile gaming',
      image: '/images/teams/cod-mobile.jpg',
      link: '/times/cod-mobile',
      order: 2,
      active: true,
    },
    {
      title: 'Galorynhos',
      subtitle: 'Primeira equipe de CS2 com atletas PCD do Brasil - Um marco de inclusão',
      image: '/images/teams/cs2-kids-logo.png',
      link: '/times/cs2-galorynhos',
      order: 3,
      active: true,
    },
  ]

  for (const bannerData of bannersData) {
    await prisma.banner.create({
      data: bannerData,
    })
    console.log(`   ✅ Banner: ${bannerData.title}`)
  }

  // ============================================
  // 6. JOGADORES EM DESTAQUE
  // ============================================
  console.log('⭐ Configurando jogadores em destaque...')

  const featuredPlayersData = [
    { slug: 'didico', order: 1 },
    { slug: 'anaozera', order: 2 },
    { slug: 'nython', order: 3 },
  ]

  for (const fp of featuredPlayersData) {
    const player = players[fp.slug]
    if (player) {
      await prisma.featuredPlayer.upsert({
        where: { playerId: player.id },
        update: { order: fp.order },
        create: { playerId: player.id, order: fp.order },
      })
      console.log(`   ✅ Destaque ${fp.order}º: ${player.nickname}`)
    }
  }

  // ============================================
  // 7. TIMES DE ELITE
  // ============================================
  console.log('🏅 Configurando times de elite...')

  const eliteTeamsData = [
    { slug: 'gran-turismo', order: 1 },
    { slug: 'cod-mobile', order: 2 },
    { slug: 'cs2', order: 3 },
    { slug: 'cs2-galorynhos', order: 4 },
  ]

  for (const et of eliteTeamsData) {
    const team = teams[et.slug]
    if (team) {
      await prisma.eliteTeam.upsert({
        where: { teamId: team.id },
        update: { order: et.order },
        create: { teamId: team.id, order: et.order },
      })
      console.log(`   ✅ Elite ${et.order}º: ${team.name}`)
    }
  }

  // ============================================
  // 8. MENU DO SITE
  // ============================================
  console.log('📋 Criando menu do site...')

  const menuItemsData = [
    { label: 'Início', href: '/', order: 1 },
    { label: 'Times', href: '/times', order: 2 },
    { label: 'Jogadores', href: '/jogadores', order: 3 },
    { label: 'Conquistas', href: '/conquistas', order: 4 },
    { label: 'Roblox', href: '/roblox', order: 5 },
    { label: 'GTA RP', href: '/gtarp', order: 6 },
    { label: 'Wallpapers', href: '/wallpapers', order: 7 },
    { label: 'Sobre', href: '/sobre', order: 8 },
    { label: 'Contato', href: '/contato', order: 9 },
  ]

  for (const menuItem of menuItemsData) {
    await prisma.menuItem.upsert({
      where: { id: `menu-${menuItem.order}` },
      update: menuItem,
      create: { id: `menu-${menuItem.order}`, ...menuItem },
    })
    console.log(`   ✅ Menu: ${menuItem.label}`)
  }

  // ============================================
  // 9. RODAPÉ
  // ============================================
  console.log('📄 Criando rodapé...')

  const footerColumnsData = [
    { name: 'Institucional', slug: 'institucional', order: 1 },
    { name: 'Nossos Times', slug: 'times', order: 2 },
    { name: 'Jogos', slug: 'jogos', order: 3 },
    { name: 'Links Úteis', slug: 'links', order: 4 },
  ]

  const footerColumns: Record<string, any> = {}
  for (const column of footerColumnsData) {
    const created = await prisma.footerColumn.upsert({
      where: { slug: column.slug },
      update: column,
      create: column,
    })
    footerColumns[column.slug] = created
    console.log(`   ✅ Coluna: ${column.name}`)
  }

  const footerItemsData = [
    { label: 'Sobre Nós', href: '/sobre', columnSlug: 'institucional', order: 1 },
    { label: 'Contato', href: '/contato', columnSlug: 'institucional', order: 2 },
    { label: 'FAQ', href: '/faq', columnSlug: 'institucional', order: 3 },
    { label: 'Termos de Uso', href: '/termos', columnSlug: 'institucional', order: 4 },
    { label: 'Privacidade', href: '/privacidade', columnSlug: 'institucional', order: 5 },
    { label: 'Gran Turismo', href: '/times/gran-turismo', columnSlug: 'times', order: 1 },
    { label: 'COD Mobile', href: '/times/cod-mobile', columnSlug: 'times', order: 2 },
    { label: 'Counter Strike 2', href: '/times/cs2', columnSlug: 'times', order: 3 },
    { label: 'CS2 Galorynhos', href: '/times/cs2-galorynhos', columnSlug: 'times', order: 4 },
    { label: 'Roblox', href: '/roblox', columnSlug: 'jogos', order: 1 },
    { label: 'GTA RP KUSH', href: '/gtarp', columnSlug: 'jogos', order: 2 },
    { label: 'GTA RP FLOW', href: '/gtarp', columnSlug: 'jogos', order: 3 },
    { label: 'Wallpapers', href: '/wallpapers', columnSlug: 'links', order: 1 },
    { label: 'Conquistas', href: '/conquistas', columnSlug: 'links', order: 2 },
    { label: 'Jogadores', href: '/jogadores', columnSlug: 'links', order: 3 },
  ]

  for (const item of footerItemsData) {
    const { columnSlug, ...data } = item
    const column = footerColumns[columnSlug]
    if (column) {
      await prisma.footerItem.create({
        data: { ...data, columnId: column.id },
      })
    }
  }
  console.log(`   ✅ ${footerItemsData.length} itens de rodapé criados`)

  // ============================================
  // 10. REDES SOCIAIS
  // ============================================
  console.log('🌐 Criando redes sociais...')

  const socialLinksData = [
    { platform: 'instagram', url: 'https://instagram.com/galorys', order: 1 },
    { platform: 'twitter', url: 'https://twitter.com/galorysgg', order: 2 },
    { platform: 'youtube', url: 'https://youtube.com/@galorys', order: 3 },
    { platform: 'discord', url: 'https://discord.gg/galorys', order: 4 },
    { platform: 'twitch', url: 'https://twitch.tv/galorys', order: 5 },
    { platform: 'tiktok', url: 'https://tiktok.com/@galorys', order: 6 },
  ]

  for (const social of socialLinksData) {
    await prisma.socialLink.upsert({
      where: { platform: social.platform },
      update: social,
      create: social,
    })
    console.log(`   ✅ Rede: ${social.platform}`)
  }

  // ============================================
  // 11. SEÇÕES DA HOME
  // ============================================
  console.log('🏠 Criando seções da home...')

  const homeSectionsData = [
    { name: 'Hero', slug: 'hero', description: 'Banner principal com "SOMOS GALORYS"', order: 1 },
    { name: 'Pioneiros Roblox', slug: 'pioneers', description: 'Primeira empresa gamer do Brasil a projetar jogos de Roblox', order: 2 },
    { name: 'Times de Elite', slug: 'elite-teams', description: 'Grid de times/modalidades', order: 3 },
    { name: 'Jogadores em Destaque', slug: 'featured-players', description: 'Jogadores destacados', order: 4 },
    { name: 'Conquistas', slug: 'achievements', description: 'Contadores de conquistas', order: 5 },
    { name: 'Roblox & GTA', slug: 'roblox', description: 'Integração com Roblox e servidores GTA RP', order: 6 },
    { name: 'Próximas Partidas', slug: 'matches', description: 'Próximas partidas (só aparece se tiver partidas cadastradas)', order: 7 },
    { name: 'Parceiros', slug: 'partners', description: 'Logos dos parceiros/patrocinadores', order: 8 },
    { name: 'Call to Action', slug: 'cta', description: 'Seção final de engajamento', order: 9 },
  ]

  for (const section of homeSectionsData) {
    await prisma.homeSection.upsert({
      where: { slug: section.slug },
      update: section,
      create: section,
    })
    console.log(`   ✅ Seção: ${section.name}`)
  }

  // ============================================
  // 12. GAME LINKS (Roblox + GTA RP)
  // Códigos de servidor REAIS
  // ============================================
  console.log('🎮 Criando links dos jogos...')

  const gameLinksData = [
    {
      game: 'roblox',
      name: 'Evolução da Aura',
      serverCode: '76149317725679',
      serverUrl: 'https://www.roblox.com/games/76149317725679',
      instagram: '@galorysroblox',
      discordInvite: null,
    },
    {
      game: 'gtarp-kush',
      name: 'KUSH PVP',
      serverCode: 'r4z8dg',
      serverUrl: 'https://cfx.re/join/r4z8dg',
      instagram: '@joguekush',
      videoPath: '/videos/video-kush.mp4',
      discordInvite: 'kushpvp',
    },
    {
      game: 'gtarp-flow',
      name: 'FLOW RP',
      serverCode: '3emg7o',
      serverUrl: 'https://cfx.re/join/3emg7o',
      instagram: '@jogueflow',
      videoPath: '/videos/video-flow.mp4',
      discordInvite: 'flowrp',
    },
  ]

  for (const gameLink of gameLinksData) {
    await prisma.gameLink.upsert({
      where: { game: gameLink.game },
      update: gameLink,
      create: gameLink,
    })
    console.log(`   ✅ Game Link: ${gameLink.name}`)
  }

  // ============================================
  // 13. PARCEIROS
  // ============================================
  console.log('🤝 Criando parceiros...')

  const partnersData = [
    { name: 'Sponsor 1', logo: '/images/partners/sponsor1.png', website: 'https://sponsor1.com', order: 1 },
    { name: 'Sponsor 2', logo: '/images/partners/sponsor2.png', website: 'https://sponsor2.com', order: 2 },
    { name: 'Sponsor 3', logo: '/images/partners/sponsor3.png', website: 'https://sponsor3.com', order: 3 },
  ]

  for (const partner of partnersData) {
    await prisma.partner.upsert({
      where: { id: `partner-${partner.order}` },
      update: partner,
      create: { id: `partner-${partner.order}`, ...partner },
    })
    console.log(`   ✅ Parceiro: ${partner.name}`)
  }

  // ============================================
  // 14. CONFIGURAÇÃO DO SITE (formato key-value)
  // ============================================
  console.log('⚙️ Criando configuração do site...')

  const siteConfigs = [
    { key: 'siteName', value: 'Galorys eSports' },
    { key: 'siteDescription', value: 'Organização de eSports brasileira com times de Gran Turismo, COD Mobile, Counter-Strike 2 e o projeto inclusivo Galorynhos.' },
    { key: 'contactEmail', value: 'contato@galorys.com' },
  ]

  for (const config of siteConfigs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    })
    console.log(`   ✅ Config: ${config.key}`)
  }

  console.log('')
  console.log('✅ Seed concluído com sucesso!')
  console.log('')
  console.log('📊 Resumo:')
  console.log('   - 1 usuário admin (contato@galorys.com / 123)')
  console.log('   - 14 jogos/modalidades')
  console.log('   - 6 times (4 ativos, 2 inativos)')
  console.log('   - 18 jogadores com dados reais')
  console.log('   - 14 conquistas')
  console.log('   - 3 banners')
  console.log('   - 3 jogadores em destaque (Didico, Anãozera, Nython)')
  console.log('   - 4 times de elite')
  console.log('   - 9 itens de menu')
  console.log('   - 4 colunas de rodapé')
  console.log('   - 15 itens de rodapé')
  console.log('   - 6 redes sociais')
  console.log('   - 8 seções da home')
  console.log('   - 3 links de jogos (Roblox + KUSH + FLOW)')
  console.log('   - 3 parceiros')
  console.log('   - 3 configurações do site')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro no seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })