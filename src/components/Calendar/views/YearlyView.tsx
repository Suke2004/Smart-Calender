import React from 'react';
import { motion } from 'motion/react';
import { format, isSameMonth, parseISO, eachMonthOfInterval, startOfYear, endOfYear } from 'date-fns';
import { Note } from '../../../types';
import { MONTHS_DATA } from '../../../constants';

interface YearlyViewProps {
  year: number;
  notes: Note[];
  onMonthClick: (date: Date) => void;
  themeColor: string;
}

export function YearlyView({ year, notes, onMonthClick, themeColor }: YearlyViewProps) {
  const months = eachMonthOfInterval({
    start: startOfYear(new Date(year, 0, 1)),
    end: endOfYear(new Date(year, 0, 1)),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-8">
      {months.map((month) => {
        const monthKey = format(month, 'yyyy-MM');
        const monthInfo = MONTHS_DATA[monthKey];
        const monthNotes = notes.filter((n) => isSameMonth(parseISO(n.date), month));

        return (
          <motion.div
            key={monthKey}
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => onMonthClick(month)}
            className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-black/5 cursor-pointer group border border-black/[0.02]"
            role="button"
            aria-label={`View ${format(month, 'MMMM yyyy')}`}
          >
            <div className="h-32 relative overflow-hidden">
              <img
                src={
                  monthInfo?.heroImage ||
                  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop'
                }
                alt={monthInfo?.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="serif-italic text-3xl text-white drop-shadow-lg">
                  {format(month, 'MMMM')}
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">
                  Activity
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: monthInfo?.themeColor || themeColor }}
                >
                  {monthNotes.length} Entries
                </span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {monthNotes.slice(0, 5).map((note) => (
                  <div
                    key={note.id}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: monthInfo?.themeColor || themeColor }}
                  />
                ))}
                {monthNotes.length > 5 && (
                  <span className="text-[8px] font-bold opacity-30">
                    +{monthNotes.length - 5}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
