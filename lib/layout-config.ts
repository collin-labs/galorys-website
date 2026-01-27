// Layout configuration for home page
export type LayoutVersion = "v1" | "v2" | "v3"

export interface LayoutConfig {
  version: LayoutVersion
  name: string
  description: string
}

export const layoutConfigs: Record<LayoutVersion, LayoutConfig> = {
  v1: {
    version: "v1",
    name: "Layout Clássico",
    description: "Design original com animações suaves e elementos elegantes",
  },
  v2: {
    version: "v2",
    name: "Layout Animado",
    description: "Experiência rica com animações avançadas, carrossel e efeitos visuais impactantes",
  },
  v3: {
    version: "v3",
    name: "Layout Cinematográfico",
    description: "Hero com vídeo de fundo, transições cinematográficas e experiência imersiva",
  },
}

// Default layout - can be changed in admin
export const defaultLayout: LayoutVersion = "v1"
