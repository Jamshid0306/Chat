<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import UserIcon from "../../components/icons/UserIcon.vue";
import SendIcon from "../../components/icons/SendIcon.vue";
import "./chat.scss";
import { useAuthStore } from "../../stores/mainStore";

const { t } = useI18n();
const store = useAuthStore();
const newMessage = ref("");
const messagesContainer = ref(null);
let intervalId;

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;
  await store.postMessage(newMessage.value);
  newMessage.value = "";
  scrollToBottom();
};

onMounted(async () => {
  await store.getMessages();
  scrollToBottom();
  intervalId = setInterval(async () => {
    await store.pollNewMessages();
    scrollToBottom();
  }, 3000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <section class="chat">
    <div class="chat-block">
      <div class="chat-block-top">
        <UserIcon :size="35" />
        <span>{{ t("chat.reception") }}</span>
      </div>

      <div class="chat-block-main" ref="messagesContainer">
        <transition-group name="fade" tag="div">
          <div
            v-for="msg in store.messages"
            :key="msg.id"
            :class="['message', msg.sender.type === 'user' ? 'user' : 'employee']"
          >
            <div class="message-content">{{ msg.content }}</div>
            <div class="message-time">
              {{ new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </div>
          </div>
        </transition-group>
      </div>

      <div class="chat-block-input">
        <input
          type="text"
          v-model="newMessage"
          :placeholder="t('chat.sendMessage')"
          @keyup.enter="sendMessage"
        />
        <SendIcon class="sendIcon" :size="35" :color="'rgb(0, 162, 255)'" @click="sendMessage" />
      </div>
    </div>
  </section>
</template>


<style scoped>
.chat {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.chat-block {
  width: 100%;
  max-width: 500px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-block-top {
  background: #00a2ff;
  color: white;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
}

.chat-block-main {
  padding: 10px;
}

.message {
  margin: 8px 0;
  padding: 10px 14px;
  border-radius: 10px;
  max-width: 70%;
  word-wrap: break-word;
  animation: fadeIn 0.3s ease-in-out;
}

.user {
  background: #d1f7d6;
  margin-left: auto;
}

.employee {
  background: #f1f1f1;
  margin-right: auto;
}

.message-time {
  font-size: 12px;
  color: gray;
  margin-top: 2px;
  text-align: right;
}

.chat-block-input {
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #eee;
}

.chat-block-input input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px;
  border-radius: 8px;
  background: #f9f9f9;
  margin-right: 8px;
}

.sendIcon {
  cursor: pointer;
  transition: transform 0.2s;
}

.sendIcon:hover {
  transform: scale(1.1);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
