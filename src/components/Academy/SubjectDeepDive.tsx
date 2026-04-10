import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { Subject } from '../../types';
import { useAcademy } from '../../hooks/useAcademy';
import { format, subDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isAfter } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cn } from '../../utils';

interface SubjectDeepDiveProps {
  subject: Subject | null;
  onClose: () => void;
  academy: ReturnType<typeof useAcademy>;
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function SubjectDeepDive({ subject, onClose, academy }: SubjectDeepDiveProps) {
  
  const chartData = useMemo(() => {
    if (!subject) return [];
    
    const data = [];
    let cumulativePresent = 0;
    let cumulativeTotal = 0;

    for (let i = 29; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const rec = subject.records[dateStr];

      if (rec) {
        if (rec.status === 'present') {
          cumulativePresent++;
          cumulativeTotal++;
        } else if (rec.status === 'absent') {
          cumulativeTotal++;
        }
      }

      const percentage = cumulativeTotal === 0 ? 100 : (cumulativePresent / cumulativeTotal) * 100;

      data.push({
        date: format(d, 'MMM dd'),
        fullDate: dateStr,
        percentage: Number(percentage.toFixed(1)),
        isTarget: subject.targetAttendance
      });
    }
    return data;
  }, [subject]);

  const { blankDays, monthDays } = useMemo(() => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(start);
    const days = eachDayOfInterval({ start, end });
    const firstDay = getDay(start);
    const blanks = firstDay === 0 ? 6 : firstDay - 1; // 0 for Monday
    return { blankDays: Array(blanks).fill(null), monthDays: days };
  }, []);

  if (!subject) return null;

  const stats = academy.calculateStats(subject.records, subject.targetAttendance);

  const cycleAttendance = (dateStr: string) => {
    const currentStatus = subject.records[dateStr]?.status;
    if (!currentStatus) academy.markAttendance(subject.id, dateStr, 'present');
    else if (currentStatus === 'present') academy.markAttendance(subject.id, dateStr, 'absent');
    else if (currentStatus === 'absent') academy.markAttendance(subject.id, dateStr, 'cancelled');
    else academy.markAttendance(subject.id, dateStr, 'cancelled'); // Hitting cancel twice toggles it off in the hook!
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-on-surface/20 backdrop-blur-xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-surface/95 backdrop-blur-3xl min-h-[80vh] max-h-[95vh] overflow-y-auto p-6 sm:p-10 rounded-[2.5rem] shadow-2xl border border-white/20"
        >
          <button
            onClick={onClose}
            className="absolute top-6 sm:top-8 right-6 sm:right-8 text-on-surface-variant hover:text-on-surface p-2 hover:bg-outline/5 rounded-full transition-all z-10"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="mb-12 pr-12">
            <div className="flex gap-2 items-center mb-2">
              <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: subject.themeColor }} />
              <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                {subject.code || 'Deep Dive'}
              </span>
            </div>
            <h2 className="serif-italic text-4xl sm:text-5xl tracking-tighter text-on-surface">{subject.name}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            
            {/* Analytics Column */}
            <div className="xl:col-span-2 space-y-8">
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-black/[0.02]">
                <div className="flex justify-between items-end mb-8">
                  <div>
                     <h3 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">
                        Attendance Trajectory (30 Days)
                     </h3>
                     <div className="flex items-center gap-4">
                        <span className="serif-italic text-4xl" style={{ color: subject.themeColor }}>
                          {stats.percentage.toFixed(1)}%
                        </span>
                        {stats.percentage < subject.targetAttendance && (
                          <div className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
                            <AlertCircle size={12} /> Below Target
                          </div>
                        )}
                     </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant">Target</span>
                    <p className="font-bold text-lg">{subject.targetAttendance}%</p>
                  </div>
                </div>

                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={subject.themeColor} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={subject.themeColor} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#888' }} 
                        dy={10} 
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#888' }} 
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: '#111', fontWeight: 'bold' }}
                      />
                      <ReferenceLine y={subject.targetAttendance} stroke="#ff4d4f" strokeDasharray="3 3" />
                      <Area 
                        type="monotone" 
                        dataKey="percentage" 
                        stroke={subject.themeColor} 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorPercentage)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Interactive Calendar Column */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-black/[0.02]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={16} className="text-on-surface-variant" />
                    <h3 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      {format(new Date(), 'MMMM yyyy')}
                    </h3>
                  </div>
                  <span className="text-[8px] uppercase tracking-widest font-bold opacity-40">Tap days to toggle</span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {DAY_LABELS.map(day => (
                    <div key={`header-${day}`} className="text-center py-2 text-[8px] uppercase font-bold text-on-surface-variant opacity-50">
                      {day}
                    </div>
                  ))}
                  
                  {blankDays.map((_, i) => <div key={`blank-${i}`} />)}

                  {monthDays.map((d) => {
                    const dateStr = format(d, 'yyyy-MM-dd');
                    const record = subject.records[dateStr];
                    const isFuture = isAfter(d, new Date()) && !isSameDay(d, new Date());
                    
                    let bgClass = "bg-outline/5 hover:bg-outline/10 text-on-surface";
                    if (record?.status === 'present') bgClass = "bg-green-500 shadow-md text-white font-bold";
                    if (record?.status === 'absent') bgClass = "bg-red-500 shadow-md text-white font-bold";
                    if (record?.status === 'cancelled') bgClass = "bg-gray-400 shadow-sm text-white font-bold";

                    return (
                      <button
                        key={dateStr}
                        disabled={isFuture}
                        onClick={() => cycleAttendance(dateStr)}
                        className={cn(
                          "aspect-square rounded-xl flex items-center justify-center text-xs transition-all",
                          bgClass,
                          isFuture && "opacity-30 cursor-not-allowed",
                          isSameDay(d, new Date()) && !record && "border-2 border-black/20"
                        )}
                        title={record ? `Currently: ${record.status}` : isFuture ? "Future date" : "Unmarked"}
                      >
                        {format(d, 'd')}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex justify-between items-center mt-6 px-1">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"/><span className="text-[8px] uppercase tracking-widest font-bold opacity-60">Present</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"/><span className="text-[8px] uppercase tracking-widest font-bold opacity-60">Absent</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-400"/><span className="text-[8px] uppercase tracking-widest font-bold opacity-60">Cancel</span></div>
                </div>

              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

