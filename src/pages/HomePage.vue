<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Chat from "@/views/Chat/Chat.vue";
import LoginModal from "@/views/LoginModal/LoginModal.vue";
import Modal from "@/views/Modal/Modal.vue";
import { useAuthStore } from "@/stores/mainStore";

const authStore = useAuthStore();
const { t } = useI18n();

const showLoginModal = ref(authStore.isLoggedIn || true);
const showModal = ref(false);
const modalType = ref(false);
if (authStore.isLoggedIn) {
  showLoginModal.value = false;
}
function closeLoginModal() {
  showLoginModal.value = false;
}
function closeModal() {
  showModal.value = false;
}
function openLanguageModal() {
  modalType.value = false;
  showModal.value = true;
}
function openTypeModal() {
  modalType.value = true;
  showModal.value = true;
}
</script>

<template>
  <div>
    <!-- <button class="styled-btn" @click="openTypeModal">
        📋 {{ t("buttons.chooseType") }}
      </button> -->
  </div>

  <Modal v-if="showModal" :showSelect="modalType" @close="closeModal" />
  <LoginModal v-if="showLoginModal" @close="closeLoginModal" />
  <Chat @openLanguageModal="openLanguageModal" @openTypeModal="openTypeModal" />
</template>

<style scoped>
.button-container {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 20px 0;
  @media screen and (max-width: 400px) {
    flex-direction: column;
  }
}

.styled-btn {
  background: linear-gradient(135deg, #4a90e2, #357abd);
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
  background: linear-gradient(135deg, #5aa0f2, #4689c8);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.button-container {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 20px 0;
  flex-wrap: wrap;

  @media screen and (max-width: 400px) {
    flex-direction: column;
    gap: 10px;
  }
}

.styled-btn {
  background: linear-gradient(135deg, #00a2ff, #0077cc);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 14px;
  font-size: 16px;
  margin-top: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 162, 255, 0.3);
  letter-spacing: 0.5px;

  &:hover {
    background: linear-gradient(135deg, #33b6ff, #0095e0);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 162, 255, 0.4);
  }

  &:active {
    transform: scale(0.97);
  }
}
</style>
