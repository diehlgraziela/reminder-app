import { ref } from "vue";
import { defineStore } from "pinia";
import type { Reminder, ReminderDate } from "@/types/Reminder";
import { reminderService } from "@/services/reminderService";

export const useReminderStore = defineStore("reminder", () => {
  const reminders = ref<Reminder[]>([]);

  function setReminders(value: { id: number & Reminder }[]) {
    reminders.value = value;
  }

  function getReminders(): Reminder[] {
    return reminders.value;
  }

  async function fetchReminders(payload: ReminderDate) {
    const res = await reminderService.getReminders(payload);

    if (res.ok && res.data) {
      setReminders(res.data.data);
    } else {
      setReminders([]);
    }

    return res;
  }

  async function createReminder(reminder: Reminder) {
    return await reminderService.createReminder(reminder);
  }

  const state = {
    reminders,
  };

  const actions = {
    getReminders,
    fetchReminders,
    createReminder,
  };

  return {
    ...state,
    ...actions,
  };
});
