"use client"

import { motion } from "framer-motion"
import { Calendar, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MatchesBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-gradient-to-r from-galorys-purple/20 to-galorys-pink/20 border border-galorys-purple/30 p-4 lg:p-6"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-galorys-purple/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-galorys-purple" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Fique ligado nas próximas partidas!</h3>
            <p className="text-sm text-muted-foreground">
              Em breve você poderá acompanhar o calendário de competições dos seus times favoritos.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="border-galorys-purple/50 hover:bg-galorys-purple/20 shrink-0 bg-transparent"
        >
          <Bell className="w-4 h-4 mr-2" />
          Ativar Notificações
        </Button>
      </div>
    </motion.div>
  )
}
