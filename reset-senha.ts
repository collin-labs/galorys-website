import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('123', 10)
  await prisma.user.update({
    where: { email: 'contato@galorys.com' },
    data: { password: hash }
  })
  console.log('✅ Senha resetada para 123')
  await prisma.$disconnect()
}

main()
