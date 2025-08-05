<script setup>
import UserIcon from "../../components/icons/UserIcon.vue";
import SendIcon from "../../components/icons/SendIcon.vue";
import "./chat.scss";
</script>
<template>
  <section class="chat">
    <div class="chat-block">
      <div class="chat-block-top">
        <UserIcon :size="35" />
        <span>Reception</span>
      </div>
      <div class="chat-block-main"></div>
      <div class="chat-block-input">
        <input type="text" placeholder="Send Message" />
        <SendIcon class="sendIcon" :size="35" :color="'rgb(0, 162, 255)'" />
      </div>
    </div>
  </section>
</template>
