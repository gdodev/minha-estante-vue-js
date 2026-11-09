<script setup>
import { ref, computed, useTemplateRef } from "vue";
import LivroItem from "./LivroItem.vue";

const props = defineProps({
  // Lista já ordenada pelo App
  livros: { type: Array, required: true },
  idsDetalhes: { type: Array, required: true },
  leituraAtiva: Boolean,
});

// A aba não altera os livros: repassa os pedidos para o App, que é o dono dos dados.
const emit = defineEmits([
  "alternar-lido",
  "remover",
  "avaliar",
  "alternar-detalhes",
  "editar-titulo",
  "ocultar-detalhes",
  "ler-agora",
]);

// Estado LOCAL da aba: só a lista precisa saber qual filtro está ativo.
// Como o App envolve as abas com <KeepAlive>, esta aba não é desmontada
// ao trocar para "Estatísticas", e o filtro escolhido é preservado.
const filtro = ref("todos");

const livrosFiltrados = computed(() => {
  if (filtro.value === "lidos") return props.livros.filter((l) => l.lido);
  if (filtro.value === "nao-lidos") return props.livros.filter((l) => !l.lido);
  return props.livros; // 'todos'
});

function identificarCliqueLinha(livro) {
  console.log("[identificarCliqueLinha] clicou no livro", livro.titulo);
}

const itensLista = useTemplateRef("itens-lista");

// Com o ref num COMPONENTE, cada item é a instância do LivroItem, e não
// o <li>. O $el é o elemento raiz do componente (o <li> de verdade).
function rolarAteLivro(id) {
  const elemento = itensLista.value
    ?.map((item) => item.$el)
    .find((li) => li.dataset.id === String(id));
  elemento?.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Em <script setup> o componente é "fechado" por padrão: o pai só consegue
// chamar o que for exposto explicitamente aqui.
defineExpose({ rolarAteLivro });
</script>

<template>
  <div class="painel" tabindex="0" @keyup.esc="emit('ocultar-detalhes')">
    <fieldset class="filtro">
      <legend>Filtrar</legend>
      <label><input type="radio" value="todos" v-model="filtro" /> Todos</label>
      <label><input type="radio" value="lidos" v-model="filtro" /> Lidos</label>
      <label>
        <input type="radio" value="nao-lidos" v-model="filtro" /> Não lidos
      </label>
    </fieldset>

    <p v-if="livrosFiltrados.length === 0" class="aviso">
      Nenhum livro neste filtro
    </p>
    <ul v-else class="lista-livros">
      <!-- @click e :data-id vão parar no <li> raiz do LivroItem (fallthrough). -->
      <LivroItem
        v-for="(livro, index) in livrosFiltrados"
        :key="livro.id"
        ref="itens-lista"
        :livro="livro"
        :posicao="index + 1"
        :detalhes-abertos="idsDetalhes.includes(livro.id)"
        :leitura-ativa="leituraAtiva"
        :data-id="livro.id"
        @click="identificarCliqueLinha(livro)"
        @alternar-lido="emit('alternar-lido', livro)"
        @remover="emit('remover', livro.id)"
        @avaliar="(nota) => emit('avaliar', livro.id, nota)"
        @alternar-detalhes="emit('alternar-detalhes', livro.id)"
        @editar-titulo="(titulo) => emit('editar-titulo', livro.id, titulo)"
        @ler-agora="emit('ler-agora', livro)"
      />
    </ul>
  </div>
</template>

<style scoped>
.painel {
  margin-top: 8px;
  border-radius: var(--raio);
}

.filtro {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  border: none;
  padding: 0;
  margin: 0 0 8px;
}
.filtro legend {
  font-weight: 600;
  margin-bottom: 6px;
  padding: 0;
}

.aviso {
  color: var(--erro);
  font-style: italic;
}

.lista-livros {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
