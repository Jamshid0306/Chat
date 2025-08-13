<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/mainStore";

const authStore = useAuthStore();
const username = ref("");
const password = ref("");

const handleLogin = async () => {
  const success = await authStore.adminLogin(username.value, password.value);
  if (success) {
    // Login bo'lsa admin panelga o'tkazamiz
    window.location.href = "/admin/dashboard";
  }
};
</script>

<template>
  <div class="admin-login-wrapper">
    <div class="login-card">
      <h2>🔐 Admin Panel</h2>
      <p class="subtitle">Tizimga kirish uchun login va parolni kiriting</p>

      <div v-if="authStore.loginError" class="error-message">
        {{ authStore.loginError }}
      </div>

      <input
        v-model="username"
        type="text"
        placeholder="👤 Username"
        class="input-field"
      />

      <input
        v-model="password"
        type="password"
        placeholder="🔑 Parol"
        class="input-field"
      />

      <button
        @click="handleLogin"
        :disabled="authStore.isLoading"
        class="login-btn"
      >
        <span v-if="!authStore.isLoading">Kirish</span>
        <span v-else class="loader"></span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.admin-login-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0d0d0d, #1a1a40);
}

.login-card {
  background: #1f1f2e;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  width: 350px;
  text-align: center;
  color: #fff;
}

.login-card h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
}

.input-field:focus {
  box-shadow: 0 0 5px #4a90e2;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #4a90e2, #357abd);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s ease;
}

.login-btn:hover {
  background: linear-gradient(135deg, #5aa0f2, #4689c8);
}

.error-message {
  background: rgba(255, 0, 0, 0.1);
  color: #ff4d4d;
  padding: 8px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 10px;
}

.loader {
  width: 18px;
  height: 18px;
  border: 3px solid #fff;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
