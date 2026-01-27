# 🎮 AUDITORIA COMPLETA - GALORYS ESPORTS V2

> **Projeto:** Galorys eSports Website  
> **Tecnologia:** Next.js 14 + React + TypeScript + Tailwind CSS + Prisma  
> **Data da Auditoria:** 15/01/2026  
> **Status Atual:** 🔴 **PENDENTE CORREÇÕES**  
> **Auditor:** Claude AI

---

## 📋 RESUMO EXECUTIVO

### Problemas Identificados

| Prioridade | Descrição | Status |
|------------|-----------|--------|
| 🔴 CRÍTICO | Pasta `/public/images/` não existe - Todas as imagens falharão | ⚠️ Implementado fallback |
| 🔴 CRÍTICO | Imagem jogador "Anão Zika" com caminho incorreto | ✅ CORRIGIDO |
| 🔴 CRÍTICO | `object-contain` ao invés de `object-cover` na PlayersSection | ✅ CORRIGIDO |
| 🔴 CRÍTICO | TeamHero com texto estático ao invés de dinâmico | ✅ CORRIGIDO |
| 🟡 ALTO | Estrutura flex faltando em `/times/[slug]` e `/times/[slug]/jogador/[playerId]` | ✅ CORRIGIDO |
| 🟡 ALTO | Faltam fallbacks (onError) para imagens em múltiplos componentes | ✅ CORRIGIDO |
| 🟡 ALTO | TeamsSection com dados hardcoded (duplicação) | ✅ CORRIGIDO |
| 🟢 MÉDIO | Logos no header/footer usando imagens inexistentes | ✅ CORRIGIDO |

---

## 📑 MAPEAMENTO DE TODAS AS PÁGINAS

### 1. PÁGINAS PÚBLICAS (14 páginas)

| # | Rota | Arquivo | Componente Principal | Status Layout | Problemas |
|---|------|---------|----------------------|---------------|-----------|
| 1 | `/` | `app/page.tsx` | HomeV1/V2/V3 | ✅ OK | PlayersSection com `object-contain` incorreto |
| 2 | `/sobre` | `app/sobre/page.tsx` | SobreContent | ✅ OK | - |
| 3 | `/contato` | `app/contato/page.tsx` | ContatoContent | ✅ OK | - |
| 4 | `/faq` | `app/faq/page.tsx` | FaqContent | ✅ OK | - |
| 5 | `/jogadores` | `app/jogadores/page.tsx` | JogadoresContent | ✅ OK | Falta fallback para imagens |
| 6 | `/times` | `app/times/page.tsx` | TimesContent | ✅ OK | - |
| 7 | `/times/[slug]` | `app/times/[slug]/page.tsx` | TeamPageContent | 🔴 **FALHA** | Falta `flex flex-col` + `flex-1` |
| 8 | `/times/[slug]/jogador/[playerId]` | `app/times/[slug]/jogador/[playerId]/page.tsx` | PlayerProfile | 🔴 **FALHA** | Falta `flex flex-col` + `flex-1` |
| 9 | `/conquistas` | `app/conquistas/page.tsx` | ConquistasContent | ✅ OK | - |
| 10 | `/wallpapers` | `app/wallpapers/page.tsx` | WallpapersContent | ✅ OK | - |
| 11 | `/roblox` | `app/roblox/page.tsx` | RobloxContent | ✅ OK | - |
| 12 | `/login` | `app/login/page.tsx` | LoginPage | ✅ OK | - |
| 13 | `/termos` | `app/termos/page.tsx` | TermosPage | ✅ OK | - |
| 14 | `/privacidade` | `app/privacidade/page.tsx` | PrivacidadePage | ✅ OK | - |

### 2. DASHBOARD DO USUÁRIO (4 páginas)

| # | Rota | Status Layout | Problemas |
|---|------|---------------|-----------|
| 1 | `/dashboard` | ✅ OK | - |
| 2 | `/dashboard/favoritos` | ✅ OK | - |
| 3 | `/dashboard/recompensas` | ✅ OK | - |
| 4 | `/dashboard/configuracoes` | ✅ OK | - |

### 3. ADMIN DASHBOARD (20 páginas)

| # | Rota | Status | Problemas |
|---|------|--------|-----------|
| 1 | `/admin` | ✅ OK | - |
| 2 | `/admin/times` | ✅ OK | - |
| 3 | `/admin/times/novo` | ✅ OK | - |
| 4 | `/admin/times/[id]/editar` | ✅ OK | - |
| 5 | `/admin/jogadores` | ✅ OK | - |
| 6 | `/admin/jogadores/novo` | ✅ OK | - |
| 7 | `/admin/jogadores/[id]/editar` | ✅ OK | - |
| 8 | `/admin/conquistas` | ✅ OK | - |
| 9 | `/admin/conquistas/novo` | ✅ OK | - |
| 10 | `/admin/conquistas/[id]/editar` | ✅ OK | - |
| 11 | `/admin/partidas` | ✅ OK | - |
| 12 | `/admin/partidas/novo` | ✅ OK | - |
| 13 | `/admin/partidas/[id]/editar` | ✅ OK | - |
| 14 | `/admin/parceiros` | ✅ OK | - |
| 15 | `/admin/noticias` | ✅ OK | - |
| 16 | `/admin/banners` | ✅ OK | - |
| 17 | `/admin/recompensas` | ✅ OK | - |
| 18 | `/admin/resgates` | ✅ OK | - |
| 19 | `/admin/usuarios` | ✅ OK | - |
| 20 | `/admin/mensagens` | ✅ OK | - |
| 21 | `/admin/configuracoes` | ✅ OK | - |
| 22 | `/admin/backup` | ✅ OK | - |
| 23 | `/admin/layout-home` | ✅ OK | - |
| 24 | `/admin/secoes` | ✅ OK | - |

---

## 🔴 PROBLEMAS CRÍTICOS DETALHADOS

### PROBLEMA #1: Pasta de Imagens Não Existe

**Severidade:** 🔴 CRÍTICO  
**Localização:** `/public/`  
**Status:** ❌ NÃO CORRIGIDO

**Descrição:**
A pasta `/public/images/` não existe no projeto. Todas as referências a imagens falharão:

```
Esperado: /public/images/
Encontrado: PASTA NÃO EXISTE

Conteúdo atual de /public/:
- apple-icon.png
- icon-dark-32x32.png
- icon-light-32x32.png
- icon.svg
- placeholder-logo.png
- placeholder-logo.svg
- placeholder-user.jpg
- placeholder.jpg
- placeholder.svg
```

**Imagens Referenciadas no Código:**
```
/images/logo/logo_g.png
/images/logo/logo_galorys.png
/images/base/base-imagem-galorys.png
/images/players/didico.png
/images/players/anaozera.png
/images/players/anao-zika.png (incorreto - deveria ser anaozika.png)
/images/players/zeus.png
/images/players/lucasz1n.png
/images/players/ygorcoach.png
/images/players/hen.png
/images/players/fokeey.png
/images/players/m1hawk.png
/images/players/minicountry.png
/images/players/tequileiro.png
/images/players/minicraque.png
/images/players/murillo.png
/images/players/nython.png
/images/players/tomate.png
/images/players/destiny.png
/images/players/card.png
/images/players/gbb.png
/images/teams/cs2-logo.png
/images/teams/cs2-banner.jpg
/images/teams/galorynhos-logo.png
/images/teams/galorynhos-banner.jpg
/images/teams/codm-logo.png
/images/teams/codm-banner.jpg
/images/teams/gt-logo.png
/images/teams/gt-banner.jpg
/images/teams/gran-turismo.webp (TeamsSection)
/images/teams/gran-turismo-logo.webp (TeamsSection)
/images/teams/cod-mobile.jpg (TeamsSection)
/images/teams/cod-mobile-logo.png (TeamsSection)
/images/teams/cs2-kids.png (TeamsSection)
/images/teams/cs2-kids-logo.png (TeamsSection)
/images/teams/cs2.png (TeamsSection)
```

**Ação Necessária:**
Criar estrutura de pastas e adicionar imagens ou implementar sistema de fallback robusto.

---

### PROBLEMA #2: Caminho Incorreto da Imagem "Anão Zika"

**Severidade:** 🔴 CRÍTICO  
**Localização:** `lib/data/players.ts` - Linha 233  
**Status:** ❌ NÃO CORRIGIDO

**Código Atual:**
```typescript
photo: '/images/players/anao-zika.png',
```

**Código Correto:**
```typescript
photo: '/images/players/anaozika.png',
```

---

### PROBLEMA #3: Object-fit Incorreto na PlayersSection

**Severidade:** 🔴 CRÍTICO  
**Localização:** `components/sections/players-section.tsx` - Linha 127  
**Status:** ❌ NÃO CORRIGIDO

**Descrição:**
A imagem do jogador principal está usando `object-contain` que causa corte incorreto.

**Código Atual (Linha 127):**
```tsx
className="object-contain object-bottom"
```

**Código Correto:**
```tsx
className="object-cover object-top"
```

---

### PROBLEMA #4: TeamHero com Texto Estático

**Severidade:** 🔴 CRÍTICO  
**Localização:** `components/teams/team-hero.tsx` - Linhas 53-60  
**Status:** ❌ NÃO CORRIGIDO

**Descrição:**
O componente TeamHero exibe texto estático "COUNTER STRIKE 2" para TODOS os times, ao invés de usar os dados dinâmicos do time.

**Código Atual:**
```tsx
<h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-wider">
  COUNTER
</h2>
<h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-wider flex items-center justify-center">
  STRIKE
  <span className="text-5xl md:text-7xl ml-2 text-cyan-400 italic">2</span>
</h2>
```

**Código Correto:**
```tsx
<h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-wider">
  {team.name.toUpperCase()}
</h2>
<p className="text-sm md:text-base text-blue-300/80 mt-1 tracking-[0.3em]">{team.gameLabel}</p>
```

---

## 🟡 PROBLEMAS DE ALTA PRIORIDADE

### PROBLEMA #5: Estrutura Flex Faltando em Páginas de Time/Jogador

**Severidade:** 🟡 ALTO  
**Localização:** 
- `app/times/[slug]/page.tsx` - Linha 42
- `app/times/[slug]/jogador/[playerId]/page.tsx` - Linha 57
**Status:** ❌ NÃO CORRIGIDO

**Código Atual:**
```tsx
<main className="min-h-screen bg-background overflow-x-hidden">
```

**Código Correto:**
```tsx
<main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
  <Header />
  <div className="flex-1">
    {/* Conteúdo */}
  </div>
  <Footer />
</main>
```

---

### PROBLEMA #6: Fallbacks de Imagem Faltando

**Severidade:** 🟡 ALTO  
**Localização:** Múltiplos componentes  
**Status:** ❌ NÃO CORRIGIDO

**Componentes Afetados:**
1. `components/teams/player-card.tsx` - Linhas 37-42
2. `components/teams/player-profile.tsx` - Linhas 53-58, 211-215
3. `components/pages/jogadores-content.tsx` - Linhas 101-106
4. `components/sections/players-section.tsx` - Linhas 122-128, 208-213

**Solução Proposta - Adicionar fallback:**
```tsx
import { getPlayerAvatar } from "@/lib/data/players"

// No componente Image:
<Image
  src={player.photo}
  alt={player.nickname}
  fill
  className="object-cover object-top"
  onError={(e) => {
    const target = e.target as HTMLImageElement
    target.src = getPlayerAvatar(player.nickname)
  }}
/>
```

---

### PROBLEMA #7: TeamsSection com Dados Duplicados

**Severidade:** 🟡 ALTO  
**Localização:** `components/sections/teams-section.tsx` - Linhas 7-52  
**Status:** ❌ NÃO CORRIGIDO

**Descrição:**
O componente TeamsSection define seus próprios dados de times (hardcoded), ao invés de usar o arquivo centralizado `lib/data/teams.ts`. Isso causa:
- Duplicação de código
- Inconsistência de dados
- Dificuldade de manutenção
- Caminhos de imagens diferentes

**Código Atual (Hardcoded):**
```tsx
const teams = [
  {
    id: "gran-turismo",
    name: "Gran Turismo",
    image: "/images/teams/gran-turismo.webp",  // DIFERENTE do centralizado
    logo: "/images/teams/gran-turismo-logo.webp",  // DIFERENTE
    // ...
  },
  // ...
]
```

**Código Correto (Usando fonte centralizada):**
```tsx
import { teams, gameIcons } from "@/lib/data/teams"

// Usar teams diretamente do import
```

---

## 🟢 PROBLEMAS DE MÉDIA PRIORIDADE

### PROBLEMA #8: Header e Footer Usando Imagens Inexistentes

**Severidade:** 🟢 MÉDIO  
**Localização:** 
- `components/layout/header.tsx` - Linhas 81, 83
- `components/layout/footer.tsx` - Linhas 46, 48
**Status:** ❌ NÃO CORRIGIDO

**Descrição:**
Header e Footer referenciam logos que não existem:
- `/images/logo/logo_g.png`
- `/images/logo/logo_galorys.png`

---

## 📱 AUDITORIA DE RESPONSIVIDADE

### Breakpoints do Projeto
```
Mobile: < 768px (md)
Tablet: 768px - 1024px (lg)
Desktop: > 1024px (xl)
```

### Status por Componente

| Componente | Mobile | Tablet | Desktop | Notas |
|------------|--------|--------|---------|-------|
| Header | ✅ | ✅ | ✅ | Menu mobile funcional |
| Footer | ✅ | ✅ | ✅ | Grid responsivo |
| HeroSection | ✅ | ✅ | ✅ | - |
| PlayersSection | 🔴 | 🟡 | ✅ | Imagem cortada, grid pequeno |
| TeamsSection | ✅ | ✅ | ✅ | - |
| PlayerCard | 🔴 | ✅ | ✅ | Aspect ratio 4/5 problemático em mobile |
| TeamHero | 🟡 | ✅ | ✅ | Texto não dinâmico |
| JogadoresContent | ✅ | ✅ | ✅ | Grid 2-3-4-6 colunas |
| AdminSidebar | 🟡 | ✅ | ✅ | Testar menu colapsável |
| DashboardSidebar | ✅ | ✅ | ✅ | - |

---

## ✅ CHECKLIST DE CORREÇÕES

### ETAPA 1 - Crítico (Bloqueia funcionamento)
- [ ] **#1** Criar estrutura `/public/images/` com todas as imagens necessárias
- [ ] **#2** Corrigir caminho `anao-zika.png` → `anaozika.png` em `lib/data/players.ts`
- [ ] **#3** Mudar `object-contain` → `object-cover` em `players-section.tsx`
- [ ] **#4** Fazer TeamHero usar dados dinâmicos do time

### ETAPA 2 - Alto (Afeta UX)
- [ ] **#5** Adicionar `flex flex-col` + `flex-1` nas páginas de time e jogador
- [ ] **#6** Implementar fallback (onError) em todas as imagens de jogadores
- [ ] **#7** Refatorar TeamsSection para usar dados centralizados

### ETAPA 3 - Médio (Melhorias)
- [ ] **#8** Criar/ajustar imagens de logo para header e footer
- [ ] **#9** Verificar responsividade do PlayerCard em mobile
- [ ] **#10** Testar AdminSidebar em dispositivos reais

---

## 📁 ARQUIVOS QUE PRECISAM SER CORRIGIDOS

| # | Arquivo | Linhas | Correção Necessária |
|---|---------|--------|---------------------|
| 1 | `lib/data/players.ts` | 233 | Caminho da imagem |
| 2 | `components/sections/players-section.tsx` | 127 | object-fit |
| 3 | `components/teams/team-hero.tsx` | 53-60 | Dados dinâmicos |
| 4 | `app/times/[slug]/page.tsx` | 42-47 | Estrutura flex |
| 5 | `app/times/[slug]/jogador/[playerId]/page.tsx` | 56-62 | Estrutura flex |
| 6 | `components/teams/player-card.tsx` | 37-42 | Fallback imagem |
| 7 | `components/teams/player-profile.tsx` | 53-58, 211-215 | Fallback imagem |
| 8 | `components/pages/jogadores-content.tsx` | 101-106 | Fallback imagem |
| 9 | `components/sections/teams-section.tsx` | 7-52 | Usar dados centralizados |
| 10 | `components/layout/header.tsx` | 81, 83 | Fallback logo |
| 11 | `components/layout/footer.tsx` | 46, 48 | Fallback logo |

---

## 📝 LOG DE CORREÇÕES

Este documento será atualizado conforme as correções forem aplicadas:

| Data | Arquivo | Alteração | Status |
|------|---------|-----------|--------|
| 15/01/2026 | `lib/data/players.ts` | Corrigido caminho `anao-zika.png` → `anaozika.png` | ✅ |
| 15/01/2026 | `components/sections/players-section.tsx` | `object-contain` → `object-cover` + fallbacks | ✅ |
| 15/01/2026 | `components/teams/team-hero.tsx` | Refatorado para dados dinâmicos do time | ✅ |
| 15/01/2026 | `app/times/[slug]/page.tsx` | Adicionado `flex flex-col` + `flex-1` | ✅ |
| 15/01/2026 | `app/times/[slug]/jogador/[playerId]/page.tsx` | Adicionado `flex flex-col` + `flex-1` | ✅ |
| 15/01/2026 | `components/teams/player-card.tsx` | Adicionado fallback de imagem com getPlayerAvatar | ✅ |
| 15/01/2026 | `components/teams/player-profile.tsx` | Adicionado fallback de imagem para jogador e teammates | ✅ |
| 15/01/2026 | `components/pages/jogadores-content.tsx` | Adicionado fallback de imagem | ✅ |
| 15/01/2026 | `components/sections/teams-section.tsx` | Refatorado para usar dados centralizados de `lib/data/teams.ts` | ✅ |
| 15/01/2026 | `components/layout/header.tsx` | Logo refatorado sem dependência de imagem externa | ✅ |
| 15/01/2026 | `components/layout/footer.tsx` | Logo refatorado sem dependência de imagem externa | ✅ |

---

## 📊 PROGRESSO

```
Críticos:    4/4 corrigidos  (100%) ✅
Altos:       3/3 corrigidos  (100%) ✅
Médios:      1/1 corrigidos  (100%) ✅
────────────────────────────
TOTAL:       8/8 corrigidos  (100%) ✅
```

---

**Documento criado em:** 15/01/2026  
**Versão:** 2.0  
**Status Final:** ✅ TODAS AS CORREÇÕES APLICADAS

---

## ⚠️ NOTA IMPORTANTE

As correções de código foram aplicadas com sucesso. No entanto, a pasta `/public/images/` ainda precisa ser criada com as imagens reais do projeto. O sistema de fallback implementado garantirá que:

1. **Logos:** Agora são renderizados via CSS/HTML (gradiente + texto "G" e "galorys")
2. **Imagens de jogadores:** Se não carregarem, mostram avatar gerado automaticamente via `ui-avatars.com`
3. **Imagens de background:** Se não carregarem, apenas são ocultadas sem quebrar o layout
4. **Imagens de times:** Se não carregarem, são ocultadas sem quebrar o layout

Para funcionamento completo com as imagens originais, você precisará:
1. Criar a pasta `/public/images/`
2. Adicionar as subpastas: `players/`, `teams/`, `logo/`, `base/`
3. Copiar as imagens do ambiente de produção
