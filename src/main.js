import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/styles/main.scss"
import i18n from '@/i18n/index.js'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) // majburiy

const app = createApp(App)
app.use(i18n)
app.use(pinia)
app.mount('#app')
