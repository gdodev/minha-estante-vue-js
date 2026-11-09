<script setup>
import BarraProgresso from "./BarraProgresso.vue";
import { ref, onMounted } from "vue";

// Os números são calculados no App (que também os usa no título da página
// e no alerta de meta batida); a aba só exibe.
defineProps({
  totalLidos: { type: Number, required: true },
  totalPaginasLidas: { type: Number, required: true },
  progressoMeta: { type: Number, required: true },
  mediaNotas: { type: String, required: true },
});

// Sugestão do dia (etapa 13, tarefa 4)
const sugestao = ref(""); // título sorteado
const carregando = ref(true); // começa true: a busca já dispara ao montar
const erroSugestao = ref(""); // mensagem para o usuário, se a busca falhar

// Com o <KeepAlive> no App, esta aba não é desmontada ao trocar de aba:
// o onMounted roda só uma vez e a sugestão se mantém.
onMounted(async () => {
  try {
    const url = `https://openlibrary.org/subjects/fantasy.json?limit=20`;
    const resposta = await fetch(url);

    // fetch NÃO lança erro para status 404/500, só para falha de rede.
    // Por isso é preciso checar manualmente:
    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}`);
    }

    const jsonResposta = await resposta.json();
    const nomesObras = jsonResposta["works"].map((value) => value["title"]);
    // .length em vez de 20: o limit é só um máximo, a API pode devolver menos
    const indiceSorteado = Math.floor(Math.random() * nomesObras.length);
    sugestao.value = nomesObras[indiceSorteado];
  } catch (erro) {
    console.error("Falha na busca:", erro);
    erroSugestao.value = "Não foi possível carregar a sugestão do dia.";
  } finally {
    // Roda no sucesso e no erro: o "Carregando..." sempre some
    carregando.value = false;
  }
});
</script>

<template>
  <div class="aba-estatisticas">
    <div class="estatisticas">
      <p>Quantidade de livros lidos: {{ totalLidos }}</p>
      <p>Quantidade de páginas lidas: {{ totalPaginasLidas }}</p>
      <p :class="{ 'meta-batida': progressoMeta === 100 }">
        Progresso da meta: {{ progressoMeta }}%
      </p>
      <p>Média das notas dos livros lidos: {{ mediaNotas }}</p>
    </div>

    <BarraProgresso :progresso="progressoMeta" />

    <p v-if="progressoMeta === 0">Bora começar! 📖</p>
    <p v-else-if="progressoMeta < 50">Bom começo, continue!</p>
    <p v-else-if="progressoMeta < 100">Falta pouco! 🔥</p>
    <p v-else>Meta batida! 🎉</p>

    <p v-if="carregando" class="sugestao">Carregando sugestão...</p>
    <p v-else-if="erroSugestao" class="sugestao aviso">{{ erroSugestao }}</p>
    <p v-else class="sugestao">
      📌 Sugestão do dia: <strong>{{ sugestao }}</strong>
    </p>
  </div>
</template>

<style scoped>
.aba-estatisticas {
  margin-top: 8px;
}

.sugestao {
  padding: 10px 14px;
  border: 1px dashed var(--borda);
  border-radius: 10px;
  color: var(--texto-suave);
}
.sugestao strong {
  color: var(--texto);
}

/* O .aviso do App.vue não alcança esta aba (scoped), por isso fica aqui */
.aviso {
  color: var(--erro);
  font-style: italic;
}

/* 2 por linha; 4 quando a região da estante (o container) tiver espaço */
.estatisticas {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}
.estatisticas p {
  margin: 0;
  padding: 12px 14px;
  background: var(--destaque-claro);
  border-radius: 10px;
  font-size: 0.85rem;
  color: var(--texto-suave);
}
@container (min-width: 640px) {
  .estatisticas {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.estatisticas .meta-batida {
  color: var(--sucesso);
  font-weight: 600;
}
</style>
