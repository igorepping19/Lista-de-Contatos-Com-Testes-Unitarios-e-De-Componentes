// Função que roda todos os testes
function runUnitTests() {
  
  testar("UNIT - Validar nome", () => {
    if (!window.validarNome("João Silva")) throw new Error("Esperado true para 'João Silva'");
  });

  testar("UNIT - Validar nome", () => {
    if (!window.validarNome("Ana Luíza Costa-Souza")) throw new Error("Esperado true para nome com acentos e hífen");
  });

  testar("UNIT - Validar nome", () => {
    if (window.validarNome("")) throw new Error("Esperado false para nome vazio");
  });

  testar("UNIT - Validar nome", () => {
    if (window.validarNome("João123")) throw new Error("Esperado false para nome com números");
  });

  testar("UNIT - Validar nome", () => {
    if (window.validarNome("João@Silva")) throw new Error("Esperado false para nome com caracteres especiais");
  });

  testar("UNIT - Validar Telefone", () => {
    if (!window.validarTelefone("12345678")) throw new Error("Esperado true para telefone de 8 dígitos");
  });

  testar("UNIT - Validar Telefone", () => {
    if (!window.validarTelefone("912345678")) throw new Error("Esperado true para telefone de 9 dígitos");
  });

  testar("UNIT - Validar Telefone", () => {
    if (!window.validarTelefone("11987654321")) throw new Error("Esperado true para telefone de 11 dígitos");
  });

  testar("UNIT - Validar Telefone", () => {
    if (!window.validarTelefone("(11) 98765-4321")) throw new Error("Esperado true para telefone formatado");
  });

  testar("UNIT - Validar Telefone", () => {
    if (window.validarTelefone("1234567")) throw new Error("Esperado false para telefone com menos de 8 dígitos");
  });

  testar("UNIT - Validar Telefone", () => {
    if (window.validarTelefone("123456789012")) throw new Error("Esperado false para telefone com mais de 11 dígitos");
  });

  testar("UNIT - Validar Telefone", () => {
    if (window.validarTelefone("123abc456")) throw new Error("Esperado false para telefone com letras");
  }); 
 
  testar("UNIT - Validar Email", () => {
    if (!window.validarEmail("teste@example.com")) throw new Error("Esperado true para e-mail válido");
  });

  testar("UNIT - Validar Email", () => {
    if (window.validarEmail("testeexample.com")) throw new Error("Esperado false para e-mail sem @");
  });

  testar("UNIT - Validar Email", () => {
    if (window.validarEmail("teste@.com")) throw new Error("Esperado false para e-mail sem domínio");
  });

  testar("UNIT - Validar Email", () => {
    if (window.validarEmail("teste @example.com")) throw new Error("Esperado false para e-mail com espaço");
  });

  testar("UNIT - Validar Email", () => {
    if (window.validarEmail("")) throw new Error("Esperado false para e-mail vazio");
  });

     testar("UNIT - Verificar duplicidade", () => {
    // Limpar contatos para este teste
    window.appContatos.splice(0, window.appContatos.length);
    const mensagem = window.verificarDuplicidade("Novo Contato", "123456789", "novo@email.com");
    if (mensagem !== "") throw new Error("Esperado nenhuma mensagem de duplicidade");
  });

  testar("UNIT - Verificar duplicidade", () => {
    // Adiciona um contato existente
    window.appContatos.splice(0, window.appContatos.length);
    window.appContatos.push({ nome: "Duplicado", telefone: "111111111", email: "duplicado@teste.com" });
    const mensagem = window.verificarDuplicidade("Duplicado", "111111111", "duplicado@teste.com");
    if (!mensagem.includes("Um contato com este nome, telefone e e-mail já existe")) throw new Error("Esperado mensagem completa de duplicidade");
  });

  testar("UNIT - Verificar duplicidade", () => {
    window.appContatos.splice(0, window.appContatos.length);
    window.appContatos.push({ nome: "Apenas Nome", telefone: "999999999", email: "diferente@email.com" });
    const mensagem = window.verificarDuplicidade("Apenas Nome", "123123123", "outro@email.com");
    if (!mensagem.includes("Um contato com este nome já existe")) throw new Error("Esperado mensagem de duplicidade de nome");
  });

  testar("UNIT - Salvar contatos e Carregar contatos", () => {
    // Limpa e adicionar um contato para teste de persistência
    localStorage.clear();
    window.appContatos.splice(0, window.appContatos.length);
    window.appContatos.push({ nome: "Persistido", telefone: "123456780", email: "persistido@test.com" });
    window.appSalvarContatos(); // Salva o contato

    window.appContatos.splice(0, window.appContatos.length); // Esvazia o array
    window.appCarregarContatos(); // Carrega do localStorage

    if (window.appContatos.length !== 1 || window.appContatos[0].nome !== "Persistido") {
      throw new Error("Contatos não foram salvos e carregados corretamente");
    }
  });
}
