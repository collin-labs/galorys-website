// ============================================
// UTILITÁRIO PARA SERVIR IMAGENS DINÂMICAS
// ============================================
// O Next.js NÃO serve arquivos adicionados ao /public/ depois
// do build em produção. Esta função converte paths estáticos
// para o endpoint /api/files/ que lê do disco em runtime.
//
// Exemplos:
//   getImageUrl('/images/players/didico.png')
//   → '/api/files/images/players/didico.png'
//
//   getImageUrl('/api/files/images/players/foto.png')
//   → '/api/files/images/players/foto.png' (já convertido)
//
//   getImageUrl(null)
//   → '' (fallback vazio)
// ============================================

export function getImageUrl(path: string | null | undefined): string {
  if (!path || path.trim() === '') return ''

  // Se já está no formato /api/files/, retornar como está
  if (path.startsWith('/api/files/')) return path

  // Se é URL externa (http/https), retornar como está
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  // Se começa com /images/ ou /uploads/, converter para /api/files/
  if (path.startsWith('/')) {
    return `/api/files${path}`
  }

  // Fallback: adicionar / e converter
  return `/api/files/${path}`
}
