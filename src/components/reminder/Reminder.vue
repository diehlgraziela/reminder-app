<template>
  <Popover @update:open="handleClose">
    <PopoverTrigger as-child>
      <Button size="icon" variant="ghost">
        <CalendarDays />
      </Button>
    </PopoverTrigger>

    <PopoverContent align="end" :class="['p-0 h-[400px] flex', showReminderForm ? 'w-[620px]' : 'w-[310px]']">
      <div class="flex flex-col flex-1 gap-4 py-3 reminder-container border-r border-r-neutral-200">
        <ReminderHeader @select-day="selectDay" />

        <ReminderList @edit="showReminderForm = true" :selected-day="selectedDay" />

        <ReminderFooter :disabled="showReminderForm" @create-reminder="toggleReminderForm" />
      </div>

      <ReminderForm v-if="showReminderForm" :reminder="reminderStore.getReminder()" @cancel="toggleReminderForm" @save="saveTask" />
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CalendarDays } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ReminderHeader from "./ReminderHeader.vue";
import ReminderForm from "./ReminderForm.vue";
import ReminderFooter from "./ReminderFooter.vue";
import ReminderList from "./ReminderList.vue";
import type { ReminderPayload, ReminderFilter } from "@/types/Reminder";

import { useReminderStore } from "@/store/reminderStore";

const reminderStore = useReminderStore();
const showReminderForm = ref<boolean>(false);
const selectedDay = ref<ReminderFilter>();

async function selectDay(payload: ReminderFilter) {
  await reminderStore.fetchReminders(payload);

  selectedDay.value = payload;
}

function toggleReminderForm() {
  showReminderForm.value = !showReminderForm.value;

  if (!showReminderForm.value) {
    reminderStore.setReminder(null);
  }
}

function handleClose() {
  showReminderForm.value = false;
}

async function saveTask(payload: ReminderPayload) {
  let res;

  if (payload.id) {
    res = await reminderStore.updateReminder(payload);
  } else {
    res = await reminderStore.createReminder(payload);
  }

  if (res && res.ok) {
    toggleReminderForm();
  }
}
</script>

<style scoped></style>
