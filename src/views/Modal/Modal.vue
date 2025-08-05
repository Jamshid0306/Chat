<script setup>
import { useI18n } from "vue-i18n"
import { useStorage } from "@vueuse/core"
import "./modal.scss"

const { t, locale } = useI18n()
const selectedLang = useStorage("lang", "uz")

const emit = defineEmits(["close"])

function changeLanguage(lang) {
  locale.value = lang
  selectedLang.value = lang
  emit("close")
}
</script>

<template>
  <div class="modal">
    <h1 class="modal-title">{{ t("modal.title") }}</h1>
    <div class="buttons">
      <button @click="changeLanguage('uz')">
        <img src="@/assets/images/flags/uz.png" alt="Flag" />
        <span>Uzbekcha</span>
      </button>
      <button @click="changeLanguage('ru')">
        <img src="@/assets/images/flags/ru.png" alt="Flag" />
        <span>Русский</span>
      </button>
      <button @click="changeLanguage('en')">
        <img src="@/assets/images/flags/en.png" alt="Flag" />
        <span>English</span>
      </button>
    </div>
  </div>
  <div class="modal-overlay"></div>
</template>
