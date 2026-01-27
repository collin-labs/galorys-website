"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const ADMIN_EMAIL = "contato@galorys.com"

export default function RecuperarSenhaPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: ADMIN_EMAIL })
      })

      if (response.ok) {
        setSent(true)
      } else {
        const data = await response.json()
        setError(data.error || "Erro ao enviar email")
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-galorys-purple/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-galorys-pink/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-galorys-purple to-galorys-pink p-0.5">
                <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                  <Image
                    src="/images/logo/logo_g.png"
                    alt="Galorys"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Galorys</h1>
                <p className="text-xs text-muted-foreground">Painel Administrativo</p>
              </div>
            </div>
          </div>

          {sent ? (
            /* Sucesso */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Email Enviado!</h2>
              <p className="text-muted-foreground text-sm mb-2">
                Enviamos um link de recuperação para:
              </p>
              <p className="text-foreground font-medium mb-6">
                {ADMIN_EMAIL}
              </p>
              <p className="text-muted-foreground text-xs mb-6">
                Verifique também a pasta de spam.
              </p>
              <Link href="/admin/login">
                <Button variant="outline" className="w-full border-border">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para o Login
                </Button>
              </Link>
            </motion.div>
          ) : (
            /* Confirmação */
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Esqueceu a senha?</h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Enviaremos um link de recuperação para:
                </p>
                <p className="text-foreground font-semibold text-lg bg-muted/50 rounded-lg py-2 px-4 inline-block">
                  {ADMIN_EMAIL}
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-galorys-purple to-galorys-pink hover:opacity-90 text-white font-semibold rounded-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Enviar Link de Recuperação
                  </>
                )}
              </Button>

              <div className="mt-6 text-center">
                <Link
                  href="/admin/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para o Login
                </Link>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Galorys eSports
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
