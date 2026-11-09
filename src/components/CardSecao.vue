<script setup>
// Componente "moldura": cuida só da estrutura (section + título).
// O conteúdo de dentro vem do pai, pelo slot.
defineProps({
  titulo: { type: String, required: true },
});
</script>

<template>
  <!-- Classes passadas pelo pai (ex.: class="regiao-estante") não são props,
   então "caem" nesta <section> e se juntam ao "regiao" (fallthrough). -->
  <section class="regiao">
    <h2>{{ titulo }}</h2>
    <!-- Tudo o que o pai escrever entre <CardSecao> e </CardSecao> entra aqui -->
    <slot />
  </section>
</template>

<style scoped>
.regiao {
  background: var(--superficie);
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  box-shadow: var(--sombra);
  padding: 20px 24px;
  margin-bottom: 24px;
}
.regiao h2 {
  font-size: 1.4rem;
  margin: 0 0 12px;
}

/* Desktop: o espaçamento entre as regiões vem do gap do grid do App */
@media (min-width: 1280px) {
  .regiao {
    margin-bottom: 0;
  }
}

/* Celular */
@media (max-width: 480px) {
  .regiao {
    padding: 16px;
  }
}
</style>
