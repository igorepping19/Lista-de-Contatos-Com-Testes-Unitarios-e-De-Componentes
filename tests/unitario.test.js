// tests/unitario.test.js

document.addEventListener('DOMContentLoaded', () => {
    window.runUnitTests = function() {
        console.groupCollapsed('--- Rodando Testes Unitários de Validação (1 a 7) ---');

        describe('Funções de Validação', () => {

            // Teste 1: Validar se o nome é válido (letras e espaços)
            // Teste 2: Exibir erro se for nome inválido (coberto pelo teste de validação e interação da UI)
            describe('validarNome', () => {
                test('deve retornar true para nomes válidos e false para nomes inválidos', () => {
                    expect(window.validarNome('Ana')).toBe(true);
                    expect(window.validarNome('Carlos Silva')).toBe(true);
                    expect(window.validarNome('Nome123')).toBe(false); // Inválido: contém números
                    expect(window.validarNome('')).toBe(false);        // Inválido: vazio
                });
            });

            // Teste 3: Validar telefone com 8 a 11 dígitos
            // Teste 4: Exibir erro se número fora do padrão (coberto pelo teste de validação e interação da UI)
            describe('validarTelefone', () => {
                test('deve retornar true para telefones válidos e false para telefones inválidos', () => {
                    expect(window.validarTelefone('98765432')).toBe(true);      // 8 dígitos
                    expect(window.validarTelefone('11987654321')).toBe(true);   // 11 dígitos
                    expect(window.validarTelefone('123')).toBe(false);         // Inválido: menos de 8
                    expect(window.validarTelefone('123456789012')).toBe(false); // Inválido: mais de 11
                    expect(window.validarTelefone('abc')).toBe(false);         // Inválido: não numérico
                });
            });

            // Teste 5: Validar e-mail válido
            // Teste 6: Exibir erro se for e-mail inválido (coberto pelo teste de validação e interação da UI)
            describe('validarEmail', () => {
                test('deve retornar true para emails válidos e false para emails inválidos', () => {
                    expect(window.validarEmail('teste@dominio.com')).toBe(true);
                    expect(window.validarEmail('usuario.nome@sub.dominio.com.br')).toBe(true);
                    expect(window.validarEmail('emailinvalido')).toBe(false); // Inválido: sem @
                    expect(window.validarEmail('@dominio.com')).toBe(false);  // Inválido: sem nome de usuário
                });
            });

            // Teste 7: Deve Exibir mensagem de duplicidade
            describe('verificarDuplicidade', () => {
                beforeEach(() => {
                    // Limpa o array de contatos para cada teste de duplicidade
                    window.appContatos.splice(0, window.appContatos.length);
                });

                test('deve retornar uma mensagem se o nome e telefone já existirem', () => {
                    window.appContatos.push({ nome: 'João', telefone: '123456789', email: 'joao@email.com' });
                    const mensagem = window.verificarDuplicidade('João', '123456789', 'novo@email.com');
                    expect(mensagem).toContain('Um contato com este nome e telefone já existe.');
                });

                test('deve retornar string vazia se não houver duplicidade', () => {
                    window.appContatos.push({ nome: 'Maria', telefone: '987654321', email: 'maria@email.com' });
                    const mensagem = window.verificarDuplicidade('Pedro', '111111111', 'pedro@email.com');
                    expect(mensagem).toBe('');
                });
            });
        });
        console.groupEnd();
    };
});