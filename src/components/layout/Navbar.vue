<template>
  <nav class="navbar bg-white border border-b-neutral-200 h-16 w-full flex items-center justify-between">
    <span class="font-medium text-xl">Página inicial</span>

    <Reminder />
  </nav>
</template>

<script setup lang="ts">
import Reminder from "../reminder/Reminder.vue";
</script>

<style scoped>
.navbar {
  padding: 16px 24px;
}
</style>
