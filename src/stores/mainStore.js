import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: !!localStorage.getItem("token"),
    loginError: "",
    isLoading: false,
    chat_id: localStorage.getItem("chat_id") || "",
    messages: JSON.parse(localStorage.getItem("messages") || "[]"),
  }),

  actions: {
    async sendCode(phone) {
      this.isLoading = true;
      this.loginError = "";
      try {
        await axios.post(
          "https://0c718146b181.ngrok-free.app/auth/send-code",
          { phone_number: phone },
          { headers: { "Content-Type": "application/json" } }
        );
        return true;
      } catch (error) {
        this.loginError = error.response?.data?.message || "Kod yuborilmadi";
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async verifyCode(phone, code) {
      this.isLoading = true;
      this.loginError = "";
      try {
        const res = await axios.post(
          "https://0c718146b181.ngrok-free.app/auth/verify-code",
          { phone_number: phone, code: code },
          { headers: { "Content-Type": "application/json" } }
        );
        if (res.status === 200) {
          this.isLoggedIn = true;
          localStorage.setItem("token", res.data.access_token);
          return true;
        }
        this.loginError = res.data.message || "Kod noto‘g‘ri";
        return false;
      } catch (error) {
        this.loginError = error.response?.data?.message || "Kod noto‘g‘ri";
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async sendType(type) {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.post(
          "https://0c718146b181.ngrok-free.app/user/chats",
          { type: type },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          this.chat_id = response.data.id;
          localStorage.setItem("chat_id", this.chat_id);
          await this.getMessages(0, 50);
        }
        return response.data;
      } catch (error) {
        console.error(error.response?.data || error.message);
        return null;
      }
    },

    async getMessages(skip = 0, limit = 50) {
      try {
        const token = localStorage.getItem("token");
        if (!token || !this.chat_id) return;
        const response = await axios.get(
          `https://0c718146b181.ngrok-free.app/user/chats/${this.chat_id}/messages`,
          {
            params: { skip, limit },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        console.log(response.data);

        this.messages = response.data || [];
        localStorage.setItem("messages", JSON.stringify(this.messages));
        return response.data;
      } catch (err) {
        console.error(err.response?.data || err.message);
        return null;
      }
    },

    async postMessage(content) {
      try {
        const token = localStorage.getItem("token");
        if (!token || !this.chat_id) return;
        const response = await axios.post(
          `https://0c718146b181.ngrok-free.app/user/chats/${this.chat_id}/messages`,
          { content: content },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          this.messages.push(response.data);
          localStorage.setItem("messages", JSON.stringify(this.messages));
        }
        return response.data;
      } catch (error) {
        console.error(error.response?.data || error.message);
        return null;
      }
    },
    async pollNewMessages() {
      try {
        const token = localStorage.getItem("token");
        if (!token || !this.chat_id) return;

        const lastId = this.messages.length
          ? this.messages[this.messages.length - 1].id
          : 0;
        console.log(this.chat_id);
        
        const res = await axios.get(
          `https://0c718146b181.ngrok-free.app/user/chats/${this.chat_id}/messages?since_id=${lastId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        if (Array.isArray(res.data) && res.data.length > 0) {
          this.messages.push(...res.data);
        }
      } catch (err) {
        console.error(
          "pollNewMessages xatosi:",
          err.response?.data || err.message
        );
      }
    },
  },
  persist: true,
});
