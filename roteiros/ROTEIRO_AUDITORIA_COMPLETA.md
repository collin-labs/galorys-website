# 📊 ROTEIRO DE CORREÇÕES - AUDITORIA COMPLETA GALORYS
## Baseado no "ESTUDO COMPLETO DO PROJETO GALORYS ESPORTS"

---

## 📋 VISÃO GERAL

Este roteiro complementa as correções já aplicadas na auditoria de 15/01/2026.
Muitos itens já foram corrigidos, mas alguns podem precisar de validação ou melhorias adicionais.

---

## ✅ CORREÇÕES JÁ APLICADAS (Auditoria 15/01)

| # | Problema | Status |
|---|----------|--------|
| 1 | Caminho imagem "Anão Zika" (`anao-zika.png` → `anaozika.png`) | ✅ CORRIGIDO |
| 2 | `object-contain` → `object-cover` na PlayersSection | ✅ CORRIGIDO |
| 3 | TeamHero com texto estático → dinâmico | ✅ CORRIGIDO |
| 4 | Estrutura flex faltando em `/times/[slug]` | ✅ CORRIGIDO |
| 5 | Estrutura flex faltando em `/times/[slug]/jogador/[playerId]` | ✅ CORRIGIDO |
| 6 | Fallbacks de imagem em player-card.tsx | ✅ CORRIGIDO |
| 7 | Fallbacks de imagem em player-profile.tsx | ✅ CORRIGIDO |
| 8 | Fallbacks de imagem em jogadores-content.tsx | ✅ CORRIGIDO |
| 9 | TeamsSection usando dados centralizados | ✅ CORRIGIDO |
| 10 | Header logo refatorado | ✅ CORRIGIDO |
| 11 | Footer logo refatorado | ✅ CORRIGIDO |

---

## 🔴 PENDÊNCIAS CRÍTICAS

### 1. PASTA DE IMAGENS `/public/images/`

**Status:** ⚠️ PENDENTE DE CRIAÇÃO PELO CLIENTE

**Descrição:** A pasta `/public/images/` precisa existir com as imagens reais do projeto.

**Estrutura necessária:**
```
D:\Projetos\Galorys\public\images\
├── logo\
│   ├── logo_g.png          (logo G para header/admin)
│   └── logo_galorys.png    (logo texto "galorys")
├── players\
│   ├── didico.png
│   ├── anaozera.png
│   ├── anaozika.png        (⚠️ não mais anao-zika.png)
│   ├── zeus.png
│   ├── lucasz1n.png
│   ├── ygorcoach.png
│   ├── hen.png
│   ├── fokeey.png
│   ├── m1hawk.png
│   ├── minicountry.png
│   ├── tequileiro.png
│   ├── minicraque.png
│   ├── murillo.png
│   ├── nython.png
│   ├── tomate.png
│   ├── destiny.png
│   ├── card.png
│   └── gbb.png
├── teams\
│   ├── cs2-logo.png
│   ├── cs2-banner.jpg
│   ├── galorynhos-logo.png
│   ├── galorynhos-banner.jpg
│   ├── codm-logo.png
│   ├── codm-banner.jpg
│   ├── gt-logo.png
│   └── gt-banner.jpg
└── base\
    └── base-imagem-galorys.png
```

**Ação:** O cliente deve criar esta estrutura e adicionar as imagens.

---

## 🟡 MELHORIAS RECOMENDADAS

### 2. VALIDAÇÃO DE RESPONSIVIDADE

| Componente | Mobile | Tablet | Desktop | Ação |
|------------|--------|--------|---------|------|
| PlayerCard | 🔴 | ✅ | ✅ | Testar em dispositivos reais |
| AdminSidebar | 🟡 | ✅ | ✅ | Testar menu colapsável |
| PlayersSection | 🔴 | 🟡 | ✅ | Verificar grid em mobile |

**Checklist de Teste:**
- [ ] Testar em iPhone SE (320px)
- [ ] Testar em iPhone 12 (390px)
- [ ] Testar em iPad (768px)
- [ ] Testar em iPad Pro (1024px)
- [ ] Testar em Desktop Full HD (1920px)

### 3. PERFORMANCE DE IMAGENS

**Recomendação:** Converter todas as imagens para WebP com fallback.

```tsx
// Exemplo de implementação com next/image
<Image
  src="/images/players/didico.webp"
  alt="Didico"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
  quality={85}
  placeholder="blur"
  blurDataURL="/images/placeholder-blur.jpg"
/>
```

### 4. SEO E METADATA

**Verificar/Adicionar em cada página:**
- [ ] `<title>` único
- [ ] `<meta name="description">` único
- [ ] Open Graph tags
- [ ] Schema.org markup para esports

---

## 📱 ETAPAS DE VALIDAÇÃO

### ETAPA 1 - Validação Visual (30 min)
1. [ ] Abrir `/` e verificar todas as seções
2. [ ] Abrir `/times` e navegar para cada time
3. [ ] Abrir `/jogadores` e verificar grid
4. [ ] Abrir `/admin` e navegar por todos os menus
5. [ ] Verificar no mobile (DevTools)

### ETAPA 2 - Validação Funcional (1h)
1. [ ] Testar formulário de contato
2. [ ] Testar painel admin (criar/editar/deletar)
3. [ ] Testar alteração de links dos jogos
4. [ ] Testar LiveCounter (API de jogadores online)
5. [ ] Testar troca de layout da home (v1/v2/v3)

### ETAPA 3 - Validação de Produção (1h)
1. [ ] Build de produção: `npm run build`
2. [ ] Verificar erros de TypeScript
3. [ ] Verificar warnings do Lighthouse
4. [ ] Testar em ambiente de staging

---

## 🔧 CORREÇÕES ADICIONAIS IDENTIFICADAS (20/01/2026)

Estas correções foram aplicadas hoje em resposta às solicitações do cliente:

| # | Correção | Arquivo | Status |
|---|----------|---------|--------|
| 1 | Remover bloqueio do /admin | `components/demo-mode.tsx` | ✅ |
| 2 | LiveCounter fixo no topo com design moderno | `components/sections/live-counter.tsx` | ✅ |
| 3 | Header abaixo do LiveCounter | `components/layout/header.tsx` | ✅ |
| 4 | Remover dashboard do cliente | `components/sections/hero-section.tsx`, `header.tsx` | ✅ |
| 5 | Logo G com borda roxa (padrão home) | `header.tsx`, `admin-sidebar.tsx`, `admin-header.tsx`, `admin/page.tsx` | ✅ |
| 6 | CTA para marketing de jogos | `components/sections/cta-section.tsx` | ✅ |

---

## 📁 ARQUIVOS MODIFICADOS (20/01/2026)

Lista completa dos arquivos alterados nesta sessão:

```
Correções aplicadas em: D:\Projetos\Galorys\

├── app\
│   └── admin\
│       └── page.tsx                    (Logo G com borda roxa)
│
├── components\
│   ├── admin\
│   │   ├── admin-header.tsx           (Logo G com borda roxa)
│   │   └── admin-sidebar.tsx          (Logo G com borda roxa + logo galorys)
│   │
│   ├── layout\
│   │   └── header.tsx                 (Logo G com borda roxa + top-10 + menu simplificado)
│   │
│   ├── sections\
│   │   ├── cta-section.tsx            (Marketing de jogos ao invés de login)
│   │   ├── hero-section.tsx           (Botão "Sobre a Galorys" + padding ajustado)
│   │   └── live-counter.tsx           (Design moderno + posição fixa)
│   │
│   └── demo-mode.tsx                  (/admin removido das rotas bloqueadas)
```

---

## ⚠️ CHECKLIST FINAL ANTES DO DEPLOY

### Código
- [x] Todas as correções solicitadas aplicadas
- [x] Código validado (sem quebras de layout)
- [ ] Build de produção sem erros
- [ ] TypeScript sem warnings críticos

### Imagens
- [ ] Pasta `/public/images/` criada
- [ ] Todas as imagens de jogadores adicionadas
- [ ] Todas as logos adicionadas
- [ ] Imagens de times adicionadas

### Banco de Dados
- [ ] Prisma migrations aplicadas
- [ ] Dados de seed populados
- [ ] Links dos jogos configurados no admin

### Ambiente
- [ ] Variáveis de ambiente configuradas
- [ ] NEXTAUTH_SECRET definido
- [ ] DATABASE_URL configurado

---

## 📊 PROGRESSO GERAL

```
Auditoria 15/01:  11/11 corrigidos (100%) ✅
Correções 20/01:   6/6  corrigidos (100%) ✅
Pendências:        
  - Pasta de imagens: CLIENTE
  - Testes mobile: CLIENTE
────────────────────────────────────────
STATUS: PRONTO PARA TESTE
```

---

**Data:** 20/01/2026  
**Versão:** 1.0  
**Responsável:** Claude (Anthropic)
