import type React from "react"

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Layout limpo sem sidebar/header para a página de login
  return <>{children}</>
}
