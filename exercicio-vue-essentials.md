# 📚 Exercício Progressivo: Vue.js Essentials

## O projeto: **Minha Estante**

Você vai construir, do zero, um app para acompanhar os livros que está lendo. Cada etapa corresponde a um tópico da seção **Essentials** da documentação, na mesma ordem. O app cresce aos poucos: você **nunca joga código fora**, só adiciona e refatora.

| Etapa | Tópico da documentação | O que o app ganha |
|---|---|---|
| 0 | — | Projeto criado |
| 1 | Creating an Application | App montado e limpo |
| 2 | Template Syntax | Cabeçalho com dados dinâmicos |
| 3 | Reactivity Fundamentals | Estado reativo (livros e usuário) |
| 4 | Computed Properties | Estatísticas automáticas |
| 5 | Class and Style Bindings | Barra de progresso e destaques visuais |
| 6 | Conditional Rendering | Estado vazio, mensagens e detalhes |
| 7 | List Rendering | Lista de livros e estrelas de avaliação |
| 8 | Event Handling | Botões e atalhos de teclado |
| 9 | Form Input Bindings | Formulário para adicionar livros |
| 10 | Watchers | Salvar no localStorage e buscar na internet |
| 11 | Template Refs | Foco automático e scroll |
| 12 | Components Basics | Separar em componentes |
| 13 | Lifecycle Hooks | Carregar dados e limpar recursos |

### Como usar este guia

- Faça as etapas **em ordem**. Cada uma depende da anterior.
- Cada etapa tem: 🎯 **Objetivo**, 📝 **Tarefas**, 💡 **Dicas**, 🧪 **Teste você mesmo** e 🔥 **Desafio extra** (opcional).
- As soluções ficam escondidas em blocos `▶ Ver solução`. **Tente primeiro sem olhar.** Se travar por mais de 15 minutos, olhe só o trecho de que precisa.
- Use sempre a **Composition API com `<script setup>`** (o modo "Composition" ligado na documentação).
- Mantenha a documentação aberta na aba do tópico da etapa.

---

## Etapa 0: Preparando o ambiente

📝 **Tarefas**

1. Crie o projeto:
   ```bash
   npm create vue@latest minha-estante
   ```
   Responda **No** para tudo (TypeScript, Router, Pinia etc.). Queremos o mínimo.
2. Entre na pasta, instale e rode:
   ```bash
   cd minha-estante
   npm install
   npm run dev
   ```
3. Abra o endereço que aparecer (normalmente `http://localhost:5173`).
4. Instale a extensão **Vue.js devtools** no navegador. Ela vai ajudar muito a ver o estado reativo.

---

## Etapa 1: Creating an Application

🎯 **Objetivo:** entender o que acontece entre o `index.html`, o `main.js` e o `App.vue`.

📝 **Tarefas**

1. Abra `index.html` e encontre o `<div id="app">`. Esse é o **container** onde o Vue será montado.
2. Abra `src/main.js`. Leia e identifique: onde a **instância do app** é criada e onde ela é **montada**.
3. Apague tudo dentro de `src/components/` e substitua o conteúdo de `src/App.vue` por:
   ```vue
   <script setup>
   </script>

   <template>
     <h1>Minha Estante</h1>
   </template>
   ```
4. Remova o `import './assets/main.css'` do `main.js` (vamos escrever nosso próprio CSS).
5. Ainda no `main.js`, configure um **tratador de erros global** com `app.config.errorHandler` que faça `console.error('[Minha Estante]', err)`.
6. Registre uma **propriedade global** `app.config.globalProperties.$versao = '1.0'` e exiba-a no `App.vue`.

💡 **Dicas**
- Para configurar o app, você precisa guardar o retorno de `createApp()` numa variável **antes** de chamar `.mount()`.
- O `.mount()` deve ser **a última coisa** a ser chamada.

🧪 **Teste você mesmo**
- O que acontece se você trocar `'#app'` por `'#outro'` no `mount`? Olhe o console.
- Por que configurar o app depois do `mount` não é uma boa ideia?

<details>
<summary>▶ Ver solução</summary>

```js
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.config.errorHandler = (err) => {
  console.error('[Minha Estante]', err)
}

app.config.globalProperties.$versao = '1.0'

app.mount('#app')
```

```vue
<!-- src/App.vue -->
<template>
  <h1>Minha Estante</h1>
  <small>v{{ $versao }}</small>
</template>
```
</details>

---

## Etapa 2: Template Syntax

🎯 **Objetivo:** praticar interpolação, `v-bind`, expressões JavaScript e diretivas com argumentos.

📝 **Tarefas** (por enquanto, use **variáveis comuns**, sem `ref`; reatividade é a próxima etapa)

1. No `<script setup>`, crie:
   ```js
   const titulo = 'Minha Estante'
   const frase = 'Um leitor vive mil vidas antes de morrer.'
   const descricaoHtml = 'Acompanhe suas <strong>leituras</strong> e metas.'
   const linkDocs = 'https://vuejs.org'
   const anoAtual = new Date().getFullYear()
   const appEmManutencao = false
   const atributosRodape = { id: 'rodape', class: 'rodape', title: 'Rodapé do app' }
   ```
2. Exiba o `titulo` com **interpolação** (`{{ }}`).
3. Exiba a `frase` **toda em maiúsculas**, usando uma expressão JS dentro do `{{ }}`.
4. Exiba a `descricaoHtml` de forma que o `<strong>` **seja renderizado** como negrito (e não como texto).
5. Crie um link `<a>` cujo `href` venha de `linkDocs`.
6. Crie um `<button>Adicionar livro</button>` que fique **desabilitado** quando `appEmManutencao` for `true`.
7. Crie um `<footer>` que receba **todos** os atributos de `atributosRodape` de uma vez só, e mostre `© {{ anoAtual }}`.
8. Use um **argumento dinâmico**: crie `const atributo = 'title'` e faça `<h1 :[atributo]="frase">`. Passe o mouse no título.

💡 **Dicas**
- Interpolação dentro de atributos (`href="{{ x }}"`) **não funciona**. Use `:href`.
- O atalho de `v-bind:` é `:`. A forma "sem argumento" de `v-bind` aceita um objeto.
- Dentro de `{{ }}` só cabem **expressões** (algo que retorna valor). `if` ou `const` não funcionam.

🧪 **Teste você mesmo**
- Tente colocar `{{ if (true) { 'oi' } }}` no template. Que erro aparece? Por quê?
- Mude `appEmManutencao` para `true` e salve. O botão desabilitou?
- Experimente `{{ anoAtual - 1990 }}` e `{{ frase.split(' ').length }} palavras`.

🔥 **Desafio extra:** pesquise por que `v-html` com conteúdo vindo do usuário é perigoso (XSS).

<details>
<summary>▶ Ver solução</summary>

```vue
<script setup>
const titulo = 'Minha Estante'
const frase = 'Um leitor vive mil vidas antes de morrer.'
const descricaoHtml = 'Acompanhe suas <strong>leituras</strong> e metas.'
const linkDocs = 'https://vuejs.org'
const anoAtual = new Date().getFullYear()
const appEmManutencao = false
const atributosRodape = { id: 'rodape', class: 'rodape', title: 'Rodapé do app' }
const atributo = 'title'
</script>

<template>
  <h1 :[atributo]="frase">{{ titulo }}</h1>
  <p>{{ frase.toUpperCase() }}</p>
  <p v-html="descricaoHtml"></p>
  <a :href="linkDocs" target="_blank">Documentação do Vue</a>
  <button :disabled="appEmManutencao">Adicionar livro</button>
  <footer v-bind="atributosRodape">© {{ anoAtual }}</footer>
</template>
```
</details>

---

## Etapa 3: Reactivity Fundamentals

🎯 **Objetivo:** entender `ref`, `reactive`, `.value` e quando a tela atualiza.

📝 **Tarefas**

1. Crie o estado principal do app:
   ```js
   import { ref, reactive } from 'vue'

   const livros = ref([
     { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', paginas: 256, lido: true, nota: 5 },
     { id: 2, titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', paginas: 310, lido: false, nota: 0 },
     { id: 3, titulo: '1984', autor: 'George Orwell', paginas: 328, lido: true, nota: 4 },
   ])

   const usuario = reactive({
     nome: 'Seu Nome',
     metaAnual: 12,
   })
   ```
2. Exiba no template: `Olá, {{ usuario.nome }}! Sua meta é ler {{ usuario.metaAnual }} livros.`
3. Exiba temporariamente a quantidade de livros: `{{ livros.length }}`.
4. Crie uma função `aumentarMeta()` que soma 1 à meta, e um botão que a chama com `@click="aumentarMeta"`. (Eventos serão aprofundados na etapa 8; por ora basta isso.)
5. Crie uma função `adicionarLivroTeste()` que faz `push` de um livro novo qualquer em `livros`. Ligue a um botão. O contador da tarefa 3 atualizou?
6. Crie uma função `marcarPrimeiroComoLido()` que altera `livros.value[1].lido = true`. Exiba `{{ livros[1].lido }}` no template e veja mudar. Isso mostra a **reatividade profunda**.

🧪 **Teste você mesmo: as armadilhas** (faça e observe; depois desfaça)

- **Armadilha 1:** dentro de `aumentarMeta`, troque por `let { metaAnual } = usuario; metaAnual++`. A tela atualiza? Por quê?
- **Armadilha 2:** no `<script>`, tente `livros.push(...)` sem `.value`. Qual erro aparece?
- **Armadilha 3:** no template, por que você **não** precisa escrever `livros.value.length`?
- **Armadilha 4:** tente fazer `usuario = reactive({ nome: 'Outro', metaAnual: 1 })`. O que acontece (com `const` e com `let`)?
- **`nextTick`:** em `adicionarLivroTeste`, logo após o `push`, faça `console.log(document.querySelectorAll('li').length)` (se já tiver `li`s). Depois repita usando `await nextTick()` antes do log. Qual a diferença?

💡 **Dicas**
- No `<script>`: `ref` precisa de `.value`. No template: não precisa (o Vue "desembrulha" automaticamente).
- `reactive` **só funciona com objetos** e **perde a reatividade** se você desestruturar ou substituir o objeto inteiro. Por isso a documentação recomenda usar `ref` como padrão.

<details>
<summary>▶ Ver solução</summary>

```vue
<script setup>
import { ref, reactive } from 'vue'

const livros = ref([ /* ...os 3 livros... */ ])
const usuario = reactive({ nome: 'Seu Nome', metaAnual: 12 })

function aumentarMeta() {
  usuario.metaAnual++
}

function adicionarLivroTeste() {
  livros.value.push({
    id: Date.now(), titulo: 'Livro Teste', autor: 'Fulano',
    paginas: 100, lido: false, nota: 0,
  })
}

function marcarPrimeiroComoLido() {
  livros.value[1].lido = true
}
</script>

<template>
  <p>Olá, {{ usuario.nome }}! Sua meta é ler {{ usuario.metaAnual }} livros.</p>
  <p>Livros cadastrados: {{ livros.length }}</p>
  <button @click="aumentarMeta">+1 na meta</button>
  <button @click="adicionarLivroTeste">Adicionar teste</button>
  <button @click="marcarPrimeiroComoLido">Marcar O Hobbit como lido</button>
  <p>O Hobbit lido? {{ livros[1].lido }}</p>
</template>
```

**Respostas das armadilhas:**
1. Desestruturar copia o **número** para uma variável comum, sem conexão com o objeto reativo.
2. `livros` é um objeto `ref`, não um array. O array está em `livros.value`.
3. Refs de nível superior no `<script setup>` são desembrulhados automaticamente no template.
4. Com `const`: erro, pois não dá para reatribuir. Com `let`: o template continua ligado ao objeto **antigo** e a tela não atualiza.
</details>

---

## Etapa 4: Computed Properties

🎯 **Objetivo:** derivar valores do estado sem duplicar dados.

📝 **Tarefas**

1. Remova os botões de teste da etapa 3 (mantenha o "+1 na meta").
2. Crie as seguintes **computed**:
   - `totalLidos`: quantidade de livros com `lido: true`.
   - `totalPaginasLidas`: soma das páginas dos livros lidos.
   - `progressoMeta`: porcentagem (0 a 100, **nunca acima de 100**) de `totalLidos` em relação à `usuario.metaAnual`, arredondada.
   - `livrosOrdenados`: os livros ordenados por título (A→Z), **sem alterar o array original**.
   - `mediaNotas`: média das notas dos livros lidos, com 1 casa decimal (ou `'—'` se não houver).
3. Exiba um painel de estatísticas com esses valores.
4. Crie uma **computed com getter e setter** chamada `primeiroNome`:
   - o **get** retorna o primeiro nome de `usuario.nome`;
   - o **set** recebe um novo primeiro nome e substitui só a primeira palavra de `usuario.nome`.

   Teste com um botão que faz `primeiroNome = 'Maria'` (no script: `primeiroNome.value = 'Maria'`).

🧪 **Teste você mesmo: computed vs método**
- Crie uma **função** `calcularTotalLidos()` igual à computed, mas com um `console.log('função rodou')` dentro. Coloque também um `console.log('computed rodou')` dentro da computed.
- Use as duas **três vezes cada** no template. Clique em "+1 na meta". Quantos logs de cada aparecem? Por quê?
- Por que `livros.value.sort()` dentro de uma computed é um erro? (Dica: efeito colateral.)

💡 **Dicas**
- `[...livros.value].sort(...)` cria uma cópia antes de ordenar.
- `a.titulo.localeCompare(b.titulo)` ordena strings corretamente com acentos.
- `Math.min(100, valor)` garante o teto.

<details>
<summary>▶ Ver solução</summary>

```js
import { ref, reactive, computed } from 'vue'

const totalLidos = computed(() => livros.value.filter(l => l.lido).length)

const totalPaginasLidas = computed(() =>
  livros.value.filter(l => l.lido).reduce((soma, l) => soma + l.paginas, 0)
)

const progressoMeta = computed(() =>
  Math.min(100, Math.round((totalLidos.value / usuario.metaAnual) * 100))
)

const livrosOrdenados = computed(() =>
  [...livros.value].sort((a, b) => a.titulo.localeCompare(b.titulo))
)

const mediaNotas = computed(() => {
  const lidos = livros.value.filter(l => l.lido)
  if (lidos.length === 0) return '—'
  return (lidos.reduce((s, l) => s + l.nota, 0) / lidos.length).toFixed(1)
})

const primeiroNome = computed({
  get: () => usuario.nome.split(' ')[0],
  set: (novo) => {
    const resto = usuario.nome.split(' ').slice(1)
    usuario.nome = [novo, ...resto].join(' ')
  },
})
```

**Por que a função loga mais?** A computed fica em **cache** e só recalcula quando `livros` muda. A função roda **a cada renderização** e em cada lugar em que é chamada. Mudar a meta causa re-render, então a função roda 3 vezes e a computed nenhuma.
</details>

---

## Etapa 5: Class and Style Bindings

🎯 **Objetivo:** aplicar classes e estilos dinamicamente.

📝 **Tarefas**

1. Adicione um `<style>` no `App.vue` com (pode incrementar à vontade):
   ```css
   .barra { background: #ddd; border-radius: 8px; height: 16px; overflow: hidden; }
   .barra-preenchida { height: 100%; transition: width .3s; }
   .livro-lido { text-decoration: line-through; opacity: .6; }
   .destaque { font-weight: bold; }
   .meta-batida { color: green; }
   .card { border: 1px solid #ccc; border-radius: 8px; padding: 12px; margin: 8px 0; }
   .escuro { background: #222; color: #eee; }
   ```
2. **Barra de progresso:** crie uma `div.barra` com uma `div.barra-preenchida` dentro, cuja **largura** (`width`) seja `progressoMeta + '%'` via `:style`.
3. A **cor** da barra deve ser:
   - vermelha se o progresso < 30;
   - amarela se < 70;
   - verde se >= 70.

   Crie uma computed `corDaBarra` e use no `:style`.
4. No texto de progresso, aplique a classe `meta-batida` **somente** quando `progressoMeta === 100` (sintaxe de **objeto** no `:class`).
5. Temporariamente, liste os títulos com um `<p>` por livro, escrevendo-os à mão (`livros[0]`, `livros[1]`, `livros[2]`; a lista de verdade vem na etapa 7). Em cada um, use a sintaxe de **array** no `:class` para aplicar `'card'` sempre e `'livro-lido'` só se o livro estiver lido.
6. Crie um `ref` `temaEscuro = ref(false)`, um botão que alterna o valor, e aplique a classe `escuro` na `div` raiz do app conforme esse valor.

💡 **Dicas**
- Objeto: `:class="{ 'nome-da-classe': condicao }"`.
- Array: `:class="['card', livro.lido ? 'livro-lido' : '']"` ou `:class="['card', { 'livro-lido': livro.lido }]"`.
- `:style` aceita objeto com propriedades em camelCase: `{ backgroundColor: 'red' }`.

🔥 **Desafio extra:** em vez de muitos `:class` soltos, crie uma computed `classesDoApp` que retorne um objeto com todas as classes da `div` raiz.

<details>
<summary>▶ Ver solução</summary>

```js
const temaEscuro = ref(false)

const corDaBarra = computed(() => {
  if (progressoMeta.value < 30) return 'crimson'
  if (progressoMeta.value < 70) return 'goldenrod'
  return 'seagreen'
})
```

```vue
<div :class="{ escuro: temaEscuro }">
  <button @click="temaEscuro = !temaEscuro">Alternar tema</button>

  <div class="barra">
    <div class="barra-preenchida"
         :style="{ width: progressoMeta + '%', backgroundColor: corDaBarra }"></div>
  </div>
  <p :class="{ 'meta-batida': progressoMeta === 100 }">{{ progressoMeta }}% da meta</p>

  <p :class="['card', { 'livro-lido': livros[0].lido }]">{{ livros[0].titulo }}</p>
  <!-- ...repita para livros[1] e livros[2] -->
</div>
```
</details>

---

## Etapa 6: Conditional Rendering

🎯 **Objetivo:** usar `v-if`, `v-else-if`, `v-else`, `v-show` e `<template v-if>`.

📝 **Tarefas**

1. Abaixo da barra, mostre **uma** mensagem motivacional conforme o progresso, com `v-if` / `v-else-if` / `v-else`:
   - 0%: "Bora começar! 📖"
   - < 50%: "Bom começo, continue!"
   - < 100%: "Falta pouco! 🔥"
   - 100%: "Meta batida! 🎉"
2. Crie um botão "Limpar estante" que esvazia `livros` (`livros.value = []`). Quando não houver livros, mostre **"Sua estante está vazia."** no lugar das estatísticas. Use `<template v-if>` para envolver **vários elementos** (o painel de estatísticas + a barra) sem criar uma `div` extra.
3. Crie um `ref` `mostrarEstatisticas = ref(true)` e um botão "Mostrar/Ocultar estatísticas" que alterna com **`v-show`**.
4. Abra o **inspetor de elementos** do navegador e compare:
   - O que acontece no DOM quando um elemento com `v-if` some?
   - E quando um com `v-show` some?

🧪 **Teste você mesmo**
- Quando faz mais sentido usar `v-show` em vez de `v-if`? (Dica: frequência de alternância.)
- `v-show` funciona em `<template>`? Teste.
- Por que a documentação diz para **não** usar `v-if` e `v-for` no mesmo elemento? (Você vai ver na próxima etapa.)

<details>
<summary>▶ Ver solução</summary>

```vue
<template v-if="livros.length > 0">
  <div v-show="mostrarEstatisticas">
    <!-- painel de estatísticas -->
    <!-- barra de progresso -->
  </div>

  <p v-if="progressoMeta === 0">Bora começar! 📖</p>
  <p v-else-if="progressoMeta < 50">Bom começo, continue!</p>
  <p v-else-if="progressoMeta < 100">Falta pouco! 🔥</p>
  <p v-else>Meta batida! 🎉</p>
</template>
<p v-else>Sua estante está vazia.</p>

<button @click="mostrarEstatisticas = !mostrarEstatisticas">
  {{ mostrarEstatisticas ? 'Ocultar' : 'Mostrar' }} estatísticas
</button>
<button @click="livros = []">Limpar estante</button>
```

`v-if` **remove** o elemento do DOM. `v-show` só aplica `display: none`. Use `v-show` quando alterna muito; use `v-if` quando a condição raramente muda ou quando não quer renderizar nada caro sem necessidade.
</details>

---

## Etapa 7: List Rendering

🎯 **Objetivo:** renderizar listas com `v-for`, usar `key` corretamente e filtrar com computed.

📝 **Tarefas**

1. Substitua os `<p>` escritos à mão da etapa 5 por um `<ul>` com `v-for` sobre `livrosOrdenados`. Cada `<li>` deve:
   - ter `:key="livro.id"`;
   - mostrar a **posição** (1, 2, 3...) usando o índice do `v-for`;
   - mostrar título e autor;
   - manter as classes da etapa 5.
2. **Estrelas:** dentro de cada `li`, mostre a nota com estrelas usando `v-for` com **intervalo** (`v-for="n in 5"`): ⭐ se `n <= livro.nota`, ☆ caso contrário.
3. **Filtro:** crie `const filtro = ref('todos')` com 3 botões: "Todos", "Lidos", "Não lidos". Crie a computed `livrosFiltrados` (baseada em `livrosOrdenados`) e faça o `v-for` usar ela.
4. **`v-for` em objeto:** crie um botão "Detalhes" em cada livro (ainda sem lógica, só visual) e, abaixo do `li`, use `v-for="(valor, chave) in livro"` para listar todas as propriedades do livro (`titulo: Dom Casmurro`, etc.). Por enquanto, deixe sempre visível.
5. Quando o filtro não retornar nada, mostre "Nenhum livro neste filtro." (lembre-se da etapa 6).

🧪 **Teste você mesmo: a importância do `key`**
- Coloque um `<input>` dentro de cada `li`, digite algo no primeiro, e depois mude a ordenação (por exemplo, inverta a ordem na computed). O texto digitado acompanhou o livro?
- Agora troque `:key="livro.id"` por `:key="index"` e repita. O que mudou?
- Tente colocar `v-if="livro.lido"` no mesmo `<li>` do `v-for`. Leia o erro/aviso. Por que filtrar numa computed é melhor?

💡 **Dicas**
- `v-for="(livro, index) in lista"`. O índice começa em 0.
- `v-for="n in 5"` começa em **1**, não em 0.

<details>
<summary>▶ Ver solução</summary>

```js
const filtro = ref('todos')

const livrosFiltrados = computed(() => {
  if (filtro.value === 'lidos') return livrosOrdenados.value.filter(l => l.lido)
  if (filtro.value === 'nao-lidos') return livrosOrdenados.value.filter(l => !l.lido)
  return livrosOrdenados.value
})
```

```vue
<button @click="filtro = 'todos'">Todos</button>
<button @click="filtro = 'lidos'">Lidos</button>
<button @click="filtro = 'nao-lidos'">Não lidos</button>

<ul v-if="livrosFiltrados.length">
  <li v-for="(livro, index) in livrosFiltrados" :key="livro.id"
      :class="['card', { 'livro-lido': livro.lido }]">
    {{ index + 1 }}. <strong>{{ livro.titulo }}</strong> — {{ livro.autor }}
    <span v-for="n in 5" :key="n">{{ n <= livro.nota ? '⭐' : '☆' }}</span>

    <ul>
      <li v-for="(valor, chave) in livro" :key="chave">{{ chave }}: {{ valor }}</li>
    </ul>
  </li>
</ul>
<p v-else>Nenhum livro neste filtro.</p>
```
</details>

---

## Etapa 8: Event Handling

🎯 **Objetivo:** praticar handlers inline e por método, `$event` e modificadores.

📝 **Tarefas**

1. **Alternar lido:** em cada livro, um botão "✔ Lido / ↺ Não lido" que chama `alternarLido(livro)`.
2. **Remover:** um botão "🗑" que chama `removerLivro(livro.id)`. Antes de remover, peça confirmação com `confirm()`.
3. **Avaliar:** torne as estrelas **clicáveis**: clicar na 3ª estrela define `livro.nota = 3`. Faça isso com um **handler inline** (direto no template).
4. **Detalhes:** agora sim, faça o botão "Detalhes" mostrar/ocultar a lista de propriedades do livro (etapa 7). Guarde os IDs abertos num `ref` (um `Set` ou array) e use `v-if`.
5. **`.stop`:** faça o `<li>` inteiro ser clicável e chamar `console.log('clicou no livro', livro.titulo)`. Note que clicar no botão "🗑" **também** dispara o clique do `li`. Corrija com o modificador `.stop`.
6. **`$event`:** crie uma função `logEvento(mensagem, evento)` e chame no botão "Detalhes" passando uma string **e** o evento nativo. Mostre `evento.target.tagName` no console.
7. **Teclado:** adicione um listener na `div` raiz que, ao pressionar **Esc**, fecha todos os detalhes abertos. (Use `@keyup.esc` e `tabindex="0"` na div para ela poder receber foco.)

💡 **Dicas**
- Handler por método: `@click="removerLivro"` (recebe o evento). Inline: `@click="removerLivro(livro.id)"`.
- Para acessar o evento num handler inline, use a variável especial `$event`.
- Modificadores úteis: `.stop`, `.prevent`, `.once`, `.self`, `.enter`, `.esc`, `.ctrl`.

🔥 **Desafio extra:** use `@click.once` num botão "Ganhou um livro de presente! +1 na meta" para que só funcione uma vez.

<details>
<summary>▶ Ver solução</summary>

```js
const detalhesAbertos = ref([])

function alternarLido(livro) {
  livro.lido = !livro.lido
}

function removerLivro(id) {
  if (!confirm('Remover este livro?')) return
  livros.value = livros.value.filter(l => l.id !== id)
}

function alternarDetalhes(id) {
  const i = detalhesAbertos.value.indexOf(id)
  if (i === -1) detalhesAbertos.value.push(id)
  else detalhesAbertos.value.splice(i, 1)
}

function logEvento(mensagem, evento) {
  console.log(mensagem, evento.target.tagName)
}
```

```vue
<div :class="{ escuro: temaEscuro }" tabindex="0" @keyup.esc="detalhesAbertos = []">
  ...
  <li v-for="..." @click="console.log('clicou no livro', livro.titulo)">
    ...
    <span v-for="n in 5" :key="n" @click.stop="livro.nota = n" style="cursor:pointer">
      {{ n <= livro.nota ? '⭐' : '☆' }}
    </span>
    <button @click.stop="alternarLido(livro)">{{ livro.lido ? '↺ Não lido' : '✔ Lido' }}</button>
    <button @click.stop="removerLivro(livro.id)">🗑</button>
    <button @click.stop="alternarDetalhes(livro.id); logEvento('detalhes', $event)">Detalhes</button>

    <ul v-if="detalhesAbertos.includes(livro.id)"> ... </ul>
  </li>
</div>
```

> Nota: `console` funciona dentro do template no Vue 3.4+. Se der erro na sua versão, crie uma função `clicouNoLivro(livro)`.
</details>

---

## Etapa 9: Form Input Bindings

🎯 **Objetivo:** usar `v-model` com todos os tipos de input e seus modificadores.

📝 **Tarefas**

1. **Adicione o campo `genero`, `formato`, `tags` e `resenha`** aos 3 livros iniciais (valores à sua escolha).
2. Crie um formulário **"Adicionar livro"** com um objeto reativo `novoLivro` contendo:

   | Campo | Tipo de input | Modificador |
   |---|---|---|
   | `titulo` | `<input type="text">` | `.trim` |
   | `autor` | `<input type="text">` | `.trim` |
   | `paginas` | `<input type="number">` | `.number` |
   | `genero` | `<select>` com opções: Romance, Fantasia, Ficção científica, Não ficção | — |
   | `formato` | `<input type="radio">` × 3: Físico, E-book, Audiobook | — |
   | `tags` | `<input type="checkbox">` × 4 (ex.: Favorito, Clássico, Emprestado, Releitura), ligados ao **mesmo array** | — |
   | `lido` | `<input type="checkbox">` único (booleano) | — |
   | `resenha` | `<textarea>` | `.lazy` |

3. Abaixo do formulário, mostre um **preview ao vivo** de `novoLivro` com `<pre>{{ novoLivro }}</pre>`.
4. Ao submeter (`@submit.prevent`), adicione o livro na lista com um `id` único e **limpe o formulário**.
5. **Validação simples:** o botão "Adicionar" fica desabilitado (`:disabled`) enquanto `titulo` ou `autor` estiverem vazios. Use uma computed `formularioValido`.
6. Exiba o gênero e o formato em cada livro da lista.
7. **Edição inline:** quando os detalhes de um livro estiverem abertos (etapa 8), mostre um `<input v-model="livro.titulo">` para editar o título diretamente.

🧪 **Teste você mesmo**
- Remova o `.number` e digite um número. No preview, `paginas` aparece com ou sem aspas? Isso vai quebrar a soma de `totalPaginasLidas`?
- Digite na `<textarea>` e observe o preview. Quando ele atualiza com `.lazy`? E sem?
- Digite espaços antes do título. O `.trim` funcionou?
- Por que é preciso **criar um objeto novo** ao adicionar à lista em vez de fazer `livros.value.push(novoLivro)` diretamente? (Teste e veja o que acontece ao digitar no formulário depois.)

💡 **Dicas**
- `<option value="">Selecione...</option>` com `disabled` é um bom placeholder para o `<select>`.
- Checkbox de **vários valores**: todos com o mesmo `v-model` apontando para um array, cada um com seu `value`.
- Para "limpar", você pode criar uma função `livroVazio()` que retorna o objeto inicial e usar `Object.assign(novoLivro, livroVazio())`.

<details>
<summary>▶ Ver solução</summary>

```js
function livroVazio() {
  return {
    titulo: '', autor: '', paginas: 0, genero: '', formato: 'Físico',
    tags: [], lido: false, resenha: '', nota: 0,
  }
}

const novoLivro = reactive(livroVazio())

const formularioValido = computed(() => novoLivro.titulo !== '' && novoLivro.autor !== '')

function adicionarLivro() {
  livros.value.push({ ...novoLivro, tags: [...novoLivro.tags], id: Date.now() })
  Object.assign(novoLivro, livroVazio())
}
```

```vue
<form @submit.prevent="adicionarLivro" class="card">
  <input v-model.trim="novoLivro.titulo" placeholder="Título" />
  <input v-model.trim="novoLivro.autor" placeholder="Autor" />
  <input v-model.number="novoLivro.paginas" type="number" min="1" />

  <select v-model="novoLivro.genero">
    <option value="" disabled>Selecione o gênero</option>
    <option>Romance</option>
    <option>Fantasia</option>
    <option>Ficção científica</option>
    <option>Não ficção</option>
  </select>

  <label v-for="f in ['Físico', 'E-book', 'Audiobook']" :key="f">
    <input type="radio" v-model="novoLivro.formato" :value="f" /> {{ f }}
  </label>

  <label v-for="t in ['Favorito', 'Clássico', 'Emprestado', 'Releitura']" :key="t">
    <input type="checkbox" v-model="novoLivro.tags" :value="t" /> {{ t }}
  </label>

  <label><input type="checkbox" v-model="novoLivro.lido" /> Já li</label>

  <textarea v-model.lazy="novoLivro.resenha" placeholder="Resenha"></textarea>

  <button :disabled="!formularioValido">Adicionar</button>
</form>
<pre>{{ novoLivro }}</pre>
```

**Por que copiar?** Se você der `push(novoLivro)`, a lista guarda **a mesma referência** do formulário. Ao limpar ou digitar, o livro na lista muda junto. (É a mesma ideia do `newValue === oldValue` dos watchers!)
</details>

---

## Etapa 10: Watchers

🎯 **Objetivo:** reagir a mudanças com efeitos colaterais: persistência, chamadas assíncronas e comparação de valores.

📝 **Tarefas**

1. **Persistência (deep watcher):** crie um `watch` em `livros` que salva a lista no `localStorage` (`JSON.stringify`) sempre que algo mudar, **inclusive** dentro de um livro (marcar lido, mudar nota, editar título).
2. **Carregar ao iniciar:** ao criar o `ref` `livros`, use como valor inicial o que estiver no `localStorage` (`JSON.parse`), ou a lista padrão se não houver nada. Recarregue a página e confirme que os dados continuam lá.
3. Faça o mesmo para `usuario` (nome e meta) e para `temaEscuro`.
4. **Valor antigo vs novo:** crie um watcher **só** na meta (`() => usuario.metaAnual`) que faz `console.log(\`Meta mudou de ${antigo} para ${novo}\`)`.
5. **Meta batida:** crie um watcher em `progressoMeta` que, quando o valor **passar** a ser 100 (ou seja, antes era menor), mostre um `alert('🎉 Parabéns, meta batida!')`. Não deve alertar se já estava em 100.
6. **Busca na internet (`watch` assíncrono + cleanup):**
   - Crie `const termoBusca = ref('')` com um input.
   - Crie um `watch` em `termoBusca` que, se o termo tiver **3 ou mais letras**, espera **500 ms** (debounce) e busca em `https://openlibrary.org/search.json?q=TERMO&limit=5`.
   - Mostre os resultados (`docs[].title` e `docs[].author_name?.[0]`) numa lista, cada um com um botão **"Adicionar à estante"**.
   - Use **`onWatcherCleanup`** para cancelar o timer **e** a requisição (`AbortController`) quando o termo mudar antes de terminar.
   - Mostre "Buscando..." enquanto carrega (lembre da etapa 6).
7. **`watchEffect`:** crie um `watchEffect` que atualiza o título da aba do navegador (`document.title`) para `Minha Estante (X/Y)`, onde X = lidos e Y = meta.

🧪 **Teste você mesmo**
- Na tarefa 1, remova o `{ deep: true }`. Marcar um livro como lido ainda salva? E adicionar um livro? Por quê? (Releia a explicação de "mutar vs substituir".)
- Na tarefa 4, tente `watch(usuario.metaAnual, ...)`. O que acontece?
- Na tarefa 4, tente observar `usuario` inteiro e logar `antigo.metaAnual` e `novo.metaAnual`. Os valores são diferentes?
- Na tarefa 6, digite rápido e abra a aba **Network** do DevTools. Quantas requisições foram feitas? E se você remover o cleanup?
- Na tarefa 7, por que `watchEffect` faz sentido aqui e não `watch`?

<details>
<summary>▶ Ver solução</summary>

```js
import { ref, reactive, computed, watch, watchEffect, onWatcherCleanup } from 'vue'

const LIVROS_PADRAO = [ /* ...os 3 livros... */ ]

function carregar(chave, padrao) {
  const salvo = localStorage.getItem(chave)
  return salvo ? JSON.parse(salvo) : padrao
}

const livros = ref(carregar('livros', LIVROS_PADRAO))
const usuario = reactive(carregar('usuario', { nome: 'Seu Nome', metaAnual: 12 }))
const temaEscuro = ref(carregar('temaEscuro', false))

watch(livros, (v) => localStorage.setItem('livros', JSON.stringify(v)), { deep: true })
watch(usuario, (v) => localStorage.setItem('usuario', JSON.stringify(v)))
watch(temaEscuro, (v) => localStorage.setItem('temaEscuro', JSON.stringify(v)))

watch(() => usuario.metaAnual, (novo, antigo) => {
  console.log(`Meta mudou de ${antigo} para ${novo}`)
})

watch(progressoMeta, (novo, antigo) => {
  if (novo === 100 && antigo < 100) alert('🎉 Parabéns, meta batida!')
})

// Busca
const termoBusca = ref('')
const resultados = ref([])
const buscando = ref(false)

watch(termoBusca, (termo) => {
  resultados.value = []
  if (termo.trim().length < 3) return

  const controller = new AbortController()
  const timer = setTimeout(async () => {
    buscando.value = true
    try {
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(termo)}&limit=5`
      const res = await fetch(url, { signal: controller.signal })
      const dados = await res.json()
      resultados.value = dados.docs
    } catch (e) {
      if (e.name !== 'AbortError') console.error(e)
    } finally {
      buscando.value = false
    }
  }, 500)

  onWatcherCleanup(() => {
    clearTimeout(timer)
    controller.abort()
  })
})

function adicionarDaBusca(doc) {
  livros.value.push({
    id: Date.now(), titulo: doc.title, autor: doc.author_name?.[0] ?? 'Desconhecido',
    paginas: doc.number_of_pages_median ?? 0, lido: false, nota: 0,
    genero: '', formato: 'Físico', tags: [], resenha: '',
  })
}

watchEffect(() => {
  document.title = `Minha Estante (${totalLidos.value}/${usuario.metaAnual})`
})
```

**Respostas:**
- Sem `deep`: só salva quando o **array é substituído** (ex.: `livros.value = [...]` no remover). `push` e `livro.lido = true` são **mutações** e não disparam.
- `watch(usuario.metaAnual)` passa um **número**, não algo reativo. O Vue avisa que a fonte é inválida.
- Observando `usuario` inteiro, `antigo === novo` (mesmo objeto), então os dois mostram o valor **novo**.
- `watchEffect` rastreia automaticamente `totalLidos` e `usuario.metaAnual` e já roda na criação, sem precisar listar dependências nem usar `immediate`.
</details>

---

## Etapa 11: Template Refs

🎯 **Objetivo:** acessar elementos do DOM diretamente quando necessário.

📝 **Tarefas**

1. **Foco automático:** quando a página carregar, o cursor deve já estar no campo **Título** do formulário. Use `useTemplateRef` (Vue 3.5+) ou um `ref` com o mesmo nome do atributo `ref` do elemento.
2. **Foco após adicionar:** depois de adicionar um livro (etapa 9), devolva o foco para o campo Título.
3. **Scroll até o livro novo:** coloque um `ref` nos `<li>` da lista (`ref` dentro de `v-for` gera um **array**). Depois de adicionar um livro, role a página até o último `<li>` adicionado com `elemento.scrollIntoView({ behavior: 'smooth' })`.
4. **Atalho global:** quando o usuário pressionar **`/`** em qualquer lugar, o foco vai para o input de busca da etapa 10. (Use `window.addEventListener('keydown', ...)`; a parte de "limpar" esse listener fica para a etapa 13.)

🧪 **Teste você mesmo**
- Faça `console.log(inputTitulo.value)` diretamente no `<script setup>`, fora de qualquer função. O que aparece? Por quê?
- Na tarefa 3, logo após o `push`, o novo `<li>` já existe no DOM? (Lembre do `nextTick` da etapa 3.)
- A ordem do array de refs do `v-for` é garantida igual à ordem da lista?

💡 **Dicas**
- O elemento só existe **depois** que o componente é montado. Use `onMounted` (que você vai aprofundar na etapa 13).
- Depois de mudar o estado, o DOM só atualiza no próximo "tick". Use `await nextTick()` antes de procurar o elemento novo.

<details>
<summary>▶ Ver solução</summary>

```js
import { ..., useTemplateRef, onMounted, nextTick } from 'vue'

const inputTitulo = useTemplateRef('inputTitulo')
const inputBusca = useTemplateRef('inputBusca')
const itensLista = useTemplateRef('itensLista')

onMounted(() => {
  inputTitulo.value.focus()

  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT'
        && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault()
      inputBusca.value.focus()
    }
  })
})

async function adicionarLivro() {
  const id = Date.now()
  livros.value.push({ ...novoLivro, tags: [...novoLivro.tags], id })
  Object.assign(novoLivro, livroVazio())

  await nextTick()
  inputTitulo.value.focus()
  const el = itensLista.value.find(li => li.dataset.id === String(id))
  el?.scrollIntoView({ behavior: 'smooth' })
}
```

```vue
<input ref="inputTitulo" v-model.trim="novoLivro.titulo" placeholder="Título" />
<input ref="inputBusca" v-model="termoBusca" placeholder="Buscar livros (/)" />

<li v-for="livro in livrosFiltrados" :key="livro.id" ref="itensLista" :data-id="livro.id"> ... </li>
```

**Respostas:**
- Fora de função, aparece `null`: o template ainda não foi montado quando o `<script setup>` roda.
- Não: o array de refs do `v-for` **não garante** a mesma ordem. Por isso usamos `data-id` para encontrar o elemento certo.
</details>

---

## Etapa 12: Components Basics

🎯 **Objetivo:** quebrar o `App.vue` gigante em componentes com props, eventos e slots.

Neste ponto seu `App.vue` provavelmente está enorme. Vamos organizar.

📝 **Tarefas**

1. **`LivroItem.vue`**: extraia um `<li>` da lista para este componente.
   - **Props:** `livro` (objeto) e `detalhesAbertos` (booleano).
   - **Eventos (`defineEmits`):** `alternar-lido`, `remover`, `avaliar` (com a nota) e `alternar-detalhes`.
   - O componente **não** deve alterar a prop `livro` diretamente: ele **emite** e o pai altera.
2. **`BarraProgresso.vue`**: recebe `progresso` (número) por prop e cuida sozinho da cor (mova a computed `corDaBarra` para dentro dele).
3. **`CardSecao.vue`**: um componente "moldura" com **slot**. Ele renderiza:
   ```vue
   <section class="card">
     <h2>{{ titulo }}</h2>
     <slot />
   </section>
   ```
   Use-o para envolver as seções "Estatísticas", "Adicionar livro", "Buscar livros" e "Minha lista".
4. **Abas com componente dinâmico:**
   - Crie `AbaLista.vue` (filtro + lista de `LivroItem`) e `AbaEstatisticas.vue` (painel + barra + mensagem motivacional).
   - No `App.vue`, crie botões "Lista" e "Estatísticas" e alterne entre elas com `<component :is="...">`.
   - Passe as props necessárias para cada aba.
5. Registre os componentes **localmente** (basta importar no `<script setup>`).

🧪 **Teste você mesmo**
- Dentro do `LivroItem`, tente fazer `props.livro.titulo = 'X'`. Funciona? O Vue avisa? Por que isso é considerado má prática mesmo funcionando para objetos? (Dica: fluxo de dados de mão única.)
- Tente `props.livro = {}`. E agora?
- Use `<LivroItem />` e `<livro-item></livro-item>` no template do pai. Ambos funcionam num SFC? (Lembre da conversa sobre templates no DOM.)
- Alterne entre as abas. O estado interno de cada uma (ex.: o filtro) é preservado? O que acontece se você envolver o `<component>` com `<KeepAlive>`?

💡 **Dicas**
- `const props = defineProps({ livro: Object, detalhesAbertos: Boolean })`
- `const emit = defineEmits(['alternar-lido', 'remover', 'avaliar', 'alternar-detalhes'])`
- No pai: `<LivroItem :livro="livro" @avaliar="(nota) => livro.nota = nota" />`
- `<component :is="abaAtual === 'lista' ? AbaLista : AbaEstatisticas" />`: o `:is` recebe o **componente importado**, não uma string, quando se usa `<script setup>`.

🔥 **Desafio extra:** onde fica o filtro (`filtro`)? Ele deveria ficar dentro de `AbaLista` (estado local) ou no `App` (estado compartilhado)? Experimente as duas formas e observe a diferença ao trocar de aba.

<details>
<summary>▶ Ver solução (LivroItem.vue)</summary>

```vue
<script setup>
const props = defineProps({
  livro: { type: Object, required: true },
  detalhesAbertos: Boolean,
})

const emit = defineEmits(['alternar-lido', 'remover', 'avaliar', 'alternar-detalhes'])
</script>

<template>
  <li :class="['card', { 'livro-lido': livro.lido }]">
    <strong>{{ livro.titulo }}</strong> — {{ livro.autor }}
    <small>({{ livro.genero }} · {{ livro.formato }})</small>

    <span v-for="n in 5" :key="n" @click="emit('avaliar', n)" style="cursor:pointer">
      {{ n <= livro.nota ? '⭐' : '☆' }}
    </span>

    <button @click="emit('alternar-lido')">{{ livro.lido ? '↺ Não lido' : '✔ Lido' }}</button>
    <button @click="emit('remover')">🗑</button>
    <button @click="emit('alternar-detalhes')">Detalhes</button>

    <ul v-if="detalhesAbertos">
      <li v-for="(valor, chave) in livro" :key="chave">{{ chave }}: {{ valor }}</li>
    </ul>
  </li>
</template>
```

```vue
<!-- No pai -->
<LivroItem
  v-for="livro in livrosFiltrados"
  :key="livro.id"
  :livro="livro"
  :detalhes-abertos="detalhesAbertos.includes(livro.id)"
  @alternar-lido="alternarLido(livro)"
  @remover="removerLivro(livro.id)"
  @avaliar="(nota) => (livro.nota = nota)"
  @alternar-detalhes="alternarDetalhes(livro.id)"
/>
```

> Nota: a edição inline do título (etapa 9) agora viola o fluxo de mão única. Desafio: emita um evento `editar-titulo` com o novo valor.
</details>

---

## Etapa 13: Lifecycle Hooks

🎯 **Objetivo:** entender o ciclo de vida de um componente e limpar recursos corretamente.

📝 **Tarefas**

1. **Observando o ciclo de vida:** no `LivroItem.vue`, adicione:
   ```js
   onMounted(() => console.log('montado:', props.livro.titulo))
   onUpdated(() => console.log('atualizado:', props.livro.titulo))
   onUnmounted(() => console.log('desmontado:', props.livro.titulo))
   ```
   Agora: adicione um livro, mude uma nota, remova um livro, troque de filtro e troque de aba. Anote o que aparece no console em cada ação.
2. **Limpar o listener global (etapa 11):** o atalho `/` adicionou um listener no `window`. Mova a lógica para uma função nomeada e remova-o no `onUnmounted` do componente que o registrou.
3. **Cronômetro de leitura:** crie o componente `SessaoLeitura.vue`:
   - Recebe o `livro` por prop e mostra "Lendo *título* há X segundos".
   - No `onMounted`, inicia um `setInterval` que soma 1 segundo por vez.
   - No `onUnmounted`, **para** o intervalo com `clearInterval`.
   - Em cada `LivroItem` não lido, adicione um botão "▶ Ler agora" que define o livro em leitura no `App`. O `App` mostra `<SessaoLeitura v-if="livroEmLeitura" :livro="livroEmLeitura" />` com um botão "⏹ Parar".
   - Ao parar, emita um evento `finalizar` com os segundos lidos e guarde em `livro.segundosLidos` (some ao que já havia).
4. **Sugestão do dia:** no `onMounted` da `AbaEstatisticas`, busque um livro aleatório de um assunto (ex.: `https://openlibrary.org/subjects/fantasy.json?limit=20`) e mostre "📌 Sugestão do dia: *título*". Mostre "Carregando sugestão..." enquanto isso.
5. **Refatore com composable (bônus de transição para o próximo capítulo):** extraia a lógica de `localStorage` da etapa 10 para uma função `usePersistencia(chave, valorPadrao)` em `src/composables/usePersistencia.js`, que retorna um `ref` já sincronizado. Use em `livros` e `temaEscuro`.

🧪 **Teste você mesmo**
- Na tarefa 3, **comente** o `clearInterval` do `onUnmounted`. Inicie e pare a leitura 3 vezes. Coloque um `console.log` dentro do `setInterval`. O que acontece? Isso é um **vazamento de memória**.
- Na tarefa 2, sem remover o listener, troque entre as abas (se o listener estiver numa aba) várias vezes e aperte `/`. Quantas vezes o handler roda?
- Qual a diferença entre `onMounted` e o código solto no `<script setup>`? Em qual dos dois o DOM já existe?
- Na tarefa 1: alternar `v-show` dispara `onUnmounted`? E `v-if`? (Compare com a etapa 6.)
- Com o `<KeepAlive>` da etapa 12, os componentes das abas desmontam? Pesquise `onActivated` e `onDeactivated`.

<details>
<summary>▶ Ver solução (SessaoLeitura.vue)</summary>

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({ livro: { type: Object, required: true } })
const emit = defineEmits(['finalizar'])

const segundos = ref(0)
let intervalo = null

onMounted(() => {
  intervalo = setInterval(() => segundos.value++, 1000)
})

onUnmounted(() => {
  clearInterval(intervalo)
})
</script>

<template>
  <div class="card">
    📖 Lendo <strong>{{ livro.titulo }}</strong> há {{ segundos }}s
    <button @click="emit('finalizar', segundos)">⏹ Parar</button>
  </div>
</template>
```

```vue
<!-- No App.vue -->
<SessaoLeitura
  v-if="livroEmLeitura"
  :livro="livroEmLeitura"
  @finalizar="(s) => {
    livroEmLeitura.segundosLidos = (livroEmLeitura.segundosLidos ?? 0) + s
    livroEmLeitura = null
  }"
/>
```

</details>

<details>
<summary>▶ Ver solução (usePersistencia.js)</summary>

```js
import { ref, watch } from 'vue'

export function usePersistencia(chave, valorPadrao) {
  const salvo = localStorage.getItem(chave)
  const estado = ref(salvo ? JSON.parse(salvo) : valorPadrao)

  watch(estado, (v) => localStorage.setItem(chave, JSON.stringify(v)), { deep: true })

  return estado
}
```

```js
// App.vue
const livros = usePersistencia('livros', LIVROS_PADRAO)
const temaEscuro = usePersistencia('temaEscuro', false)
```
</details>

---

## ✅ Checklist final

Se você conseguiu fazer tudo sem olhar as soluções (ou olhando pouco), você praticou:

- [ ] Criar e configurar uma aplicação (`createApp`, `mount`, `app.config`)
- [ ] Interpolação, `v-html`, `v-bind`, argumentos dinâmicos, expressões
- [ ] `ref` vs `reactive`, `.value`, reatividade profunda, armadilhas de desestruturação, `nextTick`
- [ ] Computed com cache e computed com getter/setter
- [ ] `:class` (objeto e array) e `:style`
- [ ] `v-if` / `v-else-if` / `v-else`, `<template v-if>`, `v-show`
- [ ] `v-for` com `key`, índice, intervalo e objeto; filtragem por computed
- [ ] Handlers inline e por método, `$event`, modificadores de evento e teclado
- [ ] `v-model` em text, number, select, radio, checkbox (booleano e array), textarea; `.trim`, `.number`, `.lazy`
- [ ] `watch` (ref, getter, deep, valor antigo/novo), `watchEffect`, `onWatcherCleanup`
- [ ] Template refs, refs dentro de `v-for`, foco e scroll
- [ ] Componentes com props, emits, slots e componentes dinâmicos
- [ ] `onMounted`, `onUpdated`, `onUnmounted` e limpeza de recursos

## 🚀 Desafios finais (sem solução)

1. **Ordenação configurável:** um `<select>` para ordenar por título, autor, nota ou páginas, crescente ou decrescente.
2. **Busca local:** um input que filtra a sua lista por título **ou** autor, combinado com o filtro lido/não lido.
3. **Estatísticas por gênero:** uma lista mostrando quantos livros você leu de cada gênero, com uma mini barra de progresso (reutilizando `BarraProgresso`) para cada um.
4. **Exportar/importar:** um botão que baixa os livros como `.json` e um `<input type="file">` que importa um arquivo.
5. **Componente `v-model`:** crie `EstrelasAvaliacao.vue` que funcione com `v-model="livro.nota"` (isso já é do capítulo *Components In-Depth → Component v-model*, um bom próximo passo!).

Bons estudos! 📖
