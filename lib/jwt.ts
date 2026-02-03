import { SignJWT, jwtVerify, JWTPayload } from 'jose'
import { prisma } from '@/lib/prisma'

// ============================================
// CONFIGURAÇÃO JWT - SEGURANÇA GALORYS
// ============================================

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'TROQUE_ESTA_CHAVE_EM_PRODUCAO_32chars!'
)

const JWT_ISSUER = 'galorys.com'
const JWT_AUDIENCE = 'galorys-admin'
const JWT_EXPIRATION = '7d' // 7 dias

// Interface do payload do token
export interface AdminTokenPayload extends JWTPayload {
  userId: string
  email: string
  role: string
}

// ============================================
// CRIAR TOKEN JWT ASSINADO
// ============================================
export async function createAdminToken(user: {
  id: string
  email: string
  name: string | null
  role: string
}): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET)

  return token
}

// ============================================
// VERIFICAR TOKEN JWT
// ============================================
export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })

    return payload as AdminTokenPayload
  } catch (error) {
    console.error('Erro ao verificar JWT:', error)
    return null
  }
}

// ============================================
// VALIDAR SESSÃO COMPLETA (JWT + BANCO)
// ============================================
export async function validateAdminSession(token: string): Promise<{
  valid: boolean
  user?: {
    id: string
    email: string
    name: string | null
    role: string
  }
  error?: string
}> {
  // 1. Verificar assinatura e expiração do JWT
  const payload = await verifyAdminToken(token)
  
  if (!payload) {
    return { valid: false, error: 'Token inválido ou expirado' }
  }

  // 2. CRÍTICO: Validar se o usuário existe no banco
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        banned: true,
      }
    })

    // Usuário não existe
    if (!user) {
      return { valid: false, error: 'Usuário não encontrado' }
    }

    // Usuário banido
    if (user.banned) {
      return { valid: false, error: 'Conta suspensa' }
    }

    // Email não bate (possível adulteração)
    if (user.email !== payload.email) {
      return { valid: false, error: 'Dados da sessão inválidos' }
    }

    // Role não bate (possível adulteração)
    if (user.role !== payload.role) {
      return { valid: false, error: 'Permissões alteradas' }
    }

    // Não é admin
    if (user.role !== 'ADMIN') {
      return { valid: false, error: 'Acesso não autorizado' }
    }

    // 3. Tudo válido!
    return {
      valid: true,
      user: {
        id: user.id,
        email: user.email!,
        name: user.name,
        role: user.role,
      }
    }
  } catch (error) {
    console.error('Erro ao validar sessão no banco:', error)
    return { valid: false, error: 'Erro ao validar sessão' }
  }
}

// ============================================
// RATE LIMITING SIMPLES (EM MEMÓRIA)
// ============================================
const loginAttempts = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minuto
const MAX_ATTEMPTS = 5 // 5 tentativas por minuto

export function checkRateLimit(identifier: string): {
  allowed: boolean
  remaining: number
  resetIn: number
} {
  const now = Date.now()
  const record = loginAttempts.get(identifier)

  // Limpar registros antigos
  if (record && record.resetAt < now) {
    loginAttempts.delete(identifier)
  }

  const current = loginAttempts.get(identifier)

  if (!current) {
    // Primeira tentativa
    loginAttempts.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW
    })
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetIn: RATE_LIMIT_WINDOW }
  }

  if (current.count >= MAX_ATTEMPTS) {
    // Limite excedido
    return {
      allowed: false,
      remaining: 0,
      resetIn: current.resetAt - now
    }
  }

  // Incrementar contador
  current.count++
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - current.count,
    resetIn: current.resetAt - now
  }
}

export function resetRateLimit(identifier: string): void {
  loginAttempts.delete(identifier)
}
