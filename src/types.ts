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
