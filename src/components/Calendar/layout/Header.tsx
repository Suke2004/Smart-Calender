import React from 'react';
import {
  ChevronLeft, ChevronRight, Search, Bell, Download,
} from 'lucide-react';
import { CalendarMonth } from '../../../types';
import { Notification, UserProfile, ViewMode } from '../../../hooks/useCalendar';
import { DateRange } from '../../../types';

interface HeaderProps {
  viewMode: ViewMode;
  monthInfo: CalendarMonth;
  yearToView: number;
  themeColor: string;
  range: DateRange;
  notifications: Notification[];
  userProfile: UserProfile;
  onGoToToday: () => void;
  onPrev: () => void;
  onNext: () => void;
  onClearRange: () => void;
  onExport: () => void;
  onOpenSearch: () => void;
  onToggleNotifications: () => void;
  onOpenProfile: () => void;
}

export function Header({
  viewMode, monthInfo, yearToView, themeColor,
  range, notifications, userProfile,
  onGoToToday, onPrev, onNext, onClearRange,
  onExport, onOpenSearch, onToggleNotifications, onOpenProfile,
}: HeaderProps) {
  const title = viewMode === 'monthly'
    ? `${monthInfo.name} ${monthInfo.year}`
    : yearToView;

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 lg:px-12 py-4 sm:py-8 sticky top-0 bg-surface/60 backdrop-blur-2xl z-30 gap-4 sm:gap-0">
      {/* Left: Today + navigation */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8 w-full sm:w-auto">
        <button
          onClick={onGoToToday}
          style={{ backgroundColor: themeColor, boxShadow: `0 10px 20px -5px ${themeColor}40` }}
          className="text-surface px-6 sm:px-8 py-2 sm:py-3 rounded-2xl text-[9px] sm:text-[11px] uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-all active:scale-95"
        >
          Today
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onPrev}
            className="text-on-surface-variant hover:text-on-surface transition-colors p-1.5 sm:p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-black/[0.03]"
            aria-label="Previous"
          >
            <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
          </button>

          <h2 className="serif-italic text-xl sm:text-3xl tracking-tighter w-32 sm:w-48 text-center">
            {title}
          </h2>

          <button
            onClick={onNext}
            className="text-on-surface-variant hover:text-on-surface transition-colors p-1.5 sm:p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-black/[0.03]"
            aria-label="Next"
          >
            <ChevronRight size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {(range.start || range.end) && (
          <button
            onClick={onClearRange}
            style={{ color: themeColor }}
            className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold hover:underline px-4 sm:px-5 py-2 sm:py-2.5 bg-white rounded-2xl shadow-sm border border-black/[0.03] transition-all"
            aria-label="Clear selection"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right: Actions + profile */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          onClick={onExport}
          style={{ color: themeColor }}
          className="hover:opacity-80 transition-all flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white rounded-2xl shadow-sm border border-black/[0.03] active:scale-95"
          aria-label="Export view"
        >
          <Download size={18} style={{ color: themeColor }} className="sm:w-5 sm:h-5" />
          <span className="hidden md:inline text-[9px] sm:text-[11px] uppercase tracking-[0.2em] font-bold">
            Export View
          </span>
        </button>

        <button
          onClick={onOpenSearch}
          className="text-on-surface-variant hover:text-on-surface transition-colors p-2 sm:p-2.5 bg-white rounded-xl shadow-sm border border-black/[0.03]"
          aria-label="Search"
        >
          <Search size={18} className="sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={onToggleNotifications}
          className="text-on-surface-variant hover:text-on-surface transition-colors p-2 sm:p-2.5 bg-white rounded-xl shadow-sm border border-black/[0.03] relative"
          aria-label="Notifications"
        >
          <Bell size={18} className="sm:w-5 sm:h-5" />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
          )}
        </button>

        <div
          onClick={onOpenProfile}
          className="w-8 h-8 sm:w-10 sm:h-10 bg-outline/20 overflow-hidden rounded-xl sm:rounded-2xl border border-outline/10 shadow-sm cursor-pointer hover:ring-2 transition-all"
          role="button"
          aria-label="Profile"
        >
          <img
            src={userProfile.photo}
            alt="Profile"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
