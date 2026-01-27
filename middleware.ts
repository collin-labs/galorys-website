import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas que precisam de autenticação
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'
  const isApiAuth = pathname.startsWith('/api/auth')

  // Permitir acesso à página de login e APIs de auth
  if (isLoginPage || isApiAuth) {
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
      // Decodificar e verificar sessão
      const decoded = JSON.parse(Buffer.from(session.value, 'base64').toString())
      
      // Verificar expiração
      if (decoded.exp < Date.now()) {
        // Sessão expirada - limpar cookie e redirecionar
        const response = NextResponse.redirect(new URL('/admin/login', request.url))
        response.cookies.delete('admin_session')
        return response
      }

      // Verificar se é admin
      if (decoded.role !== 'ADMIN') {
        const response = NextResponse.redirect(new URL('/admin/login', request.url))
        response.cookies.delete('admin_session')
        return response
      }

      // Sessão válida - continuar
      return NextResponse.next()
    } catch {
      // Erro ao decodificar - limpar cookie e redirecionar
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
