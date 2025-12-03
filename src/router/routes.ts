import AppLayout from "@/pages/layouts/AppLayout.vue";
import GuestLayout from "@/pages/layouts/GuestLayout.vue";
import LoginPage from "@/pages/auth/LoginPage.vue";
import Dashboard from "@/pages/Index.vue";

export const routes = [
  {
    path: "/",
    component: AppLayout,
    children: [
      {
        path: "/",
        component: Dashboard,
        name: "Index",
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/auth",
    component: GuestLayout,
    children: [
      {
        path: "login",
        component: LoginPage,
        name: "LoginIndex",
        meta: { requiresAuth: false },
      },
    ],
  },
];
