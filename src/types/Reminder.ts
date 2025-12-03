export interface Reminder {
  title: string;
  scheduledAt: string;
  entity: "chat" | "contact";
  entityId: number;
  notifyBeforeMinutes: 0;
}

export interface ReminderBody {
  data: { id: number & Reminder }[];
  links: {
    first: string;
    last: string;
    prev: string;
    next: string;
  };
  meta: {
    path: string;
    per_page: number;
    next_cursor: string;
    prev_cursor: string;
  };
}

export interface ReminderDate {
  date?: string;
  from?: string;
  to?: string;
}
