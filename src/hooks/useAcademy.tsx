import { useState, useEffect, useMemo } from 'react';
import { Subject, AttendanceStatus, AttendanceRecord } from '../types';

export interface SubjectStats {
  present: number;
  absent: number;
  cancelled: number;
  total: number;
  percentage: number;
  safeSkips: number;
  recoveryClasses: number;
}

export function useAcademy() {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('curator_academy_subjects');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deepDiveSubject, setDeepDiveSubject] = useState<Subject | null>(null);

  useEffect(() => {
    localStorage.setItem('curator_academy_subjects', JSON.stringify(subjects));
  }, [subjects]);

  const addOrUpdateSubject = (subject: Subject) => {
    setSubjects((prev) => {
      const exists = prev.find((s) => s.id === subject.id);
      if (exists) {
        return prev.map((s) => (s.id === subject.id ? subject : s));
      }
      return [...prev, subject];
    });
    setIsSubjectModalOpen(false);
    setEditingSubject(null);
  };

  const deleteSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  const markAttendance = (subjectId: string, dateStr: string, status: AttendanceStatus) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== subjectId) return s;
        // If marking the exact same status, we toggle it off (remove the record)
        if (s.records[dateStr]?.status === status) {
          const newRecords = { ...s.records };
          delete newRecords[dateStr];
          return { ...s, records: newRecords };
        }
        // Otherwise, add or update the record
        const record: AttendanceRecord = {
          id: dateStr,
          date: new Date().toISOString(), // store creation sort of
          status,
        };
        return {
          ...s,
          records: { ...s.records, [dateStr]: record },
        };
      })
    );
  };

  const calculateStats = (records: Record<string, AttendanceRecord>, targetPercent: number): SubjectStats => {
    const recordsArr = Object.values(records);
    const present = recordsArr.filter((r) => r.status === 'present').length;
    const absent = recordsArr.filter((r) => r.status === 'absent').length;
    const cancelled = recordsArr.filter((r) => r.status === 'cancelled').length;
    const total = present + absent; // cancelled doesn't count towards total classes
    const percentage = total === 0 ? 100 : (present / total) * 100;
    
    const target = targetPercent / 100;
    
    let safeSkips = 0;
    let recoveryClasses = 0;

    if (total > 0) {
      if (percentage >= targetPercent) {
        safeSkips = Math.floor(present / target - total);
        if (safeSkips < 0) safeSkips = 0;
      } else {
        // We need P + R >= target * (T + R) => R(1 - target) >= target * T - P
        recoveryClasses = Math.ceil((target * total - present) / (1 - target));
        if (recoveryClasses < 0) recoveryClasses = 0;
      }
    }

    return {
      present,
      absent,
      cancelled,
      total,
      percentage,
      safeSkips,
      recoveryClasses,
    };
  };

  const getOverallStats = useMemo(() => {
    let totalPresent = 0;
    let totalClasses = 0;
    
    subjects.forEach((s) => {
      const stats = calculateStats(s.records, s.targetAttendance);
      totalPresent += stats.present;
      totalClasses += stats.total;
    });

    const percentage = totalClasses === 0 ? 100 : (totalPresent / totalClasses) * 100;
    return {
      percentage,
      totalClasses,
      totalPresent,
    };
  }, [subjects]);

  const archetype = useMemo(() => {
    const p = getOverallStats.percentage;
    const total = getOverallStats.totalClasses;

    if (total === 0) return "The Blank Slate";
    if (p === 100) return "The Oracle";
    if (p >= 90) return "The Scholar";
    if (p >= 75 && p < 85) return "The Strategist";
    if (p >= 60 && p < 75) return "Living on the Edge";
    return "The Phantom";
  }, [getOverallStats]);

  return {
    subjects,
    isSubjectModalOpen, setIsSubjectModalOpen,
    editingSubject, setEditingSubject,
    deepDiveSubject, setDeepDiveSubject,
    addOrUpdateSubject,
    deleteSubject,
    markAttendance,
    calculateStats,
    getOverallStats,
    archetype,
  };
}
