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
