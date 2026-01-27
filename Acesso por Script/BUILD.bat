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
