<script setup>
import { ref, reactive, onMounted } from "vue";
import { useAdminStore } from "../stores/adminStore";
import axios from "axios";
import { computed } from "vue";

const confirmedUsers = computed(() =>
  store.users.filter((u) => u.booking_status === "confirmed")
);

const store = useAdminStore();
const showForm = ref(false);
const formData = reactive({
  firstName: "",
  lastName: "",
  middleName: "",
  phone: "",
  roomId: null,
  checkoutDate: "",
});
const selectedUser = ref(null);
const action = ref("");
const newCheckoutDate = ref("");
const showActionModal = ref(false);
const hoveredUserId = ref(null);

const onCancel = () => {
  showForm.value = false;
  formData.firstName = "";
  formData.lastName = "";
  formData.middleName = "";
  formData.phone = "";
  formData.roomId = null;
  formData.checkoutDate = "";
};

const onSubmit = async () => {
  if (
    !formData.firstName.trim() ||
    !formData.lastName.trim() ||
    !formData.phone.trim()
  )
    return alert("Iltimos, ism, familiya va telefonni to‘ldiring");
  if (!formData.roomId) return alert("Iltimos, xona tanlang");
  if (!formData.checkoutDate)
    return alert("Iltimos, checkout sanasini tanlang");
  const isoCheckoutDate = new Date(formData.checkoutDate);
  isoCheckoutDate.setHours(23, 59, 59, 999);
  await store.createUser({
    first_name: formData.firstName,
    last_name: formData.lastName,
    patronymic: formData.middleName,
    phone_number: formData.phone,
    room_id: formData.roomId,
    check_out_date: isoCheckoutDate.toISOString(),
  });
  await store.fetchUsers();
  onCancel();
};

onMounted(() => {
  store.fetchUsers();
  store.getRooms();
});

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return "-";
  return d.toLocaleDateString();
};

const openActionModal = (user) => {
  selectedUser.value = user;
  action.value = "";
  newCheckoutDate.value = "";
  showActionModal.value = true;
};

const closeActionModal = () => {
  showActionModal.value = false;
  selectedUser.value = null;
  action.value = "";
  newCheckoutDate.value = "";
};

const onActionConfirm = async () => {
  if (!action.value) return alert("Iltimos, harakatni tanlang");
  if (action.value === "extend") {
    if (!newCheckoutDate.value)
      return alert("Iltimos, yangi checkout sanasini tanlang");
    const d = new Date(newCheckoutDate.value);
    d.setHours(23, 59, 59, 999);
    try {
      await store.updateUserCheckout(
        selectedUser.value.booking_id,
        d.toISOString()
      );
      await store.fetchUsers();
      closeActionModal();
    } catch (error) {
      alert("Xatolik yuz berdi: " + (error.message || error));
    }
  } else if (action.value === "delete") {
    try {
      await store.completeBookingStatus(selectedUser.value.booking_id);
      closeActionModal();
    } catch (error) {
      alert("Xatolik yuz berdi: " + (error.message || error));
    }
  }
};
</script>

<template>
  <section class="dashboard">
    <div class="top">
      <h2 class="title">Hamma foydalanuvchilar</h2>
      <button @click="showForm = true" class="btn-primary">
        Yangi user yaratish
      </button>
    </div>

    <div v-if="showForm" class="modal">
      <h2 class="modal-title">Yangi user yaratish</h2>
      <form @submit.prevent="onSubmit" class="form">
        <div class="input-group">
          <label for="firstName">Ism *</label>
          <input
            type="text"
            id="firstName"
            v-model="formData.firstName"
            required
          />
        </div>
        <div class="input-group">
          <label for="lastName">Familiya *</label>
          <input
            type="text"
            id="lastName"
            v-model="formData.lastName"
            required
          />
        </div>
        <div class="input-group">
          <label for="middleName">Otasining ismi</label>
          <input type="text" id="middleName" v-model="formData.middleName" />
        </div>
        <div class="input-group">
          <label for="phone">Telefon *</label>
          <input type="tel" id="phone" v-model="formData.phone" required />
        </div>
        <div class="input-group">
          <label for="checkoutDate">Checkout sanasi *</label>
          <input
            type="date"
            id="checkoutDate"
            v-model="formData.checkoutDate"
            required
          />
        </div>
        <div class="input-group">
          <label for="room">Xona *</label>
          <select id="room" v-model="formData.roomId" required>
            <option value="" disabled>Xona tanlang</option>
            <option
              v-for="room in store.rooms.filter(
                (r) => r.status === 'available'
              )"
              :key="room.id"
              :value="room.id"
            >
              Xona №{{ room.room_number }}
            </option>
          </select>
        </div>
        <div class="buttons2">
          <button type="button" class="btn-cancel" @click="onCancel">
            Bekor qilish
          </button>
          <button type="submit" class="btn-submit">Yaratish</button>
        </div>
      </form>
    </div>
    <div v-if="showForm" class="modal-overlay" @click="onCancel"></div>

    <div v-if="store.loading" class="loading-text">Yuklanmoqda...</div>
    <div v-if="store.error" class="error-text">
      {{ store.error.message || store.error }}
    </div>
    <div class="users-wrapper">
      <table v-if="store.users.length" class="users-table">
        <thead>
          <tr>
            <th>Ism</th>
            <th>Familiya</th>
            <th>Otasining ismi</th>
            <th>Telefon</th>
            <th>Checkout sanasi</th>
            <th style="width: 40px"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in store.users.filter(
              (user) => user.booking_status === 'confirmed'
            )"
            :key="item.id"
            @mouseenter="hoveredUserId = item.id"
            @mouseleave="hoveredUserId = null"
          >
            <td>{{ item.first_name }}</td>
            <td>{{ item.last_name }}</td>
            <td>{{ item.patronymic || "-" }}</td>
            <td>{{ item.phone_number }}</td>
            <td>{{ formatDate(item.check_out_date) }}</td>
            <div
              class="del"
              @click="openActionModal(item)"
              v-show="hoveredUserId === item.id"
            >
              ➔
            </div>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!store.loading && store.users.length === 0" class="no-users">
      Foydalanuvchilar topilmadi
    </div>

    <div v-if="showActionModal" class="modal">
      <h2 class="modal-title">
        {{ selectedUser?.first_name }} uchun harakat tanlang
      </h2>
      <div class="input-group">
        <label for="actionSelect">Harakat *</label>
        <select id="actionSelect" v-model="action">
          <option disabled value="">Tanlang</option>
          <option value="extend">Checkout sanasini uzaytirish</option>
          <option value="delete">Foydalanuvchini o'chirish</option>
        </select>
      </div>
      <div class="input-group" v-if="action === 'extend'">
        <label for="newCheckoutDate">Yangi checkout sanasi</label>
        <input type="date" id="newCheckoutDate" v-model="newCheckoutDate" />
      </div>
      <div class="buttons2" style="margin-top: 20px">
        <button class="btn-cancel" @click="closeActionModal" type="button">
          Bekor qilish
        </button>
        <button class="btn-submit" @click="onActionConfirm" type="button">
          Tasdiqlash
        </button>
      </div>
    </div>
    <div
      v-if="showActionModal"
      class="modal-overlay"
      @click="closeActionModal"
    ></div>
  </section>
</template>

<style scoped lang="scss">
.del {
  cursor: pointer;
  user-select: none;
  text-align: center;
  font-weight: 700;
  font-size: 20px;
  color: #007bff;
  transition: color 0.3s ease;
  opacity: 0;
  transition: 0.2s;
  top: 50%;
  transform: translateY(-50%);
  right: 20px;
  position: absolute;
  &:hover {
    color: #0056b3;
  }
}
tr {
  position: relative;
}
tr:hover .del {
  opacity: 1;
}

.dashboard {
  padding: 30px 15px;
  max-width: 900px;
  margin: 10px auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 15px;

    .title {
      font-size: 28px;
      font-weight: 800;
      color: #222;
      letter-spacing: 0.03em;
      @media (max-width: 600px) {
        font-size: 22px;
      }
    }
    .btn-primary {
      background: linear-gradient(135deg, #5a9bf6, #2a74f4);
      color: #fff;
      border: none;
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(42, 116, 244, 0.4);
      transition: background 0.3s ease, box-shadow 0.3s ease;
      &:hover {
        background: linear-gradient(135deg, #2a74f4, #0053c9);
        box-shadow: 0 6px 20px rgba(0, 83, 201, 0.6);
      }
      @media (max-width: 600px) {
        padding: 10px 18px;
        font-size: 14px;
      }
    }
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 9998;
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 14px;
    padding: 32px 30px;
    box-shadow: 0 18px 36px rgba(0, 0, 0, 0.12);
    z-index: 9999;
    width: 100%;
    max-width: 450px;
    @media (max-width: 500px) {
      padding: 24px 20px;
      max-width: 90%;
    }

    .modal-title {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 26px;
      text-align: center;
      color: #1f2937;
      letter-spacing: 0.02em;
      @media (max-width: 500px) {
        font-size: 20px;
        margin-bottom: 20px;
      }
    }
    form,
    .input-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    label {
      font-size: 15px;
      margin-bottom: 3px;
      color: #374151;
      font-weight: 700;
      @media (max-width: 500px) {
        font-size: 14px;
      }
    }
    input,
    select {
      padding: 14px 18px;
      border-radius: 12px;
      border: 1.8px solid #d1d5db;
      font-size: 16px;
      outline: none;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
      background: #fefefe;
      &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
      }
      @media (max-width: 500px) {
        padding: 12px 15px;
        font-size: 15px;
      }
    }
  }

  .users-wrapper {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin-top: 20px;
    border-radius: 14px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  }

  .users-table {
    width: 100%;
    min-width: 600px;
    border-collapse: separate;
    border-spacing: 0 10px;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    background: white;

    thead {
      background: #2563eb;
      color: #fff;
      font-weight: 700;
      font-size: 17px;
      letter-spacing: 0.03em;
      @media (max-width: 600px) {
        font-size: 15px;
      }
    }
    th,
    td {
      padding: 14px 18px;
      text-align: left;
      vertical-align: middle;
      @media (max-width: 600px) {
        padding: 12px 15px;
        font-size: 14px;
      }
    }
    tbody tr {
      background: #f9fafb;
      border-radius: 12px;
      box-shadow: inset 0 -1px 0 #e5e7eb;
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
      cursor: default;
      user-select: none;
      &:hover {
        background: #e0e7ff;
        box-shadow: 0 4px 15px rgba(37, 99, 235, 0.25);
      }
    }
    tbody tr td.del {
      background: transparent;
      color: #2563eb;
      font-weight: 700;
      font-size: 22px;
      text-align: center;
      cursor: pointer;
      transition: color 0.3s ease;
      user-select: none;
      &:hover {
        color: #1e40af;
      }
    }
  }

  .loading-text,
  .error-text,
  .no-users {
    text-align: center;
    font-size: 18px;
    margin-top: 24px;
    font-weight: 600;
    @media (max-width: 600px) {
      font-size: 16px;
    }
  }

  .loading-text {
    color: #6b7280;
  }

  .error-text {
    color: #dc2626;
  }

  .no-users {
    color: #9ca3af;
  }
}

.buttons2 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 14px;
  @media (max-width: 500px) {
    gap: 12px;
    flex-wrap: wrap;
  }
  button {
    padding: 14px 26px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s ease, color 0.3s ease;
    @media (max-width: 500px) {
      padding: 12px 20px;
      font-size: 14px;
      width: 100%;
    }
    &.btn-cancel {
      background: #e5e7eb;
      color: #6b7280;
      &:hover {
        background: #d1d5db;
      }
    }
    &.btn-submit {
      background: #2563eb;
      color: white;
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
      &:hover {
        background: #1e40af;
      }
    }
  }
}
</style>
