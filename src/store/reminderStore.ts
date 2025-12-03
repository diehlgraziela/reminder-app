import { ref } from "vue";
import { defineStore } from "pinia";
import type { ReminderPayload, ReminderDate } from "@/types/Reminder";
import { reminderService } from "@/services/reminderService";

export const useReminderStore = defineStore("reminder", () => {
  const reminders = ref<ReminderPayload[]>([]);

  function setReminders(value: ReminderPayload[]) {
    reminders.value = value;
  }

  function getReminders(): ReminderPayload[] {
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

  async function createReminder(reminder: ReminderPayload) {
    return await reminderService.createReminder(reminder);
  }

  async function deleteReminder(id: number) {
    const res = await reminderService.deleteReminder(id);

    if (res.ok) {
      setReminders(reminders.value.filter((reminder: ReminderPayload) => reminder.id !== id));
    }
  }

  const state = {
    reminders,
  };

  const actions = {
    getReminders,
    fetchReminders,
    createReminder,
    deleteReminder,
  };

  return {
    ...state,
    ...actions,
  };
});
