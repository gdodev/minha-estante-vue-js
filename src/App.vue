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
import { ref, reactive, computed } from "vue";

const livros = ref([
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

const usuario = reactive({
  nome: "Guilherme de Oliveira",
  metaAnual: 12,
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

const corBarra = computed(() => {
  if (progressoMeta.value >= 70) return "green"; // verde: meta batida
  if (progressoMeta.value >= 30) return "yellow"; // amarelo: mais da metade
  return "red"; // vermelho: menos da metade
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

const mostrarEstatisticas = ref(true);
const filtro = ref("todos");

const livrosFiltrados = computed(() => {
  const lista = livrosOrdenados.value;
  if (filtro.value === "lidos") return lista.filter((livro) => livro.lido);
  if (filtro.value === "nao-lidos") return lista.filter((livro) => !livro.lido);
  return lista; // 'todos'
});

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

function identificarCliqueLinha(livro) {
  console.log("[identificarCliqueLinha] clicou no livro", livro.titulo);
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

function adicionarLivro() {
  // O spread (...) cria um objeto NOVO com uma cópia dos campos do formulário.
  // Sem ele, push(novoLivro) colocaria na lista o próprio objeto do formulário
  // (mesma referência): limpar ou editar o formulário alteraria o livro também.
  // A cópia é rasa, então o array de tags também precisa ser copiado com [...].
  livros.value.push({
    ...novoLivro,
    tags: [...novoLivro.tags],
    id: Date.now(),
    nota: 0,
  });
  Object.assign(novoLivro, livroVazio());
}

const formularioValido = computed(() => {
  return novoLivro.titulo.length > 0 && novoLivro.autor.length > 0;
});
</script>

<template>
  <h1 :[atributo]="frase">{{ titulo }}</h1>
  <p>{{ frase.toUpperCase() }}</p>
  <p v-html="descricaoHtml"></p>
  <a :href="linkDocs">Documentação Vue.js</a><br />
  <button :disabled="appEmManutencao">Adicionar livro</button>
  <footer v-bind="atributosRodape">{{ anoAtual }}</footer>
  <p>Olá, {{ usuario.nome }}! Sua meta é ler {{ usuario.metaAnual }} livros.</p>
  <p>Quantidade de livros: {{ livros.length }}</p>
  <button @click="aumentarMeta">+1 na meta</button>
  <br /><button @click="adicionarLivroTeste">Adicionar livro teste</button>
  <!-- só mostra a linha se existir o livro -->
  <p v-if="livros.length >= 2">
    Primeiro livro está lido? {{ livros[1].lido }}
  </p>

  <br /><button @click="marcarPrimeiroComoLido">
    Marcar primeiro como lido
  </button>
  <br /><button @click="mostrarEstatisticas = !mostrarEstatisticas">
    {{ mostrarEstatisticas ? "Ocultar" : "Mostrar" }} estatísticas
  </button>

  <div
    v-show="mostrarEstatisticas"
    style="padding: 0px 8px; border: 1px solid black; margin-top: 8px"
    tabindex="0"
    @keyup.esc="ocultarTodosDetalhes"
  >
    <label> <input type="radio" value="todos" v-model="filtro" /> Todos </label>
    <label> <input type="radio" value="lidos" v-model="filtro" /> Lidos </label>
    <label>
      <input type="radio" value="nao-lidos" v-model="filtro" /> Não lidos
    </label>
    <p>Quantidade de livros lidos: {{ totalLidos }}</p>
    <p>Quantidade de páginas lidas: {{ totalPaginasLidas }}</p>
    <p :class="{ 'meta-batida': progressoMeta === 100 }">
      Progresso da meta: {{ progressoMeta }}%
    </p>
    <!-- <p>Livros ordenados por nome: {{ livrosOrdenados.map((livro) => livro.titulo).join() }}</p> -->
    <p v-if="livrosFiltrados.length === 0" style="color: red">
      Nenhum livro neste filtro
    </p>
    <ul v-else>
      <li
        v-for="(livro, index) in livrosFiltrados"
        :key="livro.id"
        class="card"
        @click="identificarCliqueLinha(livro)"
      >
        <span :class="{ 'livro-lido': livro.lido }">
          {{ index + 1 }}. {{ livro.titulo }}, de {{ livro.autor }}
        </span>
        <!-- Monta "gênero · formato": o array junta os dois valores,
         o filter(Boolean) descarta os vazios ('' ou undefined) e o
         join(" · ") une o que sobrou, com o separador só entre itens.
         Assim um livro sem gênero mostra "(E-book)", e não "( · E-book)". -->
        <small v-if="livro.genero || livro.formato">
          ({{ [livro.genero, livro.formato].filter(Boolean).join(" · ") }})
        </small>
        <!-- O modificador stop serve
         para o evento de clique não 
         subir para o li e disparar a
         função identificarCliqueLinha -->
        <span v-for="n in 5" :key="n" @click.stop="avaliarLivro(livro.id, n)">{{
          n <= livro.nota ? "⭐" : "☆"
        }}</span>
        <button @click.stop="alternarLido(livro)">
          {{ livro.lido ? "✔ Lido" : "↺ Não lido" }}
        </button>
        <button @click.stop="removerLivro(livro.id)">🗑 Remover livro</button>
        <button
          @click.stop="
            alternarDetalhes(livro.id);
            logEvento('detalhes', $event);
          "
        >
          Detalhes
        </button>

        <div v-if="idsLivrosDetalhes.includes(livro.id)">
          <ul>
            <li v-for="(valor, chave) in livro" :key="chave">
              {{ chave }}: {{ valor }}
            </li>
          </ul>
          <input v-model="livro.titulo" />
        </div>
      </li>
    </ul>

    <p>Média das notas dos livros lidos: {{ mediaNotas }}</p>
    <p>Primeiro nome: {{ primeiroNome }}</p>
    <p>Nome completo: {{ usuario.nome }}</p>
    <button @click="primeiroNome = 'João'">Trocar primeiro nome</button>
  </div>

  <template v-if="livros.length > 0">
    <div class="barra">
      <div
        class="barra-preenchida"
        :style="{ width: progressoMeta + '%', background: corBarra }"
      ></div>
    </div>
    <p v-if="progressoMeta === 0">Bora começar! 📖</p>
    <p v-else-if="progressoMeta < 50">Bom começo, continue!</p>
    <p v-else-if="progressoMeta < 100">Falta pouco! 🔥</p>
    <p v-else>Meta batida! 🎉</p>
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

  <button @click="limparEstante">Limpar estante</button>
  <form @submit.prevent="adicionarLivro">
    <h2>Adicionar livro</h2>

    <label for="titulo">Título:</label><br />
    <input
      type="text"
      id="titulo"
      v-model.trim="novoLivro.titulo"
      required
    /><br />

    <label for="autor">Autor:</label><br />
    <input
      type="text"
      id="autor"
      v-model.trim="novoLivro.autor"
      required
    /><br />

    <label for="paginas">Páginas:</label><br />
    <input
      type="number"
      id="paginas"
      min="1"
      v-model.number="novoLivro.paginas"
    /><br />

    <label for="genero">Gênero:</label><br />
    <select id="genero" v-model="novoLivro.genero">
      <option value="" disabled>Selecione...</option>
      <option value="Romance">Romance</option>
      <option value="Fantasia">Fantasia</option>
      <option value="Ficção científica">Ficção científica</option>
      <option value="Não ficção">Não ficção</option>
    </select>

    <fieldset>
      <legend>Formato</legend>
      <label
        ><input type="radio" value="Físico" v-model="novoLivro.formato" />
        Físico</label
      >
      <label
        ><input type="radio" value="E-book" v-model="novoLivro.formato" />
        E-book</label
      >
      <label
        ><input type="radio" value="Audiobook" v-model="novoLivro.formato" />
        Audiobook</label
      >
    </fieldset>

    <fieldset>
      <legend>Tags</legend>
      <label
        ><input type="checkbox" value="Favorito" v-model="novoLivro.tags" />
        Favorito</label
      >
      <label
        ><input type="checkbox" value="Clássico" v-model="novoLivro.tags" />
        Clássico</label
      >
      <label
        ><input type="checkbox" value="Emprestado" v-model="novoLivro.tags" />
        Emprestado</label
      >
      <label
        ><input type="checkbox" value="Releitura" v-model="novoLivro.tags" />
        Releitura</label
      >
    </fieldset>

    <label
      ><input type="checkbox" v-model="novoLivro.lido" /> Já li este
      livro</label
    ><br />

    <label for="resenha">Resenha:</label><br />
    <textarea id="resenha" rows="4" v-model.lazy="novoLivro.resenha"></textarea
    ><br />

    <button type="submit" :disabled="!formularioValido">Adicionar</button>
  </form>
  <pre>{{ novoLivro }}</pre>
  <br /><small>v{{ $versao }}</small>
</template>

<style scoped>
.barra {
  background: #ddd;
  border-radius: 8px;
  height: 16px;
  overflow: hidden;
}
.barra-preenchida {
  height: 100%;
  transition: width 0.3s;
}
.livro-lido {
  text-decoration: line-through;
  opacity: 0.6;
}
.destaque {
  font-weight: bold;
}
.meta-batida {
  color: green;
}
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  margin: 8px 0;
}
.escuro {
  background: #222;
  color: #eee;
}
</style>
