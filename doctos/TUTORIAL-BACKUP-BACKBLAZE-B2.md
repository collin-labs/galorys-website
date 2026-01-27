# 🚀 Tutorial: Configurar Backblaze B2 para Backup na Nuvem

## 📋 Por que Backblaze B2?

| Vantagem | Descrição |
|----------|-----------|
| ✅ **10GB Grátis** | Primeiros 10GB de storage são 100% gratuitos |
| ✅ **Upload Grátis** | Não cobra para enviar arquivos |
| ✅ **API Key Simples** | Não expira (diferente do Google Drive/Dropbox) |
| ✅ **Funciona com Gmail** | Não precisa de conta empresarial |
| ✅ **Confiável** | Empresa pública (BLZE), +1 exabyte de dados |

---

## 🔧 Passo a Passo

### 1️⃣ Criar Conta no Backblaze

1. Acesse: https://www.backblaze.com/sign-up/cloud-storage
2. Preencha email e senha
3. Confirme o email
4. **Não precisa de cartão de crédito** para os 10GB grátis!

---

### 2️⃣ Criar um Bucket

1. No painel, clique em **"B2 Cloud Storage"** no menu lateral
2. Clique em **"Buckets"**
3. Clique em **"Create a Bucket"**
4. Configure:
   - **Bucket Unique Name:** `galorys-backups` (ou outro nome único)
   - **Files in Bucket are:** `Private` (recomendado)
   - **Default Encryption:** `Disable` (opcional)
   - **Object Lock:** `Disable`
5. Clique em **"Create a Bucket"**
6. **ANOTE o Bucket ID** - você vai precisar dele!

> 💡 O Bucket ID aparece na lista de buckets, ex: `4a8b2c3d4e5f6g7h8`

---

### 3️⃣ Criar Application Key

1. No menu lateral, clique em **"Application Keys"**
2. Clique em **"Add a New Application Key"**
3. Configure:
   - **Name of Key:** `galorys-backup-key`
   - **Allow access to Bucket(s):** Selecione `galorys-backups`
   - **Type of Access:** `Read and Write`
   - **Allow List All Bucket Names:** ✅ Marcar
   - **File name prefix:** deixe vazio
   - **Duration:** deixe vazio (não expira)
4. Clique em **"Create New Key"**
5. **COPIE IMEDIATAMENTE:**
   - `keyID` - Ex: `0054a8b2c3d4e5f0000000001`
   - `applicationKey` - Ex: `K005xYzAbCdEfGhIjKlMnOpQrStUvWx`

⚠️ **IMPORTANTE:** A `applicationKey` só aparece UMA VEZ! Se perder, precisa criar outra.

---

### 4️⃣ Configurar no Projeto (.env)

Adicione estas variáveis no seu arquivo `.env`:

```env
# ===== BACKBLAZE B2 =====
BACKBLAZE_KEY_ID=seu_key_id_aqui
BACKBLAZE_APP_KEY=sua_application_key_aqui
BACKBLAZE_BUCKET_ID=seu_bucket_id_aqui
BACKBLAZE_BUCKET_NAME=galorys-backups
```

**Exemplo preenchido:**
```env
BACKBLAZE_KEY_ID=0054a8b2c3d4e5f0000000001
BACKBLAZE_APP_KEY=K005xYzAbCdEfGhIjKlMnOpQrStUvWx
BACKBLAZE_BUCKET_ID=4a8b2c3d4e5f6g7h8
BACKBLAZE_BUCKET_NAME=galorys-backups
```

---

### 5️⃣ Ativar no Sistema de Backup

1. Acesse o painel admin: `/admin/backup`
2. Clique no ícone de ⚙️ (Configurações)
3. Em **"Armazenamento"**, selecione **"Backblaze B2"**
4. Clique em **"Salvar"**
5. Teste criando um backup manual!

---

## ✅ Verificação

Após criar um backup, você deve ver nos logs:

```
--- Upload para Backblaze B2 ---
Enviando: backup_2026-01-26T03-00-00-000Z.zip
Para bucket: galorys-backups
📤 Enviando para Backblaze B2: backup_2026-01-26T03-00-00-000Z.zip (450.5 KB)
✅ Upload para Backblaze B2 concluído
   FileId: 4_z4a8b2c3d4e5f6g7h8_f1234567890_d20260126_m030000_c000_v0001013_t0020
   URL: https://f005.backblazeb2.com/file/galorys-backups/backup_2026-01-26T03-00-00-000Z.zip
```

---

## 💰 Preços (caso exceda 10GB)

| Item | Preço |
|------|-------|
| Storage | $0.006/GB/mês (~R$0,03) |
| Upload | **GRÁTIS** |
| Download | $0.01/GB |
| Primeiros 10GB | **GRÁTIS** |

Para o Galorys (backups de ~500KB), você pode guardar **~20.000 backups** antes de pagar qualquer coisa!

---

## 🔒 Segurança

- ✅ Arquivos são criptografados em trânsito (HTTPS)
- ✅ Bucket configurado como **Private** (não acessível publicamente)
- ✅ Application Key com permissões limitadas ao bucket específico
- ✅ Dados armazenados em data centers nos EUA/EU

---

## ❓ Troubleshooting

### Erro: "Unauthorized"
- Verifique se o `BACKBLAZE_KEY_ID` e `BACKBLAZE_APP_KEY` estão corretos
- A applicationKey pode ter sido copiada incorretamente (caracteres especiais)

### Erro: "Bucket not found"
- Verifique se o `BACKBLAZE_BUCKET_ID` está correto
- O Bucket ID é diferente do Bucket Name!

### Erro: "Key does not have access"
- Ao criar a Application Key, você selecionou o bucket correto?
- Marcou "Allow List All Bucket Names"?

---

## 📞 Suporte

- Documentação Backblaze: https://www.backblaze.com/docs/cloud-storage
- Status do serviço: https://status.backblaze.com/

---

**Última atualização:** Janeiro 2026
