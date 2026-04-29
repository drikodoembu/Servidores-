const lista = document.getElementById("lista");
const tabs = document.getElementById("tabs");
const modal = document.getElementById("modal");

const btnAdd = document.getElementById("btnAdd");
const btnSalvar = document.getElementById("salvar");
const btnCancelar = document.getElementById("cancelar");

const modalTitulo = document.getElementById("modalTitulo");
const campoCategoria = document.getElementById("categoria");
const campoNome = document.getElementById("nome");
const campoDescricao = document.getElementById("descricao");
const campoUrl = document.getElementById("url");

let categoriaAtual = "Todos";
let editandoIndex = null;

let acessos = JSON.parse(localStorage.getItem("acessos")) || [
  {
    categoria: "IPTV",
    nome: "Login P2SPEED",
    descricao: "Servidor IPTV",
    url: "https://seulink.com"
  }
];

const categoriasFixas = ["Todos", "IPTV", "Sites", "Lojas", "Painéis", "Outros"];

function salvarLocal() {
  localStorage.setItem("acessos", JSON.stringify(acessos));
}

function abrirModal(index = null) {
  editandoIndex = index;

  if (index === null) {
    modalTitulo.innerText = "Novo acesso";
    campoCategoria.value = categoriaAtual !== "Todos" ? categoriaAtual : "IPTV";
    campoNome.value = "";
    campoDescricao.value = "";
    campoUrl.value = "";
  } else {
    const acesso = acessos[index];

    modalTitulo.innerText = "Editar acesso";
    campoCategoria.value = acesso.categoria;
    campoNome.value = acesso.nome;
    campoDescricao.value = acesso.descricao;
    campoUrl.value = acesso.url;
  }

  modal.classList.remove("hidden");
}

function fecharModal() {
  modal.classList.add("hidden");
}

function renderTabs() {
  tabs.innerHTML = "";

  categoriasFixas.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "tab";

    if (cat === categoriaAtual) {
      btn.classList.add("active");
    }

    btn.innerText = cat;

    btn.onclick = () => {
      categoriaAtual = cat;
      renderTabs();
      renderLista();
    };

    tabs.appendChild(btn);
  });
}

function renderLista() {
  lista.innerHTML = "";

  const filtrados = categoriaAtual === "Todos"
    ? acessos
    : acessos.filter(item => item.categoria === categoriaAtual);

  if (filtrados.length === 0) {
    lista.innerHTML = `<p class="vazio">Nenhum acesso nessa categoria.</p>`;
    return;
  }

  filtrados.forEach((item) => {
    const indexReal = acessos.indexOf(item);

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-top">
        <div>
          <h2>${item.nome}</h2>
          <p>${item.descricao || "Sem descrição"}</p>
          <span class="categoriaTag">${item.categoria}</span>
        </div>
      </div>

      <div class="actions">
        <a class="abrir" href="${corrigirUrl(item.url)}" target="_blank">Abrir</a>
        <button class="editar" onclick="abrirModal(${indexReal})">Editar</button>
        <button class="excluir" onclick="excluirAcesso(${indexReal})">Excluir</button>
      </div>
    `;

    lista.appendChild(card);
  });
}

function corrigirUrl(url) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }

  return url;
}

function excluirAcesso(index) {
  const confirmar = confirm("Deseja excluir este acesso?");

  if (!confirmar) return;

  acessos.splice(index, 1);
  salvarLocal();
  renderLista();
}

btnAdd.onclick = () => abrirModal();

btnCancelar.onclick = () => fecharModal();

btnSalvar.onclick = () => {
  const categoria = campoCategoria.value.trim();
  const nome = campoNome.value.trim();
  const descricao = campoDescricao.value.trim();
  const url = campoUrl.value.trim();

  if (!nome || !url) {
    alert("Preencha pelo menos o nome e o link.");
    return;
  }

  const dados = {
    categoria,
    nome,
    descricao,
    url
  };

  if (editandoIndex === null) {
    acessos.push(dados);
  } else {
    acessos[editandoIndex] = dados;
  }

  salvarLocal();
  fecharModal();
  renderTabs();
  renderLista();
};

renderTabs();
renderLista();
