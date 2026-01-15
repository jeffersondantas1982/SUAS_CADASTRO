@echo off
echo INICIANDO DIAGNOSTICO...
pause

echo Verificando se o 'gh' (GitHub CLI) esta instalado...
WHERE gh
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERRO GRAVE: O programa 'gh' nao foi encontrado!
    echo.
    echo O Windows nao reconheceu a instalacao do GitHub CLI.
    echo Tente REINICIAR o computador para atualizar o sistema.
    echo.
    echo Se nao funcionar, baixe e instale manualmente:
    echo https://cli.github.com/
    echo.
    pause
    exit
)

echo.
echo 'gh' encontrado com sucesso! Iniciando login...
echo.
echo Siga as instrucoes na tela.
pause

gh auth login

echo.
echo FIM DO PROCESSO.
pause
