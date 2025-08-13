import { defineStore } from "pinia";
import axios from "axios";
import router from "@/router";
axios.defaults.baseURL = import.meta.env.VITE_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";

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
        await axios.post("/auth/send-code", { phone_number: phone });
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
        const res = await axios.post("/auth/verify-code", {
          phone_number: phone,
          code: code,
        });
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

    async sendType(type = "RECEPTION") {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.post(
          "/user/chats",
          { type },
          { headers: { Authorization: `Bearer ${token}` } }
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
          `/user/chats/${this.chat_id}/messages`,
          {
            params: { skip, limit },
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
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
          `/user/chats/${this.chat_id}/messages`,
          { content },
          { headers: { Authorization: `Bearer ${token}` } }
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

        const res = await axios.get(
          `/user/chats/${this.chat_id}/messages`,
          {
            params: { since_id: lastId },
            headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" },
          }
        );

        if (Array.isArray(res.data) && res.data.length > 0) {
          this.messages.push(...res.data);
        }
      } catch (err) {
        console.error("pollNewMessages xatosi:", err.response?.data || err.message);
      }
    },
    async login(phone, password) {
      this.isLoading = true;
      this.loginError = "";
      try {
        const res = await axios.post("/auth/login", {
          phone_number: phone,
          password: password
        });
    
        if (res.status === 200) {
          this.isLoggedIn = true;
          localStorage.setItem("token", res.data.access_token);
          await this.sendType();
          router.push("/chat"); // login bo‘lsa /chat sahifasiga o‘tkazish
          return true;
        }
    
        this.loginError = res.data.message || "Kirish muvaffaqiyatsiz";
        return false;
      } catch (error) {
        this.loginError = error.response?.data?.message || "Kirishda xatolik";
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    async adminLogin(username, password) {
      this.isLoading = true;
      this.loginError = "";
      try {
        const res = await axios.post("/admin/login", {
          username,
          password
        });
    
        if (res.status === 200) {
          this.isLoggedIn = true;
          localStorage.setItem("admin_token", res.data.access_token);
          router.push("/admin/dashboard"); // admin panelga yo‘naltirish
          return true;
        }
    
        this.loginError = res.data.message || "Kirish muvaffaqiyatsiz";
        return false;
      } catch (error) {
        this.loginError = error.response?.data?.message || "Kirishda xatolik";
        return false;
      } finally {
        this.isLoading = false;
      }
    }
    
    
  },
  persist: true,
});
