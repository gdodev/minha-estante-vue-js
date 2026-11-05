<script setup>
// Etapa #1
const titulo = 'Minha Estante';
const frase = 'Um leitor vive mil vidas antes de morrer.';
const descricaoHtml = 'Acompanhe suas <strong>leituras</strong> e metas.';
const linkDocs = 'https://vuejs.org';
const appEmManutencao = false;
const anoAtual = new Date().getFullYear();
const atributosRodape = {
  id: 'rodape',
  class: 'rodape',
  title: 'Rodapé do app'
};
const atributo = 'title';

// Etapa #2
import { ref, reactive, computed } from 'vue';

const livros = ref([
  { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', paginas: 256, lido: true, nota: 5 },
  { id: 2, titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', paginas: 310, lido: false, nota: 0 },
  { id: 3, titulo: '1984', autor: 'George Orwell', paginas: 328, lido: true, nota: 4 },
]);

const usuario = reactive({
  nome: 'Guilherme de Oliveira',
  metaAnual: 12,
});

function aumentarMeta() {
  usuario.metaAnual += 1;
}

function adicionarLivroTeste() {
  livros.value.push({
    'id': 4,
    'titulo': 'Título 4',
    'autor': 'Autor 4',
    'paginas': 4,
    'lido': false,
    'nota': 4,
  });
}

function marcarPrimeiroComoLido() {
  livros.value[1].lido = true;
}

const livrosLidos = computed(() => livros.value.filter((livro) => livro.lido));

const totalLidos = computed(() => livrosLidos.value.length);

const totalPaginasLidas = computed(() =>
  livrosLidos.value.reduce((total, livro) => total + livro.paginas, 0)
);

const progressoMeta = computed(() => {
  return Math.min(100, Math.floor((totalLidos.value / usuario.metaAnual) * 100));
});

const corBarra = computed(() => {
  if (progressoMeta.value >= 70) return 'green'; // verde: meta batida
  if (progressoMeta.value >= 30) return 'yellow';  // amarelo: mais da metade
  return 'red';                                 // vermelho: menos da metade
});


const livrosOrdenados = computed(() =>
  livros.value.toSorted((a, b) => a.titulo.localeCompare(b.titulo))
);

const mediaNotas = computed(() => {
  const lidos = livrosLidos.value;
  if (lidos.length === 0) {
    return '-';
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
    usuario.nome = [novoPrimeiroNome.trim(), ...restoDoNome].filter(Boolean).join(' ');
  },
});

</script>

<template>
  <h1 :[atributo]="frase">{{ titulo }}</h1>
  <p>{{ frase.toUpperCase() }}</p>
  <p v-html="descricaoHtml"></p>
  <a :href="linkDocs">Documentação Vue.js</a><br>
  <button :disabled="appEmManutencao">Adicionar livro</button>
  <footer v-bind="atributosRodape">{{ anoAtual }}</footer>
  <p>Olá, {{ usuario.nome }}! Sua meta é ler {{ usuario.metaAnual }} livros.</p>
  <p>Quantidade de livros: {{ livros.length }}</p>
  <button @click="aumentarMeta">+1 na meta</button>
  <br><button @click="adicionarLivroTeste">Adicionar livro teste</button>
  <p>Primeiro livro está lido? {{ livros[1].lido }}</p>
  <br><button @click="marcarPrimeiroComoLido">Marcar primeiro como lido</button>
  <div style="padding: 0px 8px; border: 1px solid black; margin-top: 8px;">
    <p>Quantidade de livros lidos: {{ totalLidos }}</p>
    <p>Quantidade de páginas lidas: {{ totalPaginasLidas }}</p>
    <p :class="{ 'meta-batida': progressoMeta === 100 }">Progresso da meta: {{ progressoMeta }}%</p>
    <p>Livros ordenados por nome: {{ livrosOrdenados.map((livro) => livro.titulo).join() }}</p>
    <p>Média das notas dos livros lidos: {{ mediaNotas }}</p>
    <p>Primeiro nome: {{ primeiroNome }}</p>
<p>Nome completo: {{ usuario.nome }}</p>
<button @click="primeiroNome = 'João'">Trocar primeiro nome</button>
  </div>
  <div class="barra">
    <div class="barra-preenchida" :style="{ width: progressoMeta + '%', background: corBarra }"></div>
  </div>
  <p :class="['card', livros[0].lido ? 'livro-lido' : '']">{{ livros[0].titulo }}</p>
  <p :class="['card', livros[1].lido ? 'livro-lido' : '']">{{ livros[1].titulo }}</p>
  <p :class="['card', livros[2].lido ? 'livro-lido' : '']">{{ livros[2].titulo }}</p>
  <br><small>v{{ $versao }}</small>
</template>

<style scoped>
.barra { background: #ddd; border-radius: 8px; height: 16px; overflow: hidden; }
.barra-preenchida { height: 100%; transition: width .3s; }
.livro-lido { text-decoration: line-through; opacity: .6; }
.destaque { font-weight: bold; }
.meta-batida { color: green; }
.card { border: 1px solid #ccc; border-radius: 8px; padding: 12px; margin: 8px 0; }
.escuro { background: #222; color: #eee; }
</style>
