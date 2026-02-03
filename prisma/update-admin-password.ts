// ============================================
// SCRIPT PARA ATUALIZAR SENHA DO ADMIN
// ============================================
// Execute com: npx ts-node prisma/update-admin-password.ts
// Ou: npx tsx prisma/update-admin-password.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Gerar senha forte aleatória
function generateStrongPassword(length: number = 20): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%&*'
  
  const allChars = uppercase + lowercase + numbers + symbols
  let password = ''
  
  // Garantir pelo menos 1 de cada tipo
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // Preencher o resto
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Embaralhar
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

async function updateAdminPassword() {
  console.log('\n========================================')
  console.log('🔐 ATUALIZAÇÃO DE SENHA - GALORYS ADMIN')
  console.log('========================================\n')

  try {
    // Buscar admin
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!admin) {
      console.log('❌ Nenhum usuário admin encontrado!')
      return
    }

    console.log(`📧 Admin encontrado: ${admin.email}`)
    
    // Gerar nova senha
    const newPassword = generateStrongPassword(20)
    
    // Criar hash
    const hash = await bcrypt.hash(newPassword, 12)
    
    // Atualizar no banco
    await prisma.user.update({
      where: { id: admin.id },
      data: { password: hash }
    })

    console.log('\n✅ SENHA ATUALIZADA COM SUCESSO!\n')
    console.log('========================================')
    console.log('📝 GUARDE ESTAS INFORMAÇÕES:')
    console.log('========================================')
    console.log(`   Email: ${admin.email}`)
    console.log(`   Nova Senha: ${newPassword}`)
    console.log('========================================\n')
    console.log('⚠️  IMPORTANTE:')
    console.log('   1. Salve esta senha no gerenciador de senhas')
    console.log('   2. Não compartilhe em canais inseguros')
    console.log('   3. A senha antiga NÃO funciona mais\n')

  } catch (error) {
    console.error('❌ Erro ao atualizar senha:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar
updateAdminPassword()
