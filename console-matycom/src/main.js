import '@mdi/font/css/materialdesignicons.css';

// Custom SCSS - CSS imports
import './sass/site.scss';

// Vue config
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

// Plugins
import { registerPlugins } from './plugins'
registerPlugins(app);

// Pinia config
import { createPinia } from "pinia";
const pinia = createPinia();
app.use(pinia);

app.config.globalProperties.getId = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

app.mount('#app')