import { http } from "./http";
import type { ApiResponse } from "./http";
import type { Reminder, ReminderDate } from "@/types/Reminder";

export const reminderService = {
  async getReminders(payload: ReminderDate): Promise<ApiResponse<ReminderBody>> {
    let query = "";

    if (payload?.date) {
      query += `?date=${payload.date}`;
    }
    if (payload?.from) {
      query += `?from=${payload.from}`;
    }
    if (payload?.to) {
      query += `&to=${payload.to}`;
    }

    return await http.request<ReminderDate>("GET", `/reminders${query}`, {
      date: payload?.date,
      from: payload?.from,
      to: payload?.to,
    });
  },
  async createReminder(reminder: Reminder): Promise<ApiResponse<Reminder>> {
    return await http.request<Reminder>("POST", "/reminders", {
      title: reminder.title,
      scheduled_at: reminder.scheduledAt,
      entity: reminder.entity,
      entity_id: reminder.entityId,
      notify_before_minutes: reminder.notifyBeforeMinutes,
    });
  },
};
