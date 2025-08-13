import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
const routes = [
  {
    path: "/",
    name: "login",
    component: HomePage,
  },
  {
    path: "/chat",
    name: "chat",
    component: HomePage,
    meta: { requiresAuth: true }
  },
  
  {
    path: "/admin",
    name: "admin",
    component: () => import("@/pages/AdminPage.vue")
  },
  {
    path: "/admin/dashboard",
    name: "dashboard",
    component: () => import("@/pages/DashboardPage.vue"),
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
