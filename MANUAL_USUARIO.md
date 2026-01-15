# 📖 Manual do Usuário - Sistema SCFV

Bem-vindo ao manual de operações do Sistema de Cadastro do SCFV. Este documento explica como utilizar as principais funcionalidades, incluindo o novo sistema de gerenciamento de usuários.

## 🔑 Acesso ao Sistema

### Endereço
Para acessar o sistema, abra o navegador e digite:
`http://localhost:3000`

### Login Administrativo
Para acessar o painel de controle, use o botão "Área Administrativa" no rodapé ou acesse:
`http://localhost:3000/login`

**Credenciais Padrão:**
- **Usuário:** admin
- **Senha:** admin123

---

## 👥 Gerenciamento de Usuários (Novo!)

O sistema agora possui uma janela exclusiva para gerenciar quem pode acessar a área administrativa.

### Como Acessar
1. Faça login no Painel Administrativo.
2. No menu de abas, clique no botão **"👥 Gerenciar Usuários"** (canto superior direito).
3. Uma nova janela (popup) será aberta.

### Funcionalidades

#### 1. Criar Novo Usuário
1. Clique no botão azul **"+ Novo Usuário"**.
2. Preencha os dados:
    - **Usuário:** Nome para login (sem espaços).
    - **Senha:** Senha de acesso.
    - **Perfil:** 
        - `Administrador`: Acesso total (inclui gerenciar usuários e deletar cadastros).
        - `Operador`: Apenas visualiza cadastros e imprime fichas.
3. Clique em "Criar".

#### 2. Editar Usuário
1. Na lista de usuários, clique no **ícone de lápis (✏️)** ao lado do nome.
2. Você pode alterar:
    - O perfil de acesso.
    - A senha (digite a nova senha ou deixe em branco para manter a atual).
3. Clique em "Salvar Alterações".
    - *Nota: Não é possível alterar o nome de usuário (ID).*

#### 3. Tipos de Armazenamento
Os dados dos usuários são salvos em um arquivo Excel no servidor:
- 📂 `data/users.xlsx`
Isso permite que você tenha um backup fácil das credenciais.

---

## 📊 Painel de Controle (Dashboard)

O painel principal permite visualizar todos os cadastros feitos.

### Abas de Atividades
Navegue entre as abas (Hitbox, Ballet, etc.) para ver as listas específicas de cada modalidade.

### Ações nos Cadastros
Em cada linha da tabela, você encontra botões de ação:
- 🖨️ **Imprimir**: Gera uma ficha PDF pronta para impressão.
- ✏️ **Editar**: Permite corrigir dados do cadastro.
- 🗑️ **Excluir**: Remove o cadastro (Apenas Administradores).

### Exportação
- **Baixar Excel Completo**: No topo da página, este botão baixa um arquivo `.xlsx` contendo TODOS os cadastros de todas as atividades, organizados por abas, ideal para relatórios.

---

## ❓ Resolução de Problemas Comuns

### "O botão não funciona / Nada acontece"
Se o sistema foi atualizado recentemente, seu navegador pode estar usando uma memória antiga (cache).
**Solução:**
1. Na página com problema, pressione as teclas `Ctrl` + `F5` juntas.
2. Isso forçará o navegador a baixar a versão mais nova do sistema.

### "Não consigo acessar a gestão de usuários"
Verifique se você é um Administrador. Operadores não veem o botão de gerenciamento de usuários.

### "Esqueci a senha do admin"
Como os dados estão em Excel (`data/users.xlsx`), um técnico pode abrir esse arquivo no servidor e visualizar/resetar as senhas manualmente se necessário.
