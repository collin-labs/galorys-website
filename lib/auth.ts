import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // Credenciais (email/senha)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error('Usuário não encontrado')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Senha incorreta')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    newUser: '/dashboard',
  },
  
  callbacks: {
    async signIn({ user }) {
      // Verificar se o usuário está banido
      if (user.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        })
        if (dbUser?.banned) {
          return false
        }
      }
      return true
    },
    
    async jwt({ token, user, trigger, session }) {
      // Primeiro login - adicionar dados do usuário ao token
      if (user) {
        token.id = user.id
        token.role = (user as any).role || 'USER'
        token.points = 0
      }
      
      // Buscar dados atualizados do banco
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, points: true, name: true, image: true },
        })
        if (dbUser) {
          token.role = dbUser.role
          token.points = dbUser.points
          token.name = dbUser.name
          token.picture = dbUser.image
        }
      }
      
      // Atualização manual via update()
      if (trigger === 'update' && session) {
        token.name = session.name ?? token.name
        token.picture = session.image ?? token.picture
      }
      
      return token
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.points = token.points as number
      }
      return session
    },
  },
  
  events: {
    async createUser({ user }) {
      // Dar pontos de boas-vindas para novos usuários
      await prisma.user.update({
        where: { id: user.id },
        data: { points: 100 },
      })
      
      // Registrar atividade
      await prisma.activity.create({
        data: {
          userId: user.id,
          type: 'SIGNUP',
          points: 100,
          description: 'Bem-vindo à Galorys! +100 pontos de boas-vindas',
        },
      })
    },
    
    async signIn({ user, isNewUser }) {
      if (!isNewUser && user.id) {
        // Dar pontos de login diário (máx 1x por dia)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const loginToday = await prisma.activity.findFirst({
          where: {
            userId: user.id,
            type: 'LOGIN',
            createdAt: { gte: today },
          },
        })
        
        if (!loginToday) {
          await prisma.user.update({
            where: { id: user.id },
            data: { points: { increment: 10 } },
          })
          
          await prisma.activity.create({
            data: {
              userId: user.id,
              type: 'LOGIN',
              points: 10,
              description: 'Login diário +10 pontos',
            },
          })
        }
      }
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
}

// Tipos estendidos para TypeScript
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: string
      points: number
    }
  }
  
  interface User {
    role?: string
    points?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: string
    points?: number
  }
}
