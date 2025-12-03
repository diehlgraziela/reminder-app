<template>
  <ul class="flex flex-col gap-1.5 flex-1">
    <template v-if="reminderStore.getReminders().length > 0">
      <ReminderItem v-for="reminder in reminderStore.getReminders()" :key="reminder" :reminder="reminder" @edit="editTask" @delete="deleteTask" />
    </template>
    <p class="text-sm text-center text-neutral-700" v-else>Nenhum lembrete encontrado.</p>
  </ul>
</template>

<script setup lang="ts">
import { useReminderStore } from "@/store/reminderStore";
import ReminderItem from "../reminder/ReminderItem.vue";
import type { ReminderPayload } from "@/types/Reminder";

type Emits = {
  (e: "edit"): void;
};

const emit = defineEmits<Emits>();
const reminderStore = useReminderStore();

async function editTask(reminder: ReminderPayload) {
  await reminderStore.setReminder(reminder);

  emit("edit");
}

async function deleteTask(id: number) {
  await reminderStore.deleteReminder(id);
}
</script>

<style scoped></style>
