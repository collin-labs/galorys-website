import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// ============================================
// MIDDLEWARE DE AUTENTICAÇÃO - GALORYS
// ============================================

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'TROQUE_ESTA_CHAVE_EM_PRODUCAO_32chars!'
)

const JWT_ISSUER = 'galorys.com'
const JWT_AUDIENCE = 'galorys-admin'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas que precisam de autenticação
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'
  const isRecoverPage = pathname.startsWith('/admin/login/recuperar')
  const isNewPasswordPage = pathname.startsWith('/admin/login/nova-senha')
  const isApiAuth = pathname.startsWith('/api/auth')

  // Permitir acesso à página de login, recuperação e APIs de auth
  if (isLoginPage || isRecoverPage || isNewPasswordPage || isApiAuth) {
    return NextResponse.next()
  }

  // Verificar autenticação para rotas admin
  if (isAdminRoute) {
    const session = request.cookies.get('admin_session')

    if (!session) {
      // Redirecionar para login
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      // ============================================
      // VERIFICAR JWT ASSINADO
      // ============================================
      const { payload } = await jwtVerify(session.value, JWT_SECRET, {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      })

      // Verificar se é admin
      if (payload.role !== 'ADMIN') {
        const response = NextResponse.redirect(new URL('/admin/login', request.url))
        response.cookies.delete('admin_session')
        return response
      }

      // ============================================
      // JWT VÁLIDO - Adicionar headers com info do usuário
      // (para uso nas páginas, sem precisar decodificar novamente)
      // ============================================
      const response = NextResponse.next()
      response.headers.set('x-user-id', payload.userId as string)
      response.headers.set('x-user-email', payload.email as string)
      response.headers.set('x-user-role', payload.role as string)
      
      return response
    } catch (error) {
      // JWT inválido, expirado ou adulterado
      console.error('[MIDDLEWARE] Token inválido:', error)
      
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin_session')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Proteger todas as rotas /admin exceto arquivos estáticos
    '/admin/:path*'
  ]
}
