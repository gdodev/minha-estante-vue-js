<script setup>
// Props: dados que o pai (App.vue) entrega. Elas são somente leitura aqui.
const props = defineProps({
  livro: { type: Object, required: true },
  detalhesAbertos: Boolean,
  posicao: Number,
  // Verdadeiro enquanto QUALQUER livro estiver em leitura: bloqueia
  // o "Ler agora" para não iniciar uma segunda sessão por cima da atual.
  leituraAtiva: Boolean,
});

import { onMounted, onUpdated, onUnmounted } from "vue";

onMounted(() => console.log("montado:", props.livro.titulo));
onUpdated(() => console.log("atualizado:", props.livro.titulo));
onUnmounted(() => console.log("desmontado:", props.livro.titulo));

// Eventos: em vez de alterar o livro, o componente AVISA o pai, e o pai
// altera os dados (fluxo de dados de mão única).
const emit = defineEmits([
  "alternar-lido",
  "remover",
  "avaliar",
  "alternar-detalhes",
  "editar-titulo",
  "ler-agora",
]);
</script>

<template>
  <!-- @click e data-id usados pelo pai não são props nem emits declarados,
   então "caem" automaticamente neste <li> (fallthrough attributes). -->
  <li class="card">
    <span :class="{ 'livro-lido': livro.lido }">
      {{ posicao }}. {{ livro.titulo }}, de {{ livro.autor }}
    </span>
    <!-- Monta "gênero · formato": o array junta os dois valores,
     o filter(Boolean) descarta os vazios ('' ou undefined) e o
     join(" · ") une o que sobrou, com o separador só entre itens.
     Assim um livro sem gênero mostra "(E-book)", e não "( · E-book)". -->
    <small v-if="livro.genero || livro.formato">
      ({{ [livro.genero, livro.formato].filter(Boolean).join(" · ") }})
    </small>
    <!-- O modificador stop serve para o evento de clique não subir
     para o li e disparar o @click que o pai colocou nele -->
    <span class="estrelas">
      <span
        v-for="n in 5"
        :key="n"
        class="estrela"
        @click.stop="emit('avaliar', n)"
        >{{ n <= livro.nota ? "⭐" : "☆" }}</span
      >
    </span>

    <div class="acoes">
      <button @click.stop="emit('alternar-lido')">
        {{ livro.lido ? "✔ Lido" : "↺ Não lido" }}
      </button>
      <button @click.stop="emit('remover')">🗑 Remover livro</button>
      <button @click.stop="emit('alternar-detalhes')">Detalhes</button>
      <button
        v-if="!livro.lido"
        :disabled="leituraAtiva"
        :title="leituraAtiva ? 'Pare a leitura atual antes de iniciar outra' : ''"
        @click.stop="emit('ler-agora')"
      >
        ▶ Ler agora
      </button>
    </div>

    <div v-if="detalhesAbertos" class="detalhes">
      <ul>
        <li v-for="(valor, chave) in livro" :key="chave">
          {{ chave }}: {{ valor }}
        </li>
      </ul>
      <!-- Sem v-model: v-model="livro.titulo" alteraria a prop diretamente.
       O :value só exibe, e o @input avisa o pai do novo título. -->
      <input
        :value="livro.titulo"
        @click.stop
        @input="emit('editar-titulo', $event.target.value)"
      />
    </div>
  </li>
</template>

<style scoped>
/* O visual do cartão mora aqui. Antes ele ficava no App.vue, porque o
   <style scoped> do pai alcança o elemento RAIZ do filho (este <li>).
   Agora o pai deste componente é a AbaLista, então o App não o alcança mais. */
.card {
  background: var(--superficie);
  border: 1px solid var(--borda);
  border-left: 4px solid var(--destaque);
  border-radius: 10px;
  padding: 14px 16px;
  margin: 10px 0;
  cursor: pointer;
  transition:
    box-shadow 0.15s,
    transform 0.15s;
}
.card:hover {
  box-shadow: var(--sombra);
  transform: translateY(-1px);
}

.card small {
  color: var(--texto-suave);
  margin: 0 6px;
}

.estrelas {
  white-space: nowrap; /* as 5 estrelas sempre na mesma linha */
}
.estrela {
  cursor: pointer;
  font-size: 1.05rem;
  transition: transform 0.1s;
  display: inline-block;
}
.estrela:hover {
  transform: scale(1.25);
}

/* .livro-lido e .acoes também existem no App.vue, que os usa fora da lista */
.livro-lido {
  text-decoration: line-through;
  opacity: 0.6;
}

.acoes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 0;
}

.detalhes {
  margin-top: 12px;
  padding: 12px;
  background: var(--fundo);
  border-radius: 8px;
  font-size: 0.85rem;
}
.detalhes ul {
  margin: 0 0 8px;
  padding-left: 18px;
  font-family: ui-monospace, "Cascadia Code", Menlo, monospace;
}
.detalhes input {
  width: 100%;
}
</style>
