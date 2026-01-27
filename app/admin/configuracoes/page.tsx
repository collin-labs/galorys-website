"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Settings,
  Mail,
  Globe,
  Database,
  Shield,
  ArrowLeft,
  ChevronRight,
} from "lucide-react"

const configItems = [
  {
    title: 'Site e SEO',
    description: 'Nome, descrição, palavras-chave, imagens e analytics',
    icon: Globe,
    href: '/admin/configuracoes/site',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20'
  },
  {
    title: 'Segurança',
    description: 'Trocar senha de acesso ao painel',
    icon: Shield,
    href: '/admin/configuracoes/seguranca',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20'
  },
  {
    title: 'Email',
    description: 'Provedor de email, SMTP, recuperação de senha',
    icon: Mail,
    href: '/admin/configuracoes/email',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20'
  },
  {
    title: 'Backup',
    description: 'Backup automático, Google Drive, histórico',
    icon: Database,
    href: '/admin/backup',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20'
  },
]

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Configurações
          </h1>
          <p className="text-sm text-muted-foreground">Gerencie todas as configurações do site</p>
        </div>
      </div>

      {/* Config Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {configItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={item.href}
              className="block p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${item.bgColor}`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-lg font-semibold mt-4">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-muted/50 border border-border rounded-xl p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-yellow-400" />
          Dicas de Segurança
        </h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Troque a senha do admin após o primeiro login</li>
          <li>• Configure um provedor de email para recuperação de senha</li>
          <li>• Ative o backup automático para não perder dados</li>
          <li>• Se usar Vercel, configure o Google Drive para backups</li>
        </ul>
      </div>
    </div>
  )
}
