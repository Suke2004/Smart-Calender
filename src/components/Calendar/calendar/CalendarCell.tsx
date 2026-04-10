import React from 'react';
import { motion } from 'motion/react';
import {
  format, isSameMonth, isSameDay, startOfToday,
  isAfter, parseISO, getDay, getDate, isWithinInterval,
} from 'date-fns';
import { HOLIDAYS } from '../../../constants';
import { isDateInRange, cn } from '../../../utils';
import { DateRange, Note, Subject } from '../../../types';

interface CalendarCellProps {
  key?: React.Key;
  day: Date;
  currentDate: Date;
  range: DateRange;
  notes: Note[];
  themeColor: string;
  subjects: Subject[];
  onClick: (day: Date) => void;
}

export function CalendarCell({ day, currentDate, range, notes, themeColor, subjects, onClick }: CalendarCellProps) {

  const isCurrentMonth  = isSameMonth(day, currentDate);
  const isToday         = isSameDay(day, startOfToday());
  const isSelectedStart = !!(range.start && isSameDay(day, range.start));
  const isSelectedEnd   = !!(range.end   && isSameDay(day, range.end));
  const isInRange       = isDateInRange(day, range.start, range.end);
  const holiday         = HOLIDAYS[format(day, 'yyyy-MM-dd')];

  const dayNotes = notes.filter(n => {
    const start           = parseISO(n.date);
    const isAfterOrSame   = isSameDay(day, start) || isAfter(day, start);
    if (!isAfterOrSame) return false;
    if (n.recurrence === 'weekly')  return getDay(start)  === getDay(day);
    if (n.recurrence === 'monthly') return getDate(start) === getDate(day);
    if (n.endDate) return isWithinInterval(day, { start, end: parseISO(n.endDate) });
    return isSameDay(start, day);
  });

  const dateStr = format(day, 'yyyy-MM-dd');
  const dayAttendanceLogs = subjects
    .filter(s => s.records[dateStr])
    .map(s => ({
      subject: s,
      status: s.records[dateStr].status
    }));

  return (
    <motion.div
      onClick={() => onClick(day)}
      whileHover={{ scale: 1.02, y: -2 }}
      className={cn(
        'aspect-square p-0.5 sm:p-2 lg:p-4 flex flex-col justify-between group cursor-pointer transition-all relative overflow-hidden rounded-lg sm:rounded-3xl border border-transparent',
        !isCurrentMonth ? 'bg-surface/30 opacity-30' : 'bg-surface hover:bg-white shadow-sm hover:shadow-xl hover:shadow-black/5 hover:border-black/[0.03]',
        isInRange && 'bg-primary/5',
        (isSelectedStart || isSelectedEnd) && 'bg-primary/10',
      )}
      role="gridcell"
      aria-label={format(day, 'MMMM d, yyyy')}
      aria-selected={isSelectedStart || isSelectedEnd || isInRange}
    >
      {/* Date number + holiday label */}
      <div className="flex justify-between items-start z-10">
        <div className="relative group/holiday">
          <span
            className={cn(
              'serif-italic text-xs sm:text-base lg:text-lg transition-all relative z-10 px-0.5 sm:px-2 py-0.5 sm:py-1',
              isToday && 'font-bold underline decoration-2 underline-offset-4',
              isToday && !isSelectedStart && !isSelectedEnd && 'text-on-surface',
              (isSelectedStart || isSelectedEnd) && 'text-surface font-bold',
            )}
            style={isToday && !isSelectedStart && !isSelectedEnd
              ? { color: themeColor, textDecorationColor: themeColor }
              : {}}
          >
            {format(day, 'd')}
          </span>

          {(isSelectedStart || isSelectedEnd) && (
            <motion.div
              layoutId="selection-indicator"
              style={{ backgroundColor: themeColor }}
              className="absolute inset-0.5 sm:inset-1 rounded-full -z-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </div>

        {holiday && (
          <div className="relative group/tooltip">
            <span
              style={{ color: themeColor }}
              className="hidden md:block text-[8px] uppercase tracking-widest font-bold opacity-60 cursor-help"
            >
              {holiday}
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-on-surface text-surface text-[8px] uppercase tracking-widest whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 rounded shadow-lg">
              {holiday}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-on-surface" />
            </div>
          </div>
        )}
      </div>

      {/* Note indicators + start/end labels */}
      <div className="flex flex-col items-end gap-0.5 sm:gap-1 z-10">
        {dayNotes.some(n => n.label) && (
          <div className="flex flex-col items-end gap-0.5 mb-1">
            {dayNotes.filter(n => n.label).map(note => (
              <span
                key={`label-${note.id}`}
                style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                className="text-[6px] sm:text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden max-w-[60px] sm:max-w-[100px] text-ellipsis"
              >
                {note.label}
              </span>
            ))}
          </div>
        )}

        {dayNotes.length > 0 && (
          <div className="flex gap-0.5">
            {dayNotes.map(note => (
              <div
                key={note.id}
                className={cn('w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full', note.endDate ? 'w-1 sm:w-2' : 'bg-outline')}
                style={note.endDate ? { backgroundColor: themeColor } : {}}
              />
            ))}
          </div>
        )}

        {/* --- ACADEMIC LEDGER BRIDGING VISUALS --- */}
        {dayAttendanceLogs.length > 0 && (
          <div className="flex gap-0.5 mt-0.5" title="Academy Logs">
            {dayAttendanceLogs.map((log, idx) => {
              let dotColor = "bg-gray-400"; // Cancelled
              if (log.status === 'present') dotColor = "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]";
              if (log.status === 'absent') dotColor = "bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]";
              return (
                <div
                  key={`academy-log-${idx}`}
                  className={cn('w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full z-10', dotColor)}
                />
              );
            })}
          </div>
        )}

        {isSelectedStart && (
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: themeColor }}
            className="text-[5px] sm:text-[6px] lg:text-[7px] uppercase tracking-[0.1em] sm:tracking-[0.2em] font-black flex items-center gap-0.5 sm:gap-1"
          >
            <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full" style={{ backgroundColor: themeColor }} />
            Start
          </motion.span>
        )}

        {isSelectedEnd && (
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: themeColor }}
            className="text-[5px] sm:text-[6px] lg:text-[7px] uppercase tracking-[0.1em] sm:tracking-[0.2em] font-black flex items-center gap-0.5 sm:gap-1"
          >
            <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full" style={{ backgroundColor: themeColor }} />
            End
          </motion.span>
        )}
      </div>

      {/* Range highlight overlay */}
      {isInRange && (
        <motion.div
          layoutId="range-highlight"
          className={cn(
            'absolute inset-0 pointer-events-none flex items-center',
            isSelectedStart && !isSelectedEnd ? 'left-1/2' : '',
            isSelectedEnd && !isSelectedStart ? 'right-1/2' : '',
            isSelectedStart && isSelectedEnd  ? 'hidden' : '',
          )}
        >
          <div
            style={{ backgroundColor: `${themeColor}15`, borderTopColor: `${themeColor}30`, borderBottomColor: `${themeColor}30` }}
            className="h-6 sm:h-10 lg:h-12 w-full border-y transition-colors duration-300"
          />
        </motion.div>
      )}
    </motion.div>
  );
}
