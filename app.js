const lista = document.getElementById("lista");
const modal = document.getElementById("modal");

const btnAdd = document.getElementById("btnAdd");
const btnSalvar = document.getElementById("salvar");
const btnCancelar = document.getElementById("cancelar");

let servidores = JSON.parse(localStorage.getItem("servidores")) || [];

function salvarLocal() {
  localStorage.setItem("servidores", JSON.stringify(servidores));
}

function render() {
  lista.innerHTML = "";

  servidores.forEach((s, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div>
        <h2>${s.nome}</h2>
        <p>${s.descricao}</p>
      </div>

      <div class="actions">
        <a href="${s.url}" target="_blank">Abrir</a>
        <button onclick="remover(${index})">X</button>
      </div>
    `;

    lista.appendChild(card);
  });
}

function remover(index) {
  servidores.splice(index, 1);
  salvarLocal();
  render();
}

btnAdd.onclick = () => {
  modal.classList.remove("hidden");
};

btnCancelar.onclick = () => {
  modal.classList.add("hidden");
};

btnSalvar.onclick = () => {
  const nome = document.getElementById("nome").value;
  const descricao = document.getElementById("descricao").value;
  const url = document.getElementById("url").value;

  if (!nome || !url) {
    alert("Preencha nome e link");
    return;
  }

  servidores.push({ nome, descricao, url });
  salvarLocal();
  render();

  modal.classList.add("hidden");

  document.getElementById("nome").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("url").value = "";
};

render();
