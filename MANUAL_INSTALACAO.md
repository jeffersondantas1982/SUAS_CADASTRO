# 🛠️ Manual de Instalação - Windows

Este guia passo-a-passo ajudará você a instalar e rodar o Sistema de Cadastro SCFV em um computador com Windows.

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado no computador:

1.  **Node.js** (Versão LTS recomendada)
    - Baixe aqui: [https://nodejs.org/](https://nodejs.org/)
    - Durante a instalação, clique em "Next" (Próximo) até finalizar. Não precisa mudar nenhuma configuração.

---

## 🚀 Como Instalar

Siga estes passos na primeira vez que colocar o sistema no computador:

### Passo 1: Preparar os arquivos
1.  Baixe a pasta do projeto ou copie-a para a **Área de Trabalho** (Desktop).
2.  Recomendamos que o nome da pasta seja `SUAS_CADASTRO`.

### Passo 2: Instalar dependências
1.  Abra a pasta `SUAS_CADASTRO`.
2.  Encontre o arquivo chamado **`INSTALAR.BAT`** (pode aparecer apenas como `INSTALAR`).
3.  Dê um **duplo clique** nele.
4.  Uma janela preta vai abrir e baixar as bibliotecas necessárias. Aguarde até aparecer "INSTALACAO CONCLUIDA" e pressione qualquer tecla para fechar.

---

## ▶️ Como Rodar o Sistema

Sempre que quiser usar o sistema:

1.  Abra a pasta `SUAS_CADASTRO`.
2.  Dê um duplo clique no arquivo **`START.BAT`** (ou `START`).
3.  Uma janela preta vai abrir mostrando "Iniciando o Sistema SCFV...". **Não feche essa janela**, ela é o servidor rodando.
4.  O sistema estará disponível no seu navegador.

---

## 🌐 Acessando o Sistema

1.  Abra seu navegador preferido (Chrome, Edge, Firefox).
2.  Na barra de endereços, digite:
    **`http://localhost:3000`**
3.  Pronto! Você verá a tela inicial.

---

## ⚠️ Solução de Problemas

**Erro: "npm não é reconhecido..."**
- Isso significa que o Node.js não foi instalado corretamente. Baixe e instale novamente o Node.js do site oficial e **reinicie o computador**.

**Janela preta fecha imediatamente ao clicar no START**
- Verifique se você já executou o `INSTALAR.BAT` antes.

**Erro: "EADDRINUSE: address already in use"**
- Isso significa que o sistema já está aberto em outra janela. Procure outra janela preta do Node.js aberta e feche-a, ou apenas acesse o endereço no navegador.

---

© 2026 - Secretaria de Assistência Social - Santo Amaro do Maranhão
