@echo off
:: --- TRUQUE PARA MINIMIZAR O PROMPT ---
if not "%1" == "min" (
    start /min "" "%~0" min
    exit /b
)

:: --- CONFIGURAÇÃO DE INICIALIZAÇÃO ---
echo Iniciando o Sistema SCFV...
echo Aguarde um momento enquanto o servidor e o navegador sao carregados.

:: Abre o navegador (com um pequeno delay para o Node carregar)
start "" "http://localhost:3000"

:: Inicia o Node.js
echo.
echo Acesse http://localhost:3000 no seu navegador.
npm start

pause
