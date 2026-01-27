// URL base da API (backend)
const API_URL = "https://lista-de-tarefas-backend-jpqb.onrender.com/tarefas";

// Captura dos elementos da página
const form = document.getElementById("form");
const input = document.getElementById("titulo");
const lista = document.getElementById("lista");

let editandoId = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault(); //Evita recarregar a página

  const titulo = input.value.trim();
  if (!titulo) return;

  // Se existe um id em edição, faz UPDATE (PUT)
  if (editandoId !== null) {
    await fetch(`${API_URL}/${editandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo })
    });

    // Após editar, volta ao modo de criação
    editandoId = null;
  } else {
    // Caso contrário, cria uma nova tarefa (POST)
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo })
    });
  }

  // Limpa o input e recarrega a lista
  input.value = "";
  carregarTarefas();
});

// Função responsável por buscar e renderizar as tarefas
async function carregarTarefas() {
  // Limpa a lista antes de recriar
  lista.innerHTML = "";

  // Busca as tarefas no backend (GET)
  const response = await fetch(API_URL);
  const tarefas = await response.json();

  // Para cada tarefa, cria os elementos HTML
  tarefas.forEach(t => {
    const li = document.createElement("li");

    // Texto da tarefa
    const span = document.createElement("span");
    span.textContent = t.titulo;

    // Botão de editar
    const btnEditar = document.createElement("button");
    btnEditar.textContent = "✏️";
    btnEditar.onclick = () => {
      // Coloca o texto no input e ativa o modo de edição
      input.value = t.titulo;
      editandoId = t.id;
    };

    // Botão de excluir
    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "🗑️";
    btnExcluir.onclick = async () => {
      // Chama o DELETE da API
      await fetch(`${API_URL}/${t.id}`, { method: "DELETE" });
      carregarTarefas();
    };

    // Monta o item da lista
    li.append(span, btnEditar, btnExcluir);
    lista.appendChild(li);
  });
}

// Carrega as tarefas assim que a página abre
carregarTarefas();
