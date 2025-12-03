export interface ReminderPayload {
  id?: number;
  title: string;
  scheduled_at: string;
  entity: string;
  entity_id: number;
  notify_before_minutes: number;
}

export interface ReminderResponse extends ReminderPayload {
  entity_data: {
    id: number;
    name?: string;
  };
}

export interface ReminderResponse {
  data: ReminderResponse[];
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
