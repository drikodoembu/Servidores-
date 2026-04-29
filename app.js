const categoriasContainer = document.getElementById("categoriasContainer");

const modalAcesso = document.getElementById("modalAcesso");
const modalCategoria = document.getElementById("modalCategoria");

const btnNovaCategoria = document.getElementById("btnNovaCategoria");

const tituloModalAcesso = document.getElementById("tituloModalAcesso");
const campoCategoriaAcesso = document.getElementById("categoriaAcesso");
const campoNome = document.getElementById("nome");
const campoDescricao = document.getElementById("descricao");
const campoUrl = document.getElementById("url");

const btnSalvarAcesso = document.getElementById("salvarAcesso");
const btnCancelarAcesso = document.getElementById("cancelarAcesso");

const campoNomeCategoria = document.getElementById("nomeCategoria");
const btnSalvarCategoria = document.getElementById("salvarCategoria");
const btnCancelarCategoria = document.getElementById("cancelarCategoria");

let categorias = JSON.parse(localStorage.getItem("categorias")) || [
  "IPTV",
  "Sites",
  "Painéis",
  "Lojas",
  "Ferramentas",
  "Outros"
];

let acessos = JSON.parse(localStorage.getItem("acessos")) || JSON.parse(localStorage.getItem("servidores")) || [];

let editandoIndex = null;

/* Corrige dados antigos */
acessos = acessos.map(item => {
  return {
    categoria: item.categoria || "IPTV",
    nome: item.nome || "Sem nome",
    descricao: item.descricao || "",
    url: item.url || ""
  };
});

acessos.forEach(item => {
  if (!categorias.includes(item.categoria)) {
    categorias.push(item.categoria);
  }
});

salvarTudo();

function salvarTudo() {
  localStorage.setItem("categorias", JSON.stringify(categorias));
  localStorage.setItem("acessos", JSON.stringify(acessos));
}

function corrigirUrl(url) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }

  return url;
}

function renderCategorias() {
  categoriasContainer.innerHTML = "";

  categorias.forEach(categoria => {
    const box = document.createElement("section");
    box.className = "categoria-box";

    const acessosDaCategoria = acessos.filter(item => item.categoria === categoria);

    box.innerHTML = `
      <div class="categoria-header">
        <h2>📁 ${categoria}</h2>
        <button onclick="abrirModalAcesso(null, '${categoria}')">+ Acesso</button>
      </div>

      <div class="lista-acessos" id="lista-${categoria.replaceAll(" ", "-")}"></div>
    `;

    categoriasContainer.appendChild(box);

    const lista = box.querySelector(".lista-acessos");

    if (acessosDaCategoria.length === 0) {
      lista.innerHTML = `<div class="vazio">Nenhum acesso nesta categoria.</div>`;
      return;
    }

    acessosDaCategoria.forEach(item => {
      const indexReal = acessos.indexOf(item);

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${item.nome}</h3>
        <p>${item.descricao || "Sem descrição"}</p>
        <small>${item.url}</small>

        <div class="actions">
          <a class="abrir" href="${corrigirUrl(item.url)}" target="_blank">Abrir</a>
          <button class="editar" onclick="abrirModalAcesso(${indexReal})">Editar</button>
          <button class="excluir" onclick="excluirAcesso(${indexReal})">Excluir</button>
        </div>
      `;

      lista.appendChild(card);
    });
  });
}

function atualizarSelectCategorias() {
  campoCategoriaAcesso.innerHTML = "";

  categorias.forEach(categoria => {
    const option = document.createElement("option");
    option.value = categoria;
    option.innerText = categoria;
    campoCategoriaAcesso.appendChild(option);
  });
}

function abrirModalAcesso(index = null, categoriaPadrao = "IPTV") {
  editandoIndex = index;
  atualizarSelectCategorias();

  if (index === null) {
    tituloModalAcesso.innerText = "Novo acesso";
    campoCategoriaAcesso.value = categoriaPadrao;
    campoNome.value = "";
    campoDescricao.value = "";
    campoUrl.value = "";
  } else {
    const acesso = acessos[index];

    tituloModalAcesso.innerText = "Editar acesso";
    campoCategoriaAcesso.value = acesso.categoria;
    campoNome.value = acesso.nome;
    campoDescricao.value = acesso.descricao;
    campoUrl.value = acesso.url;
  }

  modalAcesso.classList.remove("hidden");
}

function fecharModalAcesso() {
  modalAcesso.classList.add("hidden");
}

function excluirAcesso(index) {
  const confirmar = confirm("Deseja excluir este acesso?");

  if (!confirmar) return;

  acessos.splice(index, 1);
  salvarTudo();
  renderCategorias();
}

btnSalvarAcesso.onclick = () => {
  const categoria = campoCategoriaAcesso.value.trim();
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

  salvarTudo();
  fecharModalAcesso();
  renderCategorias();
};

btnCancelarAcesso.onclick = fecharModalAcesso;

btnNovaCategoria.onclick = () => {
  campoNomeCategoria.value = "";
  modalCategoria.classList.remove("hidden");
};

btnSalvarCategoria.onclick = () => {
  const novaCategoria = campoNomeCategoria.value.trim();

  if (!novaCategoria) {
    alert("Digite o nome da categoria.");
    return;
  }

  if (categorias.includes(novaCategoria)) {
    alert("Essa categoria já existe.");
    return;
  }

  categorias.push(novaCategoria);
  salvarTudo();

  modalCategoria.classList.add("hidden");
  renderCategorias();
};

btnCancelarCategoria.onclick = () => {
  modalCategoria.classList.add("hidden");
};

renderCategorias();
