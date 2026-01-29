import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }
    
    // Validar tipo
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de arquivo não permitido" }, { status: 400 })
    }
    
    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Arquivo muito grande (máx 5MB)" }, { status: 400 })
    }
    
    // Gerar nome único
    const ext = file.name.split(".").pop()
    const fileName = `game-${Date.now()}.${ext}`
    
    // Criar diretório se não existir
    const uploadDir = path.join(process.cwd(), "public", "uploads", "games")
    await mkdir(uploadDir, { recursive: true })
    
    // Salvar arquivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = path.join(uploadDir, fileName)
    
    await writeFile(filePath, buffer)
    
    // Retornar URL pública
    const url = `/uploads/games/${fileName}`
    
    return NextResponse.json({ 
      success: true, 
      url,
      fileName 
    })
  } catch (error) {
    console.error("Erro no upload:", error)
    return NextResponse.json({ error: "Erro ao fazer upload" }, { status: 500 })
  }
}
