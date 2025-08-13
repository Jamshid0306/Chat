import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/styles/main.scss"
import i18n from '@/i18n/index.js'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from "./router";

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(i18n)
app.use(router);
app.use(pinia)
app.mount('#app')
