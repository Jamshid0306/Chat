<script setup>
import { useI18n } from "vue-i18n"
import UserIcon from "../../components/icons/UserIcon.vue"
import SendIcon from "../../components/icons/SendIcon.vue"
import "./chat.scss"

const { t } = useI18n()
</script>

<template>
  <section class="chat">
    <div class="chat-block">
      <div class="chat-block-top">
        <UserIcon :size="35" />
        <span>{{ t('chat.reception') }}</span>
      </div>
      <div class="chat-block-main"></div>
      <div class="chat-block-input">
        <input type="text" :placeholder="t('chat.sendMessage')" />
        <SendIcon class="sendIcon" :size="35" :color="'rgb(0, 162, 255)'" />
      </div>
    </div>
  </section>
</template>
