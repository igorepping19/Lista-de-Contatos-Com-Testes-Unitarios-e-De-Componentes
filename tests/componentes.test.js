// tests/componentes.test.js

document.addEventListener('DOMContentLoaded', () => {
    window.runComponentTests = function() {
        console.groupCollapsed('--- Rodando Testes de Componente (8 a 11) ---');

        describe('Interação da UI e Lógica do Formulário', () => {

            let nomeInput, telefoneInput, emailInput, addContatoBtn, listaContatosUL;
            let capturedAlerts = []; // Para capturar mensagens de alert e confirm

            beforeEach(() => {
                // Limpa o localStorage mockado e o array de contatos da aplicação
                window.localStorage.clear();
                window.appContatos.splice(0, window.appContatos.length);
                window.appSalvarContatos(); // Garante que o localStorage reflita o array vazio

                // Mocka alert e confirm para capturar chamadas
                capturedAlerts = [];
                window.mockAlert((message) => { capturedAlerts.push(message); });
                // Para confirm, sempre retorna true para simular o "OK" padrão, a menos que alterado no teste
                window.mockConfirm((message) => { capturedAlerts.push(message); return true; });

                // Re-inicializa os elementos do DOM para cada teste
                nomeInput = window.getById('nome');
                telefoneInput = window.getById('telefone');
                emailInput = window.getById('email');
                addContatoBtn = window.getById('addContatoBtn');
                listaContatosUL = window.getById('listaContatos');

                // Garante que a UI esteja no estado inicial (lista vazia)
                window.appRenderizarContatos();
            });

            // Teste 8: Ao clicar em adicionar os campos devem ficar vazios
            test('Ao adicionar um contato válido, os campos do formulário devem ser limpos', () => {
                window.fireEvent.input(nomeInput, 'Fulano Teste');
                window.fireEvent.input(telefoneInput, '11223344556');
                window.fireEvent.input(emailInput, 'fulano@teste.com');
                window.fireEvent.click(addContatoBtn);

                expect(nomeInput).toHaveValue('');
                expect(telefoneInput).toHaveValue('');
                expect(emailInput).toHaveValue('');
            });

            // Teste 9: O contato deve ser adicionado quando ouvir o clique no botão
            test('Deve adicionar um novo contato e exibi-lo na lista', () => {
                window.fireEvent.input(nomeInput, 'Ciclano');
                window.fireEvent.input(telefoneInput, '987654321');
                window.fireEvent.input(emailInput, 'ciclano@email.com');
                window.fireEvent.click(addContatoBtn);

                // Verifica o array interno e o localStorage
                expect(window.appContatos.length).toBe(1);
                expect(window.localStorage.getItem('listaContatos')).toContain('Ciclano');

                // Verifica a UI
                expect(listaContatosUL).toContainText('Ciclano');
            });

            // Teste 10: Deve excluir um contato quando clicado no botão excluir
            test('Deve remover um contato da lista ao clicar no botão "Excluir"', () => {
                // Adiciona um contato para poder excluí-lo
                window.setTestContatos([{ nome: 'Para Excluir', telefone: '111111111', email: 'excluir@email.com' }]);

                const excluirBtn = window.querySelector('#listaContatos li .excluir-btn');
                expect(excluirBtn).not.toBeNull();
                window.fireEvent.click(excluirBtn);

                expect(window.appContatos.length).toBe(0);
                expect(window.localStorage.getItem('listaContatos')).toEqual('[]');
                expect(listaContatosUL).toContainText('Nenhum contato adicionado ainda.');
            });

            // Teste 11: Deve exibir mensagem de erro caso alguma informação esteja incorreta
            test('Deve exibir alerta de erro e não adicionar contato com dados inválidos', () => {
                window.fireEvent.input(nomeInput, '123'); // Nome inválido
                window.fireEvent.input(telefoneInput, 'curto'); // Telefone inválido
                window.fireEvent.input(emailInput, 'invalido'); // E-mail inválido
                window.fireEvent.click(addContatoBtn);

                expect(capturedAlerts.length).toBe(1); // Um único alerta com todas as mensagens
                expect(capturedAlerts[0]).toContain('O campo Nome deve conter apenas letras e espaços.');
                expect(capturedAlerts[0]).toContain('O campo Telefone deve conter apenas números e ter entre 8 e 11 dígitos.');
                expect(capturedAlerts[0]).toContain('Por favor, insira um E-mail válido.');
                expect(window.appContatos.length).toBe(0); // Contato não deve ser adicionado
            });
        });
        console.groupEnd();
    };
});