import { http } from "./http";
import type { ApiResponse } from "./http";
import type { ReminderFilter } from "@/types/Reminder";

export const reminderService = {
  async getReminders(payload: ReminderFilter): Promise<ApiResponse<ReminderResponse>> {
    let query = "?groupBy=day";

    if (payload?.date) {
      query += `&date=${payload.date}`;
    }
    if (payload?.from) {
      query += `&from=${payload.from}`;
    }
    if (payload?.to) {
      query += `&to=${payload.to}`;
    }

    return await http.request<ReminderResponse>("GET", `/reminders${query}`, {
      date: payload?.date,
      from: payload?.from,
      to: payload?.to,
    });
  },
  async getReminder(id: number): Promise<ApiResponse<ReminderPayload>> {
    return await http.request<ReminderPayload>("GET", `/reminders/${id}`);
  },
  async createReminder(reminder: ReminderPayload): Promise<ApiResponse<ReminderPayload>> {
    return await http.request<ReminderPayload>("POST", "/reminders", reminder);
  },
  async updateReminder(reminder: ReminderPayload): Promise<ApiResponse<ReminderPayload>> {
    return await http.request<ReminderPayload>("PUT", `/reminders/${reminder.id}`, reminder);
  },
  async deleteReminder(id: number): Promise<ApiResponse<null>> {
    return await http.request<null>("DELETE", `/reminders/${id}`);
  },
};
