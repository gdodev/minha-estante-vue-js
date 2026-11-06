<script setup>
import { computed } from "vue";

const props = defineProps({
  progresso: { type: Number, required: true },
});

const corBarra = computed(() => {
  if (props.progresso >= 70) return "var(--progresso-alto)";
  if (props.progresso >= 30) return "var(--progresso-medio)";
  return "var(--progresso-baixo)";
});
</script>

<template>
  <div class="barra">
    <div
      class="barra-preenchida"
      :style="{ width: progresso + '%', background: corBarra }"
    ></div>
  </div>
</template>

<style scoped>
/* As cores --progresso-* são tokens do tema e ficam no :root global do
   App.vue (claro e escuro). Um :root aqui, no <style scoped>, viraria
   :root[data-v-xxx] e nunca se aplicaria. */
.barra {
  background: var(--borda);
  border-radius: 999px;
  height: 14px;
  overflow: hidden;
  margin-top: 16px;
}
.barra-preenchida {
  height: 100%;
  border-radius: 999px;
  transition:
    width 0.4s ease,
    background 0.4s ease;
}
</style>
