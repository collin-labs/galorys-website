# 🚀 GALORYS - TUTORIAL DE SCRIPTS

## Guia Completo para Desenvolvimento Local

---

## 📁 Estrutura dos Scripts

Coloque todos os arquivos `.bat` na **raiz do projeto**:

```
D:\Projetos\Galorys\
├── 🟢 SETUP.bat        ← Setup inicial completo
├── 🔵 DEV.bat          ← Rodar servidor dev
├── 🟡 STUDIO.bat       ← Gerenciar banco de dados
├── 🟣 BUILD.bat        ← Gerar build produção
├── 🔴 RESET-DB.bat     ← Resetar banco (cuidado!)
├── app/
├── components/
├── public/
└── ...
```

---

## 🟢 SETUP.bat - Configuração Inicial

### Quando usar?
- **Primeira vez** clonando/extraindo o projeto
- Após **atualizar** o projeto com novos pacotes
- Quando der erro de dependências

### O que faz?
1. `npm install` - Instala todas as dependências
2. `npx prisma generate` - Gera o cliente do banco
3. `npx prisma db push` - Cria/atualiza as tabelas
4. Cria `.env.local` se não existir
5. Inicia o servidor de desenvolvimento

### Como usar?
```
Duplo clique em SETUP.bat
```

### Código completo:
```batch
@echo off
title Galorys - Setup do Projeto
color 0A

echo.
echo ========================================
echo     GALORYS ESPORTS - SETUP
echo ========================================
echo.

echo [1/5] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)
echo OK!
echo.

echo [2/5] Gerando cliente Prisma...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERRO: Falha ao gerar Prisma!
    pause
    exit /b 1
)
echo OK!
echo.

echo [3/5] Sincronizando banco de dados...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ERRO: Falha ao sincronizar banco!
    pause
    exit /b 1
)
echo OK!
echo.

echo [4/5] Verificando .env.local...
if not exist .env.local (
    echo Criando .env.local...
    (
        echo DATABASE_URL="file:./dev.db"
        echo NEXTAUTH_SECRET="galorys-secret-key-change-in-production"
        echo NEXTAUTH_URL="http://localhost:3000"
    ) > .env.local
    echo .env.local criado!
) else (
    echo .env.local ja existe!
)
echo OK!
echo.

echo ========================================
echo     SETUP CONCLUIDO COM SUCESSO!
echo ========================================
echo.
echo [5/5] Iniciando servidor de desenvolvimento...
echo.
echo Acesse: http://localhost:3000
echo Admin:  http://localhost:3000/admin
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

call npm run dev
```

---

## 🔵 DEV.bat - Servidor de Desenvolvimento

### Quando usar?
- Todo dia para **trabalhar no projeto**
- Após já ter feito o SETUP uma vez

### O que faz?
- Inicia o servidor Next.js em modo desenvolvimento
- Hot reload automático (salva = atualiza)

### Como usar?
```
Duplo clique em DEV.bat
```

### Código completo:
```batch
@echo off
title Galorys - Dev Server
color 0A

echo.
echo ========================================
echo     GALORYS - SERVIDOR DEV
echo ========================================
echo.
echo Acesse: http://localhost:3000
echo.

call npm run dev
```

### URLs disponíveis:
| URL | Descrição |
|-----|-----------|
| http://localhost:3000 | Site principal |
| http://localhost:3000/admin | Painel admin |
| http://localhost:3000/dashboard | Dashboard do usuário |
| http://localhost:3000/login | Página de login |

---

## 🟡 STUDIO.bat - Prisma Studio

### Quando usar?
- Ver dados do banco de dados
- **Criar/editar usuários** manualmente
- Debugar problemas de dados
- Promover usuário para ADMIN

### O que faz?
- Abre interface visual do banco de dados
- Permite CRUD em todas as tabelas

### Como usar?
```
Duplo clique em STUDIO.bat
```

### Código completo:
```batch
@echo off
title Galorys - Prisma Studio
color 0E

echo.
echo ========================================
echo     GALORYS - PRISMA STUDIO
echo ========================================
echo.
echo Abrindo gerenciador do banco de dados...
echo.

call npx prisma studio
```

### Como criar usuário ADMIN:
1. Execute `STUDIO.bat`
2. Navegue até a tabela **User**
3. Clique em **Add record**
4. Preencha:
   - `email`: seu@email.com
   - `name`: Seu Nome
   - `password`: (hash bcrypt - veja abaixo)
   - `role`: **ADMIN**
5. Clique em **Save**

### Gerar hash de senha:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('sua-senha', 12).then(console.log)"
```

---

## 🟣 BUILD.bat - Build de Produção

### Quando usar?
- Antes de fazer **deploy**
- Para **testar** se o projeto compila
- Verificar **erros de tipo** TypeScript

### O que faz?
- Gera versão otimizada para produção
- Verifica erros de compilação
- Cria pasta `.next` com arquivos estáticos

### Como usar?
```
Duplo clique em BUILD.bat
```

### Código completo:
```batch
@echo off
title Galorys - Build
color 0B

echo.
echo ========================================
echo     GALORYS - BUILD PRODUCAO
echo ========================================
echo.

echo Gerando build de producao...
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo ERRO: Build falhou! Verifique os erros acima.
    pause
    exit /b 1
)

echo.
echo ========================================
echo     BUILD CONCLUIDO!
echo ========================================
echo.
echo Para testar localmente, execute:
echo npm run start
echo.
pause
```

### Após o build:
```bash
npm run start
```
Isso roda a versão de produção localmente na porta 3000.

---

## 🔴 RESET-DB.bat - Resetar Banco de Dados

### ⚠️ CUIDADO!
Este script **APAGA TODOS OS DADOS** do banco!

### Quando usar?
- Banco corrompido
- Querer **começar do zero**
- Mudanças no schema que exigem reset

### O que faz?
1. Pede confirmação (S/N)
2. Apaga todas as tabelas
3. Recria a estrutura vazia

### Como usar?
```
Duplo clique em RESET-DB.bat
Digite S para confirmar
```

### Código completo:
```batch
@echo off
title Galorys - Reset Database
color 0C

echo.
echo ========================================
echo     GALORYS - RESET BANCO DE DADOS
echo ========================================
echo.
echo ATENCAO: Isso vai APAGAR todos os dados!
echo.
set /p confirm="Tem certeza? (S/N): "

if /i "%confirm%" neq "S" (
    echo Operacao cancelada.
    pause
    exit /b 0
)

echo.
echo Resetando banco de dados...
call npx prisma db push --force-reset

if %errorlevel% neq 0 (
    echo ERRO: Falha ao resetar banco!
    pause
    exit /b 1
)

echo.
echo Banco resetado com sucesso!
echo.
pause
```

---

## 📋 Fluxo de Trabalho Recomendado

### Primeiro dia (setup):
```
1. Extrair projeto
2. Duplo clique em SETUP.bat
3. Aguardar instalação
4. Acessar http://localhost:3000
```

### Dias seguintes:
```
1. Duplo clique em DEV.bat
2. Trabalhar no código
3. Ctrl+C para parar
```

### Criar usuário admin:
```
1. DEV.bat (se não estiver rodando)
2. Em outro terminal: STUDIO.bat
3. Criar usuário com role ADMIN
```

### Antes de deploy:
```
1. BUILD.bat
2. Verificar se não há erros
3. Deploy para Vercel/servidor
```

---

## 🔧 Solução de Problemas

### Erro: "npm não reconhecido"
- Instale o [Node.js](https://nodejs.org/) (versão 18+)
- Reinicie o terminal/computador

### Erro: "prisma não encontrado"
```bash
npm install prisma --save-dev
```

### Erro: "EACCES permission denied"
- Execute como Administrador
- Ou delete a pasta `node_modules` e rode `SETUP.bat` novamente

### Porta 3000 em uso:
```bash
# Windows - encontrar processo
netstat -ano | findstr :3000

# Matar processo (substitua PID)
taskkill /PID 12345 /F
```

### Banco corrompido:
```
1. RESET-DB.bat
2. SETUP.bat
```

---

## 📱 Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl+C` | Para o servidor |
| `Ctrl+S` | Salva e recarrega (hot reload) |
| `F5` | Atualiza o navegador |

---

## 📞 Suporte

Problemas? Verifique:
1. Node.js instalado (v18+)
2. Está na pasta correta do projeto
3. `.env.local` existe
4. `node_modules` não está corrompido

---

*Tutorial criado em Janeiro/2026*
*Projeto: Galorys eSports v6*
