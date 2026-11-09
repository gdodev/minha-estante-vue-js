<script setup>
// Etapa #1
const titulo = "Minha Estante";
const frase = "Um leitor vive mil vidas antes de morrer.";
const descricaoHtml = "Acompanhe suas <strong>leituras</strong> e metas.";
const linkDocs = "https://vuejs.org";
const appEmManutencao = false;
const anoAtual = new Date().getFullYear();
const atributosRodape = {
  id: "rodape",
  class: "rodape",
  title: "Rodapé do app",
};
const atributo = "title";

// Etapa #2
import {
  ref,
  reactive,
  computed,
  watch,
  onWatcherCleanup,
  watchEffect,
  useTemplateRef,
  onMounted,
  nextTick,
} from "vue";

// Etapa #12
// Registro local: basta importar no <script setup> para usar no template.
import CardSecao from "./components/CardSecao.vue";
import AbaLista from "./components/AbaLista.vue";
import AbaEstatisticas from "./components/AbaEstatisticas.vue";

const inputTitulo = useTemplateRef("input-titulo");
const inputBusca = useTemplateRef("input-busca");
// Instância da aba que estiver na tela (AbaLista ou AbaEstatisticas)
const componenteAba = useTemplateRef("componente-aba");

onMounted(() => {
  inputTitulo.value.focus();

  window.addEventListener("keydown", (evento) => {
    if (evento.key !== "/") return;

    // Se o usuário está digitando em algum campo, "/" é só um caractere
    const alvo = evento.target;
    const digitando =
      alvo.tagName === "INPUT" ||
      alvo.tagName === "TEXTAREA" ||
      alvo.tagName === "SELECT" ||
      alvo.isContentEditable;
    if (digitando) return;

    evento.preventDefault(); // impede que a "/" seja digitada no input
    inputBusca.value.focus();
  });
});

const CHAVE_TEMA_ESCURO = "tema-escuro";
const CHAVE_USUARIO = "usuario";
const CHAVE_LIVROS = "livros";
const LIVROS_PADRAO = ref([
  {
    id: 1,
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    paginas: 256,
    lido: true,
    nota: 5,
    genero: "Romance",
    formato: "Físico",
    tags: ["Clássico", "Favorito"],
    resenha: "Capitu traiu ou não traiu? A dúvida que atravessa gerações.",
  },
  {
    id: 2,
    titulo: "O Hobbit",
    autor: "J.R.R. Tolkien",
    paginas: 310,
    lido: false,
    nota: 0,
    genero: "Fantasia",
    formato: "E-book",
    tags: ["Emprestado"],
    resenha:
      "Um hobbit caseiro arrastado para uma aventura com anões, um mago e um dragão. Na lista para descobrir se Bilbo volta para casa a tempo do chá.",
  },
  {
    id: 3,
    titulo: "1984",
    autor: "George Orwell",
    paginas: 328,
    lido: true,
    nota: 4,
    genero: "Ficção científica",
    formato: "Audiobook",
    tags: ["Clássico", "Releitura"],
    resenha: "Assustadoramente atual. O Grande Irmão continua de olho.",
  },
]);

function carregar(chave, valorPadrao) {
  const salvo = localStorage.getItem(chave);
  return salvo ? JSON.parse(salvo) : valorPadrao;
}

const livros = ref(carregar(CHAVE_LIVROS, LIVROS_PADRAO));

// Etapa #10
// Salva a lista no localStorage sempre que ela mudar.
// Sem { deep: true }, o watch de um ref só dispara quando o .value é
// SUBSTITUÍDO (ex.: livros.value = []). Mutações não seriam percebidas:
// nem no array (push, splice) nem dentro de cada livro (lido, nota, título).
watch(
  livros,
  (livrosAtualizados) => {
    localStorage.setItem(CHAVE_LIVROS, JSON.stringify(livrosAtualizados));
  },
  { deep: true },
);

const usuario = reactive(
  carregar(CHAVE_USUARIO, { nome: "Guilherme de Oliveira", metaAnual: 12 }),
);

// Aqui não precisa de { deep: true }: quando o watch recebe um objeto
// REACTIVE diretamente, o Vue já observa em profundidade automaticamente
// (mudar usuario.nome ou usuario.metaAnual dispara o watcher).
// Com REF é diferente: o watch é raso por padrão e só percebe a troca do
// .value inteiro. Por isso o watcher de livros (um ref) precisa do deep.
watch(usuario, (usuarioAtualizado) => {
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuarioAtualizado));
});

watch(
  () => usuario.metaAnual,
  (metaAtualizada, metaAntiga) => {
    console.log(`Meta anual mudou de ${metaAntiga} para ${metaAtualizada}`);
  },
);

const temaEscuro = ref(carregar(CHAVE_TEMA_ESCURO, false));

// temaEscuro é um ref com um booleano (valor primitivo): não há nada "dentro"
// dele para mudar. Alternar o tema SUBSTITUI o .value (true <-> false), que é
// justamente o que um watch raso detecta, então o deep não é necessário.
watch(temaEscuro, (temaAtualizado) => {
  localStorage.setItem(CHAVE_TEMA_ESCURO, JSON.stringify(temaAtualizado));
});

function aumentarMeta() {
  usuario.metaAnual += 1;
}

function adicionarLivroTeste() {
  livros.value.push({
    id: 4,
    titulo: "Título 4",
    autor: "Autor 4",
    paginas: 4,
    lido: false,
    nota: 4,
  });
}

function marcarPrimeiroComoLido() {
  if (livros.value.length >= 2) {
    livros.value[1].lido = true;
  }
}

const livrosLidos = computed(() => livros.value.filter((livro) => livro.lido));

const totalLidos = computed(() => livrosLidos.value.length);

const totalPaginasLidas = computed(() =>
  livrosLidos.value.reduce((total, livro) => total + livro.paginas, 0),
);

const progressoMeta = computed(() => {
  return Math.min(
    100,
    Math.floor((totalLidos.value / usuario.metaAnual) * 100),
  );
});

watch(progressoMeta, (progressoAtualizado, progressoAntigo) => {
  if (progressoAtualizado === 100 && progressoAntigo !== 100) {
    alert("🎉 Parabéns, meta batida!");
  }
});

const livrosOrdenados = computed(() =>
  livros.value.toSorted((a, b) => a.titulo.localeCompare(b.titulo)),
);

const mediaNotas = computed(() => {
  const lidos = livrosLidos.value;
  if (lidos.length === 0) {
    return "-";
  }
  const soma = lidos.reduce((total, livro) => total + livro.nota, 0);
  return (soma / lidos.length).toFixed(1);
});

const primeiroNome = computed({
  get() {
    return usuario.nome.trim().split(/\s+/)[0];
  },
  set(novoPrimeiroNome) {
    const restoDoNome = usuario.nome.trim().split(/\s+/).slice(1);
    usuario.nome = [novoPrimeiroNome.trim(), ...restoDoNome]
      .filter(Boolean)
      .join(" ");
  },
});

function limparEstante() {
  livros.value = [];
}

// Etapa #12: abas com componente dinâmico
// O filtro agora mora dentro da AbaLista (estado local da aba).
const abaAtual = ref("lista");

// Cada aba recebe props diferentes. Montar o objeto conforme a aba evita
// passar, por exemplo, :livros para a AbaEstatisticas, que não declara
// essa prop (ela cairia como atributo HTML no elemento raiz).
// No v-bind, chaves "onAlgumaCoisa" viram listeners: onAlternarLido
// equivale a @alternar-lido.
const propsDaAba = computed(() => {
  if (abaAtual.value === "lista") {
    return {
      livros: livrosOrdenados.value,
      idsDetalhes: idsLivrosDetalhes.value,
      onAlternarLido: alternarLido,
      onRemover: removerLivro,
      onAvaliar: avaliarLivro,
      onAlternarDetalhes: alternarDetalhes,
      onEditarTitulo: editarTitulo,
      onOcultarDetalhes: ocultarTodosDetalhes,
    };
  }
  return {
    totalLidos: totalLidos.value,
    totalPaginasLidas: totalPaginasLidas.value,
    progressoMeta: progressoMeta.value,
    mediaNotas: mediaNotas.value,
  };
});

function editarTitulo(idLivro, titulo) {
  const livro = livros.value.find((livro) => livro.id === idLivro);
  if (livro) livro.titulo = titulo;
}

function alternarLido(livro) {
  livro.lido = !livro.lido;
}

function removerLivro(idLivro) {
  const index = livros.value.findIndex((livro) => livro.id === idLivro);
  // console.log(`[removerLivro] index: ${index}`);
  if (index !== -1) {
    let text = "Tem certeza que deseja remover o livro?";
    if (confirm(text) == true) {
      livros.value.splice(index, 1);
    }
  }
}
const idsLivrosDetalhes = ref([]);

function avaliarLivro(idLivro, nota) {
  const index = livros.value.findIndex((livro) => livro.id === idLivro);
  if (index !== -1) {
    livros.value[index].nota = nota;
  }
}

function alternarDetalhes(idLivro) {
  const index = idsLivrosDetalhes.value.indexOf(idLivro);
  if (index >= 0) {
    idsLivrosDetalhes.value.splice(index, 1);
  } else {
    idsLivrosDetalhes.value.push(idLivro);
  }
}

function logEvento(mensagem, evento) {
  console.log(
    `[logEvento] mensagem: "${mensagem}", evento.target.tagName: ${evento.target.tagName}`,
  );
}

function ocultarTodosDetalhes() {
  idsLivrosDetalhes.value.splice(0);
}

// Etapa #9
function livroVazio() {
  return {
    titulo: "",
    autor: "",
    paginas: null,
    genero: "",
    formato: "",
    tags: [],
    lido: false,
    resenha: "",
  };
}

const novoLivro = reactive(livroVazio());

async function adicionarLivro() {
  // O spread (...) cria um objeto NOVO com uma cópia dos campos do formulário.
  // Sem ele, push(novoLivro) colocaria na lista o próprio objeto do formulário
  // (mesma referência): limpar ou editar o formulário alteraria o livro também.
  // A cópia é rasa, então o array de tags também precisa ser copiado com [...].
  const id = Date.now();
  livros.value.push({ ...novoLivro, tags: [...novoLivro.tags], id, nota: 0 });
  Object.assign(novoLivro, livroVazio());
  inputTitulo.value.focus();

  await nextTick(); // agora o <li> novo já existe no DOM
  // A lista está dentro da AbaLista, que expõe rolarAteLivro (defineExpose).
  // Se a aba visível for a de estatísticas, o método não existe e nada acontece.
  componenteAba.value?.rolarAteLivro?.(id);
}

// Adiciona um livro vindo da busca na Open Library.
// O livroVazio() fornece os campos padrão (páginas, gênero, tags...) e
// só título e autor são sobrescritos com os dados do resultado.
// Verdadeiro se já existe na estante um livro com o mesmo título e autor.
// Usado para desabilitar o botão e evitar adicionar o mesmo livro duas vezes.
function estaNaEstante(resultado) {
  return livros.value.some(
    (livro) =>
      livro.titulo === resultado.titulo &&
      livro.autor === (resultado.autor ?? ""),
  );
}

function adicionarDaBusca(resultado) {
  livros.value.push({
    ...livroVazio(),
    titulo: resultado.titulo,
    autor: resultado.autor ?? "",
    id: Date.now(),
    nota: 0,
  });
}

const formularioValido = computed(() => {
  return novoLivro.titulo.length > 0 && novoLivro.autor.length > 0;
});

const termoBusca = ref("");

const buscando = ref(false);
const resultados = ref([]);
const erroBusca = ref("");
watch(termoBusca, (termoBuscaAtualizado, termoBuscaAntigo) => {
  if (termoBuscaAtualizado.length < 3) {
    resultados.value = [];
    return;
  }

  const controller = new AbortController();

  const timer = setTimeout(async () => {
    buscando.value = true;
    erroBusca.value = "";

    try {
      const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(termoBuscaAtualizado)}&limit=5`;
      const resposta = await fetch(url, { signal: controller.signal });

      // fetch NÃO lança erro para status 404/500, só para falha de rede.
      // Por isso é preciso checar manualmente:
      if (!resposta.ok) {
        throw new Error(`Erro HTTP ${resposta.status}`);
      }

      const jsonResposta = await resposta.json();

      resultados.value = jsonResposta.docs.map((doc) => ({
        titulo: doc.title,
        autor: doc.author_name?.[0],
      }));
    } catch (erro) {
      // Cancelamento proposital (o usuário digitou de novo): não é erro de verdade
      if (erro.name === "AbortError") return;

      console.error("Falha na busca:", erro);
      erroBusca.value = "Não foi possível buscar os livros. Tente novamente.";
      resultados.value = [];
    } finally {
      buscando.value = false;
    }
  }, 500);

  onWatcherCleanup(() => {
    clearTimeout(timer); // termo mudou ANTES dos 500 ms → a busca nem começa
    controller.abort(); // termo mudou DEPOIS → cancela o fetch em andamento
  });
});

watchEffect(() => {
  document.title = `Minha Estante (${totalLidos.value}/${usuario.metaAnual})`;
});
</script>

<template>
  <div class="app" :class="{ escuro: temaEscuro }">
    <!-- ===================== BOTÃO DE TEMA ===================== -->
    <!-- Fica fixo no canto superior direito. Tema claro (false): mostra
     a lua, para ativar o escuro. Tema escuro (true): mostra o sol. -->
    <button
      type="button"
      class="botao-tema"
      :aria-label="temaEscuro ? 'Ativar tema claro' : 'Ativar tema escuro'"
      :title="temaEscuro ? 'Ativar tema claro' : 'Ativar tema escuro'"
      @click="temaEscuro = !temaEscuro"
    >
      <!-- Lua -->
      <svg
        v-if="!temaEscuro"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <!-- Sol -->
      <svg
        v-else
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="5" />
        <path
          d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        />
      </svg>
    </button>

    <!-- ===================== CABEÇALHO ===================== -->
    <header class="cabecalho">
      <h1 :[atributo]="frase">{{ titulo }}</h1>
      <p class="frase">{{ frase.toUpperCase() }}</p>
      <p v-html="descricaoHtml"></p>
      <a :href="linkDocs">Documentação Vue.js</a>
    </header>

    <main>
      <div class="coluna">
        <!-- ===================== META DE LEITURA ===================== -->
        <CardSecao titulo="Meta de leitura" class="regiao-meta">
          <p>
            Olá, {{ usuario.nome }}! Sua meta é ler
            {{ usuario.metaAnual }} livros.
          </p>
          <button @click="aumentarMeta">+1 na meta</button>

          <!-- A barra e a mensagem motivacional foram para a AbaEstatisticas -->
          <template v-if="livros.length > 0">
            <!-- <p :class="['card', livros[0].lido ? 'livro-lido' : '']">{{ livros[0].titulo }}</p>
            <p :class="['card', livros[1].lido ? 'livro-lido' : '']">{{ livros[1].titulo }}</p>
            <p :class="['card', livros[2].lido ? 'livro-lido' : '']">{{ livros[2].titulo }}</p> -->
            <p
              v-for="livro in livros"
              :key="livro.id"
              :class="['card', { 'livro-lido': livro.lido }]"
            >
              {{ livro.titulo }}
            </p>
          </template>
        </CardSecao>

        <!-- ===================== ESTANTE ===================== -->
        <CardSecao titulo="Minha estante" class="regiao-estante">
          <p>Quantidade de livros: {{ livros.length }}</p>

          <div class="acoes">
            <button @click="limparEstante">Limpar estante</button>
          </div>

          <!-- Botões das abas: só trocam o valor de abaAtual -->
          <div class="abas" role="group" aria-label="Visualização da estante">
            <button
              type="button"
              :class="{ ativa: abaAtual === 'lista' }"
              :aria-pressed="abaAtual === 'lista'"
              @click="abaAtual = 'lista'"
            >
              Lista
            </button>
            <button
              type="button"
              :class="{ ativa: abaAtual === 'estatisticas' }"
              :aria-pressed="abaAtual === 'estatisticas'"
              @click="abaAtual = 'estatisticas'"
            >
              Estatísticas
            </button>
          </div>

          <!-- Componente dinâmico: em <script setup>, o :is recebe o
           componente IMPORTADO (não uma string). Ao trocar de aba, a
           anterior é desmontada e a nova é montada do zero. -->
          <component
            :is="abaAtual === 'lista' ? AbaLista : AbaEstatisticas"
            ref="componente-aba"
            v-bind="propsDaAba"
          />
        </CardSecao>
      </div>

      <div class="coluna">
        <!-- No desktop, a .coluna "some" (display: contents) e esta pilha
         vira um item do grid: busca e formulário ficam empilhados na
         coluna da direita, sem depender da altura das outras regiões. -->
        <div class="pilha-direita">
          <!-- ===================== BUSCAR LIVRO (API) ===================== -->
          <CardSecao titulo="Buscar livro" class="regiao-buscar">
            <p class="dica">
              Pesquise na Open Library e adicione à estante com um clique.
            </p>

            <div class="campo-busca">
              <span class="icone-busca" aria-hidden="true">🔍</span>
              <input
                type="text"
                id="termo"
                v-model.trim="termoBusca"
                placeholder="Digite ao menos 3 letras do título"
                aria-label="Buscar livro pelo título"
                autocomplete="off"
                ref="input-busca"
              />
            </div>

            <p v-if="buscando" class="status-busca">
              <span class="spinner" aria-hidden="true"></span> Buscando...
            </p>
            <p v-else-if="erroBusca" class="aviso">{{ erroBusca }}</p>

            <ul v-if="resultados.length > 0" class="resultados-busca">
              <li
                v-for="(resultado, index) in resultados"
                :key="index"
                class="resultado"
              >
                <div class="resultado-info">
                  <strong>{{ resultado.titulo }}</strong>
                  <small>{{ resultado.autor || "Autor desconhecido" }}</small>
                </div>
                <button
                  type="button"
                  class="botao-adicionar"
                  :disabled="estaNaEstante(resultado)"
                  @click="adicionarDaBusca(resultado)"
                >
                  {{
                    estaNaEstante(resultado) ? "✔ Na estante" : "+ Adicionar"
                  }}
                </button>
              </li>
            </ul>
          </CardSecao>

          <!-- ===================== ADICIONAR LIVRO ===================== -->
          <CardSecao titulo="Adicionar livro" class="regiao-adicionar">

            <form class="formulario" @submit.prevent="adicionarLivro">
              <div class="campo">
                <label for="titulo">Título:</label>
                <input
                  type="text"
                  id="titulo"
                  v-model.trim="novoLivro.titulo"
                  ref="input-titulo"
                  required
                />
              </div>

              <div class="campo">
                <label for="autor">Autor:</label>
                <input
                  type="text"
                  id="autor"
                  v-model.trim="novoLivro.autor"
                  required
                />
              </div>

              <div class="campo">
                <label for="paginas">Páginas:</label>
                <input
                  type="number"
                  id="paginas"
                  min="1"
                  v-model.number="novoLivro.paginas"
                />
              </div>

              <div class="campo">
                <label for="genero">Gênero:</label>
                <select id="genero" v-model="novoLivro.genero">
                  <option value="" disabled>Selecione...</option>
                  <option value="Romance">Romance</option>
                  <option value="Fantasia">Fantasia</option>
                  <option value="Ficção científica">Ficção científica</option>
                  <option value="Não ficção">Não ficção</option>
                </select>
              </div>

              <fieldset>
                <legend>Formato</legend>
                <label>
                  <input
                    type="radio"
                    value="Físico"
                    v-model="novoLivro.formato"
                  />
                  Físico
                </label>
                <label>
                  <input
                    type="radio"
                    value="E-book"
                    v-model="novoLivro.formato"
                  />
                  E-book
                </label>
                <label>
                  <input
                    type="radio"
                    value="Audiobook"
                    v-model="novoLivro.formato"
                  />
                  Audiobook
                </label>
              </fieldset>

              <fieldset>
                <legend>Tags</legend>
                <label>
                  <input
                    type="checkbox"
                    value="Favorito"
                    v-model="novoLivro.tags"
                  />
                  Favorito
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Clássico"
                    v-model="novoLivro.tags"
                  />
                  Clássico
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Emprestado"
                    v-model="novoLivro.tags"
                  />
                  Emprestado
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Releitura"
                    v-model="novoLivro.tags"
                  />
                  Releitura
                </label>
              </fieldset>

              <label>
                <input type="checkbox" v-model="novoLivro.lido" /> Já li este
                livro
              </label>

              <div class="campo">
                <label for="resenha">Resenha:</label>
                <textarea
                  id="resenha"
                  rows="4"
                  v-model.lazy="novoLivro.resenha"
                ></textarea>
              </div>

              <button type="submit" :disabled="!formularioValido">
                Adicionar
              </button>
            </form>

            <!-- Preview ao vivo do formulário (etapa 9, tarefa 3) -->
            <pre class="preview">{{ novoLivro }}</pre>
          </CardSecao>
        </div>

        <!-- ===================== ÁREA DE TESTES ===================== -->
        <!-- Experimentos das etapas anteriores, mantidos para referência -->
        <CardSecao titulo="Área de testes" class="regiao-testes">

          <div class="acoes">
            <button :disabled="appEmManutencao">Adicionar livro</button>
            <button @click="adicionarLivroTeste">Adicionar livro teste</button>
            <button @click="marcarPrimeiroComoLido">
              Marcar primeiro como lido
            </button>
          </div>

          <!-- só mostra a linha se existir o livro -->
          <p v-if="livros.length >= 2">
            Primeiro livro está lido? {{ livros[1].lido }}
          </p>

          <p>Primeiro nome: {{ primeiroNome }}</p>
          <p>Nome completo: {{ usuario.nome }}</p>
          <button @click="primeiroNome = 'João'">Trocar primeiro nome</button>
        </CardSecao>
      </div>
    </main>

    <!-- ===================== RODAPÉ ===================== -->
    <footer v-bind="atributosRodape">
      {{ anoAtual }} · <small>v{{ $versao }}</small>
    </footer>
  </div>
</template>

<style>
/* ==========================================================
   ESTILOS GLOBAIS (sem scoped): valem para a página inteira
   ========================================================== */

/* ---------- Tema claro (padrão) ---------- */
:root {
  color-scheme: light; /* controles nativos (radio, checkbox, scrollbar) claros */

  /* Superfícies */
  --fundo: #f6f1e9; /* fundo da página */
  --superficie: #fffdf9; /* cartões, campos, botões */
  --borda: #e4dacd;

  /* Texto */
  --texto: #2d2621;
  --texto-suave: #7a6e64;
  --texto-sobre-destaque: #ffffff; /* texto em cima de --destaque */

  /* Cor da marca */
  --destaque: #8b5a3c;
  --destaque-hover: #6f4630;
  --destaque-claro: #f3e6dc; /* fundo dos blocos de estatística */

  /* Estados */
  --sucesso: #3f7d4e;
  --erro: #b4423a;

  /* Barra de progresso da meta (usadas no componente BarraProgresso) */
  --progresso-baixo: #c0503f;
  --progresso-medio: #d9a13b;
  --progresso-alto: #3f7d4e;

  --sombra: 0 1px 2px rgba(45, 38, 33, 0.06), 0 4px 16px rgba(45, 38, 33, 0.06);

  /* Medidas e fontes (iguais nos dois temas) */
  --raio: 12px;
  --fonte-titulo: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
  --fonte-texto: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

/* ---------- Tema escuro ---------- */
/* Vale quando a div raiz tem a classe .escuro (temaEscuro === true).
   :root:has(.escuro) aplica as cores na página inteira, inclusive no body;
   .escuro sozinho é a garantia para navegadores sem suporte a :has(). */
:root:has(.escuro),
.escuro {
  color-scheme: dark; /* controles nativos escuros */

  --fundo: #1c1916;
  --superficie: #26221e;
  --borda: #3a342e;

  --texto: #ece5dc;
  --texto-suave: #a89c90;
  --texto-sobre-destaque: #1c1916;

  --destaque: #d39b74;
  --destaque-hover: #e5b08b;
  --destaque-claro: #3a2c22;

  --sucesso: #7cc28c;
  --erro: #e27b72;

  --progresso-baixo: #e27b72;
  --progresso-medio: #e3b75e;
  --progresso-alto: #7cc28c;

  --sombra: 0 1px 2px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.25);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--fundo);
  color: var(--texto);
  font-family: var(--fonte-texto);
  line-height: 1.6;
  transition:
    background 0.3s,
    color 0.3s;
}

#app {
  max-width: 760px;
  margin: 0 auto;
  padding: 32px 16px 48px;
}

/* Quanto mais largura, mais espaço a página ocupa */
@media (min-width: 768px) {
  #app {
    max-width: 1100px;
    padding: 40px 24px 56px;
  }
}
@media (min-width: 1280px) {
  #app {
    max-width: 1480px;
    padding: 40px 32px 56px;
  }
}

h1,
h2 {
  font-family: var(--fonte-titulo);
  line-height: 1.2;
}

a {
  color: var(--destaque);
}

/* Botões */
button {
  font: inherit;
  font-size: 0.9rem;
  padding: 6px 14px;
  border: 1px solid var(--borda);
  border-radius: 999px;
  background: var(--superficie);
  color: var(--texto);
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
}
button:hover:not(:disabled) {
  border-color: var(--destaque);
  color: var(--destaque);
}
button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Campos de formulário */
input[type="text"],
input[type="number"],
input:not([type]),
select,
textarea {
  font: inherit;
  padding: 8px 10px;
  border: 1px solid var(--borda);
  border-radius: 8px;
  background: var(--superficie);
  color: var(--texto);
}
input[type="radio"],
input[type="checkbox"] {
  accent-color: var(--destaque);
}

/* Contorno de foco visível só para quem navega pelo teclado */
:focus-visible {
  outline: 2px solid var(--destaque);
  outline-offset: 2px;
}
</style>

<style scoped>
/* ==========================================================
   ESTILOS DO COMPONENTE (scoped)
   ========================================================== */

/* ---------- Estrutura ---------- */
.cabecalho {
  text-align: center;
  margin-bottom: 32px;
}
.cabecalho h1 {
  font-size: 2.6rem;
  margin: 0 0 8px;
  color: var(--destaque);
}
.cabecalho .frase {
  font-family: var(--fonte-titulo);
  font-style: italic;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  color: var(--texto-suave);
  margin: 0 0 16px;
}
.cabecalho p {
  margin: 4px 0;
}

/* O visual base das regiões (.regiao e seu h2) agora mora no CardSecao.vue.
   As classes regiao-* abaixo chegam à <section> raiz do CardSecao por
   fallthrough, e o scoped do pai alcança o elemento raiz do filho.
   O ".regiao" extra aumenta a especificidade, para estas regras vencerem
   as do CardSecao independentemente da ordem em que os estilos carregam. */
.regiao.regiao-testes {
  background: transparent;
  box-shadow: none;
  border-style: dashed;
  opacity: 0.85;
}

.rodape {
  text-align: center;
  font-size: 0.85rem;
  color: var(--texto-suave);
  margin-top: 32px;
}

.acoes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

/* ---------- Estante ---------- */
/* A região da estante vira um "container": as estatísticas (AbaEstatisticas)
   se ajustam à largura DA REGIÃO, não da tela. Container queries não são
   afetadas pelo scoped, então a regra @container pode ficar na aba. */
.regiao-estante {
  container-type: inline-size;
}

/* Os estilos de dentro das abas (filtro, lista, estatísticas) ficam em
   AbaLista.vue e AbaEstatisticas.vue; o visual do item, no LivroItem.vue. */
.abas {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  margin: 4px 0 12px;
  border: 1px solid var(--borda);
  border-radius: 999px;
  background: var(--fundo);
}
.abas button {
  border-color: transparent;
  background: transparent;
}
.abas button.ativa {
  background: var(--destaque);
  border-color: var(--destaque);
  color: var(--texto-sobre-destaque);
  font-weight: 600;
}
.abas button.ativa:hover {
  color: var(--texto-sobre-destaque);
}

.aviso {
  color: var(--erro);
  font-style: italic;
}

/* Usado pelos títulos listados na meta de leitura */
.card {
  background: var(--superficie);
  border: 1px solid var(--borda);
  border-left: 4px solid var(--destaque);
  border-radius: 10px;
  padding: 14px 16px;
  margin: 10px 0;
}

.livro-lido {
  text-decoration: line-through;
  opacity: 0.6;
}

/* ---------- Busca na API ---------- */
.dica {
  margin: -4px 0 14px;
  font-size: 0.9rem;
  color: var(--texto-suave);
}

/* Input com a lupa "dentro": a lupa fica posicionada sobre o input,
   e o padding-left abre espaço para ela. */
.campo-busca {
  position: relative;
}
.icone-busca {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.95rem;
  opacity: 0.6;
  pointer-events: none; /* o clique passa direto para o input */
}
.campo-busca input {
  width: 100%;
  padding: 10px 14px 10px 38px;
  border-radius: 999px;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}
.campo-busca input:focus {
  border-color: var(--destaque);
  box-shadow: 0 0 0 3px var(--destaque-claro);
  outline: none;
}

.status-busca {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 14px 0 0;
  font-size: 0.9rem;
  color: var(--texto-suave);
}
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--borda);
  border-top-color: var(--destaque);
  border-radius: 50%;
  animation: girar 0.7s linear infinite;
}
@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}

.resultados-busca {
  list-style: none;
  padding: 0;
  margin: 14px 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.resultado {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px 10px 14px;
  border: 1px solid var(--borda);
  border-radius: 10px;
  background: var(--fundo);
  transition: border-color 0.15s;
}
.resultado:hover {
  border-color: var(--destaque);
}
.resultado-info {
  display: flex;
  flex-direction: column;
  min-width: 0; /* permite cortar o texto longo com reticências */
}
.resultado-info strong,
.resultado-info small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.resultado-info strong {
  font-family: var(--fonte-titulo);
  font-size: 1rem;
}
.resultado-info small {
  color: var(--texto-suave);
}
.botao-adicionar {
  flex-shrink: 0; /* o botão nunca encolhe; quem encolhe é o texto */
  background: var(--destaque);
  border-color: var(--destaque);
  color: var(--texto-sobre-destaque);
  font-weight: 600;
}
.botao-adicionar:hover:not(:disabled) {
  background: var(--destaque-hover);
  border-color: var(--destaque-hover);
  color: var(--texto-sobre-destaque);
}
.botao-adicionar:disabled {
  background: transparent;
  border-color: var(--sucesso);
  color: var(--sucesso);
  opacity: 1;
  cursor: default;
}

/* ---------- Formulário ---------- */
.formulario {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.formulario fieldset {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  border: 1px solid var(--borda);
  border-radius: 8px;
  padding: 10px 14px 12px;
  margin: 0;
}
.formulario legend {
  font-weight: 600;
  padding: 0 6px;
}
.campo label {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
}
.campo input,
.campo select,
.campo textarea {
  width: 100%;
}
.campo textarea {
  resize: vertical;
}

.formulario button[type="submit"] {
  align-self: flex-start;
  background: var(--destaque);
  border-color: var(--destaque);
  color: var(--texto-sobre-destaque);
  font-weight: 600;
  padding: 8px 22px;
}
.formulario button[type="submit"]:hover:not(:disabled) {
  background: var(--destaque-hover);
  border-color: var(--destaque-hover);
  color: var(--texto-sobre-destaque);
}

.preview {
  margin: 16px 0 0;
  padding: 12px;
  background: var(--fundo);
  border: 1px dashed var(--borda);
  border-radius: 8px;
  font-size: 0.8rem;
  overflow-x: auto;
}

/* ---------- Botão de tema ---------- */
.botao-tema {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 10;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  box-shadow: var(--sombra);
}

/* ---------- Utilitárias (ainda não usadas no template) ---------- */
.destaque {
  font-weight: bold;
}
/* A classe .escuro (na div raiz) troca as variáveis de cor:
   veja o bloco "Tema escuro" no <style> global. */

/* ---------- Layout responsivo ---------- */
/* Celular (até 767px): regiões uma abaixo da outra, sem grid. */

/* Tablet (768px a 1279px): duas colunas. Cada .coluna é uma coluna do grid:
   à esquerda a meta e a estante (mais larga), à direita o formulário e os testes. */
@media (min-width: 768px) {
  main {
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    gap: 24px;
    align-items: start;
  }
}

/* Desktop (a partir de 1280px): três colunas.
   O display: contents faz as .coluna "sumirem" do layout, então as quatro
   regiões viram itens diretos do grid e são posicionadas pelos nomes das áreas.
   A estante ocupa o meio (mais larga) e as duas linhas; a meta e os testes
   dividem a coluna da esquerda; o formulário fica à direita. */
@media (min-width: 1280px) {
  main {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr) minmax(0, 1fr);
    grid-template-rows: auto 1fr;
    grid-template-areas:
      "meta   estante adicionar"
      "testes estante adicionar";
  }
  .coluna {
    display: contents;
  }
  .regiao-meta {
    grid-area: meta;
  }
  .regiao-estante {
    grid-area: estante;
  }
  .pilha-direita {
    grid-area: adicionar;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .regiao-testes {
    grid-area: testes;
  }
}

/* ---------- Celular ---------- */
@media (max-width: 480px) {
  .cabecalho h1 {
    font-size: 2rem;
  }
}
</style>
