// src/i18n/index.js
import { createI18n } from 'vue-i18n'
import uz from '@/locales/uz.json'
import ru from '@/locales/ru.json'
import en from '@/locales/en.json'

const savedLang = localStorage.getItem('lang') || 'uz'

const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'uz',
  messages: {
    uz,
    ru,
    en
  }
})

export default i18n
