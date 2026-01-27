# 🚀 Backblaze B2 - Instalação COMPLETA

## 📁 Arquivos para SUBSTITUIR

```
galorys-backblaze-b2/
├── lib/
│   └── backblaze-b2.ts              → COPIAR para: lib/
├── app/
│   ├── admin/
│   │   └── backup/
│   │       └── page.tsx             → SUBSTITUIR: app/admin/backup/page.tsx  ⭐ IMPORTANTE!
│   └── api/
│       └── admin/
│           └── backup/
│               └── create/
│                   └── route.ts     → SUBSTITUIR: app/api/admin/backup/create/route.ts
├── doctos/
│   └── TUTORIAL-BACKUP-BACKBLAZE-B2.md
└── .env.example                     → Conteúdo vai para seu .env
```

## ⚡ Passo a Passo

### 1. SUBSTITUIR arquivos
- `lib/backblaze-b2.ts` → Copiar para sua pasta lib/
- `app/admin/backup/page.tsx` → **SUBSTITUIR** o existente (remove Google Drive do dropdown!)
- `app/api/admin/backup/create/route.ts` → **SUBSTITUIR** o existente

### 2. Adicionar no .env
Cole no final do seu arquivo `.env`:

```
BACKBLAZE_KEY_ID=ad30bb96e844
BACKBLAZE_APP_KEY=0052b3715925bbda3458c445f6e2182ff8c6e3d334
BACKBLAZE_BUCKET_ID=7a1df3f03bfbf9869eb80414
BACKBLAZE_BUCKET_NAME=galorys-backups
```

### 3. Instalar dependência (se não tiver)
```bash
npm install backblaze-b2
```

### 4. Reiniciar o servidor
```bash
npm run dev
```

### 5. Ativar no Admin
1. Acesse `/admin/backup`
2. Clique em ⚙️ **Configurações**
3. Em Armazenamento → Selecione **"Backblaze B2"**
4. Clique em **Salvar**

### 6. Testar
Clique em "Criar Backup" - deve aparecer nos logs:
```
✅ Upload para Backblaze B2 concluído
```

---

## ✅ O que muda

| Antes | Depois |
|-------|--------|
| Dropdown: Local, Google Drive | Dropdown: Local, **Backblaze B2** |
| Google Drive não funcionava | Backblaze B2 funciona 100% |

---

**Pronto!** Seus backups vão para a nuvem automaticamente.
