export interface Note {
  id: string;
  date: string; // Start date ISO string
  endDate?: string; // End date ISO string for ranges
  content: string;
  isPinned?: boolean;
  type?: 'editorial' | 'reflection' | 'memo';
  recurrence?: 'none' | 'weekly' | 'monthly';
  label?: string;
  reminderTime?: number; // Minutes before
}

export interface CalendarMonth {
  name: string;
  year: number;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  themeColor: string; // Hex color for the month's theme
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type AttendanceStatus = 'present' | 'absent' | 'cancelled';

export interface AttendanceRecord {
  id: string; // Typically YYYY-MM-DD
  date: string; // ISO String
  status: AttendanceStatus;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  targetAttendance: number; // e.g. 75
  themeColor: string;
  records: Record<string, AttendanceRecord>; // mapping date string (YYYY-MM-DD) to record
}
