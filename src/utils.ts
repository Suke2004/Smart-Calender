import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  isWithinInterval,
  format
} from 'date-fns';

export function getCalendarDays(date: Date) {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });

  return eachDayOfInterval({ start, end });
}

export function isDateInRange(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  try {
    const interval = start < end ? { start, end } : { start: end, end: start };
    return isWithinInterval(date, interval);
  } catch {
    return false;
  }
}

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
