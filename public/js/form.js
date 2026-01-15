// Validações
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;

    return true;
}

function formatCPF(value) {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return value;
}

function formatPhone(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
}

function formatNIS(value) {
    value = value.replace(/\D/g, '');
    return value.substring(0, 11);
}

// Aplicar máscaras
function applyMasks() {
    const cpfInput = document.getElementById('cpf');
    const phoneInput = document.getElementById('telefone');
    const nisInput = document.getElementById('nis');

    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            e.target.value = formatCPF(e.target.value);
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = formatPhone(e.target.value);
        });
    }

    if (nisInput) {
        nisInput.addEventListener('input', (e) => {
            e.target.value = formatNIS(e.target.value);
        });
    }
}

// Campos condicionais
function setupConditionalFields() {
    const programaSocialRadios = document.getElementsByName('programaSocial');
    const descricaoProgramaField = document.getElementById('descricaoProgramaField');

    const deficienciaRadios = document.getElementsByName('possuiDeficiencia');
    const descricaoDeficienciaField = document.getElementById('descricaoDeficienciaField');

    programaSocialRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'SIM' && radio.checked) {
                descricaoProgramaField.style.display = 'block';
            } else {
                descricaoProgramaField.style.display = 'none';
                document.getElementById('descricaoPrograma').value = '';
            }
        });
    });

    deficienciaRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'SIM' && radio.checked) {
                descricaoDeficienciaField.style.display = 'block';
            } else {
                descricaoDeficienciaField.style.display = 'none';
                document.getElementById('descricaoDeficiencia').value = '';
            }
        });
    });
}


// Variáveis globais para o contexto do modal
let currentActivity = '';
let currentRegistrationId = '';
let currentRegistrationData = {};

// Mostrar Modal de Sucesso
function showSuccessModal(activity, id, data) {
    currentActivity = activity;
    currentRegistrationId = id;
    currentRegistrationData = data;

    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Fechar Modal
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
        // Opcional: Recarregar a página para limpar tudo totalmente ou focar no email para novo cadastro
        document.getElementById('email').focus();
    }
}

// Ação: Imprimir Comprovante
function printReceipt() {
    if (currentActivity && currentRegistrationId) {
        // Redireciona para a página de impressão
        window.open(`/views/print.html?activity=${currentActivity}&id=${currentRegistrationId}`, '_blank');
    } else {
        alert('Erro: Informações do cadastro não disponíveis.');
    }
}

// Ação: Enviar por WhatsApp
function sendWhatsApp() {
    if (currentRegistrationData && currentRegistrationId) {
        const nome = currentRegistrationData.nome || 'Usuário';
        const atividade = currentActivity.charAt(0).toUpperCase() + currentActivity.slice(1);
        const protocolo = currentRegistrationId;

        // Mensagem formatada
        const text = `Olá ${nome}! Seu cadastro na atividade *${atividade}* foi realizado com sucesso.%0AProtocolo: *${protocolo}*.%0A%0ASecretaria de Assistência Social - Santo Amaro do Maranhão`;

        // Abrir WhatsApp Web
        window.open(`https://wa.me/?text=${text}`, '_blank');
    }
}

// Submeter formulário
async function submitForm(event, activity) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.innerHTML;

    // Validar email
    const email = document.getElementById('email').value;
    if (!validateEmail(email)) {
        showAlert('Por favor, insira um email válido.', 'danger');
        return;
    }

    // Validar CPF
    const cpf = document.getElementById('cpf').value;
    if (!validateCPF(cpf)) {
        showAlert('Por favor, insira um CPF válido.', 'danger');
        return;
    }

    // Desabilitar botão e mostrar loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span>Enviando...';

    // Coletar dados do formulário
    const formData = {
        email: email,
        nome: document.getElementById('nome')?.value || '',
        idade: document.getElementById('idade')?.value || '',
        rg: document.getElementById('rg')?.value || '',
        dataExpedicao: document.getElementById('dataExpedicao')?.value || '',
        dataNascimento: document.getElementById('dataNascimento')?.value || '',
        cpf: cpf.replace(/\D/g, ''),
        nis: document.getElementById('nis')?.value.replace(/\D/g, '') || '',
        telefone: document.getElementById('telefone')?.value || '',
        programaSocial: document.querySelector('input[name="programaSocial"]:checked')?.value || 'NÃO',
        descricaoPrograma: document.getElementById('descricaoPrograma')?.value || '',
        possuiDeficiencia: document.querySelector('input[name="possuiDeficiencia"]:checked')?.value || 'NÃO',
        descricaoDeficiencia: document.getElementById('descricaoDeficiencia')?.value || ''
    };

    // Campos específicos
    const nomeResponsavel = document.getElementById('nomeResponsavel');
    if (nomeResponsavel) formData.nomeResponsavel = nomeResponsavel.value;

    const grauParentesco = document.getElementById('grauParentesco');
    if (grauParentesco) formData.grauParentesco = grauParentesco.value;

    const tamanhoCamisa = document.getElementById('tamanhoCamisa');
    if (tamanhoCamisa) formData.tamanhoCamisa = tamanhoCamisa.value;

    try {
        const response = await fetch(`/api/cadastro/${activity}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            // showAlert('✅ Cadastro realizado com sucesso!', 'success'); // Removido em favor do modal
            form.reset();

            // Resetar campos condicionais
            if (document.getElementById('descricaoProgramaField')) {
                document.getElementById('descricaoProgramaField').style.display = 'none';
            }
            if (document.getElementById('descricaoDeficienciaField')) {
                document.getElementById('descricaoDeficienciaField').style.display = 'none';
            }

            // Scroll para o topo
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Mostrar Modal com os dados retornados
            // O backend retorna apenas o ID no momento, vamos usar o ID e os dados locais
            // Precisamos garantir que o ID venha no result.data.id
            const newId = result.data.id;
            showSuccessModal(activity, newId, formData);

        } else {
            showAlert('❌ ' + result.message, 'danger');
        }
    } catch (error) {
        console.error('Erro:', error);
        showAlert('❌ Erro ao processar cadastro. Tente novamente.', 'danger');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = btnText;
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    checkAuth(); // Verificar login antes de tudo
    applyMasks();
    setupConditionalFields();
});

// Verificar autenticação
async function checkAuth() {
    try {
        const response = await fetch('/api/me');
        const result = await response.json();

        if (!result.success) {
            // Salvar URL de destino para redirecionar de volta depois se desejar
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Erro de autenticação:', error);
        window.location.href = '/login';
    }
}
