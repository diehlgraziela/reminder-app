<template>
  <aside class="flex flex-col justify-end items-center py-4 sidebar">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button class="align-bottom" @click="handleLogout">
            <LogOut class="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sair</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </aside>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LogOut } from "lucide-vue-next";
import router from "@/router";
import { authService } from "@/services/authService";

const handleLogout = async () => {
  await authService.logout();
  router.push({
    name: "LoginIndex",
  });
};
</script>

<style scoped>
.sidebar {
  background-color: #162935;
  width: 72px;
  height: 100%;
}
</style>
