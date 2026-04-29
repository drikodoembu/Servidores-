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

let acessos =
  JSON.parse(localStorage.getItem("acessos")) ||
  JSON.parse(localStorage.getItem("servidores")) ||
  [];

let categoriasAbertas =
  JSON.parse(localStorage.getItem("categoriasAbertas")) || {};

let editandoIndex = null;

acessos = acessos.map(item => ({
  categoria: item.categoria || "IPTV",
  nome: item.nome || "Sem nome",
  descricao: item.descricao || "",
  url: item.url || ""
}));

acessos.forEach(item => {
  if (!categorias.includes(item.categoria)) {
    categorias.push(item.categoria);
  }
});

categorias.forEach(cat => {
  if (categoriasAbertas[cat] === undefined) {
    categoriasAbertas[cat] = true;
  }
});

salvarTudo();

function salvarTudo() {
  localStorage.setItem("categorias", JSON.stringify(categorias));
  localStorage.setItem("acessos", JSON.stringify(acessos));
  localStorage.setItem("categoriasAbertas", JSON.stringify(categoriasAbertas));
}

function corrigirUrl(url) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }
  return url;
}

function limparTexto(texto) {
  return String(texto).replace(/'/g, "\\'");
}

function alternarCategoria(categoria) {
  categoriasAbertas[categoria] = !categoriasAbertas[categoria];
  salvarTudo();
  renderCategorias();
}

function renderCategorias() {
  categoriasContainer.innerHTML = "";

  categorias.forEach(categoria => {
    const aberta = categoriasAbertas[categoria] !== false;
    const acessosDaCategoria = acessos.filter(item => item.categoria === categoria);

    const box = document.createElement("section");
    box.className = "categoria-box";

    box.innerHTML = `
      <div class="categoria-header">
        <button class="btn-seta" onclick="alternarCategoria('${limparTexto(categoria)}')">
          ${aberta ? "▼" : "▶"}
        </button>

        <h2>📁 ${categoria}</h2>

        <button class="btn-acesso" onclick="abrirModalAcesso(null, '${limparTexto(categoria)}')">
          + Acesso
        </button>

        <button class="btn-del-cat" onclick="deletarCategoria('${limparTexto(categoria)}')">
          Excluir
        </button>
      </div>

      <div class="lista-acessos ${aberta ? "" : "fechada"}"></div>
    `;

    categoriasContainer.appendChild(box);

    const lista = box.querySelector(".lista-acessos");

    if (!aberta) return;

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
          <button class="mover" onclick="moverAcesso(${indexReal})">Mover</button>
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
  if (!confirm("Deseja excluir este acesso?")) return;

  acessos.splice(index, 1);
  salvarTudo();
  renderCategorias();
}

function moverAcesso(index) {
  let texto = "Digite o número da categoria para mover:\n\n";

  categorias.forEach((cat, i) => {
    texto += `${i + 1} - ${cat}\n`;
  });

  const escolha = prompt(texto);

  if (!escolha) return;

  const numero = parseInt(escolha);

  if (isNaN(numero) || numero < 1 || numero > categorias.length) {
    alert("Categoria inválida.");
    return;
  }

  const novaCategoria = categorias[numero - 1];

  acessos[index].categoria = novaCategoria;
  categoriasAbertas[novaCategoria] = true;

  salvarTudo();
  renderCategorias();
}

function deletarCategoria(categoria) {
  const temAcessos = acessos.some(item => item.categoria === categoria);

  if (temAcessos) {
    const mover = confirm(
      `A categoria "${categoria}" possui acessos.\n\nDeseja mover esses acessos para "Outros" antes de excluir?`
    );

    if (!mover) return;

    if (!categorias.includes("Outros")) {
      categorias.push("Outros");
      categoriasAbertas["Outros"] = true;
    }

    acessos = acessos.map(item => {
      if (item.categoria === categoria) {
        return { ...item, categoria: "Outros" };
      }
      return item;
    });
  }

  categorias = categorias.filter(cat => cat !== categoria);
  delete categoriasAbertas[categoria];

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

  categoriasAbertas[categoria] = true;

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
  categoriasAbertas[novaCategoria] = true;

  salvarTudo();

  modalCategoria.classList.add("hidden");
  renderCategorias();
};

btnCancelarCategoria.onclick = () => {
  modalCategoria.classList.add("hidden");
};

renderCategorias();
