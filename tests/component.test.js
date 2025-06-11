function runComponentTests() {
  testar("COMPONENT - Inputs de contato devem estar presentes na página", () => {
    const nomeInput = document.getElementById("nome");
    const telefoneInput = document.getElementById("telefone");
    const emailInput = document.getElementById("email");

    if (!nomeInput || !telefoneInput || !emailInput) {
      throw new Error("Um ou mais inputs de contato não foram encontrados");
    }
  });

  testar("COMPONENT - Adicionar Contato: Preenchimento e clique devem adicionar à lista", () => {
    const nomeInput = document.getElementById('nome');
    const telefoneInput = document.getElementById('telefone');
    const emailInput = document.getElementById('email');
    const addContatoBtn = document.getElementById('addContatoBtn');
    const listaContatosUL = document.getElementById('listaContatos');

    // Limpa o localStorage e a lista de contatos do app antes do teste
    localStorage.clear();
    window.appContatos.splice(0, window.appContatos.length);
    window.appRenderizarContatos();

    // Preenche os inputs
    nomeInput.value = "João da Silva";
    telefoneInput.value = "11987654321";
    emailInput.value = "joao@example.com";

    // Clica no botão adicionar
    addContatoBtn.click();

    // Verifica se o contato foi adicionado à lista visualmente
    const itensLista = listaContatosUL.querySelectorAll('li');
    if (itensLista.length === 0) {
      throw new Error("Nenhum item adicionado à lista visualmente");
    }
    const textoPrimeiroItem = itensLista[0].textContent;
    if (!textoPrimeiroItem.includes("João da Silva") || !textoPrimeiroItem.includes("11987654321") || !textoPrimeiroItem.includes("joao@example.com")) {
      throw new Error("O item adicionado não contém as informações corretas");
    }

    // Verifica se o contato foi adicionado ao array interno do app
    if (window.appContatos.length !== 1 || window.appContatos[0].nome !== "João da Silva") {
      throw new Error("Contato não adicionado corretamente ao array interno do app");
    }
  });

  testar("COMPONENT - Excluir Contato: Deve remover o contato da lista", () => {
    // Limpa e adiciona um contato para o teste de exclusão
    localStorage.clear();
    window.appContatos.splice(0, window.appContatos.length);
    window.appContatos.push({ nome: "Maria Teste", telefone: "999998888", email: "maria@teste.com" });
    window.appSalvarContatos();
    window.appRenderizarContatos();

    const listaContatosUL = document.getElementById('listaContatos');
    const btnExcluir = listaContatosUL.querySelector('.excluir-btn');

    if (!btnExcluir) {
      throw new Error("Botão de excluir não encontrado para o teste");
    }

    btnExcluir.click();

    

    // Verifica se a lista visual está vazia ou o item foi removido
    const itensLista = listaContatosUL.querySelectorAll('li');
    if (itensLista.length > 0 && itensLista[0].textContent.includes("Maria Teste")) {
      throw new Error("Contato não foi removido visualmente da lista");
    }

    // Verifica se o contato foi removido do array interno do app
    if (window.appContatos.length !== 0) {
      throw new Error("Contato não removido do array interno do app");
    }
  });

  testar("COMPONENT - Validação de campos vazios deve exibir alerta", () => {
    const nomeInput = document.getElementById('nome');
    const telefoneInput = document.getElementById('telefone');
    const emailInput = document.getElementById('email');
    const addContatoBtn = document.getElementById('addContatoBtn');

    // Limpa inputs
    nomeInput.value = "";
    telefoneInput.value = "";
    emailInput.value = "";

    let alertaChamado = false;
    const originalAlert = window.alert;
    window.alert = (message) => {
      alertaChamado = true;
      if (!message.includes("O campo Nome é obrigatório") || !message.includes("O campo Telefone é obrigatório") || !message.includes("O campo E-mail é obrigatório")) {
        throw new Error("Mensagem de alerta incorreta para campos vazios");
      }
    };

    addContatoBtn.click();

    window.alert = originalAlert; // Restaurar a função alert original

    if (!alertaChamado) {
      throw new Error("Alerta de validação para campos vazios não foi chamado");
    }
  });

   testar("COMPONENT - Verificação de duplicidade deve chamar o confirm e não adicionar se cancelado", () => {
    // Limpa e adiciona um contato para simular duplicidade
    localStorage.clear();
    window.appContatos.splice(0, window.appContatos.length);
    window.appContatos.push({ nome: "Duplicado", telefone: "123456789", email: "duplicado@teste.com" });
    window.appSalvarContatos();
    window.appRenderizarContatos(); // Renderiza para simular estado inicial

    const nomeInput = document.getElementById('nome');
    const telefoneInput = document.getElementById('telefone');
    const emailInput = document.getElementById('email');
    const addContatoBtn = document.getElementById('addContatoBtn');
    const listaContatosUL = document.getElementById('listaContatos');

    nomeInput.value = "Duplicado";
    telefoneInput.value = "123456789";
    emailInput.value = "duplicado@teste.com";

    let confirmChamado = false;
    const originalConfirm = window.confirm;
    window.confirm = (message) => {
      confirmChamado = true;
      if (!message.includes("já existe")) {
        throw new Error("Mensagem de confirmação de duplicidade incorreta");
      }
      return false; // Retorna false para simular o usuário clicando em "Cancelar"
    };

    addContatoBtn.click();

    window.confirm = originalConfirm; // Restaura a função confirm original

    if (!confirmChamado) {
      throw new Error("Confirmação de duplicidade não foi chamada");
    }

    if (window.appContatos.length !== 1) {
      throw new Error("Contato duplicado foi adicionado apesar do cancelamento");
    }

    const itensLista = listaContatosUL.querySelectorAll('li');
    
    if (itensLista.length !== 1) {
      throw new Error("A lista visual foi alterada indevidamente após o cancelamento da duplicidade");
    }
    if (!itensLista[0].textContent.includes("Duplicado")) {
      throw new Error("O contato original sumiu da lista visual após o cancelamento da duplicidade");
    }
  });

}