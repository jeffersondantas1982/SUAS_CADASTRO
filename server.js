const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ExcelJS = require('exceljs');
const XLSX = require('xlsx'); // Import xlsx for user management
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Servir arquivos HTML da pasta views
app.use('/views', express.static('views'));

// Caminho do arquivo Excel
const EXCEL_FILE = path.join(__dirname, 'data', 'cadastros.xlsx');

// Garantir que a pasta data existe
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// === AUTH SYSTEM ===
const USERS_FILE = path.join(__dirname, 'data', 'users.xlsx'); // Excel file
const JSON_USERS_FILE = path.join(__dirname, 'data', 'users.json'); // Legacy file
const sessions = {}; // In-memory session store

// Inicializar Usuários no Excel
function initializeUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        let initialUsers = [];

        // Migração: Se existir JSON antigo, usar esses dados
        if (fs.existsSync(JSON_USERS_FILE)) {
            try {
                const legacyData = JSON.parse(fs.readFileSync(JSON_USERS_FILE));
                if (Array.isArray(legacyData) && legacyData.length > 0) {
                    initialUsers = legacyData;
                    console.log('📦 Migrando usuários do JSON para Excel...');
                }
            } catch (e) {
                console.error('Erro ao ler JSON antigo:', e);
            }
        }

        // Se vazio, cria admin padrão
        if (initialUsers.length === 0) {
            initialUsers = [{ username: 'admin', password: 'admin123', role: 'admin' }];
            console.log('🔒 Criando usuário Admin padrão no Excel.');
        }

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(initialUsers);
        XLSX.utils.book_append_sheet(wb, ws, "Users");
        XLSX.writeFile(wb, USERS_FILE);
    }
}
initializeUsers();

function getUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    try {
        const wb = XLSX.readFile(USERS_FILE);
        const sheet = wb.Sheets[wb.SheetNames[0]];
        return XLSX.utils.sheet_to_json(sheet);
    } catch (e) {
        console.error('Erro ao ler usuários:', e);
        return [];
    }
}

function saveUsers(users) {
    try {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(users);
        XLSX.utils.book_append_sheet(wb, ws, "Users");
        XLSX.writeFile(wb, USERS_FILE);
    } catch (e) {
        console.error('Erro ao salvar usuários:', e);
    }
}

// Middleware de Autenticação
function authenticate(req, res, next) {
    const token = req.cookies.auth_token;
    if (!token || !sessions[token]) {
        return res.status(401).json({ success: false, message: 'Não autorizado' });
    }
    req.user = sessions[token];
    next();
}

// Middleware de Autorização
function authorize(roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Acesso negado' });
        }
        next();
    };
}

// Função para inicializar o arquivo Excel
async function initializeExcel() {
    if (!fs.existsSync(EXCEL_FILE)) {
        const workbook = new ExcelJS.Workbook();

        // Criar planilhas para cada atividade
        const activities = ['Hitbox', 'Ballet', 'Karate', 'Idosos', 'Funcional'];

        activities.forEach(activity => {
            const worksheet = workbook.addWorksheet(activity);

            // Cabeçalhos comuns
            const headers = [
                'ID',
                'Data de Cadastro',
                'Email',
                'Nome do Usuário',
                'Idade',
                'RG',
                'Data de Expedição',
                'Data de Nascimento',
                'CPF',
                'NIS',
                'Telefone',
                'Programa Social',
                'Descrição Programa',
                'Possui Deficiência',
                'Descrição Deficiência'
            ];

            // Campos específicos
            if (activity === 'Hitbox') {
                headers.push('Nome do Responsável', 'Grau de Parentesco', 'Tamanho da Camisa');
            } else if (activity === 'Ballet' || activity === 'Karate') {
                headers.push('Nome do Responsável', 'Grau de Parentesco');
            }

            // Coluna de Auditoria
            headers.push('Cadastrado Por');

            worksheet.addRow(headers);

            // Estilizar cabeçalho
            worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4472C4' }
            };

            // Ajustar largura das colunas
            worksheet.columns.forEach((column, index) => {
                column.width = index === 0 ? 8 : 20;
            });
        });

        await workbook.xlsx.writeFile(EXCEL_FILE);
        console.log('✅ Arquivo Excel criado com sucesso!');
    }
}

// Função para adicionar cadastro
async function addRegistration(activity, data, author) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCEL_FILE);

    const worksheet = workbook.getWorksheet(activity);

    if (!worksheet) {
        throw new Error(`Planilha ${activity} não encontrada`);
    }

    // Gerar ID único
    const lastRow = worksheet.lastRow;
    const newId = lastRow && lastRow.getCell(1).value ? lastRow.getCell(1).value + 1 : 1;

    // Dados do cadastro
    const rowData = [
        newId,
        new Date().toLocaleDateString('pt-BR'),
        data.email,
        data.nome,
        data.idade,
        data.rg,
        data.dataExpedicao || '',
        data.dataNascimento,
        data.cpf,
        data.nis,
        data.telefone,
        data.programaSocial,
        data.descricaoPrograma || '',
        data.possuiDeficiencia,
        data.descricaoDeficiencia || ''
    ];

    // Campos específicos
    if (activity === 'Hitbox') {
        rowData.push(
            data.nomeResponsavel || '',
            data.grauParentesco || '',
            data.tamanhoCamisa || ''
        );
    } else if (activity === 'Ballet' || activity === 'Karate') {
        rowData.push(
            data.nomeResponsavel || '',
            data.grauParentesco || ''
        );
    }

    // Adicionar quem cadastrou
    rowData.push(author || 'Sistema');

    worksheet.addRow(rowData);

    await workbook.xlsx.writeFile(EXCEL_FILE);

    return { success: true, id: newId };
}

// Função para obter todos os cadastros
async function getAllRegistrations(activity) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCEL_FILE);

    const worksheet = workbook.getWorksheet(activity);

    if (!worksheet) {
        throw new Error(`Planilha ${activity} não encontrada`);
    }

    const registrations = [];
    const headers = [];

    worksheet.getRow(1).eachCell((cell) => {
        headers.push(cell.value);
    });

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            const registration = {};
            row.eachCell((cell, colNumber) => {
                registration[headers[colNumber - 1]] = cell.value;
            });
            registrations.push(registration);
        }
    });

    return registrations;
}

// Função para comparar IDs de forma flexível
function compareIds(id1, id2) {
    const s1 = String(id1).replace(/^ID/i, '');
    const s2 = String(id2).replace(/^ID/i, '');
    return s1 === s2;
}

// Função para obter um cadastro por ID
async function getRegistrationById(activity, id) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCEL_FILE);
    const worksheet = workbook.getWorksheet(activity);

    if (!worksheet) return null;

    let registration = null;
    const headers = [];
    worksheet.getRow(1).eachCell((cell) => headers.push(cell.value));

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1 && compareIds(row.getCell(1).value, id)) {
            registration = {};
            row.eachCell((cell, colNumber) => {
                registration[headers[colNumber - 1]] = cell.value;
            });
        }
    });

    return registration;
}

// Função para excluir cadastro
async function deleteRegistration(activity, id) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCEL_FILE);
    const worksheet = workbook.getWorksheet(activity);

    if (!worksheet) throw new Error(`Planilha ${activity} não encontrada`);

    let rowToDelete = -1;
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1 && compareIds(row.getCell(1).value, id)) {
            rowToDelete = rowNumber;
        }
    });

    if (rowToDelete !== -1) {
        worksheet.spliceRows(rowToDelete, 1);
        await workbook.xlsx.writeFile(EXCEL_FILE);
        return true;
    }

    return false;
}

// Função para atualizar cadastro
async function updateRegistration(activity, id, data) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCEL_FILE);
    const worksheet = workbook.getWorksheet(activity);

    if (!worksheet) throw new Error(`Planilha ${activity} não encontrada`);

    let rowToUpdate = -1;
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1 && compareIds(row.getCell(1).value, id)) {
            rowToUpdate = rowNumber;
        }
    });

    if (rowToUpdate !== -1) {
        const row = worksheet.getRow(rowToUpdate);

        // Atualizar valores mantendo ID e Data original
        row.getCell(3).value = data.email;
        row.getCell(4).value = data.nome;
        row.getCell(5).value = data.idade;
        row.getCell(6).value = data.rg;
        row.getCell(7).value = data.dataExpedicao || '';
        row.getCell(8).value = data.dataNascimento;
        row.getCell(9).value = data.cpf;
        row.getCell(10).value = data.nis;
        row.getCell(11).value = data.telefone;
        row.getCell(12).value = data.programaSocial;
        row.getCell(13).value = data.descricaoPrograma || '';
        row.getCell(14).value = data.possuiDeficiencia;
        row.getCell(15).value = data.descricaoDeficiencia || '';

        if (activity === 'Hitbox') {
            row.getCell(16).value = data.nomeResponsavel || '';
            row.getCell(17).value = data.grauParentesco || '';
            row.getCell(18).value = data.tamanhoCamisa || '';
        } else if (activity === 'Ballet' || activity === 'Karate') {
            row.getCell(16).value = data.nomeResponsavel || '';
            row.getCell(17).value = data.grauParentesco || '';
        }

        row.commit();
        await workbook.xlsx.writeFile(EXCEL_FILE);
        return true;
    }

    return false;
}

// Função para obter estatísticas
async function getStatistics() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCEL_FILE);

    const stats = {
        total: 0,
        hitbox: 0,
        ballet: 0,
        karate: 0,
        idosos: 0,
        funcional: 0
    };

    ['Hitbox', 'Ballet', 'Karate', 'Idosos', 'Funcional'].forEach(activity => {
        const worksheet = workbook.getWorksheet(activity);
        const count = worksheet.rowCount - 1; // -1 para excluir o cabeçalho
        stats[activity.toLowerCase()] = count > 0 ? count : 0;
        stats.total += count > 0 ? count : 0;
    });

    return stats;
}

// Rotas da API
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = crypto.randomUUID();
        sessions[token] = { username: user.username, role: user.role };
        res.cookie('auth_token', token, { httpOnly: true });
        res.json({ success: true, role: user.role, username: user.username });
    } else {
        res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }
});

app.post('/api/logout', (req, res) => {
    const token = req.cookies.auth_token;
    if (token) delete sessions[token];
    res.clearCookie('auth_token');
    res.json({ success: true });
});

app.get('/api/me', authenticate, (req, res) => {
    res.json({ success: true, user: req.user });
});

// Gestão de Usuários (Admin Only)
app.post('/api/users', authenticate, authorize(['admin']), (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !['admin', 'operador'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Dados inválidos' });
    }
    const users = getUsers();
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ success: false, message: 'Usuário já existe' });
    }
    users.push({ username, password, role });
    saveUsers(users);
    res.json({ success: true, message: 'Usuário criado' });
});

app.get('/api/users', authenticate, authorize(['admin']), (req, res) => {
    const users = getUsers().map(u => ({ username: u.username, role: u.role }));
    res.json({ success: true, data: users });
});

app.put('/api/users/:originalUsername', authenticate, authorize(['admin']), (req, res) => {
    const { originalUsername } = req.params;
    const { newUsername, password, role } = req.body;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === originalUsername);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    // Se estiver mudando o nome, checar se já existe
    if (newUsername !== originalUsername) {
        const conflict = users.find(u => u.username === newUsername);
        if (conflict) {
            return res.status(400).json({ success: false, message: 'Novo nome de usuário já está em uso' });
        }
    }

    // Atualizar
    users[userIndex].username = newUsername;
    users[userIndex].role = role;
    if (password) { // Apenas atualiza senha se enviada
        users[userIndex].password = password;
    }

    saveUsers(users);
    res.json({ success: true, message: 'Usuário atualizado com sucesso' });
});


// Proteger rotas de escrita
app.post('/api/cadastro/:activity', authenticate, async (req, res) => {
    try {
        const activity = req.params.activity.charAt(0).toUpperCase() + req.params.activity.slice(1);
        // Passar req.user.username como autor
        const result = await addRegistration(activity, req.body, req.user.username);
        res.json({ success: true, message: 'Cadastro realizado com sucesso!', data: result });
    } catch (error) {
        console.error('Erro ao adicionar cadastro:', error);
        res.status(500).json({ success: false, message: 'Erro ao processar cadastro', error: error.message });
    }
});

app.get('/api/cadastros/:activity', authenticate, async (req, res) => {
    try {
        const activity = req.params.activity.charAt(0).toUpperCase() + req.params.activity.slice(1);
        const registrations = await getAllRegistrations(activity);
        res.json({ success: true, data: registrations });
    } catch (error) {
        console.error('Erro ao buscar cadastros:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar cadastros', error: error.message });
    }
});

// Buscar cadastro único
app.get('/api/cadastro/:activity/:id', authenticate, async (req, res) => {
    try {
        const { activity, id } = req.params;
        const formattedActivity = activity.charAt(0).toUpperCase() + activity.slice(1);
        const registration = await getRegistrationById(formattedActivity, id);
        if (registration) {
            res.json({ success: true, data: registration });
        } else {
            res.status(404).json({ success: false, message: 'Cadastro não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar cadastro', error: error.message });
    }
});

// Atualizar cadastro
app.put('/api/cadastro/:activity/:id', authenticate, async (req, res) => {
    try {
        const { activity, id } = req.params;
        const formattedActivity = activity.charAt(0).toUpperCase() + activity.slice(1);
        const success = await updateRegistration(formattedActivity, id, req.body);
        if (success) {
            res.json({ success: true, message: 'Cadastro atualizado com sucesso!' });
        } else {
            res.status(404).json({ success: false, message: 'Cadastro não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao atualizar cadastro', error: error.message });
    }
});

// Excluir cadastro (Apenas Admin)
app.delete('/api/cadastro/:activity/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { activity, id } = req.params;
        const formattedActivity = activity.charAt(0).toUpperCase() + activity.slice(1);
        const success = await deleteRegistration(formattedActivity, id);
        if (success) {
            res.json({ success: true, message: 'Cadastro excluído com sucesso!' });
        } else {
            res.status(404).json({ success: false, message: 'Cadastro não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao excluir cadastro', error: error.message });
    }
});

app.get('/api/estatisticas', async (req, res) => {
    try {
        const stats = await getStatistics();
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar estatísticas', error: error.message });
    }
});

// Download do arquivo Excel
app.get('/api/download', (req, res) => {
    res.download(EXCEL_FILE, 'cadastros_scfv.xlsx');
});

// Inicializar servidor
initializeExcel().then(() => {
    app.listen(PORT, () => {
        console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
        console.log(`📊 Sistema de Cadastro SCFV - Santo Amaro do Maranhão`);
        console.log(`📁 Dados salvos em: ${EXCEL_FILE}\n`);
    });
}).catch(error => {
    console.error('❌ Erro ao inicializar:', error);
});
