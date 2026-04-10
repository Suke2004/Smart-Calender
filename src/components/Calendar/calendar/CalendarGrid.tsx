import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DateRange, Note } from '../../../types';
import { pageVariants } from '../../../hooks/useCalendar';
import { CalendarCell } from './CalendarCell';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface CalendarGridProps {
  days: Date[];
  monthKey: string;
  direction: number;
  currentDate: Date;
  range: DateRange;
  notes: Note[];
  themeColor: string;
  monthName: string;
  monthYear: number;
  onDayClick: (day: Date) => void;
}

export function CalendarGrid({
  days, monthKey, direction, currentDate, range,
  notes, themeColor, monthName, monthYear, onDayClick,
}: CalendarGridProps) {
  return (
    <section className="bg-[#f3f4f1] p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl shadow-black/5 relative">
      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 mb-1 sm:mb-2">
        {DAY_LABELS.map(day => (
          <div key={day} className="py-1 sm:py-2 text-center">
            <span className="text-[7px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] text-on-surface-variant font-bold opacity-40">
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Animated day grid */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={monthKey}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            rotateX: { type: 'spring', stiffness: 150, damping: 25 },
            opacity: { duration: 0.3 },
            scale:   { duration: 0.4 },
          }}
          className="grid grid-cols-7 bg-[#f3f4f1] gap-1 sm:gap-2"
          style={{ transformOrigin: 'center top', perspective: '1200px' }}
          role="grid"
          aria-label={`Calendar for ${monthName} ${monthYear}`}
        >
          {days.map(day => (
            <CalendarCell
              key={day.toString()}
              day={day}
              currentDate={currentDate}
              range={range}
              notes={notes}
              themeColor={themeColor}
              onClick={onDayClick}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
