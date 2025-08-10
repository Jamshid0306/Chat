<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/mainStore";
import "./loginModal.scss";

const emit = defineEmits(["close"]);
const phone = ref("");
const code = ref("");
const step = ref(1); // 1 = telefon bosqichi, 2 = kod bosqichi
const authStore = useAuthStore();

const handleSendCode = async () => {
  if (!phone.value) {
    authStore.loginError = "Iltimos, telefon raqamini kiriting";
    return;
  }
  const cleanedPhone = phone.value.replace(/\s+/g, "").replace(/-/g, "");
  const success = await authStore.sendCode(cleanedPhone);
  if (success) step.value = 2;
};

const handleVerifyCode = async () => {
  if (!code.value) {
    authStore.loginError = "Iltimos, kodni kiriting";
    return;
  }
  const cleanedPhone = phone.value.replace(/\s+/g, "").replace(/-/g, "");
  const success = await authStore.verifyCode(cleanedPhone, code.value);
  if (success) emit("close");
};
</script>

<template>
  <div class="modal-overlay"></div>
  <div class="modal">
    <form @submit.prevent="step === 1 ? handleSendCode() : handleVerifyCode()">
      <h2>Mehmonxonamizga xush kelibsiz!</h2>
      <p class="subtitle">
        {{ step === 1 ? "Telefon raqamingizni kiriting" : "SMS orqali kelgan kodni kiriting" }}
      </p>

      <div v-if="authStore.loginError" class="error-message">
        {{ authStore.loginError }}
      </div>

      <div v-if="step === 1" class="form-group">
        <label for="phone">Telefon raqami</label>
        <input
          v-model="phone"
          type="tel"
          id="phone"
          placeholder="+998991234567"
          required
        />
      </div>

      <div v-else class="form-group">
        <label for="code">Kod</label>
        <input
          v-model="code"
          type="text"
          id="code"
          placeholder="Tasdiqlash kodi"
          required
        />
      </div>

      <button type="submit" :disabled="authStore.isLoading" class="submit-btn">
        <span v-if="!authStore.isLoading">
          {{ step === 1 ? "Kod yuborish" : "Kirish" }}
        </span>
        <span v-else class="loader"></span>
      </button>
    </form>
  </div>
</template>
