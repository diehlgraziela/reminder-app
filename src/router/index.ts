import { createWebHistory, createRouter } from "vue-router";
import { routes } from "./routes";
import { useUserStore } from "@/store/userStore";

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach(async (to) => {
  const userStore = useUserStore();
  const requiresAuth = to.meta.requiresAuth;
  const authRoutes = ['LoginIndex'];
  await userStore.fetchUser();

  if (userStore.getUser() && authRoutes.includes(to.name as string)) {
    return { name: 'Index'}
  }

  if (!userStore.getUser() && requiresAuth) {
    return { name: 'LoginIndex' }
  }
})

export default router;