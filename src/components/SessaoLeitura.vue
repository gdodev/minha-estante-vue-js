<script setup>
const props = defineProps({
  livro: { type: Object, required: true },
});

const emit = defineEmits(["finalizar"]);

import { ref, onMounted, onUnmounted } from "vue";

const segundos = ref(0);
let intervalo = null;

onMounted(() => {
  intervalo = setInterval(() => {
    segundos.value++;
  }, 1000);
});
onUnmounted(() => {
  clearInterval(intervalo);
});
</script>

<template>
  <p>
    📖 Lendo <strong>{{ livro.titulo }}</strong> há {{ segundos }}s
    <button @click="emit('finalizar', segundos)">⏹ Parar</button>
  </p>
</template>

<style scoped></style>
