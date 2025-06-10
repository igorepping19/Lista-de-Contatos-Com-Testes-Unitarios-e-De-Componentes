document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do HTML
    const nomeInput = document.getElementById('nome');
    const telefoneInput = document.getElementById('telefone');
    const emailInput = document.getElementById('email');
    const addContatoBtn = document.getElementById('addContatoBtn');
    const listaContatosUL = document.getElementById('listaContatos');

    // Array para armazenar os contatos
    let contatos = []; // Este é o array de estado da UI

    // --- Exposição para Testes (APENAS PARA FINS DE TESTE) ---
    // Isso permite que os arquivos de teste acessem e manipulem o array de contatos
    // e chamem renderizarContatos e carregarContatos diretamente.
    window.appContatos = contatos;
    window.appRenderizarContatos = renderizarContatos;
    window.appCarregarContatos = carregarContatos;
    window.appSalvarContatos = salvarContatos; // Expor para testes de armazenamento
    // -----------------------------------------------------------


    // --- FUNÇÕES DE ARMAZENAMENTO E CARREGAMENTO ---

    // Salva o array de contatos no localStorage
    function salvarContatos() {
        localStorage.setItem('listaContatos', JSON.stringify(contatos));
    }

    // Carrega o array de contatos do localStorage
    function carregarContatos() {
        const contatosSalvos = localStorage.getItem('listaContatos');
        if (contatosSalvos) {
            // Importante: sobrescrever o conteúdo do array existente, não reatribuir a variável
            contatos.splice(0, contatos.length, ...JSON.parse(contatosSalvos));
        } else {
            // Se não houver contatos salvos, garanta que o array esteja vazio
            contatos.splice(0, contatos.length);
        }
    }

    // --- FUNÇÕES DE VALIDAÇÃO DE FORMATO (JÁ ESTÃO NO WINDOW) ---

    // Valida se o nome contém apenas letras e espaços
    // Mantido como window.validarNome para compatibilidade com o script anterior
    window.validarNome = function(nome) {
        const nomeTrimmed = nome.trim();
        if (nomeTrimmed.length === 0) {
            return false;
        }
        // Incluindo hífen e apóstrofo como caracteres válidos no nome
        const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
        return regex.test(nomeTrimmed);
    };

    // Valida se o telefone contém apenas números (8 a 11 dígitos)
    // Mantido como window.validarTelefone
    window.validarTelefone = function(telefone) {
        const apenasNumeros = telefone.replace(/\D/g, ''); // Remove tudo que não for dígito
        return apenasNumeros.length >= 8 && apenasNumeros.length <= 11 && /^\d+$/.test(apenasNumeros);
    };

    // Valida o formato de e-mail
    // Mantido como window.validarEmail
    window.validarEmail = function(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // --- FUNÇÃO DE VERIFICAÇÃO DE DUPLICIDADE (EXPONDO PARA TESTE) ---
    window.verificarDuplicidade = function(nome, telefone, email) { // Expondo para teste
        let mensagem = '';
        const nomeExiste = contatos.some(contato => contato.nome.toLowerCase() === nome.toLowerCase());
        const telefoneExiste = contatos.some(contato => contato.telefone === telefone);
        const emailExiste = contatos.some(contato => contato.email.toLowerCase() === email.toLowerCase());

        if (nomeExiste && telefoneExiste && emailExiste) {
            mensagem = 'Um contato com este nome, telefone e e-mail já existe. Deseja adicionar mesmo assim?';
        } else if (nomeExiste && telefoneExiste) {
            mensagem = 'Um contato com este nome e telefone já existe. Deseja adicionar mesmo assim?';
        } else if (nomeExiste && emailExiste) {
            mensagem = 'Um contato com este nome e e-mail já existe. Deseja adicionar mesmo assim?';
        } else if (telefoneExiste && emailExiste) {
            mensagem = 'Um contato com este telefone e e-mail já existe. Deseja adicionar mesmo assim?';
        } else if (nomeExiste) {
            mensagem = 'Um contato com este nome já existe. Deseja adicionar mesmo assim?';
        } else if (telefoneExiste) {
            mensagem = 'Um contato com este telefone já existe. Deseja adicionar mesmo assim?';
        } else if (emailExiste) {
            mensagem = 'Um contato com este e-mail já existe. Deseja adicionar mesmo assim?';
        }
        return mensagem;
    };

    // --- FUNÇÃO PARA RENDERIZAR CONTATOS NA UI ---
    function renderizarContatos() {
        listaContatosUL.innerHTML = ''; // Limpa a lista existente

        if (contatos.length === 0) {
            const liVazia = document.createElement('li');
            liVazia.textContent = "Nenhum contato adicionado ainda.";
            liVazia.style.textAlign = 'center';
            liVazia.style.fontStyle = 'italic';
            liVazia.style.color = '#777';
            listaContatosUL.appendChild(liVazia);
        } else {
            contatos.forEach((contato, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="contact-info">
                        <strong>Nome:</strong> ${contato.nome}<br>
                        <strong>Telefone:</strong> ${contato.telefone}<br>
                        <strong>Email:</strong> ${contato.email}
                    </div>
                    <button class="excluir-btn" data-index="${index}">Excluir</button>
                `;
                const btnExcluir = li.querySelector('.excluir-btn');
                if (btnExcluir) {
                    btnExcluir.addEventListener('click', excluirContato);
                }
                listaContatosUL.appendChild(li);
            });
        }
    }

    // --- LÓGICA DE ADIÇÃO DE CONTATOS (Event Listener) ---
    addContatoBtn.addEventListener('click', () => {
        const nome = nomeInput.value.trim();
        const telefone = telefoneInput.value.trim();
        const email = emailInput.value.trim();

        let isValidFormato = true;
        let errorMessageFormato = '';

        // 1. Validação de Formato
        if (!nome) {
            errorMessageFormato += 'O campo Nome é obrigatório.\n';
            isValidFormato = false;
        } else if (!window.validarNome(nome)) {
            errorMessageFormato += 'O campo Nome deve conter apenas letras e espaços.\n';
            isValidFormato = false;
        }

        if (!telefone) {
            errorMessageFormato += 'O campo Telefone é obrigatório.\n';
            isValidFormato = false;
        } else if (!window.validarTelefone(telefone)) {
            errorMessageFormato += 'O campo Telefone deve conter apenas números e ter entre 8 e 11 dígitos.\n';
            isValidFormato = false;
        }

        if (!email) {
            errorMessageFormato += 'O campo E-mail é obrigatório.\n';
            isValidFormato = false;
        } else if (!window.validarEmail(email)) {
            errorMessageFormato += 'Por favor, insira um E-mail válido.\n';
            isValidFormato = false;
        }

        // Se houver qualquer erro de formato, exibe o alerta e para por aqui
        if (!isValidFormato) {
            alert('Erro ao adicionar contato:\n' + errorMessageFormato);
            return;
        }

        // 2. Verificação de Duplicidade (com opção de continuar)
        const duplicidadeMensagem = window.verificarDuplicidade(nome, telefone, email);
        if (duplicidadeMensagem) {
            const confirmarAdicao = confirm(duplicidadeMensagem);
            if (!confirmarAdicao) {
                return; // Se o usuário clicar em "Cancelar", aborta a adição
            }
        }

        // 3. Adiciona o Contato e Salva
        const novoContato = { nome, telefone, email };
        contatos.push(novoContato);
        salvarContatos();
        renderizarContatos();

        // Limpa os campos do formulário
        nomeInput.value = '';
        telefoneInput.value = '';
        emailInput.value = '';
        nomeInput.focus();
    });

    // Função para excluir um contato
    function excluirContato(event) {
        const indexParaExcluir = parseInt(event.target.dataset.index);
        contatos.splice(indexParaExcluir, 1);
        salvarContatos();
        renderizarContatos();
    }

    // --- INICIALIZAÇÃO: CARREGA OS CONTATOS SALVOS E RENDERIZA A LISTA ---
    carregarContatos();
    renderizarContatos();
});