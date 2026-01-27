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
