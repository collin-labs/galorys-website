import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Dados do admin
  const adminEmail = 'contato@galorys.com'
  const adminPassword = 'galorys2024' // Trocar depois!
  const adminName = 'Administrador'

  // Verificar se já existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    console.log('✅ Admin já existe:', existingAdmin.email)
    return
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  // Criar admin
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: adminName,
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date()
    }
  })

  console.log('✅ Admin criado com sucesso!')
  console.log('📧 Email:', admin.email)
  console.log('🔑 Senha:', adminPassword)
  console.log('')
  console.log('⚠️  IMPORTANTE: Troque a senha após o primeiro login!')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao criar admin:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
