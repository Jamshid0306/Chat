<script setup>
import { useI18n } from "vue-i18n"
import { useStorage } from "@vueuse/core"
import { useAuthStore } from "../../stores/mainStore"
import "./modal.scss"
import { ref } from "vue"
const store = useAuthStore()
const { t, locale } = useI18n()
const selectedLang = useStorage("lang", "uz")
const showSelect = ref(false)

const emit = defineEmits(["close"])

function changeLanguage(lang) {
  locale.value = lang
  selectedLang.value = lang
  showSelect.value = true
}
function changeType(selected){
  store.sendType(selected)
  emit("close")
  
}



</script>

<template>
  <div v-if="!showSelect" class="modal">
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
  <div v-if="showSelect" class="modal">
    <h1 class="modal-title">Siz kim bilan bog'lanmoqchisiz?</h1>
    <div class="buttons">
      <button @click="changeType('AI')">
       <span>AI</span>
      </button>
      <button @click="changeType('RECEPTION')">
        <span>Reception</span>
      </button>
      
    </div>
  </div>
  <div class="modal-overlay"></div>
</template>
