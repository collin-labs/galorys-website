# 📧 Tutorial: Configuração de Email - Galorys

## O que é isso?

O sistema de email permite:
- ✅ **Recuperação de senha** do admin
- ✅ **Notificações de backup** (email diário confirmando que backup foi feito)
- 🔮 Futuramente: notificações de contato, newsletter, etc.

---

## 🎯 O QUE PEDIR AO CLIENTE

### Opção 1: Resend (RECOMENDADO)

**Mensagem para enviar ao cliente:**

```
Olá!

Para configurar o sistema de emails do site (recuperação de senha 
e notificações), preciso que você crie uma conta no Resend:

1. Acesse: https://resend.com
2. Clique em "Start for free" 
3. Faça login (pode usar Google)
4. No menu lateral, clique em "API Keys"
5. Clique em "Create API Key"
6. Nome: "Galorys"
7. Copie a chave que aparecer (começa com "re_")
8. Me envie essa chave

É gratuito e permite 3.000 emails por mês!

Qualquer dúvida, me avise.
```

---

### Opção 2: Gmail do cliente

**Mensagem para enviar ao cliente:**

```
Olá!

Para usar seu Gmail para enviar emails do site:

1. Acesse: https://myaccount.google.com
2. Vá em "Segurança"
3. Ative "Verificação em duas etapas" (obrigatório)
4. Depois, procure "Senhas de app"
5. Clique em "Outro (nome personalizado)"
6. Digite: "Galorys Site"
7. Clique em "Gerar"
8. Vai aparecer uma senha de 16 letras
9. Me envie:
   - Seu email: xxx@gmail.com
   - A senha de app: xxxx xxxx xxxx xxxx

IMPORTANTE: NÃO é a senha normal do Gmail!
É uma senha especial só para isso.
```

---

### Opção 3: Email da Hostinger

**Mensagem para enviar ao cliente:**

```
Se você já tem email na Hostinger (tipo contato@galorys.com),
me envie:

- Email: contato@galorys.com  
- Senha: (a senha desse email)

Eu configuro o resto!
```

---

## ⚙️ COMO CONFIGURAR NO PAINEL

Depois de receber os dados do cliente:

1. Acesse: `seusite.com/admin/configuracoes/email`
2. Escolha o provedor (Resend, SendGrid, ou SMTP)
3. Preencha os dados
4. Em "Email de Envio", coloque: `noreply@galorys.com` ou `contato@galorys.com`
5. Clique em **"Enviar Teste"**
6. Verifique se chegou no email
7. Se funcionou, clique em **"Salvar"**

---

## 💰 CUSTOS

| Provedor | Gratuito | Observação |
|----------|----------|------------|
| **Resend** | 3.000/mês | ⭐ Recomendado |
| **SendGrid** | 100/dia | Bom também |
| **Gmail** | 500/dia | Pode ir pro spam |
| **Hostinger** | Ilimitado | Se já tem email lá |

---

## ❓ PROBLEMAS COMUNS

| Problema | Solução |
|----------|---------|
| Email não chega | Verificar pasta Spam |
| Erro de autenticação | API Key ou senha errada |
| Gmail bloqueando | Usar "Senha de App", não a senha normal |
| Vai pro spam | Configurar domínio no Resend |
