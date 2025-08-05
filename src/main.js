import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/styles/main.scss"
import i18n from '@/i18n/index.js'

createApp(App).use(i18n).mount('#app')
