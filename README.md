# 📋 Sistema de Cadastro SCFV - Santo Amaro do Maranhão

Sistema completo de cadastro para o Serviço de Convivência e Fortalecimento de Vínculos (SCFV) da Secretaria de Assistência Social de Santo Amaro do Maranhão.

## 🎯 Funcionalidades

- ✅ **5 Formulários de Cadastro** (Hitbox, Ballet, Karatê, Grupo de Idosos, Treino Funcional)
- ✅ **Validação de Dados** (CPF, Email, campos obrigatórios)
- ✅ **Máscaras Automáticas** (CPF, Telefone, NIS)
- ✅ **Armazenamento em Excel** com biblioteca ExcelJS (Cadastros) e SheetJS (Usuários)
- ✅ **Painel Administrativo** completo com gráficos
- ✅ **Gestão de Usuários Dedicada** (CRUD de administradores e operadores)
- ✅ **Estatísticas em Tempo Real**
- ✅ **Sistema de Busca** nos cadastros
- ✅ **Download de Excel** com todos os dados
- ✅ **Design Moderno e Responsivo**

## 🏗️ Estrutura do Projeto

```
SUAS_CADASTRO/
├── data/
│   ├── cadastros.xlsx          # Arquivo Excel com todos os inscritos
│   └── users.xlsx              # Arquivo Excel com usuários do sistema (admin/operador)
├── public/
│   ├── css/
│   │   └── style.css           # Estilos do sistema
│   └── js/
│       └── form.js             # Lógica de formulários e validações
├── views/
│   ├── index.html              # Página inicial
│   ├── admin.html              # Painel Administrativo (Dashboard)
│   ├── users.html              # [NOVO] Gerenciamento de Usuários
│   └── [formularios.html]      # Páginas de cada atividade
├── server.js                   # Servidor Node.js com Express
├── MANUAL_USUARIO.md           # Guia de uso detalhado
├── package.json                # Dependências do projeto
└── README.md                   # Este arquivo
```

## 📦 Instalação

### Pré-requisitos
- **Node.js** (versão 14 ou superior)
- **npm** (geralmente vem com Node.js)

### Passo a Passo

1. **Abra o terminal na pasta do projeto:**
   ```bash
   cd C:\Users\Administrador\Desktop\SUAS_CADASTRO
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor:**
   ```bash
   npm start
   ```

4. **Acesse o sistema:**
   ```
   http://localhost:3000
   ```

## 🚀 Como Usar

### Para Usuários (Cadastro)
1. Acesse a página inicial (`http://localhost:3000`)
2. Escolha a atividade desejada
3. Preencha o formulário e clique em "Enviar Cadastro"

### Para Administradores
1. Acesse o Painel Administrativo (`http://localhost:3000/views/admin.html`)
2. Login padrão: **admin** / **admin123**
3. **Gestão de Usuários:** Clique no botão "👥 Gerenciar Usuários" para abrir o painel de controle de acesso (criar/editar admins e operadores).
4. **Exportação:** Clique em "Baixar Excel Completo" para relatórios.

## 📊 Estrutura dos Dados

### Cadastros (`data/cadastros.xlsx`)
Contém abas separadas para cada atividade (Hitbox, Ballet, etc).

### Usuários (`data/users.xlsx`)
Contém as credenciais de acesso ao sistema.
- **Colunas:** username, password, role

## 🔒 Validações Implementadas

- ✅ Validação de formato de **Email**
- ✅ Validação completa de **CPF** (dígitos verificadores)
- ✅ Máscaras para **CPF**, **Telefone**, **NIS**
- ✅ Campos condicionais inteligentes

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, Express.js, ExcelJS, XLSX
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Banco de Dados:** Arquivos Excel Locais (NoSQL approach)

## 📄 Licença
© 2026 - Secretaria de Assistência Social - Santo Amaro do Maranhão
