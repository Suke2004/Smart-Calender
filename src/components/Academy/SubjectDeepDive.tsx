import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Minus, Calendar as CalendarIcon, TrendingUp, AlertCircle } from 'lucide-react';
import { Subject } from '../../types';
import { useAcademy } from '../../hooks/useAcademy';
import { format, subDays, isSameDay } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { cn } from '../../utils';

interface SubjectDeepDiveProps {
  subject: Subject | null;
  onClose: () => void;
  academy: ReturnType<typeof useAcademy>;
}

export function SubjectDeepDive({ subject, onClose, academy }: SubjectDeepDiveProps) {
  
  const chartData = useMemo(() => {
    if (!subject) return [];
    
    const data = [];
    let cumulativePresent = 0;
    let cumulativeTotal = 0;

    // We'll generate data for the last 30 days
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

  const recentDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
       days.push(subDays(new Date(), i));
    }
    return days;
  }, []);

  if (!subject) return null;

  const stats = academy.calculateStats(subject.records, subject.targetAttendance);

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
          className="relative w-full max-w-5xl bg-surface/95 backdrop-blur-3xl min-h-[80vh] max-h-[95vh] overflow-y-auto p-10 rounded-[2.5rem] shadow-2xl border border-white/20"
        >
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-on-surface-variant hover:text-on-surface p-2 hover:bg-outline/5 rounded-full transition-all"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="mb-12">
            <div className="flex gap-2 items-center mb-2">
              <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: subject.themeColor }} />
              <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                {subject.code || 'Deep Dive'}
              </span>
            </div>
            <h2 className="serif-italic text-5xl tracking-tighter text-on-surface">{subject.name}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Analytics */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/[0.02]">
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

            {/* Right Column: Historical Backlog */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-black/[0.02]">
                <div className="flex items-center gap-2 mb-6">
                  <CalendarIcon size={16} className="text-on-surface-variant" />
                  <h3 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Historical Log (7 Days)
                  </h3>
                </div>

                <div className="space-y-2">
                  {recentDays.map((d) => {
                    const dateStr = format(d, 'yyyy-MM-dd');
                    const record = subject.records[dateStr];

                    let highlightClass = "bg-outline/5";
                    if (record?.status === 'present') highlightClass = "bg-green-500/10 border-green-500/20";
                    if (record?.status === 'absent') highlightClass = "bg-red-500/10 border-red-500/20";

                    return (
                      <div key={dateStr} className={cn("flex items-center justify-between p-3 rounded-xl border border-transparent transition-colors", highlightClass)}>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-on-surface">
                            {isSameDay(d, new Date()) ? 'Today' : format(d, 'EEEE')}
                          </span>
                          <span className="text-[10px] text-on-surface-variant">{format(d, 'MMM dd')}</span>
                        </div>
                        
                        <div className="flex gap-1">
                          <button 
                            onClick={() => academy.markAttendance(subject.id, dateStr, 'present')}
                            className={cn(
                              "p-2 rounded-lg transition-all",
                              record?.status === 'present' ? "bg-green-500 text-white shadow-md" : "text-on-surface-variant hover:bg-black/5"
                            )}
                          >
                            <Check size={14} />
                          </button>
                          <button 
                            onClick={() => academy.markAttendance(subject.id, dateStr, 'absent')}
                            className={cn(
                              "p-2 rounded-lg transition-all",
                              record?.status === 'absent' ? "bg-red-500 text-white shadow-md" : "text-on-surface-variant hover:bg-black/5"
                            )}
                          >
                            <X size={14} />
                          </button>
                          <button 
                            onClick={() => academy.markAttendance(subject.id, dateStr, 'cancelled')}
                            className={cn(
                              "p-2 rounded-lg transition-all",
                              record?.status === 'cancelled' ? "bg-gray-400 text-white shadow-md" : "text-on-surface-variant hover:bg-black/5"
                            )}
                          >
                            <Minus size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
