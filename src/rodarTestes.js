// src/rodarTestes.js

// Variáveis para armazenar o estado global dos testes
window.testesResultados = [];
window.testesPassados = 0;
window.testesFalhos = 0;

// Função para exibir os resultados dos testes
window.exibirResultadosTestes = function() {
    const resultadosDiv = document.getElementById('testes-resultados');
    if (!resultadosDiv) {
        console.error("Elemento #testes-resultados não encontrado.");
        return;
    }
    resultadosDiv.innerHTML = ''; // Limpa resultados anteriores

    const ul = document.createElement('ul');
    ul.classList.add('testes-lista-resultados');

    window.testesResultados.forEach(resultado => {
        const li = document.createElement('li');
        li.classList.add(resultado.passou ? 'teste-passou' : 'teste-falhou');

        const symbol = document.createElement('span');
        symbol.classList.add('test-symbol');
        symbol.textContent = resultado.passou ? '✓' : '✗';
        li.appendChild(symbol);

        const textNode = document.createTextNode(resultado.descricao);
        li.appendChild(textNode);

        if (!resultado.passou && resultado.erro) {
            const errorDetails = document.createElement('pre');
            errorDetails.classList.add('test-error-details');
            errorDetails.textContent = error.message || String(resultado.erro); // Garante que o erro seja uma string
            li.appendChild(errorDetails);
        }
        ul.appendChild(li);
    });

    const summary = document.createElement('p');
    summary.innerHTML = `<strong>Passou: <span style="color: #28a745;">${window.testesPassados}</span> | Falhou: <span style="color: #dc3545;">${window.testesFalhos}</span></strong>`;
    resultadosDiv.appendChild(summary);
    resultadosDiv.appendChild(ul);
};

// Função para registrar o resultado de um teste
window.registrarResultadoTeste = function(descricao, passou, erro = null) {
    window.testesResultados.push({ descricao, passou, erro });
    if (passou) {
        window.testesPassados++;
    } else {
        window.testesFalhos++;
    }
    console.log(`${passou ? '✓' : '✗'} ${descricao}`);
    if (erro) {
        console.error(erro);
    }
};

// ===========================================
// Estrutura de Testes (similar a frameworks como Jest)
// ===========================================

window.currentDescribe = null; // Para agrupar testes em descrições

window.describe = function(description, callback) {
    const parentDescribe = window.currentDescribe;
    window.currentDescribe = { description: description, tests: [], beforeEach: null, afterAll: null, parent: parentDescribe };
    console.groupCollapsed(description);
    callback();
    console.groupEnd();
    window.currentDescribe = parentDescribe;
};

window.test = function(description, callback) {
    if (!window.currentDescribe) {
        console.error("Erro: 'test' deve ser chamado dentro de um bloco 'describe'.");
        return;
    }

    // Constrói a descrição completa para o teste
    const fullDescriptionParts = [];
    let current = window.currentDescribe;
    while (current) {
        fullDescriptionParts.unshift(current.description);
        current = current.parent;
    }
    const fullDescription = [...fullDescriptionParts, description].join(' > ');

    try {
        // Executar beforeEach se existir para o describe atual
        if (window.currentDescribe.beforeEach) {
            window.currentDescribe.beforeEach();
        }
        callback();
        window.registrarResultadoTeste(fullDescription, true);
    } catch (error) {
        window.registrarResultadoTeste(fullDescription, false, error.message);
    } finally {
        // afterEach não é implementado, mas afterAll é chamado no final do describe
    }
};

window.beforeEach = function(callback) {
    if (window.currentDescribe) {
        window.currentDescribe.beforeEach = callback;
    } else {
        console.warn("beforeEach chamado fora de um bloco describe. Ele não terá efeito.");
    }
};

window.afterAll = function(callback) {
    if (window.currentDescribe) {
        window.currentDescribe.afterAll = callback;
    } else {
        console.warn("afterAll chamado fora de um bloco describe. Ele não terá efeito.");
    }
};

// ===========================================
// Matchers (expect)
// ===========================================

window.expect = function(actual) {
    return {
        toBe: function(expected) {
            if (actual !== expected) {
                throw new Error(`Esperado: ${expected}, Recebido: ${actual}`);
            }
        },
        toContain: function(expectedSubstring) {
            if (typeof actual !== 'string' || !actual.includes(expectedSubstring)) {
                throw new Error(`Esperado que "${actual}" contenha "${expectedSubstring}"`);
            }
        },
        toBeNull: function() {
            if (actual !== null) {
                throw new Error(`Esperado: null, Recebido: ${actual}`);
            }
        },
        toEqual: function(expected) {
            // Comparação profunda para objetos e arrays
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(`Esperado: ${JSON.stringify(expected)}, Recebido: ${JSON.stringify(actual)}`);
            }
        },
        toMatchObject: function(expected) {
            const keys = Object.keys(expected);
            for (let key of keys) {
                if (!actual.hasOwnProperty(key) || actual[key] !== expected[key]) {
                    throw new Error(`Objeto não corresponde. Propriedade "${key}": Esperado "${expected[key]}", Recebido "${actual[key]}"`);
                }
            }
        },
        toBeTruthy: function() {
            if (!actual) {
                throw new Error(`Esperado valor verdadeiro (truthy), Recebido: ${actual}`);
            }
        },
        toBeFalsy: function() {
            if (actual) {
                throw new Error(`Esperado valor falso (falsy), Recebido: ${actual}`);
            }
        },
        toHaveValue: function(expectedValue) {
            if (!actual || typeof actual.value === 'undefined') {
                throw new Error(`Elemento "${actual ? (actual.id || actual.tagName) : 'nulo'}" não possui a propriedade 'value'.`);
            }
            if (actual.value !== String(expectedValue)) {
                throw new Error(`Esperado que o elemento "${actual.id || actual.tagName}" tivesse valor "${expectedValue}", mas recebeu "${actual.value}"`);
            }
        },
        toHaveLength: function(expectedLength) {
            if (!actual || typeof actual.children === 'undefined') { // Para NodeList ou HTMLCollection
                throw new Error(`Esperado que o elemento "${actual ? (actual.id || actual.tagName) : 'nulo'}" tivesse filhos, mas não é um HTMLCollection/NodeList.`);
            }
            if (actual.children.length !== expectedLength) {
                throw new Error(`Esperado que a lista tivesse ${expectedLength} itens, mas encontrou ${actual.children.length}.`);
            }
        },
        toContainText: function(expectedText) {
            if (!actual || typeof actual.textContent !== 'string') {
                throw new Error(`Esperado que o elemento "${actual ? (actual.id || actual.tagName) : 'nulo'}" tivesse um textContent válido.`);
            }
            if (!actual.textContent.includes(expectedText)) {
                throw new Error(`Esperado que o elemento "${actual ? (actual.id || actual.tagName) : 'nulo'}" contivesse o texto "${expectedText}", mas recebeu "${actual.textContent}"`);
            }
        },
        toHaveClass: function(className) {
            if (!actual || !actual.classList || !actual.classList.contains(className)) {
                throw new Error(`Esperado que o elemento "${actual ? (actual.id || actual.tagName) : 'nulo'}" tivesse a classe "${className}".`);
            }
        },
        not: {
            toBe: function(expected) {
                if (actual === expected) {
                    throw new Error(`Esperado: não ${expected}, Recebido: ${actual}`);
                }
            },
            toBeNull: function() {
                if (actual === null) {
                    throw new Error(`Esperado: não null, Recebido: ${actual}`);
                }
            },
            toBeFalsy: function() {
                if (!actual) {
                    throw new Error(`Esperado valor verdadeiro (truthy), Recebido: ${actual}`);
                }
            },
            toContainText: function(expectedText) {
                if (!actual || typeof actual.textContent !== 'string') {
                    throw new Error(`Esperado que o elemento "${actual ? (actual.id || actual.tagName) : 'nulo'}" tivesse um textContent válido.`);
                }
                if (actual.textContent.includes(expectedText)) {
                    throw new Error(`Esperado que o elemento "${actual ? (actual.id || actual.tagName) : 'nulo'}" NÃO contivesse o texto "${expectedText}", mas o encontrou.`);
                }
            }
        }
    };
};

// ===========================================
// Funções Utilitares para Testes de Componentes (DOM e Eventos)
// ===========================================

window.fireEvent = {
    input: function(element, value) {
        if (!element) throw new Error('fireEvent.input: Elemento não encontrado.');
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
    },
    click: function(element) {
        if (!element) throw new Error('fireEvent.click: Elemento não encontrado.');
        element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    },
    change: function(element, value = undefined) {
        if (!element) throw new Error('fireEvent.change: Elemento não encontrado.');
        if (value !== undefined) {
            element.value = value;
        }
        element.dispatchEvent(new Event('change', { bubbles: true }));
    },
    submit: function(formElement) {
        if (!formElement || formElement.tagName.toLowerCase() !== 'form') {
            throw new Error('fireEvent.submit: Elemento não é um formulário.');
        }
        formElement.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
};

window.getById = function(id) {
    const element = document.getElementById(id);
    if (!element) {
        // console.warn(`Elemento com ID "${id}" não encontrado.`); // Usar warn para não falhar teste
    }
    return element;
};

window.querySelector = function(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        // console.warn(`Elemento com seletor "${selector}" não encontrado.`);
    }
    return element;
};

window.querySelectorAll = function(selector) {
    const elements = document.querySelectorAll(selector);
    return elements; // Retorna NodeList, pode estar vazia
};

// ===========================================
// Mocking de Ambiente (localStorage, alert, confirm)
// ===========================================

let originalLocalStorage = null;
let originalAlert = null;
let originalConfirm = null;

window.mockLocalStorage = function() {
    originalLocalStorage = window.localStorage;
    let store = {}; // Objeto que simula o localStorage

    Object.defineProperty(window, 'localStorage', {
        value: {
            getItem: (key) => store[key] === undefined ? null : store[key], // Retorna null se não existir
            setItem: (key, value) => { store[key] = String(value); },
            removeItem: (key) => { delete store[key]; },
            clear: () => { store = {}; },
            get length() { return Object.keys(store).length; },
            key: (index) => Object.keys(store)[index]
        },
        writable: true,
        configurable: true // Importante para poder restaurar
    });
};

window.restoreLocalStorage = function() {
    if (originalLocalStorage) {
        Object.defineProperty(window, 'localStorage', {
            value: originalLocalStorage,
            writable: true,
            configurable: true
        });
        originalLocalStorage = null;
    }
};

window.mockAlert = function(mockFn = () => {}) { // Permite passar uma mockFunction personalizada
    originalAlert = window.alert;
    window.alert = mockFn;
};

window.restoreAlert = function() {
    if (originalAlert) {
        window.alert = originalAlert;
        originalAlert = null;
    }
};

window.mockConfirm = function(returnValue = true, mockFn = () => returnValue) {
    originalConfirm = window.confirm;
    window.confirm = mockFn;
};

window.restoreConfirm = function() {
    if (originalConfirm) {
        window.confirm = originalConfirm;
        originalConfirm = null;
    }
};

// ===========================================
// Funções Auxiliares para Testes de Array da Aplicação
// ===========================================

// Salva o estado original de window.appContatos (se houver) para restauração
let originalAppContatosBackup = [];
let appContatosBackedUp = false;

window.setTestContatos = function(mockContatos) {
    if (!appContatosBackedUp) {
        // Faz uma cópia profunda do array original
        originalAppContatosBackup = JSON.parse(JSON.stringify(window.appContatos));
        appContatosBackedUp = true;
    }
    // Modifica o array original da aplicação, não o substitui, para manter a referência
    window.appContatos.splice(0, window.appContatos.length, ...mockContatos);
    window.appSalvarContatos(); // Simula salvar para que os testes de localStorage funcionem
    window.appRenderizarContatos(); // Para garantir que a UI reflita
};

window.restoreOriginalContatos = function() {
    if (appContatosBackedUp) {
        window.appContatos.splice(0, window.appContatos.length, ...originalAppContatosBackup);
        appContatosBackedUp = false;
        window.appSalvarContatos(); // Simula salvar para que os testes de localStorage funcionem
        window.appRenderizarContatos(); // Para garantir que a UI reflita
    }
};


document.addEventListener('DOMContentLoaded', () => {
    const rodarTodosOsTestesBtn = document.getElementById('rodarTodosOsTestesBtn');
    if (rodarTodosOsTestesBtn) {
        rodarTodosOsTestesBtn.addEventListener('click', () => {
            console.clear();
            console.log('--- Rodando TODOS os Testes ---');

            window.testesResultados = [];
            window.testesPassados = 0;
            window.testesFalhos = 0;

            // Mockar localStorage, alert e confirm UMA VEZ para toda a execução de testes
            window.mockLocalStorage();
            window.mockAlert(() => {});
            window.mockConfirm(true, () => true); // Default para true, pode ser alterado nos testes

            // Limpa o array da aplicação para o início dos testes, caso já haja dados
            window.appContatos.splice(0, window.appContatos.length);
            window.appSalvarContatos(); // Garante que o localStorage reflita o array vazio
            window.appRenderizarContatos(); // Atualiza a UI para refletir o estado vazio

            // Chama os testes unitários
            if (typeof window.runUnitTests === 'function') {
                window.runUnitTests();
            } else {
                console.warn("Função window.runUnitTests não encontrada. Verifique se 'unitario.test.js' foi carregado.");
            }

            // Chama os testes de componente
            if (typeof window.runComponentTests === 'function') {
                window.runComponentTests();
            } else {
                console.warn("Função window.runComponentTests não encontrada. Verifique se 'componentes.test.js' foi carregado.");
            }


            window.exibirResultadosTestes();
            console.log('--- TODOS os Testes Concluídos ---');

            // Restaurar ambiente após todos os testes
            window.restoreLocalStorage();
            window.restoreAlert();
            window.restoreConfirm();
            window.restoreOriginalContatos(); // Garante que o app.contatos volte ao estado original
        });
    } else {
        console.error("Botão 'rodarTodosOsTestesBtn' não encontrado. Verifique o ID no HTML.");
    }
});