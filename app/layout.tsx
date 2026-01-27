import type React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"
import { DemoProvider } from "@/components/demo-mode"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Galorys eSports | Dominando os eSports",
  description:
    "Organização profissional de eSports. Times de Counter Strike 2, Call of Duty Mobile, Gran Turismo e muito mais. Junte-se à família Galorys!",
  keywords: ["eSports", "Galorys", "Counter Strike", "COD Mobile", "Gran Turismo", "gaming", "times profissionais"],
  authors: [{ name: "Galorys eSports" }],
  openGraph: {
    title: "Galorys eSports",
    description: "Organização profissional de eSports",
    type: "website",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#8B5CF6",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <DemoProvider 
          enabled={true}
          contactEmail="contato@empresa.com"
          contactWhatsApp="5511999999999"
          companyName="Empresa"
        >

            {children}

          </DemoProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
