<template>
  <div class="layout bg-neutral-50">
    <Sidebar />
    <div class="page-container">
      <Toaster position="bottom-left" default />
      <Navbar />
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import Sidebar from "@/components/layout/Sidebar.vue";
import Navbar from "@/components/layout/Navbar.vue";
import { toast } from "vue-sonner";
import { Toaster } from "vue-sonner";
import echo from "@/services/echo";
import { useUserStore } from "@/store/userStore";

const userStore = useUserStore();

onMounted(() => {
  const user = userStore.getUser();

  echo
    .private(`users.${user.id}.reminders`)
    .listen(".reminder.notify", (e) => {
      toast('Olha o lembrete!', {
        description: `${e.title} acontecerá em ${(new Date(e.scheduled_at)).toLocaleDateString('pt-BR', {
          'year': 'numeric',
          'month': '2-digit',
          'day': '2-digit',
          'hour': '2-digit',
          'minute': '2-digit',
        })}`,
      });
    });
});
</script>

<style scoped>
.layout {
  display: flex;
  height: 100%;
  width: 100%;
}

.page-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>