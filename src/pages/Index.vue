<template>
  <div>
    <Button @click="handleLogout">Logout</Button>
  </div>
</template>

<script lang="ts" setup>
import Button from "@/components/ui/button/Button.vue";
import router from "@/router";
import { authService } from "@/services/authService";

const handleLogout = async () => {
  await authService.logout();
  router.push({
    name: "LoginIndex",
  })
}
</script>
