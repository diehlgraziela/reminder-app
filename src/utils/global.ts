import { format } from "date-fns";

export function atMidnight(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
}

export function getFormattedDate(date: Date, startAtMidnight?: boolean) {
  if (startAtMidnight) {
    return format(atMidnight(date), "yyyy-MM-dd HH:mm:ss");
  }

  return format(date, "yyyy-MM-dd HH:mm:ss");
}
