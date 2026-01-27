@echo off
title Galorys - Screenshot Generator COMPLETO
color 0A

echo.
echo ========================================
echo   GALORYS - SCREENSHOT GENERATOR
echo           (VERSAO COMPLETA)
echo ========================================
echo.

:: Verificar puppeteer
echo Verificando dependencias...
call npm list puppeteer >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Instalando puppeteer...
    call npm install puppeteer --save-dev
    echo.
)

echo.
echo IMPORTANTE: O servidor dev precisa estar rodando!
echo.
echo Se nao estiver, abra outro terminal e execute:
echo    npm run dev
echo.
set /p ready="O servidor esta rodando? (S/N): "

if /i "%ready%" neq "S" (
    echo.
    echo Inicie o servidor primeiro e rode novamente.
    pause
    exit /b 0
)

echo.
echo ========================================
echo   Gerando screenshots do Galorys...
echo ========================================
echo.
echo Paginas: 84
echo Tamanhos: 3 (Desktop, Tablet, Mobile)
echo Total: 252 screenshots
echo.
echo Isso pode demorar alguns minutos...
echo Pode usar o PC normalmente!
echo.

node screenshot-generator-galorys-completo.js

echo.
pause
