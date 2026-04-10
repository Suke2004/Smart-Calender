import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check, X, Minus, Trash2, Edit2, TrendingUp, ShieldAlert, Zap, Calendar as CalendarIcon, Activity } from 'lucide-react';
import { useAcademy, SubjectStats } from '../../../hooks/useAcademy';
import { format } from 'date-fns';
import { Subject } from '../../../types';
import { cn } from '../../../utils';

interface AcademyViewProps {
  themeColor: string;
  academy: ReturnType<typeof useAcademy>;
}

export function AcademyView({ themeColor, academy }: AcademyViewProps) {
  const stats = academy.getOverallStats;
  const todayRaw = new Date();
  const todayDayOfWeek = todayRaw.getDay();
  const todayStr = format(todayRaw, 'yyyy-MM-dd');

  const scheduledToday = academy.subjects.filter(s => s.schedule?.includes(todayDayOfWeek));
  const otherSubjects = academy.subjects.filter(s => !s.schedule?.includes(todayDayOfWeek));

  const markAllToday = () => {
    scheduledToday.forEach(subject => {
      academy.markAttendance(subject.id, todayStr, 'present');
    });
  };

  return (
    <div className="py-8 max-w-6xl mx-auto w-full px-4 sm:px-0">
      {/* Header & Oracle Dashboard */}
      <div className="mb-12">
        <h2 className="serif-italic text-5xl sm:text-6xl tracking-tighter mb-4 text-on-surface">The Academic Ledger</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-black/5 border border-black/[0.02]"
          >
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60 block mb-4">
              Overall Standing
            </span>
            <div className="flex items-end gap-3">
              <span className="serif-italic text-6xl tracking-tighter" style={{ color: themeColor }}>
                {stats.percentage.toFixed(1)}%
              </span>
            </div>
            <p className="text-sm mt-4 text-on-surface-variant font-medium">
              Across {stats.totalClasses} total classes recorded.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-black/5 border border-black/[0.02] md:col-span-2 relative overflow-hidden"
          >
            {/* Background design */}
            <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none">
              <TrendingUp size={200} />
            </div>
            
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60 block mb-4">
              Current Archetype
            </span>
            <h3 className="serif-italic text-4xl sm:text-5xl text-on-surface mb-2">
              {academy.archetype}
            </h3>
            <p className="text-on-surface-variant max-w-md">
              {academy.archetype === 'The Scholar' && "You're exceptionally diligent. Keep setting the standard."}
              {academy.archetype === 'The Strategist' && "Calculated precision. You know exactly what you're doing."}
              {academy.archetype === 'Living on the Edge' && "A dangerous game. You might want to consider attending soon."}
              {academy.archetype === 'The Phantom' && "Are you even enrolled? A recovery plan is strictly recommended."}
              {academy.archetype === 'The Oracle' && "Perfect flawless attendance."}
              {academy.archetype === 'The Blank Slate' && "No classes recorded yet. Begin your journey."}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="serif-italic text-3xl">Subjects</h3>
        <button
          onClick={() => {
            academy.setEditingSubject(null);
            academy.setIsSubjectModalOpen(true);
          }}
          style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:opacity-80 transition-opacity"
        >
          <Plus size={14} /> Add Subject
        </button>
      </div>

      {scheduledToday.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h4 className="flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-on-surface-variant">
              <CalendarIcon size={16} /> Scheduled Today
            </h4>
            <button
              onClick={markAllToday}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-green-500/20 transition-colors"
            >
              <Check size={14} /> Mass Mark Present
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {scheduledToday.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} academy={academy} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {otherSubjects.length > 0 && (
        <div>
          <h4 className="flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-on-surface-variant mb-6 opacity-50">
            Other Subjects
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity">
            <AnimatePresence>
              {otherSubjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} academy={academy} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {academy.subjects.length === 0 && (
        <div className="py-20 text-center bg-white/40 rounded-[2.5rem] border border-dashed border-outline/20">
          <Book size={48} className="mx-auto mb-4 text-outline/20" />
          <p className="serif-italic text-xl text-on-surface-variant">No subjects enrolled yet.</p>
        </div>
      )}

    </div>
  );
}

const Book = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
);

interface SubjectCardProps {
  key?: string;
  subject: Subject;
  academy: ReturnType<typeof useAcademy>;
}

function SubjectCard({ subject, academy }: SubjectCardProps) {
  const stats = academy.calculateStats(subject.records, subject.targetAttendance);
  const isHealthy = stats.percentage >= subject.targetAttendance;

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/[0.02] relative group overflow-hidden"
    >
      {/* Subject Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex gap-2 items-center mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.themeColor }} />
            <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
              {subject.code || 'NO CODE'}
            </span>
          </div>
          <h4 className="serif-italic text-2xl text-on-surface leading-tight pr-[80px]">{subject.name}</h4>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-6 right-6">
          <button 
            onClick={() => academy.setDeepDiveSubject(subject)}
            className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 rounded-lg transition-colors"
            title="Analysis Deep Dive"
          >
            <Activity size={14} />
          </button>
          <button 
            onClick={() => {
              academy.setEditingSubject(subject);
              academy.setIsSubjectModalOpen(true);
            }}
            className="p-1.5 bg-outline/5 hover:bg-outline/10 text-on-surface-variant rounded-lg transition-colors"
            title="Edit Subject"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={() => academy.deleteSubject(subject.id)}
            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="flex items-end justify-between mb-4">
        <div className="flex items-end gap-3">
          <span className="serif-italic text-5xl tracking-tighter" style={{ color: subject.themeColor }}>
            {stats.percentage.toFixed(0)}%
          </span>
          <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-1.5 opacity-50">
            Target: {subject.targetAttendance}%
          </span>
        </div>
      </div>

      <div className="flex gap-4 mb-5 px-1">
        <div className="text-center">
          <span className="block text-[14px] font-bold text-on-surface">{stats.present}</span>
          <span className="text-[8px] uppercase tracking-widest font-bold text-on-surface-variant opacity-60">Present</span>
        </div>
        <div className="text-center">
          <span className="block text-[14px] font-bold text-on-surface">{stats.absent}</span>
          <span className="text-[8px] uppercase tracking-widest font-bold text-on-surface-variant opacity-60">Absent</span>
        </div>
        <div className="text-center">
          <span className="block text-[14px] font-bold text-on-surface">{stats.total}</span>
          <span className="text-[8px] uppercase tracking-widest font-bold text-on-surface-variant opacity-60">Total</span>
        </div>
      </div>

      {/* Predictive Insights */}
      <div className={cn(
        "p-4 rounded-2xl mb-6",
        isHealthy ? "bg-[#f3f4f1]" : "bg-red-50"
      )}>
        {isHealthy ? (
          <div className="flex gap-3">
            <div className="mt-0.5 p-1.5 bg-white rounded-lg shadow-sm h-fit">
              <Zap size={14} style={{ color: subject.themeColor }} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-60 block mb-1">Safe Skips</span>
              <p className="text-sm font-medium text-on-surface">You can safely skip <strong style={{ color: subject.themeColor }}>{stats.safeSkips}</strong> more class{stats.safeSkips !== 1 ? 'es' : ''}.</p>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
             <div className="mt-0.5 p-1.5 bg-red-200 rounded-lg shadow-sm h-fit">
              <ShieldAlert size={14} className="text-red-600" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-60 text-red-800 block mb-1">Action Required</span>
              <p className="text-sm font-medium text-red-900">Must attend the next <strong>{stats.recoveryClasses}</strong> class{stats.recoveryClasses !== 1 ? 'es' : ''} to recover.</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button 
          onClick={() => academy.markAttendance(subject.id, todayStr, 'present')}
          className="flex-1 flex flex-col items-center gap-1 py-3 bg-outline/5 hover:bg-outline/10 text-on-surface rounded-xl transition-all"
        >
          <Check size={16} className="text-green-500" />
          <span className="text-[8px] uppercase font-bold tracking-widest">Present</span>
        </button>
        <button 
          onClick={() => academy.markAttendance(subject.id, todayStr, 'absent')}
          className="flex-1 flex flex-col items-center gap-1 py-3 bg-outline/5 hover:bg-outline/10 text-on-surface rounded-xl transition-all"
        >
          <X size={16} className="text-red-500" />
          <span className="text-[8px] uppercase font-bold tracking-widest">Absent</span>
        </button>
        <button 
          onClick={() => academy.markAttendance(subject.id, todayStr, 'cancelled')}
          className="flex-1 flex flex-col items-center gap-1 py-3 bg-outline/5 hover:bg-outline/10 text-on-surface rounded-xl transition-all"
        >
          <Minus size={16} className="text-on-surface-variant" />
          <span className="text-[8px] uppercase font-bold tracking-widest">Cancel</span>
        </button>
      </div>
    </motion.div>
  );
}
