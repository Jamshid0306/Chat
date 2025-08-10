<script setup>
import { ref } from "vue"
import Chat from "@/views/Chat/Chat.vue"
import LoginModal from "@/views/LoginModal/LoginModal.vue"
import Modal from "@/views/Modal/Modal.vue"
import { useAuthStore } from "@/stores/mainStore"

const authStore = useAuthStore()

const showLoginModal = ref(!authStore.isLoggedIn)
const showModal = ref(false)
const modalType = ref(false) // false → language modal, true → type modal

function closeLoginModal() {
  showLoginModal.value = false
}
function closeModal() {
  showModal.value = false
}

function openLanguageModal() {
  modalType.value = false
  showModal.value = true
}

function openTypeModal() {
  modalType.value = true
  showModal.value = true
}
</script>

<template>
  <div>
    <div class="button-container">
      <button class="styled-btn" @click="openLanguageModal">🌐 Change Language</button>
      <button class="styled-btn" @click="openTypeModal">📋 Choose Type</button>
    </div>

    <Modal v-if="showModal" :showSelect="modalType" @close="closeModal" />
    <LoginModal v-if="showLoginModal" @close="closeLoginModal" />
    <Chat />
  </div>
</template>

<style scoped>
.button-container {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 20px 0;
}

.styled-btn {
  background: linear-gradient(135deg, #4a90e2, #357ABD);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.styled-btn:hover {
  background: linear-gradient(135deg, #5AA0F2, #4689C8);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}
</style>

