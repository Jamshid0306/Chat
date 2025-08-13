<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/mainStore";
import "./loginModal.scss";

const emit = defineEmits(["close"]);
const phone = ref("");
const password = ref("");
const showPassword = ref(false);
const authStore = useAuthStore();

const handleLogin = async () => {
  if (!phone.value || !password.value) {
    authStore.loginError = "Telefon raqami va parol kiriting";
    return;
  }
  const cleanedPhone = phone.value.replace(/\s+/g, "").replace(/-/g, "");
  const success = await authStore.login(cleanedPhone, password.value);
  if (success) emit("close");
};
</script>

<template>
  <div class="modal-overlay"></div>
  <div class="modal">
    <form @submit.prevent="handleLogin">
      <h2>Mehmonxonamizga xush kelibsiz!</h2>
      <p class="subtitle">Telefon raqamingiz va parolingizni kiriting</p>

      <div v-if="authStore.loginError" class="error-message">{{ authStore.loginError }}</div>

      <div class="form-group">
        <label for="phone">Telefon raqami</label>
        <input v-model="phone" type="tel" id="phone" placeholder="+998991234567" required />
      </div>

      <div class="form-group">
        <label for="password">Parol</label>
        <div class="password-field">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            placeholder="Parolingiz"
            required
          />
          <button type="button" class="eye-btn" @click="showPassword = !showPassword" aria-label="Toggle password visibility">
            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.957 9.957 0 012.235-3.592"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.88 9.88a3 3 0 104.24 4.24"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18"/>
            </svg>
          </button>
        </div>
      </div>

      <button type="submit" :disabled="authStore.isLoading" class="submit-btn">
        <span v-if="!authStore.isLoading">Kirish</span>
        <span v-else class="loader"></span>
      </button>
    </form>
  </div>
</template>

<style scoped>
.password-field {
  position: relative;
}
.password-field input {
  width: 100%;
  padding-right: 40px;
}
.eye-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #888;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.eye-btn:hover { color: #fff; }
</style>
