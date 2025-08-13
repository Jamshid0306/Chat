import { defineStore } from "pinia";
import axios from "axios";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    users: [],
    loading: false,
    error: null,
    rooms: [],
  }),

  actions: {
    getAdminHeaders() {
      const token = localStorage.getItem("admin_token");
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      };
    },

    async getRooms() {
      this.loading = true;
      try {
        const { data } = await axios.get("/reception/rooms", {
          headers: this.getAdminHeaders(),
        });
        this.rooms = data;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    async fetchUsers() {
      this.loading = true;
      try {
        const { data } = await axios.get("/reception/getusers", {
          headers: this.getAdminHeaders(),
        });
        this.users = data;
        console.log(data);
        
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData) {
      try {
        const { data } = await axios.post("/reception/users", userData, {
          headers: this.getAdminHeaders(),
        });
        this.users.push(data);
      } catch (err) {
        this.error = err;
      }
    },

    async updateUserCheckout(bookingId, newCheckoutISO) {
      try {
        await axios.patch(`/reception/bookings/${bookingId}`, { check_out_date: newCheckoutISO }, {
          headers: this.getAdminHeaders(),
        });
      } catch (err) {
        this.error = err;
        throw err;
      }
    },
    async completeBookingStatus(bookingId) {
      try {
        await axios.patch(`/reception/bookings/${bookingId}`, { status: "completed" }, {
          headers: this.getAdminHeaders(),
        });
        await this.fetchUsers();
      } catch (err) {
        this.error = err;
        throw err;
      }
    },
    
    

    

    async confirmBookingStatus(bookingId) {
      try {
        await axios.patch(`/reception/bookings/${bookingId}`, { status: "completed" }, {
          headers: this.getAdminHeaders(),
        });
      } catch (err) {
        this.error = err;
        throw err;
      }
    },
  },
});
