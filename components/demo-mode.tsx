// ============================================
// DEMO MODE - VERSÃO DEBUG
// ============================================

"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ⚙️ CONFIGURAÇÃO DAS ROTAS
const BLOCKED_ROUTES: string[] = [
  "/dashboard",
  "/dashboard/recompensas",
  "/dashboard/favoritos",
  "/dashboard/configuracoes",
]

const IMMEDIATE_BLOCK_ROUTES: string[] = [
  // "/admin", // REMOVIDO - Admin agora é acessível
]

// Context
const DemoContext = createContext<{
  isDemoMode: boolean
  showBlockModal: () => void
}>({
  isDemoMode: true,
  showBlockModal: () => {},
})

export const useDemoMode = () => useContext(DemoContext)

interface DemoProviderProps {
  children: React.ReactNode
  enabled?: boolean
  contactEmail?: string
  contactWhatsApp?: string
  companyName?: string
}

export function DemoProvider({ 
  children, 
  enabled = true,
  contactEmail = "contato@empresa.com",
  contactWhatsApp = "5511999999999",
  companyName = "Empresa"
}: DemoProviderProps) {
  const [showModal, setShowModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Debug: Verifica montagem
  useEffect(() => {
    setMounted(true)
    console.log("🎮 ========== DEMO MODE DEBUG ==========")
    console.log("🎮 DemoProvider MONTADO!")
    console.log("🎮 enabled:", enabled)
    console.log("🎮 BLOCKED_ROUTES:", BLOCKED_ROUTES)
    console.log("🎮 IMMEDIATE_BLOCK_ROUTES:", IMMEDIATE_BLOCK_ROUTES)
  }, [])

  // Verifica bloqueio imediato
  useEffect(() => {
    if (!enabled || !mounted) {
      console.log("⏭️ Demo desabilitado ou não montado, pulando...")
      return
    }

    const checkRoute = () => {
      const pathname = window.location.pathname
      console.log("📍 Verificando rota:", pathname)
      
      const shouldBlockImmediately = IMMEDIATE_BLOCK_ROUTES.some(route => {
        const match = pathname === route || pathname.startsWith(route + "/")
        console.log(`   Comparando com "${route}":`, match)
        return match
      })
      
      console.log("🔴 Deve bloquear imediatamente?", shouldBlockImmediately)
      
      if (shouldBlockImmediately) {
        console.log("🚫 BLOQUEANDO ACESSO IMEDIATO!")
        setShowModal(true)
      }
    }

    // Verifica na montagem
    checkRoute()

    // Verifica em mudanças de rota
    const interval = setInterval(checkRoute, 1000) // Verifica a cada segundo
    
    return () => clearInterval(interval)
  }, [enabled, mounted])

  // Intercepta cliques
  useEffect(() => {
    if (!enabled || !mounted) return

    const handleClick = (e: MouseEvent) => {
      const pathname = window.location.pathname
      
      const isBlockedRoute = BLOCKED_ROUTES.some(route => 
        pathname === route || pathname.startsWith(route + "/")
      )

      console.log("🖱️ Clique detectado em:", pathname)
      console.log("🟡 É rota bloqueada?", isBlockedRoute)

      if (isBlockedRoute) {
        const target = e.target as HTMLElement
        console.log("🎯 Elemento clicado:", target.tagName, target.className)
        
        if (target.closest("[data-modal-close]")) {
          console.log("✅ Clique em fechar modal, permitido")
          return
        }
        if (target.closest("[data-demo-allow]")) {
          console.log("✅ Clique em área permitida")
          return
        }

        const isInteractive = 
          target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("select") ||
          target.closest("[role='button']") ||
          target.closest("[onclick]")

        console.log("🔘 É interativo?", !!isInteractive)

        if (isInteractive) {
          console.log("🚫 BLOQUEANDO CLIQUE!")
          e.preventDefault()
          e.stopPropagation()
          e.stopImmediatePropagation()
          setShowModal(true)
          return false
        }
      }
    }

    console.log("👂 Adicionando event listeners...")
    document.addEventListener("click", handleClick, true)
    document.addEventListener("mousedown", handleClick, true)
    
    return () => {
      console.log("🔇 Removendo event listeners...")
      document.removeEventListener("click", handleClick, true)
      document.removeEventListener("mousedown", handleClick, true)
    }
  }, [enabled, mounted])

  // Intercepta navegação para rotas bloqueadas
  useEffect(() => {
    if (!enabled || !mounted) return

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")
      
      if (link) {
        const href = link.getAttribute("href")
        console.log("🔗 Link clicado, href:", href)
        
        if (href) {
          const shouldBlock = IMMEDIATE_BLOCK_ROUTES.some(route => 
            href === route || href.startsWith(route + "/")
          )
          
          console.log("🔴 Link para rota bloqueada?", shouldBlock)
          
          if (shouldBlock) {
            console.log("🚫 BLOQUEANDO NAVEGAÇÃO!")
            e.preventDefault()
            e.stopPropagation()
            setShowModal(true)
          }
        }
      }
    }

    document.addEventListener("click", handleLinkClick, true)
    return () => document.removeEventListener("click", handleLinkClick, true)
  }, [enabled, mounted])

  // Não renderiza nada até montar (evita hydration mismatch)
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <DemoContext.Provider value={{ 
      isDemoMode: enabled, 
      showBlockModal: () => setShowModal(true)
    }}>
      {children}
      
      <AnimatePresence>
        {showModal && (
          <DemoBlockModal 
            onClose={() => setShowModal(false)}
            contactEmail={contactEmail}
            contactWhatsApp={contactWhatsApp}
            companyName={companyName}
          />
        )}
      </AnimatePresence>
    </DemoContext.Provider>
  )
}

function DemoBlockModal({ 
  onClose,
  contactEmail,
  contactWhatsApp,
  companyName
}: { 
  onClose: () => void
  contactEmail: string
  contactWhatsApp: string
  companyName: string
}) {
  console.log("🔴 Modal de bloqueio RENDERIZADO!")
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)'
      }} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
          background: '#1a1a2e',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        {/* Close button */}
        <button
          data-modal-close
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#9ca3af'
          }}
        >
          ✕
        </button>

        {/* Lock icon */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 24px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))',
          border: '1px solid rgba(139,92,246,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px'
        }}>
          🔒
        </div>

        <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          Versão de Demonstração
        </h2>

        <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
          Este recurso está disponível apenas na versão completa.
        </p>

        {/* Features */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <p style={{ color: '#a78bfa', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
            ✨ Na versão completa:
          </p>
          <ul style={{ color: '#d1d5db', fontSize: '14px', listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>• Acesso completo às funcionalidades</li>
            <li style={{ marginBottom: '8px' }}>• Painel administrativo</li>
            <li>• Suporte técnico dedicado</li>
          </ul>
        </div>

        {/* Buttons */}
        <a href={`mailto:${contactEmail}`} data-modal-close style={{ display: 'block', marginBottom: '12px' }}>
          <button style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
            color: 'white',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer'
          }}>
            📧 {contactEmail}
          </button>
        </a>
        
        <a href={`https://wa.me/${contactWhatsApp}`} target="_blank" data-modal-close style={{ display: 'block' }}>
          <button style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            background: 'transparent',
            color: 'white',
            fontWeight: 500,
            border: '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer'
          }}>
            📱 WhatsApp
          </button>
        </a>

        <p style={{ color: '#4b5563', fontSize: '12px', marginTop: '24px' }}>
          © {new Date().getFullYear()} {companyName}
        </p>
      </motion.div>
    </motion.div>
  )
}

export function DemoAllow({ children }: { children: React.ReactNode }) {
  return <div data-demo-allow>{children}</div>
}