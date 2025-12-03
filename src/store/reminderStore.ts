import { ref } from "vue";
import { defineStore } from "pinia";
import type { ReminderPayload, ReminderDate } from "@/types/Reminder";
import { reminderService } from "@/services/reminderService";

type ReminderMap = Record<string, ReminderPayload[]>;

export const useReminderStore = defineStore("reminder", () => {
  const reminders = ref<ReminderPayload[]>([]);
  const loadingReminders = ref<boolean>(false);
  const reminder = ref<ReminderPayload | null>(null);

  function setReminders(value: ReminderPayload[]) {
    reminders.value = value;
  }

  function getReminders(): ReminderPayload[] {
    return reminders.value;
  }

  function setReminder(value: ReminderPayload | null) {
    reminder.value = value;
  }

  function getReminder(): ReminderPayload | null {
    return reminder.value;
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

  async function fetchReminder(id: number) {
    loadingReminders.value = true;
    const res = await reminderService.getReminder(id);

    if (res.ok && res.data) {
      setReminder(res.data.data);
    } else {
      setReminder(null);
    }

    loadingReminders.value = false;

    return res;
  }

  async function createReminder(reminder: ReminderPayload) {
    return await reminderService.createReminder(reminder);
  }

  async function updateReminder(reminder: ReminderPayload) {
    return await reminderService.updateReminder(reminder);
  }

  async function deleteReminder(id: number) {
    const res = await reminderService.deleteReminder(id);

    if (res.ok) {
      setReminders(reminders.value.filter((reminder: ReminderPayload) => reminder.id !== id));
    }
  }

  const state = {
    reminders,
    loadingReminders,
  };

  const actions = {
    fetchReminders,
    fetchReminder,
    createReminder,
    updateReminder,
    deleteReminder,
    getReminders,
    setReminders,
    setReminder,
    getReminder,
  };

  return {
    ...state,
    ...actions,
  };
});
