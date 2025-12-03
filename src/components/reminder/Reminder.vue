<template>
  <Popover @update:open="handleClose">
    <PopoverTrigger as-child>
      <Button size="icon" variant="ghost">
        <CalendarDays />
      </Button>
    </PopoverTrigger>

    <PopoverContent align="end" :class="['p-0 h-[400px] flex', showTaskForm ? 'w-[620px]' : 'w-[310px]']">
      <div class="flex flex-col flex-1 gap-4 p-4 reminder-container border-r border-r-neutral-200">
        <ReminderHeader @select-day="selectDay" />

        <TaskList />

        <ReminderFooter :disabled="showTaskForm" @create-reminder="toggleTaskForm" />
      </div>

      <TaskForm v-if="showTaskForm" @cancel="toggleTaskForm" @save="saveTask" />
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CalendarDays } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ReminderHeader, { type Day } from "./ReminderHeader.vue";
import TaskForm from "../task/TaskForm.vue";
import ReminderFooter from "./ReminderFooter.vue";
import TaskList from "../task/TaskList.vue";
import type { Reminder, ReminderDate } from "@/types/Reminder";

import { useReminderStore } from "@/store/reminderStore";

const reminderStore = useReminderStore();
const selectedDay = ref<Day>("today");
const showTaskForm = ref<boolean>(false);

async function selectDay(payload: ReminderDate) {
  await reminderStore.fetchReminders(payload);
}

function toggleTaskForm() {
  showTaskForm.value = !showTaskForm.value;
}

function handleClose() {
  showTaskForm.value = false;
}

async function saveTask(data: Reminder) {
  const res = await reminderStore.createReminder(data);

  if (res && res.ok) {
    toggleTaskForm();
  }
}
</script>

<style scoped></style>
