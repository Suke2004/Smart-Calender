import React, { useState, useMemo } from 'react';
import { format, addMonths, subMonths, isSameMonth, isSameDay, isAfter, isBefore, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils';
import { DateRange } from '../../types';

interface DateRangePickerProps {
  range: DateRange;
  onChange: (range: DateRange) => void;
  themeColor: string;
}

export function DateRangePicker({ range, onChange, themeColor }: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(range.start || new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const handleDateClick = (date: Date) => {
    if (!isSelecting) {
      setIsSelecting(true);
      onChange({ start: date, end: null });
    } else {
      setIsSelecting(false);
      if (range.start && isBefore(date, range.start)) {
        onChange({ start: date, end: range.start });
      } else {
        onChange({ start: range.start, end: date });
      }
    }
  };

  const handleMouseEnter = (date: Date) => {
    if (isSelecting) {
      setHoverDate(date);
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-black/[0.05] w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-outline/5 rounded-lg transition-colors" type="button">
          <ChevronLeft size={16} />
        </button>
        <span className="text-xs font-bold uppercase tracking-widest">{format(currentMonth, 'MMMM yyyy')}</span>
        <button onClick={nextMonth} className="p-1 hover:bg-outline/5 rounded-lg transition-colors" type="button">
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
          <div key={day} className="text-center text-[8px] uppercase tracking-widest font-bold text-on-surface-variant opacity-50">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {days.map(day => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelectedStart = range.start && isSameDay(day, range.start);
          const isSelectedEnd = range.end && isSameDay(day, range.end);
          
          let isInRange = false;
          if (range.start && range.end) {
            isInRange = isWithinInterval(day, { start: range.start, end: range.end });
          } else if (range.start && hoverDate && isSelecting) {
            const start = isBefore(range.start, hoverDate) ? range.start : hoverDate;
            const end = isAfter(range.start, hoverDate) ? range.start : hoverDate;
            isInRange = isWithinInterval(day, { start, end });
          }

          const isEdge = isSelectedStart || isSelectedEnd;

          return (
            <button
              key={day.toString()}
              type="button"
              onClick={() => handleDateClick(day)}
              onMouseEnter={() => handleMouseEnter(day)}
              className={cn(
                "h-8 text-xs relative transition-colors",
                !isCurrentMonth && "opacity-30",
                isInRange && !isEdge && "bg-primary/10",
                isSelectedStart && "rounded-l-lg",
                isSelectedEnd && "rounded-r-lg",
                (isSelectedStart || isSelectedEnd) && "bg-primary/20",
                !isInRange && "hover:bg-outline/5 rounded-lg"
              )}
            >
              <span 
                className={cn(
                  "absolute inset-0 flex items-center justify-center rounded-lg transition-all",
                  isEdge && "text-white font-bold shadow-md"
                )}
                style={isEdge ? { backgroundColor: themeColor } : {}}
              >
                {format(day, 'd')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
