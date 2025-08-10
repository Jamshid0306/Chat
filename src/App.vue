<script setup>
import { ref, computed } from "vue";
import Modal from "@/views/Modal/Modal.vue";
import Chat from "@/views/Chat/Chat.vue";
import LoginModal from "./views/LoginModal/LoginModal.vue";
import { useAuthStore } from "@/stores/mainStore";

const authStore = useAuthStore();

const showLoginModal = ref(!authStore.isLoggedIn);
const showModal = ref(false);

function handleModalClose() {
  showModal.value = false;
}
function handleLoginModalClose() {
  showLoginModal.value = false;
  showModal.value = true;
}
</script>

<template>
  <div>
    <Modal v-if="showModal" @close="handleModalClose" />
    <LoginModal v-if="showLoginModal" @close="handleLoginModalClose" />
    <Chat />
  </div>
</template>
