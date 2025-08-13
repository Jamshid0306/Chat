import { createRouter, createWebHistory } from "vue-router"
import HomePage from "../pages/HomePage.vue"

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
    name: "admin-login",
    component: () => import("@/pages/AdminPage.vue")
  },
  {
    path: "/admin/dashboard",
    name: "dashboard",
    component: () => import("@/pages/DashboardPage.vue"),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const userToken = localStorage.getItem("token");
  const adminToken = localStorage.getItem("admin_token");

  if (to.path.startsWith("/chat") && !userToken) return next("/");
  
  if (to.path === "/admin" && adminToken) return next("/admin/dashboard");
  if (to.path.startsWith("/admin") && to.path !== "/admin" && !adminToken) {
    return next("/admin");
  }

  if (to.path.startsWith("/chat") && adminToken) {
    localStorage.removeItem("admin_token");
    return next("/");
  }
  if (to.path.startsWith("/admin") && userToken) {
    localStorage.removeItem("token");
    return next("/admin");
  }

  next();
});



export default router
