<template>
  <ul class="tasks">
    <template v-if="reminderStore.getReminders().length > 0">
      <Task v-for="reminder in reminderStore.getReminders()" :key="reminder" :reminder="reminder" @delete="deleteTask" />
    </template>
    <p class="text-sm text-center text-neutral-700" v-else>Nenhum lembrete encontrado.</p>
  </ul>
</template>

<script setup lang="ts">
import { useReminderStore } from "@/store/reminderStore";
import Task from "./Task.vue";

const reminderStore = useReminderStore();

async function deleteTask(id: number) {
  await reminderStore.deleteReminder(id);
}
</script>

<style scoped>
.tasks {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
</style>
