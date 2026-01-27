# 💾 Tutorial: Sistema de Backup - Galorys

## ENTENDENDO O BACKUP

### O que é feito backup?

1. **Banco de dados** (SQLite) - Todos os dados: times, jogadores, notícias, etc.
2. **Imagens** (/public/images) - Logos, fotos, banners, etc.

Tudo é compactado em um arquivo `.zip`

---

## 📍 ONDE O BACKUP É SALVO?

### Cenário 1: Hospedagem VERCEL

```
⚠️ PROBLEMA GRAVE!

Na Vercel, arquivos são TEMPORÁRIOS.
Quando você faz um novo deploy, TUDO É APAGADO!

O backup salvo em /backups/ vai SUMIR.

SOLUÇÃO: Configurar Google Drive ou Amazon S3
```

### Cenário 2: Hospedagem VPS ou Dedicado

```
✅ Arquivos ficam salvos no servidor

O backup fica em: /backups/backup_2026-01-21.zip

MAS: Se o servidor der problema, você perde tudo.

RECOMENDADO: Configurar Google Drive também (cópia extra)
```

---

## ☁️ GOOGLE DRIVE - COMO CONFIGURAR

### ⚠️ NÃO é só colocar um link!

Precisa criar credenciais de API. É chato, mas faz UMA VEZ só.

### O que pedir ao cliente:

```
Para configurar backup automático no Google Drive:

1. Acesse: https://console.cloud.google.com
2. Crie um projeto novo chamado "Backup Galorys"
3. No menu, vá em: APIs e Serviços > Biblioteca
4. Pesquise: "Google Drive API"
5. Clique e depois clique em "ATIVAR"

6. Vá em: APIs e Serviços > Credenciais
7. Clique em: Criar credenciais > Conta de serviço
8. Nome: "backup-galorys"
9. Clique em Criar e Continuar (pode pular permissões)
10. Na lista, clique na conta que criou
11. Vá na aba "Chaves"
12. Clique em: Adicionar chave > Criar nova chave > JSON
13. Vai baixar um arquivo .json - ME ENVIE ESSE ARQUIVO

14. Copie o email que aparece (algo como: backup-galorys@projeto.iam.gserviceaccount.com)

15. No seu Google Drive normal:
    - Crie uma pasta: "Backups Galorys"
    - Clique com botão direito > Compartilhar
    - Cole o email da conta de serviço
    - Dê permissão de "Editor"

16. Me envie:
    - O arquivo JSON que baixou
    - O ID da pasta (está na URL quando abre a pasta)
```

### Como pegar o ID da pasta:

```
Quando você abre a pasta no Drive, a URL fica assim:
https://drive.google.com/drive/folders/1ABCxyz123456789

O ID é: 1ABCxyz123456789
```

---

## 📧 NOTIFICAÇÃO POR EMAIL

### Como funciona:

```
Backup é criado (manual ou automático)
            ↓
Sistema envia email para contato@galorys.com
            ↓
Email mostra:
- ✅ ou ❌ Status (sucesso ou falha)
- 📅 Data e hora
- 📦 Tamanho do backup
- ⏱️ Quanto tempo levou
```

### Por que é importante:

```
Se você recebeu o email = backup funcionou ✅
Se NÃO recebeu o email = algo deu errado ⚠️

Assim o cliente sabe TODO DIA se está protegido!
```

### Onde ativar:

1. Acesse: `/admin/backup`
2. Clique em "Configurar"
3. Ative: "Notificações por Email"
4. O email vai para: contato@galorys.com

**OBS:** Precisa configurar o email primeiro em `/admin/configuracoes/email`

---

## ⏰ BACKUP AUTOMÁTICO

### Como funciona:

| Frequência | Quando roda |
|------------|-------------|
| **Diário** | Todo dia às 3h da manhã |
| **Semanal** | Toda segunda às 3h |
| **Mensal** | Todo dia 1 às 3h |

### Onde ativar:

1. Acesse: `/admin/backup`
2. Clique em "Configurar"
3. Ative: "Backup Automático"
4. Escolha a frequência
5. Salvar

---

## 🔍 VERIFICAÇÃO NO DASHBOARD

Quando entrar no painel admin, aparece um card mostrando:

```
┌─────────────────────────────────────┐
│ 💾 Status do Backup                 │
├─────────────────────────────────────┤
│ Último backup: Hoje (2.4 MB)     ✅ │
│ Automático: Diário               ✅ │
│ Storage: Google Drive            ✅ │
│ Notificação: Ativa               ✅ │
└─────────────────────────────────────┘
```

Ou se tiver problema:

```
┌─────────────────────────────────────┐
│ 💾 Status do Backup                 │
├─────────────────────────────────────┤
│ ⚠️ Último backup: Há 5 dias         │
│ ⚠️ Storage local na Vercel (risco!) │
│ ⚠️ Email não configurado            │
└─────────────────────────────────────┘
```

---

## ✅ CHECKLIST DE SEGURANÇA

Para o cliente estar 100% protegido:

- [ ] Backup automático ATIVO (diário)
- [ ] Google Drive CONFIGURADO
- [ ] Notificação por email ATIVA
- [ ] Email CONFIGURADO (Resend/SendGrid/etc)
- [ ] Testou receber email de backup
- [ ] Testou baixar e abrir o arquivo de backup

---

## 🆘 SE DER PROBLEMA

### "Não está fazendo backup automático"
- Verificar se está ativado em `/admin/backup`
- Na Vercel: precisa configurar Vercel Cron
- No VPS: precisa configurar crontab

### "Backup não está indo pro Google Drive"
- Verificar se as credenciais estão corretas
- Verificar se a pasta foi compartilhada com o email certo

### "Não recebo email de notificação"
- Verificar se email está configurado em `/admin/configuracoes/email`
- Verificar se notificação está ativa em `/admin/backup`
- Verificar pasta de spam

---

## 💰 CUSTOS

| Serviço | Custo |
|---------|-------|
| Google Drive | 15 GB grátis |
| Amazon S3 | ~$0.02/GB/mês |
| Dropbox | 2 GB grátis |

**15 GB do Google Drive gratuito é MUITO para backups!**
