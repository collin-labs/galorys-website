# 📬 CENTRAL DE MENSAGENS PROFISSIONAL

Uma central de mensagens completa e profissional para o painel administrativo da Galorys.

## ✨ FUNCIONALIDADES

### 📊 Dashboard de Stats
- **Total** de mensagens
- **Não Lidas** (destaque em azul)
- **Hoje** (mensagens do dia)
- **Esta Semana** (últimos 7 dias)

### 🏷️ Sistema de Etiquetas
Categorize suas mensagens:
- 🔵 **Parceria** - Propostas de parceria
- 🟢 **Patrocínio** - Ofertas de patrocínio
- 🟣 **Imprensa** - Contatos da mídia
- 🟠 **Suporte** - Dúvidas e problemas
- ⚪ **Outro** - Demais assuntos

### 📁 Organização
- **Caixa de Entrada** - Mensagens ativas
- **⭐ Favoritas** - Mensagens marcadas com estrela
- **📦 Arquivadas** - Mensagens arquivadas (preservadas)
- **🗑️ Lixeira** - Mensagens excluídas (30 dias para recuperar)

### 📝 Notas Internas
Adicione anotações em cada mensagem:
- "Ligar amanhã às 14h"
- "Aguardando resposta do marketing"
- "Proposta interessante - verificar budget"

### 🔍 Busca Avançada
Busque por:
- Nome do remetente
- Email
- Assunto
- Conteúdo da mensagem
- Notas internas

### 📤 Ações em Lote
Selecione várias mensagens e aplique ações:
- Marcar como lida/não lida
- Adicionar/remover estrela
- Arquivar
- Mover para lixeira
- Aplicar etiqueta

### 📥 Exportar CSV
Baixe todas as mensagens em formato CSV para backup ou análise.

## 📁 ARQUIVOS INCLUÍDOS

```
CENTRAL-MENSAGENS/
├── LEIA-ME.md
├── app/
│   ├── admin/
│   │   └── mensagens/
│   │       └── page.tsx         # Página completa da Central
│   └── api/
│       └── admin/
│           └── messages/
│               └── route.ts     # API completa
└── prisma/
    └── schema.prisma            # Schema atualizado (modelo Contact)
```

## 🔧 COMO APLICAR

### 1. Backup do banco (IMPORTANTE!)
```bash
# Faça backup antes de aplicar
cp D:\Projetos\Galorys\prisma\dev.db D:\Projetos\Galorys\prisma\dev.db.bak
```

### 2. Copiar arquivos
```bash
# Copie os arquivos para as pastas correspondentes
xcopy /E /Y CENTRAL-MENSAGENS\* D:\Projetos\Galorys\
```

### 3. Atualizar banco de dados
```bash
cd D:\Projetos\Galorys

# Gerar nova migração
npx prisma migrate dev --name add_message_features

# OU apenas sincronizar (desenvolvimento)
npx prisma db push
```

### 4. Reiniciar servidor
```bash
npm run dev
```

## 📋 CAMPOS ADICIONADOS NO MODELO CONTACT

```prisma
model Contact {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String
  message   String
  read      Boolean  @default(false)
  starred   Boolean  @default(false)      # ⭐ NOVO
  archived  Boolean  @default(false)      # 📦 NOVO
  deleted   Boolean  @default(false)      # 🗑️ NOVO
  deletedAt DateTime?                      # NOVO (para lixeira 30 dias)
  label     String?                        # 🏷️ NOVO (etiqueta)
  notes     String?                        # 📝 NOVO (notas internas)
  status    String   @default("unread")    # NOVO (unread/read/replied/archived)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt            # NOVO
}
```

## 🎮 COMO USAR

### Marcar mensagem como favorita
1. Abra a mensagem
2. Clique no ícone ⭐ no topo

### Adicionar etiqueta
1. Abra a mensagem
2. Clique no ícone 🏷️
3. Selecione a etiqueta desejada

### Arquivar mensagem
1. Abra a mensagem
2. Clique no ícone 📦
3. A mensagem vai para "Arquivadas"

### Adicionar notas
1. Abra a mensagem
2. Na seção "Notas internas", clique em "Adicionar nota"
3. Digite sua anotação
4. Clique em "Salvar"

### Ações em lote
1. Marque as checkboxes das mensagens desejadas
2. Use os botões de ação na barra que aparece

### Recuperar da lixeira
1. Vá para "Lixeira"
2. Selecione a mensagem
3. Clique em "Restaurar" (↩️)

### Esvaziar lixeira
1. Vá para "Lixeira"
2. Clique em "Esvaziar Lixeira"
3. Confirme a ação

## ⚠️ OBSERVAÇÕES

- Mensagens na lixeira são automaticamente excluídas após 30 dias
- O campo `updatedAt` é atualizado automaticamente pelo Prisma
- A busca é case-insensitive (ignora maiúsculas/minúsculas)
- As etiquetas são armazenadas como string simples
- As mensagens existentes terão `status: 'unread'` por padrão
