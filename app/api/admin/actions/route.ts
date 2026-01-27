import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as fs from 'fs'
import * as path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    switch (action) {
      case 'seed':
        return await seedDatabase()
      case 'backup':
        return await backupDatabase()
      case 'reset':
        return await resetDatabase()
      default:
        return NextResponse.json(
          { success: false, message: 'Ação desconhecida' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Erro na ação:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao executar ação' },
      { status: 500 }
    )
  }
}

async function seedDatabase() {
  // Criar times (6 times da Galorys)
  const teamsData = [
    {
      name: 'Counter-Strike 2',
      slug: 'cs2',
      game: 'CS2',
      description: 'Time principal de Counter-Strike 2 da Galorys, competindo nas principais ligas brasileiras.',
      active: true,
      order: 1,
    },
    {
      name: 'CS2 Galorynhos',
      slug: 'cs2-galorynhos',
      game: 'CS2_GALORYNHOS',
      description: 'A Galorys orgulhosamente apresenta a primeira equipe de Counter-Strike 2 (CS2) formada exclusivamente por atletas com nanismo no cenário brasileiro. Com estrutura profissional, treinos regulares e metas bem definidas, a lineup PCD da Galorys surge como um marco de inclusão e representatividade nos esports.',
      active: true,
      order: 2,
    },
    {
      name: 'Call of Duty Mobile',
      slug: 'cod-mobile',
      game: 'CODM',
      description: 'Equipe de Call of Duty Mobile com múltiplos títulos nacionais e internacionais, representando o Brasil no cenário mundial.',
      active: true,
      order: 3,
    },
    {
      name: 'Gran Turismo',
      slug: 'gran-turismo',
      game: 'GRAN_TURISMO',
      description: 'O Gran Turismo é um simulador integrado para curtir a vida com o automobilismo. É um sandbox onde os jogadores têm toda a liberdade para descobrir experiências por conta própria.',
      active: true,
      order: 4,
    },
    {
      name: 'Valorant',
      slug: 'valorant',
      game: 'VALORANT',
      description: 'Equipe de Valorant da Galorys, competindo nas principais ligas do cenário brasileiro.',
      active: false,
      order: 5,
    },
    {
      name: 'Age of Empires',
      slug: 'aoe',
      game: 'AOE',
      description: 'Representação da Galorys no cenário competitivo de Age of Empires.',
      active: false,
      order: 6,
    },
  ]

  for (const team of teamsData) {
    await prisma.team.upsert({
      where: { slug: team.slug },
      update: team,
      create: team,
    })
  }

  // Buscar IDs dos times
  const teams = await prisma.team.findMany()
  const teamMap = Object.fromEntries(teams.map(t => [t.slug, t.id]))

  // Criar jogadores reais
  const playersData = [
    // Gran Turismo
    { nickname: 'Didico', realName: 'Adriano Carrazza', slug: 'didico', teamId: teamMap['gran-turismo'], role: 'Piloto', active: true },
    
    // COD Mobile
    { nickname: 'Zeus', realName: 'Ricardo Araujo', slug: 'zeus', teamId: teamMap['cod-mobile'], role: 'Player', active: true },
    { nickname: 'Lucasz1n', realName: 'Lucas Joia Ferreira', slug: 'lucasz1n', teamId: teamMap['cod-mobile'], role: 'Player', active: true },
    { nickname: 'YgorCoach', realName: 'Ygor Simão', slug: 'ygorcoach', teamId: teamMap['cod-mobile'], role: 'Coach', active: true },
    { nickname: 'Hen', realName: 'Henrique de Oliveira', slug: 'hen', teamId: teamMap['cod-mobile'], role: 'Player', active: true },
    { nickname: 'Fokeey', realName: 'Allan Geraldo', slug: 'fokeey', teamId: teamMap['cod-mobile'], role: 'Player', active: true },
    { nickname: 'M1hawk', realName: 'Danilo Jun', slug: 'm1hawk', teamId: teamMap['cod-mobile'], role: 'Player', active: true },
    
    // CS2 Galorynhos
    { nickname: 'Anãozera', realName: 'Mateus Augusto Pesarini', slug: 'anaozera', teamId: teamMap['cs2-galorynhos'], role: 'Capitão / IGL', active: true },
    { nickname: 'Anão Zika', realName: 'Marcos Paulo', slug: 'anao-zika', teamId: teamMap['cs2-galorynhos'], role: 'Player', active: true },
    { nickname: 'MiniCountry', realName: 'Linnicker David', slug: 'minicountry', teamId: teamMap['cs2-galorynhos'], role: 'Player', active: true },
    { nickname: 'Tequileiro', realName: 'Leonardo Heinen', slug: 'tequileiro', teamId: teamMap['cs2-galorynhos'], role: 'Player', active: true },
    { nickname: 'MiniCraque', realName: 'Henrique Saturnino', slug: 'minicraque', teamId: teamMap['cs2-galorynhos'], role: 'Player', active: true },
    { nickname: 'Murillo', realName: 'Murilo Major', slug: 'murillo', teamId: teamMap['cs2-galorynhos'], role: 'Player', active: true },
    
    // CS2
    { nickname: 'Nython', realName: 'Gabriel Lino', slug: 'nython', teamId: teamMap['cs2'], role: 'Player', active: true },
    { nickname: 'Tomate', realName: 'Moises Lima', slug: 'tomate', teamId: teamMap['cs2'], role: 'Player', active: true },
    { nickname: 'Destiny', realName: 'Lucas Bullo', slug: 'destiny', teamId: teamMap['cs2'], role: 'Player', active: true },
    { nickname: 'Card', realName: 'Cauã Cardoso', slug: 'card', teamId: teamMap['cs2'], role: 'Player', active: true },
    { nickname: 'Gbb', realName: 'Gabriel Pereira', slug: 'gbb', teamId: teamMap['cs2'], role: 'Player', active: true },
  ]

  for (const player of playersData) {
    await prisma.player.upsert({
      where: { slug: player.slug },
      update: player,
      create: player,
    })
  }

  // Criar conquistas REAIS (dos banners)
  const achievementsData = [
    // Gran Turismo
    { title: '4º Lugar Olimpíadas Virtuais', placement: 'TOP 4', tournament: 'Olimpíadas Virtuais - Singapura', date: new Date('2023-06-01'), teamId: teamMap['gran-turismo'], active: true, featured: true },
    { title: '3º Nations Cup', placement: '3º', tournament: 'GT World Series 2023', date: new Date('2023-11-01'), teamId: teamMap['gran-turismo'], active: true, featured: false },
    { title: '16x Campeão Brasileiro', placement: '1º', tournament: 'Campeonato Brasileiro', date: new Date('2024-12-01'), teamId: teamMap['gran-turismo'], active: true, featured: true },
    { title: '+20 Recordes Mundiais', placement: 'Recorde', tournament: 'Gran Turismo Records', date: new Date('2024-12-01'), teamId: teamMap['gran-turismo'], active: true, featured: false },
    { title: '1º Classificatória Online Nations Cup', placement: '1º', tournament: 'GT World Series 2024', date: new Date('2024-10-01'), teamId: teamMap['gran-turismo'], active: true, featured: false },
    { title: '2º Classificatória Online Manufactures Cup', placement: '2º', tournament: 'GT World Series 2024', date: new Date('2024-10-01'), teamId: teamMap['gran-turismo'], active: true, featured: false },
    
    // Call of Duty Mobile
    { title: '2º Lugar Fase 4 Campeonato Mundial', placement: '2º', tournament: 'Campeonato Mundial COD Mobile', date: new Date('2022-12-01'), teamId: teamMap['cod-mobile'], active: true, featured: false },
    { title: '8 Títulos Nacionais e Internacionais', placement: '1º', tournament: 'Múltiplos Torneios', date: new Date('2023-12-01'), teamId: teamMap['cod-mobile'], active: true, featured: false },
    { title: '1º Toronto Ultra Mobile Madness', placement: '1º', tournament: 'Toronto Ultra Mobile Madness', date: new Date('2023-08-01'), teamId: teamMap['cod-mobile'], active: true, featured: true },
    { title: 'Bicampeão Copa Asus Rog', placement: '1º', tournament: 'Copa Asus Rog', date: new Date('2024-06-01'), teamId: teamMap['cod-mobile'], active: true, featured: false },
    { title: 'TOP 2 SPS Masters 2024', placement: '2º', tournament: 'SPS Masters 2024', date: new Date('2024-04-01'), teamId: teamMap['cod-mobile'], active: true, featured: false },
    { title: 'Bicampeão LATAM ESL', placement: '1º', tournament: 'ESL LATAM', date: new Date('2024-09-01'), teamId: teamMap['cod-mobile'], active: true, featured: true },
    { title: 'TOP 4 Mundial', placement: 'TOP 4', tournament: 'Campeonato Mundial', date: new Date('2024-12-01'), teamId: teamMap['cod-mobile'], active: true, featured: true },
    { title: 'Tetracampeão Stage 4', placement: '1º', tournament: 'Stage 4 COD Mobile', date: new Date('2024-11-01'), teamId: teamMap['cod-mobile'], active: true, featured: true },
    { title: 'Bicampeão Horus Dark', placement: '1º', tournament: 'Horus Dark', date: new Date('2025-01-01'), teamId: teamMap['cod-mobile'], active: true, featured: false },
    { title: 'Tricampeão Snapdragon', placement: '1º', tournament: 'Snapdragon Pro Series', date: new Date('2025-01-01'), teamId: teamMap['cod-mobile'], active: true, featured: false },
    
    // Valorant (time desativado, conquistas ativas)
    { title: '1º EliteCup', placement: '1º', tournament: 'EliteCup (Presencial)', date: new Date('2023-05-01'), teamId: teamMap['valorant'], active: true, featured: false },
    { title: '1º Relegation VCB SEED1', placement: '1º', tournament: 'VCB Relegation (Online)', date: new Date('2023-07-01'), teamId: teamMap['valorant'], active: true, featured: false },
    { title: '2º Serie A Finals', placement: '2º', tournament: 'Serie A Finals (Online)', date: new Date('2023-09-01'), teamId: teamMap['valorant'], active: true, featured: false },
    { title: '2º NineXT Open Air', placement: '2º', tournament: 'NineXT Open Air (Presencial)', date: new Date('2023-10-01'), teamId: teamMap['valorant'], active: true, featured: false },
    { title: '2º G-Shock Resistance Cup', placement: '2º', tournament: 'G-Shock Resistance Cup (Online)', date: new Date('2023-11-01'), teamId: teamMap['valorant'], active: true, featured: false },
    { title: 'Bicampeão VCB', placement: '1º', tournament: 'Valorant Challengers Brazil', date: new Date('2024-08-01'), teamId: teamMap['valorant'], active: true, featured: true },
    
    // Age of Empires (time desativado, conquistas ativas)
    { title: 'Campeão Brasileiro', placement: '1º', tournament: 'Campeonato Brasileiro AoE', date: new Date('2024-10-01'), teamId: teamMap['aoe'], active: true, featured: true },
    
    // Counter-Strike 2
    { title: 'Red Zone Pro League', placement: '1º', tournament: 'Red Zone Pro League', date: new Date('2023-06-01'), teamId: teamMap['cs2'], active: true, featured: false },
    { title: 'Campeão Série B GamersClub', placement: '1º', tournament: 'GamersClub Liga Série B', date: new Date('2025-01-01'), teamId: teamMap['cs2'], active: true, featured: true },
    
    // CS2 Galorynhos (marco histórico)
    { title: 'Primeira equipe PCD de CS2 do Brasil', placement: 'Marco', tournament: 'Pioneirismo nos eSports', date: new Date('2023-09-01'), teamId: teamMap['cs2-galorynhos'], active: true, featured: true },
  ]

  // Limpar conquistas existentes e inserir novas
  await prisma.achievement.deleteMany()
  for (const achievement of achievementsData) {
    await prisma.achievement.create({ data: achievement })
  }

  return NextResponse.json({
    success: true,
    message: `✅ Dados criados com sucesso! ${teamsData.length} times, ${playersData.length} jogadores, ${achievementsData.length} conquistas.`
  })
}

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupDir = './backups'
  const backupPath = path.join(backupDir, `backup-${timestamp}.db`)

  try {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    const dbPath = './prisma/dev.db'
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupPath)
      return NextResponse.json({
        success: true,
        message: `✅ Backup criado: ${backupPath}`
      })
    } else {
      return NextResponse.json({
        success: false,
        message: '❌ Arquivo do banco de dados não encontrado'
      })
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `❌ Erro ao criar backup: ${error.message}`
    })
  }
}

async function resetDatabase() {
  try {
    await prisma.activity.deleteMany()
    await prisma.userReward.deleteMany()
    await prisma.userNotification.deleteMany()
    await prisma.favorite.deleteMany()
    await prisma.contact.deleteMany()
    await prisma.newsletter.deleteMany()
    await prisma.match.deleteMany()
    await prisma.achievement.deleteMany()
    await prisma.player.deleteMany()
    await prisma.team.deleteMany()
    await prisma.partner.deleteMany()
    await prisma.news.deleteMany()
    await prisma.banner.deleteMany()
    await prisma.wallpaper.deleteMany()
    await prisma.reward.deleteMany()
    await prisma.robloxGame.deleteMany()
    await prisma.robloxGroup.deleteMany()
    await prisma.mediaItem.deleteMany()
    await prisma.timelineEvent.deleteMany()
    await prisma.siteConfig.deleteMany()

    // Repopular
    const seedResult = await seedDatabase()
    const seedData = await seedResult.json()

    return NextResponse.json({
      success: true,
      message: '✅ Banco resetado e repopulado com sucesso!'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `❌ Erro ao resetar: ${error.message}`
    })
  }
}
