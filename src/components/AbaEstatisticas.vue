<script setup>
import BarraProgresso from "./BarraProgresso.vue";

// Os números são calculados no App (que também os usa no título da página
// e no alerta de meta batida); a aba só exibe.
defineProps({
  totalLidos: { type: Number, required: true },
  totalPaginasLidas: { type: Number, required: true },
  progressoMeta: { type: Number, required: true },
  mediaNotas: { type: String, required: true },
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
  </div>
</template>

<style scoped>
.aba-estatisticas {
  margin-top: 8px;
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
