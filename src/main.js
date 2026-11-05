import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.config.errorHandler = (err) => {
    console.error('[Minha Estante]', err);
}

app.config.globalProperties.$versao = '1.0';

app.mount('#app');
