import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

// Cache das configurações do site
let siteConfigCache: Record<string, string> | null = null
let cacheTimestamp = 0
const CACHE_TTL = 60000 // 1 minuto

async function getSiteConfig(): Promise<Record<string, string>> {
  const now = Date.now()
  
  // Usar cache se ainda válido
  if (siteConfigCache && now - cacheTimestamp < CACHE_TTL) {
    return siteConfigCache
  }

  try {
    const configs = await prisma.siteConfig.findMany()
    siteConfigCache = configs.reduce((acc, config) => {
      acc[config.key] = config.value
      return acc
    }, {} as Record<string, string>)
    cacheTimestamp = now
    return siteConfigCache
  } catch (e) {
    console.error('Erro ao buscar config do site:', e)
    return {
      site_name: 'Galorys eSports',
      site_description: 'Organização brasileira de eSports',
      site_url: 'https://galorys.com',
      og_image: '/images/og-image.png',
      twitter_handle: '@galorys'
    }
  }
}

export interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

export async function generateSEO(props: SEOProps = {}): Promise<Metadata> {
  const config = await getSiteConfig()
  
  const siteName = config.site_name || 'Galorys eSports'
  const siteUrl = config.site_url || process.env.NEXT_PUBLIC_APP_URL || 'https://galorys.com'
  
  const title = props.title ? `${props.title} | ${siteName}` : siteName
  const description = props.description || config.site_description || 'Organização brasileira de eSports'
  const image = props.image || config.og_image || '/images/og-image.png'
  const url = props.url || siteUrl
  const type = props.type || 'website'

  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`

  const metadata: Metadata = {
    title,
    description,
    keywords: config.site_keywords?.split(',').map(k => k.trim()),
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'pt_BR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
      site: config.twitter_handle || '@galorys',
      creator: config.twitter_handle || '@galorys',
    },
    robots: props.noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
  }

  return metadata
}

// Função simples para páginas que não podem ser async
export function generateStaticSEO(props: SEOProps & { siteName?: string }): Metadata {
  const siteName = props.siteName || 'Galorys eSports'
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://galorys.com'
  
  const title = props.title ? `${props.title} | ${siteName}` : siteName
  const description = props.description || 'Organização brasileira de eSports'
  const image = props.image || '/images/og-image.png'
  const url = props.url || siteUrl

  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`

  return {
    title,
    description,
    openGraph: {
      type: props.type || 'website',
      title,
      description,
      url,
      siteName,
      images: [{ url: fullImageUrl, width: 1200, height: 630, alt: title }],
      locale: 'pt_BR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
      site: '@galorys',
    },
  }
}

// SEO para páginas específicas
export const pageSEO = {
  home: {
    title: 'Galorys eSports',
    description: 'Organização brasileira de eSports competindo nos maiores torneios do mundo. Conheça nossos times e jogadores.'
  },
  times: {
    title: 'Times',
    description: 'Conheça os times da Galorys eSports. Equipes de CS2, Valorant, League of Legends, Free Fire e muito mais.'
  },
  jogadores: {
    title: 'Jogadores',
    description: 'Conheça os jogadores profissionais da Galorys eSports. Talentos brasileiros competindo no cenário mundial.'
  },
  conquistas: {
    title: 'Conquistas',
    description: 'Histórico de conquistas e títulos da Galorys eSports. Campeões em diversos torneios nacionais e internacionais.'
  },
  wallpapers: {
    title: 'Wallpapers',
    description: 'Baixe wallpapers oficiais da Galorys eSports para seu desktop e celular.'
  },
  sobre: {
    title: 'Sobre Nós',
    description: 'Conheça a história da Galorys eSports, nossa missão e valores.'
  },
  contato: {
    title: 'Contato',
    description: 'Entre em contato com a Galorys eSports. Parcerias, patrocínios e suporte.'
  },
  roblox: {
    title: 'Roblox',
    description: 'Jogos da Galorys no Roblox. Divirta-se com nossa comunidade.'
  },
  gtarp: {
    title: 'GTA RP',
    description: 'Servidores de GTA RP parceiros da Galorys.'
  },
}
