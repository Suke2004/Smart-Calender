import { useState, useMemo, useRef, useEffect } from 'react';
import React from 'react';
import {
  format, addMonths, subMonths, isSameMonth, isSameDay,
  startOfToday, isBefore, isAfter, parseISO, getDay,
  getDate, isWithinInterval,
} from 'date-fns';
import { Bell, Star, Calendar as CalendarIcon, MessageSquare } from 'lucide-react';
import { domToPng } from 'modern-screenshot';
import { MONTHS_DATA, INITIAL_NOTES } from '../constants';
import { getCalendarDays } from '../utils';
import { DateRange, Note } from '../types';

// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  icon: React.ReactNode;
  text: string;
  time: string;
}

export interface UserProfile {
  name: string;
  photo: string;
}

export type ViewMode      = 'monthly' | 'yearly' | 'pinned';
export type NoteType      = 'editorial' | 'reflection' | 'memo';
export type FilterType    = 'all' | 'editorial' | 'reflection' | 'memo';
export type RecurrenceType = 'none' | 'weekly' | 'monthly';

// ─── Animation Variants ───────────────────────────────────────────────────────

export const pageVariants = {
  enter: (direction: number) => ({
    rotateX: direction > 0 ? 90 : -90,
    opacity: 0,
    scale: 0.95,
    z: -100,
  }),
  center: { rotateX: 0, opacity: 1, scale: 1, z: 0 },
  exit: (direction: number) => ({
    rotateX: direction > 0 ? -90 : 90,
    opacity: 0,
    scale: 0.95,
    z: -100,
  }),
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCalendar() {
  // Navigation state
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));
  const [direction, setDirection]     = useState(0);
  const [yearToView, setYearToView]   = useState(2024);
  const [viewMode, setViewMode]       = useState<ViewMode>('monthly');

  // Selection / range
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  // Onboarding state
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('curator_onboarding_complete') === 'true';
    }
    return false;
  });
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!hasCompletedOnboarding);

  // Notes state
  const [notes, setNotes]               = useState<Note[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('curator_notes');
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    }
    return INITIAL_NOTES;
  });
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  // Note modal form state
  const [isNoteModalOpen, setIsNoteModalOpen]       = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen]     = useState(false);
  const [editingNote, setEditingNote]               = useState<Note | null>(null);
  const [newNoteContent, setNewNoteContent]         = useState('');
  const [newNoteLabel, setNewNoteLabel]             = useState('');
  const [noteType, setNoteType]                     = useState<NoteType>('editorial');
  const [recurrence, setRecurrence]                 = useState<RecurrenceType>('none');
  const [reminderTime, setReminderTime]             = useState<number | null>(null);

  // Search & filter
  const [searchQuery, setSearchQuery]               = useState('');
  const [filterType, setFilterType]                 = useState<FilterType>('all');
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery]   = useState('');

  // Notifications
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', icon: <Star size={14} className="text-yellow-500" />,       text: "You pinned a new memory from July.", time: "2 mins ago" },
    { id: '2', icon: <CalendarIcon size={14} className="text-blue-500" />, text: "Your weekly recurrence 'Sunday Reflection' was added.", time: "1 hour ago" },
    { id: '3', icon: <MessageSquare size={14} className="text-green-500" />, text: "New monthly memo available for August.", time: "Yesterday" },
  ]);
  const [triggeredReminders, setTriggeredReminders] = useState<string[]>([]);

  // Profile
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('curator_profile');
      return saved ? JSON.parse(saved) : {
        name: 'Alex Curator',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
      };
    }
    return {
      name: 'Alex Curator',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
    };
  });

  // Export ref
  const exportRef = useRef<HTMLDivElement>(null);

  // ─── Reminder Effect ──────────────────────────────────────────────────────

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      notes.forEach(note => {
        if (note.reminderTime && !triggeredReminders.includes(note.id)) {
          const noteDate    = parseISO(note.date);
          const reminderDate = new Date(noteDate.getTime() - note.reminderTime * 60000);
          if (now >= reminderDate && now < noteDate) {
            setNotifications(prev => [
              {
                id:   Math.random().toString(36).substr(2, 9),
                icon: <Bell size={14} className="text-primary" />,
                text: `Reminder: ${note.content.substring(0, 30)}${note.content.length > 30 ? '...' : ''}`,
                time: 'Just now',
              },
              ...prev,
            ]);
            setTriggeredReminders(prev => [...prev, note.id]);
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [notes, triggeredReminders]);

  // ─── Persistence Effect ──────────────────────────────────────────────────────

  useEffect(() => {
    localStorage.setItem('curator_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('curator_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('curator_onboarding_complete', hasCompletedOnboarding.toString());
  }, [hasCompletedOnboarding]);

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    setIsOnboardingOpen(false);
  };

  // ─── Derived Values ───────────────────────────────────────────────────────

  const monthKey  = format(currentDate, 'yyyy-MM');
  const monthInfo = MONTHS_DATA[monthKey] || {
    name:        format(currentDate, 'MMMM'),
    year:        currentDate.getFullYear(),
    heroImage:   'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop',
    heroTitle:   'The Curator',
    heroSubtitle: 'Volume IV • Issue X • India',
    themeColor:  '#5f5e5e',
  };

  const themeColor = monthInfo.themeColor;
  const days       = useMemo(() => getCalendarDays(currentDate), [currentDate]);

  const currentMonthNotes = useMemo(() => {
    return notes
      .filter(n => {
        const noteDate          = parseISO(n.date);
        const isAfterOrSameMonth = isSameMonth(noteDate, currentDate) || isAfter(currentDate, noteDate);
        const matchesMonth =
          isSameMonth(noteDate, currentDate) ||
          (isAfterOrSameMonth && (n.recurrence === 'monthly' || n.recurrence === 'weekly'));
        if (!matchesMonth) return false;
        const matchesSearch = n.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === 'all' || n.type === filterType;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });
  }, [notes, currentDate, searchQuery, filterType]);

  // ─── Navigation Handlers ─────────────────────────────────────────────────

  const nextMonth = () => {
    setDirection(1);
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setDirection(-1);
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToToday = () => {
    const today = startOfToday();
    setDirection(isBefore(today, currentDate) ? -1 : 1);
    setCurrentDate(today);
  };

  // ─── Selection / Date Handlers ───────────────────────────────────────────

  const handleDateClick = (date: Date) => {
    setRange({ start: date, end: null });
  };

  // ─── Note Handlers ────────────────────────────────────────────────────────

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;

    if (editingNote) {
      setNotes(notes.map(n =>
        n.id === editingNote.id
          ? { ...n, content: newNoteContent, recurrence, type: noteType, label: newNoteLabel, reminderTime: reminderTime || undefined }
          : n
      ));
    } else {
      const newNote: Note = {
        id:           Math.random().toString(36).substr(2, 9),
        date:         range.start ? range.start.toISOString() : startOfToday().toISOString(),
        endDate:      range.end   ? range.end.toISOString()   : undefined,
        content:      newNoteContent,
        type:         noteType,
        recurrence,
        label:        newNoteLabel,
        reminderTime: reminderTime || undefined,
      };
      setNotes([...notes, newNote]);
    }

    // Reset form
    setNewNoteContent('');
    setNewNoteLabel('');
    setIsNoteModalOpen(false);
    setIsDatePickerOpen(false);
    setEditingNote(null);
    setRecurrence('none');
    setNoteType('editorial');
    setReminderTime(null);
    setRange({ start: null, end: null });
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNewNoteContent(note.content);
    setNewNoteLabel(note.label || '');
    setRecurrence(note.recurrence || 'none');
    setNoteType(note.type || 'editorial');
    setReminderTime(note.reminderTime || null);
    setRange({
      start: parseISO(note.date),
      end:   note.endDate ? parseISO(note.endDate) : null,
    });
    setIsNoteModalOpen(true);
  };

  const togglePin = (noteId: string) => {
    setNotes(notes.map(n => n.id === noteId ? { ...n, isPinned: !n.isPinned } : n));
  };

  const handleDeleteNote = (note: Note) => {
    setNoteToDelete(note);
  };

  const confirmDelete = () => {
    if (!noteToDelete) return;
    setNotes(notes.filter(n => n.id !== noteToDelete.id));
    if (editingNote?.id === noteToDelete.id) {
      setIsNoteModalOpen(false);
      setEditingNote(null);
      setNewNoteContent('');
      setNewNoteLabel('');
    }
    setNoteToDelete(null);
  };

  const handleReorder = (reorderedMonthNotes: Note[]) => {
    // Prevent reorder while search/filter is active to avoid data loss
    if (searchQuery || filterType !== 'all') return;
    const otherNotes = notes.filter(n => {
      const noteDate = parseISO(n.date);
      return !isSameMonth(noteDate, currentDate) && n.recurrence !== 'weekly' && n.recurrence !== 'monthly';
    });
    setNotes([...otherNotes, ...reorderedMonthNotes]);
  };

  // ─── Export ───────────────────────────────────────────────────────────────

  const exportView = async () => {
    if (!exportRef.current) return;
    try {
      const dataUrl = await domToPng(exportRef.current, { backgroundColor: '#fdfdfc', scale: 2 });
      const link    = document.createElement('a');
      link.download = `curator-${monthKey}.png`;
      link.href     = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // ─── Modal Helpers ────────────────────────────────────────────────────────

  const closeNoteModal = () => {
    setIsNoteModalOpen(false);
    setEditingNote(null);
    setNewNoteContent('');
    setNewNoteLabel('');
    setIsDatePickerOpen(false);
  };

  // ─── Return API ───────────────────────────────────────────────────────────

  return {
    // Navigation
    currentDate, setCurrentDate,
    direction,
    yearToView, setYearToView,
    viewMode, setViewMode,
    nextMonth, prevMonth, goToToday,

    // Derived month info
    monthKey, monthInfo, themeColor, days,

    // Selection
    range, setRange,
    handleDateClick,

    // Notes
    notes,
    currentMonthNotes,
    handleAddNote, handleEditNote,
    togglePin,
    handleDeleteNote, confirmDelete,
    handleReorder,

    // Note modal form
    isNoteModalOpen, setIsNoteModalOpen,
    isDatePickerOpen, setIsDatePickerOpen,
    editingNote, setEditingNote,
    newNoteContent, setNewNoteContent,
    newNoteLabel, setNewNoteLabel,
    noteType, setNoteType,
    recurrence, setRecurrence,
    reminderTime, setReminderTime,
    noteToDelete, setNoteToDelete,
    closeNoteModal,

    // Search & filter
    searchQuery, setSearchQuery,
    filterType, setFilterType,
    isSearchOverlayOpen, setIsSearchOverlayOpen,
    globalSearchQuery, setGlobalSearchQuery,

    // Notifications
    notifications, setNotifications,
    isNotificationsOpen, setIsNotificationsOpen,

    // Profile
    userProfile, setUserProfile,
    isProfileModalOpen, setIsProfileModalOpen,

    // Onboarding
    hasCompletedOnboarding, setHasCompletedOnboarding,
    isOnboardingOpen, setIsOnboardingOpen,
    completeOnboarding,

    // Export
    exportRef, exportView,
  };
}
