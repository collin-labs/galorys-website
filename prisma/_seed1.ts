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
  // 2. TIMES (dados exatos do mock original)
  // ============================================
  console.log('🎮 Criando times...')
  
  const teamsData = [
    {
      name: 'Gran Turismo',
      slug: 'gran-turismo',
      game: 'Gran Turismo',
      description: 'Equipe de simulação de corrida representando a Galorys no Gran Turismo.',
      logo: '/images/teams/gran-turismo.webp',
      banner: '/images/teams/gt-banner.jpg',
      active: true,
      order: 1,
    },
    {
      name: 'Call of Duty Mobile',
      slug: 'cod-mobile',
      game: 'Call of Duty Mobile',
      description: 'Time competitivo de Call of Duty Mobile da Galorys eSports.',
      logo: '/images/teams/cod-mobile.jpg',
      banner: '/images/teams/codm-banner.jpg',
      active: true,
      order: 2,
    },
    {
      name: 'CS2 Galorynhos',
      slug: 'cs2-kids',
      game: 'CS2 Galorynhos',
      description: 'Primeira equipe de CS2 com atletas PCD do Brasil.',
      logo: '/images/teams/cs2-kids-logo.png',
      banner: '/images/teams/cs2-kids-banner.jpg',
      active: true,
      order: 3,
    },
    {
      name: 'Counter Strike 2',
      slug: 'cs2',
      game: 'Counter-Strike 2',
      description: 'Equipe principal de Counter-Strike 2 da Galorys.',
      logo: '/images/teams/cs2-logo.png',
      banner: '/images/teams/cs2-banner.jpg',
      active: true,
      order: 4,
    },
    {
      name: 'Valorant',
      slug: 'valorant',
      game: 'Valorant',
      description: 'Equipe de Valorant da Galorys eSports.',
      logo: '/images/teams/valorant-logo.png',
      banner: '/images/teams/valorant-banner.jpg',
      active: false,
      order: 5,
    },
    {
      name: 'Age of Empires',
      slug: 'age-of-empires',
      game: 'Age of Empires',
      description: 'Time de estratégia em tempo real.',
      logo: '/images/teams/aoe-logo.png',
      banner: '/images/teams/aoe-banner.jpg',
      active: false,
      order: 6,
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
  // 3. JOGADORES (dados exatos do mock original)
  // ============================================
  console.log('👥 Criando jogadores...')

  const playersData = [
    // Gran Turismo (1 jogador)
    {
      nickname: 'Didico',
      realName: 'Adriano Carrazza',
      slug: 'didico',
      photo: '/esports-player-avatar.png',
      role: 'Piloto Principal',
      bio: 'Piloto principal da equipe Gran Turismo, múltiplas vezes campeão brasileiro.',
      teamSlug: 'gran-turismo',
    },
    // Call of Duty Mobile (6 jogadores)
    {
      nickname: 'Hen',
      realName: 'Henrique de Oliveira',
      slug: 'hen',
      photo: '/esports-player.png',
      role: 'Jogador Profissional',
      bio: 'Jogador profissional de COD Mobile.',
      teamSlug: 'cod-mobile',
    },
    {
      nickname: 'LUCASZ1N',
      realName: 'Lucas Joia Ferreira',
      slug: 'lucasz1n',
      photo: '/gamer-avatar.png',
      role: 'Jogador Profissional',
      bio: 'Jogador profissional de COD Mobile.',
      teamSlug: 'cod-mobile',
    },
    {
      nickname: 'YGORCOACH',
      realName: 'Ygor Simão',
      slug: 'ygorcoach',
      photo: '/coach-avatar.png',
      role: 'Jogador Profissional',
      bio: 'Jogador profissional de COD Mobile.',
      teamSlug: 'cod-mobile',
    },
    {
      nickname: 'ZEUS',
      realName: 'Ricardo Araujo',
      slug: 'zeus',
      photo: '/zeus-gamer.jpg',
      role: 'Jogador Profissional',
      bio: 'Jogador profissional de COD Mobile.',
      teamSlug: 'cod-mobile',
    },
    {
      nickname: 'fakeey',
      realName: 'Allan Geraldo',
      slug: 'fakeey',
      photo: '/fakeey-player.jpg',
      role: 'Jogador Profissional',
      bio: 'Jogador profissional de COD Mobile.',
      teamSlug: 'cod-mobile',
    },
    {
      nickname: 'm1hawk',
      realName: 'Danilo Jun',
      slug: 'm1hawk',
      photo: '/hawk-gamer.jpg',
      role: 'Jogador Profissional',
      bio: 'Jogador profissional de COD Mobile.',
      teamSlug: 'cod-mobile',
    },
    // CS2 Galorynhos (6 jogadores)
    {
      nickname: 'Anão Zika',
      realName: 'Marcos Paulo',
      slug: 'anao-zika',
      photo: '/young-gamer.jpg',
      role: 'Jogador Profissional',
      bio: 'Jogador profissional do CS2 Galorynhos.',
      teamSlug: 'cs2-kids',
    },
    {
      nickname: 'Anãozera',
      realName: 'Mateus Augusto',
      slug: 'anaozera',
      photo: '/igl-player.jpg',
      role: 'IGL',
      bio: 'In-Game Leader do CS2 Galorynhos.',
      teamSlug: 'cs2-kids',
    },
    {
      nickname: 'MiniCountry',
      realName: 'Linnicker David',
      slug: 'minicountry',
      photo: '/country-gamer.jpg',
      role: 'Jogador Profissional',
      bio: 'Jogador profissional do CS2 Galorynhos.',
      teamSlug: 'cs2-kids',
    },
    {
      nickname: 'MiniCraque',
      realName: 'Henrique Saturnino',
      slug: 'minicraque',
      photo: '/craque-player.jpg',
      role: 'Jogador Profissional',
      bio: 'Jogador profissional do CS2 Galorynhos.',
      teamSlug: 'cs2-kids',
    },
    {
      nickname: 'Murillo',
      realName: 'Murilo Major',
      slug: 'murillo',
      photo: '/murillo-gamer.jpg',
      role: 'Jogador Profissional',
      bio: 'Jogador profissional do CS2 Galorynhos.',
      teamSlug: 'cs2-kids',
    },
    {
      nickname: 'Tequileiro',
      realName: 'Leonardo Heinen',
      slug: 'tequileiro',
      photo: '/tequileiro-player.jpg',
      role: 'Jogador Profissional',
      bio: 'Jogador profissional do CS2 Galorynhos.',
      teamSlug: 'cs2-kids',
    },
    // Counter Strike 2 (5 jogadores)
    {
      nickname: 'Card',
      realName: 'Cauã Cardoso',
      slug: 'card',
      photo: '/card-cs2-player.jpg',
      role: 'Jogador Profissional',
      bio: 'Jogador profissional do CS2.',
      teamSlug: 'cs2',
    },
    {
      nickname: 'Destiny',
      realName: 'Lucas Bullo',
      slug: 'destiny',
      photo: '/destiny-gamer.jpg',
      role: 'Jogador Profissional',
      bio: 'Jogador profissional do CS2.',
      teamSlug: 'cs2',
    },
    {
      nickname: 'Gbb',
      realName: 'Gabriel Pereira',
      slug: 'gbb',
      photo: '/gbb-player.jpg',
      role: 'Jogador Profissional',
      bio: 'Jogador profissional do CS2.',
      teamSlug: 'cs2',
    },
    {
      nickname: 'Nython',
      realName: 'Gabriel Lino',
      slug: 'nython',
      photo: '/nython-cs2.jpg',
      role: 'Entry Fragger',
      bio: 'Entry Fragger do CS2.',
      teamSlug: 'cs2',
    },
    {
      nickname: 'Tomate',
      realName: 'Moises Lima',
      slug: 'tomate',
      photo: '/tomate-esports.jpg',
      role: 'Jogador Profissional',
      bio: 'Jogador profissional do CS2.',
      teamSlug: 'cs2',
    },
  ]

  const players: Record<string, any> = {}
  for (const playerData of playersData) {
    const { teamSlug, ...data } = playerData
    const team = teams[teamSlug]
    if (team) {
      const player = await prisma.player.upsert({
        where: { slug: data.slug },
        update: { ...data, teamId: team.id },
        create: { ...data, teamId: team.id },
      })
      players[data.slug] = player
      console.log(`   ✅ Jogador: ${player.nickname} (${team.name})`)
    }
  }

  // ============================================
  // 4. CONQUISTAS (dados exatos do mock original)
  // ============================================
  console.log('🏆 Criando conquistas...')

  const achievementsData = [
    {
      title: '15x Campeão Brasileiro',
      description: 'Campeonato Brasileiro Gran Turismo',
      teamSlug: 'gran-turismo',
      placement: '1º',
      tournament: 'Campeonato Brasileiro Gran Turismo',
      date: new Date('2024-11-30'),
      featured: true,
    },
    {
      title: '15x Campeão Brasileiro GT',
      description: 'Campeonato Brasileiro Gran Turismo',
      teamSlug: 'gran-turismo',
      placement: '1º',
      tournament: 'Campeonato Brasileiro Gran Turismo',
      date: new Date('2024-11-30'),
      featured: true,
    },
    {
      title: 'TOP 2 Ranking Mundial',
      description: 'Ranking Mundial COD Mobile',
      teamSlug: 'cod-mobile',
      placement: '2º',
      tournament: 'Ranking Mundial COD Mobile',
      date: new Date('2024-10-31'),
      featured: true,
    },
    {
      title: 'Classificado Gamers Club',
      description: 'Gamers Club Liga',
      teamSlug: 'cs2',
      placement: 'Classificado',
      tournament: 'Gamers Club Liga',
      date: new Date('2024-09-30'),
      featured: false,
    },
    {
      title: 'Campeão BR Series 2024',
      description: 'BR Series COD Mobile',
      teamSlug: 'cod-mobile',
      placement: '1º',
      tournament: 'BR Series COD Mobile',
      date: new Date('2024-08-31'),
      featured: true,
    },
    {
      title: '4º Lugar Olimpíadas Virtuais',
      description: 'Olimpíadas Virtuais',
      teamSlug: 'gran-turismo',
      placement: 'TOP 4',
      tournament: 'Olimpíadas Virtuais',
      date: new Date('2024-07-31'),
      featured: true,
    },
    {
      title: 'TOP 8 Eliminatórias',
      description: 'Eliminatórias Regionais CS2',
      teamSlug: 'cs2',
      placement: 'TOP 8',
      tournament: 'Eliminatórias Regionais CS2',
      date: new Date('2024-07-31'),
      featured: false,
    },
    {
      title: 'Vice-campeão LBFF',
      description: 'LBFF 2024',
      teamSlug: 'cod-mobile',
      placement: '2º',
      tournament: 'LBFF 2024',
      date: new Date('2024-06-30'),
      featured: false,
    },
    {
      title: 'TOP 4 VCT Americas',
      description: 'VCT Americas',
      teamSlug: 'valorant',
      placement: 'TOP 4',
      tournament: 'VCT Americas',
      date: new Date('2024-06-30'),
      featured: false,
    },
    {
      title: '20+ Recordes Mundiais',
      description: 'Gran Turismo World Records',
      teamSlug: 'gran-turismo',
      placement: 'Recorde',
      tournament: 'Gran Turismo World Records',
      date: new Date('2024-05-31'),
      featured: false,
    },
    {
      title: 'Vice-campeão NAC',
      description: 'NAC AoE',
      teamSlug: 'age-of-empires',
      placement: '2º',
      tournament: 'NAC AoE',
      date: new Date('2024-05-31'),
      featured: false,
    },
    {
      title: 'Campeão VCT Challengers',
      description: 'VCT Challengers Brasil',
      teamSlug: 'valorant',
      placement: '1º',
      tournament: 'VCT Challengers Brasil',
      date: new Date('2024-04-30'),
      featured: true,
    },
    {
      title: 'Campeão Red Bull Wololo',
      description: 'Red Bull Wololo Brasil',
      teamSlug: 'age-of-empires',
      placement: '1º',
      tournament: 'Red Bull Wololo Brasil',
      date: new Date('2024-03-31'),
      featured: true,
    },
    {
      title: 'Campeão Torneio Inclusivo',
      description: 'Torneio Inclusivo CS2',
      teamSlug: 'cs2-kids',
      placement: '1º',
      tournament: 'Torneio Inclusivo CS2',
      date: new Date('2024-02-29'),
      featured: false,
    },
    {
      title: 'Marco de Inclusão nos eSports',
      description: 'Cenário Competitivo Brasileiro',
      teamSlug: 'cs2-kids',
      placement: 'Marco Histórico',
      tournament: 'Cenário Competitivo Brasileiro',
      date: new Date('2023-05-31'),
      featured: true,
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
  // 5. BANNERS (dados exatos do mock original)
  // ============================================
  console.log('🖼️ Criando banners...')

  const bannersData = [
    {
      title: 'Adriano Carrazza - Dídico',
      subtitle: '4º Lugar nas Olimpíadas Virtuais de Gran Turismo',
      image: '/images/teams/gran-turismo.webp',
      link: '/times/gran-turismo',
      order: 1,
      active: true,
    },
    {
      title: 'TOP 4 Mundial COD Mobile',
      subtitle: 'Tetracampeão Stage 4 - A elite do mobile gaming',
      image: '/images/teams/cod-mobile.jpg',
      link: '/times/cod-mobile',
      order: 2,
      active: true,
    },
    {
      title: 'Galorynhos',
      subtitle: 'Primeira equipe de CS2 com atletas PCD do Brasil',
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
    { slug: 'cs2-kids', order: 4 },
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
    { label: 'CS2 Galorynhos', href: '/times/cs2-kids', columnSlug: 'times', order: 4 },
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
    { name: 'Hero', slug: 'hero', order: 1 },
    { name: 'Times de Elite', slug: 'elite-teams', order: 2 },
    { name: 'Jogadores em Destaque', slug: 'featured-players', order: 3 },
    { name: 'Próximas Partidas', slug: 'matches', order: 4 },
    { name: 'Conquistas Históricas', slug: 'achievements', order: 5 },
    { name: 'Roblox', slug: 'roblox', order: 6 },
    { name: 'GTA RP', slug: 'gtarp', order: 7 },
    { name: 'Parceiros', slug: 'partners', order: 8 },
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
  // ============================================
  console.log('🎮 Criando links dos jogos...')

  const gameLinksData = [
    {
      game: 'roblox',
      name: 'Galorys Tycoon',
      serverCode: '123456789',
      serverUrl: 'https://www.roblox.com/games/123456789',
      instagram: '@galorysroblox',
    },
    {
      game: 'gtarp-kush',
      name: 'KUSH PVP',
      serverCode: 'kush123',
      serverUrl: 'fivem://connect/kush.galorys.com',
      instagram: '@joguekush',
      videoPath: '/videos/video-kush.mp4',
    },
    {
      game: 'gtarp-flow',
      name: 'FLOW RP',
      serverCode: 'flow456',
      serverUrl: 'fivem://connect/flow.galorys.com',
      instagram: '@jogueflow',
      videoPath: '/videos/video-flow.mp4',
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

  console.log('')
  console.log('✅ Seed concluído com sucesso!')
  console.log('')
  console.log('📊 Resumo:')
  console.log('   - 1 usuário admin')
  console.log('   - 6 times')
  console.log('   - 18 jogadores')
  console.log('   - 15 conquistas')
  console.log('   - 3 banners')
  console.log('   - 3 jogadores em destaque')
  console.log('   - 4 times de elite')
  console.log('   - 9 itens de menu')
  console.log('   - 4 colunas de rodapé')
  console.log('   - 15 itens de rodapé')
  console.log('   - 6 redes sociais')
  console.log('   - 8 seções da home')
  console.log('   - 3 links de jogos')
  console.log('   - 3 parceiros')
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
