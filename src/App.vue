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
import { ref, reactive } from 'vue';

const livros = ref([
  { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', paginas: 256, lido: true, nota: 5 },
  { id: 2, titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', paginas: 310, lido: false, nota: 0 },
  { id: 3, titulo: '1984', autor: 'George Orwell', paginas: 328, lido: true, nota: 4 },
]);

const usuario = reactive({
  nome: 'Guilherme',
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
  <button @click="aumentarMeta">Aumentar meta</button>
  <br><button @click="adicionarLivroTeste">Adicionar livro teste</button>
  <p>Primeiro livro está lido? {{ livros[1].lido }}</p>
  <br><button @click="marcarPrimeiroComoLido">Marcar primeiro como lido</button>
  <br><small>v{{ $versao }}</small>
</template>
