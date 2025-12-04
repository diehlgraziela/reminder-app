import { ref } from "vue";
import { defineStore } from "pinia";
import type { ReminderPayload, ReminderFilter } from "@/types/Reminder";
import { reminderService } from "@/services/reminderService";

export const useReminderStore = defineStore("reminder", () => {
  const reminders = ref<Record<string, ReminderPayload[]>>([]);
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

  function addOrUpdateReminder(reminderData: ReminderPayload) {
    const newDate = reminderData.scheduled_at.split("T")[0];

    for (const date in reminders.value) {
      const index = reminders.value[date].findIndex((r) => r.id === reminderData.id);

      if (index !== -1) {
        reminders.value[date].splice(index, 1);

        if (reminders.value[date].length === 0) {
          delete reminders.value[date];
        }

        break;
      }
    }

    if (!reminders.value[newDate]) {
      reminders.value[newDate] = [];
    }

    reminders.value[newDate].push(reminderData);
  }

  async function fetchReminders(payload: ReminderFilter) {
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
    const res = await reminderService.createReminder(reminder);

    if (res.ok && res.data) {
      addOrUpdateReminder(res.data.data);
    }

    return res;
  }

  async function updateReminder(reminder: ReminderPayload) {
    const res = await reminderService.updateReminder(reminder);

    if (res.ok && res.data) {
      addOrUpdateReminder(res.data.data);
    }

    return res;
  }

  async function deleteReminder(id: number) {
    const res = await reminderService.deleteReminder(id);

    if (res.ok) {
      for (const date in reminders.value) {
        const index = reminders.value[date].findIndex((r) => r.id === id);

        if (index !== -1) {
          reminders.value[date].splice(index, 1);

          if (reminders.value[date].length === 0) {
            delete reminders.value[date];
          }

          break;
        }
      }
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
