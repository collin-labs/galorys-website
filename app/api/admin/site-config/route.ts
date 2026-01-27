import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar configurações do site
export async function GET() {
  try {
    const configs = await prisma.siteConfig.findMany()
    
    // Converter para objeto
    const configObject = configs.reduce((acc, config) => {
      acc[config.key] = config.value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({ config: configObject })
  } catch (error: any) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Salvar configurações do site
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Atualizar cada configuração
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        await prisma.siteConfig.upsert({
          where: { key },
          update: { value },
          create: { key, value }
        })
      }
    }

    // Buscar configurações atualizadas
    const configs = await prisma.siteConfig.findMany()
    const configObject = configs.reduce((acc, config) => {
      acc[config.key] = config.value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({ config: configObject })
  } catch (error: any) {
    console.error('Erro ao salvar configurações:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
