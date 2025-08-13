<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/mainStore";
import "./loginModal.scss";

const emit = defineEmits(["close"]);
const phone = ref("");
const password = ref("");
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

      <div v-if="authStore.loginError" class="error-message">
        {{ authStore.loginError }}
      </div>

      <div class="form-group">
        <label for="phone">Telefon raqami</label>
        <input
          v-model="phone"
          type="tel"
          id="phone"
          placeholder="+998991234567"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Parol</label>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="Parolingiz"
          required
        />
      </div>

      <button type="submit" :disabled="authStore.isLoading" class="submit-btn">
        <span v-if="!authStore.isLoading">Kirish</span>
        <span v-else class="loader"></span>
      </button>
    </form>
  </div>
</template>
