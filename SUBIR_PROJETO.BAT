@echo off
echo ===================================================
echo          ENVIANDO PARA O GITHUB...
echo ===================================================
echo.

if not exist .git (
    echo [1/5] Inicializando Repositorio...
    git init
    git branch -M main
)

echo [2/5] Configurando Identidade do Git...
REM Configura nome generico apenas para este projeto para permitir o commit
git config user.email "dantasjeff@gmail.com"
git config user.name "Jefferson Dantas"

echo [3/5] Preparando arquivos...
git add .
git commit -m "Upload via Assistente"

echo [4/5] Configurando link remoto...
git remote remove origin 2>nul
git remote add origin https://github.com/jeffersondantas1982/SUAS_CADASTRO

echo [5/5] Enviando arquivos (PUSH)...
echo.
echo ===================================================
echo SE A JANELA DE LOGIN APARECER, FACA O LOGIN!
echo ===================================================
echo.
git push -u origin main

echo.
echo ===================================================
echo                 CONCLUIDO!
echo ===================================================
pause
