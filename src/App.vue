<script setup>
import { ref } from "vue"
import Modal from "@/views/Modal/Modal.vue"
import Chat from "@/views/Chat/Chat.vue"

const showModal = ref(true)

function handleModalClose() {
  showModal.value = false
}
</script>

<template>
  <div>
    <Modal v-if="showModal" @close="handleModalClose" />
    <Chat />
  </div>
</template>
