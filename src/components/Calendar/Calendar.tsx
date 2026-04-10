import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay, 
  startOfToday,
  isBefore,
  isAfter,
  parseISO,
  isWithinInterval,
  getDay,
  getDate,
  startOfYear,
  endOfYear,
  eachMonthOfInterval
} from 'date-fns';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Bell, 
  Star, 
  Pin as PinIcon,
  Calendar as CalendarIcon,
  Archive,
  Plus,
  X,
  MessageSquare,
  Type,
  CalendarDays,
  GripVertical,
  Download,
  Repeat,
  ArrowRight
} from 'lucide-react';
import { domToPng } from 'modern-screenshot';
import { MONTHS_DATA, INITIAL_NOTES, HOLIDAYS } from '../../constants';
import { getCalendarDays, isDateInRange, cn } from '../../utils';
import { DateRange, Note } from '../../types';
import { DateRangePicker } from './DateRangePicker';

interface NotificationItemProps {
  icon: React.ReactNode;
  text: string;
  time: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ icon, text, time }) => {
  return (
    <div 
      className="flex items-start gap-4 p-3 hover:bg-[#f3f4f1] rounded-2xl transition-colors cursor-pointer group"
      role="button"
      aria-label={`${text} - ${time}`}
    >
      <div className="mt-1 p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-on-surface mb-1">{text}</p>
        <p className="text-[9px] uppercase tracking-widest font-bold opacity-40">{time}</p>
      </div>
    </div>
  );
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedDateForNote, setSelectedDateForNote] = useState<Date | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [direction, setDirection] = useState(0);
  const [recurrence, setRecurrence] = useState<'none' | 'weekly' | 'monthly'>('none');
  const [noteType, setNoteType] = useState<'editorial' | 'reflection' | 'memo'>('editorial');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'editorial' | 'reflection' | 'memo'>('all');
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly' | 'pinned'>('monthly');
  const [yearToView, setYearToView] = useState(2024);
  const [newNoteLabel, setNewNoteLabel] = useState('');
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Curator',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: '1', icon: <Star size={14} className="text-yellow-500" />, text: "You pinned a new memory from July.", time: "2 mins ago" },
    { id: '2', icon: <CalendarIcon size={14} className="text-blue-500" />, text: "Your weekly recurrence 'Sunday Reflection' was added.", time: "1 hour ago" },
    { id: '3', icon: <MessageSquare size={14} className="text-green-500" />, text: "New monthly memo available for August.", time: "Yesterday" }
  ]);
  const [reminderTime, setReminderTime] = useState<number | null>(null);
  const [triggeredReminders, setTriggeredReminders] = useState<string[]>([]);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      notes.forEach(note => {
        if (note.reminderTime && !triggeredReminders.includes(note.id)) {
          const noteDate = parseISO(note.date);
          const reminderDate = new Date(noteDate.getTime() - note.reminderTime * 60000);
          
          if (now >= reminderDate && now < noteDate) {
            setNotifications(prev => [
              {
                id: Math.random().toString(36).substr(2, 9),
                icon: <Bell size={14} className="text-primary" />,
                text: `Reminder: ${note.content.substring(0, 30)}${note.content.length > 30 ? '...' : ''}`,
                time: "Just now"
              },
              ...prev
            ]);
            setTriggeredReminders(prev => [...prev, note.id]);
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [notes, triggeredReminders]);

  const monthKey = format(currentDate, 'yyyy-MM');
  const monthInfo = MONTHS_DATA[monthKey] || {
    name: format(currentDate, 'MMMM'),
    year: currentDate.getFullYear(),
    heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop',
    heroTitle: 'The Curator',
    heroSubtitle: 'Volume IV • Issue X • India',
    themeColor: '#5f5e5e',
  };

  const themeColor = monthInfo.themeColor;

  const days = useMemo(() => getCalendarDays(currentDate), [currentDate]);

  const handleDateClick = (date: Date) => {
    setRange({ start: date, end: null });
    setSelectedDateForNote(date);
  };

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

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;
    
    if (editingNote) {
      setNotes(notes.map(n => n.id === editingNote.id ? { ...n, content: newNoteContent, recurrence, type: noteType, label: newNoteLabel, reminderTime: reminderTime || undefined } : n));
    } else {
      const newNote: Note = {
        id: Math.random().toString(36).substr(2, 9),
        date: range.start ? range.start.toISOString() : startOfToday().toISOString(),
        endDate: range.end ? range.end.toISOString() : undefined,
        content: newNoteContent,
        type: noteType,
        recurrence,
        label: newNoteLabel,
        reminderTime: reminderTime || undefined
      };
      setNotes([...notes, newNote]);
    }
    
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
      end: note.endDate ? parseISO(note.endDate) : null
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
    if (noteToDelete) {
      setNotes(notes.filter(n => n.id !== noteToDelete.id));
      setNoteToDelete(null);
      if (editingNote?.id === noteToDelete.id) {
        setIsNoteModalOpen(false);
        setEditingNote(null);
        setNewNoteContent('');
        setNewNoteLabel('');
      }
    }
  };

  const handleReorder = (reorderedMonthNotes: Note[]) => {
    // Only allow reordering if no search or filter is active to prevent data loss
    if (searchQuery || filterType !== 'all') return;

    const otherNotes = notes.filter(n => {
      const noteDate = parseISO(n.date);
      return !isSameMonth(noteDate, currentDate) && n.recurrence !== 'weekly' && n.recurrence !== 'monthly';
    });
    setNotes([...otherNotes, ...reorderedMonthNotes]);
  };

  const currentMonthNotes = useMemo(() => {
    return notes
      .filter(n => {
        const noteDate = parseISO(n.date);
        const isAfterOrSameMonth = isSameMonth(noteDate, currentDate) || isAfter(currentDate, noteDate);
        const matchesMonth = isSameMonth(noteDate, currentDate) || 
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

  const exportView = async () => {
    if (!exportRef.current) return;
    try {
      const dataUrl = await domToPng(exportRef.current, {
        backgroundColor: '#fdfdfc',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `curator-${monthKey}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      rotateX: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.95,
      z: -100,
    }),
    center: {
      rotateX: 0,
      opacity: 1,
      scale: 1,
      z: 0,
    },
    exit: (direction: number) => ({
      rotateX: direction > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.95,
      z: -100,
    }),
  };

  return (
    <div 
      className="flex min-h-screen bg-surface overflow-x-hidden transition-colors duration-1000"
      style={{ '--primary-theme': themeColor } as React.CSSProperties}
    >
      {/* Color Splash Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            backgroundColor: themeColor,
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.05, 0.03]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] rounded-full blur-[120px]"
        />
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#f3f4f1] border-r border-outline/10 p-10 sticky top-0 h-screen" role="navigation" aria-label="Main Sidebar">
        <div className="mb-12">
          <h1 className="serif-italic text-4xl text-on-surface mb-2 tracking-tighter">The Curator</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold opacity-60">Editorial Intelligence</p>
        </div>

        <nav className="flex-1 space-y-3" role="menubar">
          <SidebarItem 
            icon={<CalendarIcon size={18} />} 
            label="Monthly View" 
            active={viewMode === 'monthly'} 
            onClick={() => setViewMode('monthly')}
          />
          <SidebarItem 
            icon={<Archive size={18} />} 
            label="Yearly Archive" 
            active={viewMode === 'yearly'}
            onClick={() => setViewMode('yearly')}
          />
          <SidebarItem 
            icon={<PinIcon size={18} />} 
            label="Pinned Notes" 
            active={viewMode === 'pinned'}
            onClick={() => setViewMode('pinned')}
          />
        </nav>

        <div className="mt-auto">
          <button 
            onClick={() => setIsNoteModalOpen(true)}
            style={{ backgroundColor: themeColor, boxShadow: `0 10px 25px -5px ${themeColor}40` }}
            className="w-full text-surface py-5 rounded-2xl text-[11px] uppercase tracking-widest font-bold hover:opacity-90 transition-all active:scale-95"
            aria-label="Add New Entry"
          >
            Add Entry
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 lg:px-12 py-4 sm:py-8 sticky top-0 bg-surface/60 backdrop-blur-2xl z-30 gap-4 sm:gap-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8 w-full sm:w-auto">
            <button 
              onClick={goToToday}
              style={{ backgroundColor: themeColor, boxShadow: `0 10px 20px -5px ${themeColor}40` }}
              className="text-surface px-6 sm:px-8 py-2 sm:py-3 rounded-2xl text-[9px] sm:text-[11px] uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-all active:scale-95"
            >
              Today
            </button>
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => {
                  if (viewMode === 'monthly') prevMonth();
                  else setYearToView(yearToView - 1);
                }} 
                className="text-on-surface-variant hover:text-on-surface transition-colors p-1.5 sm:p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-black/[0.03]"
                aria-label="Previous"
              >
                <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
              </button>
              <h2 className="serif-italic text-xl sm:text-3xl tracking-tighter w-32 sm:w-48 text-center">
                {viewMode === 'monthly' ? `${monthInfo.name} ${monthInfo.year}` : yearToView}
              </h2>
              <button 
                onClick={() => {
                  if (viewMode === 'monthly') nextMonth();
                  else setYearToView(yearToView + 1);
                }} 
                className="text-on-surface-variant hover:text-on-surface transition-colors p-1.5 sm:p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-black/[0.03]"
                aria-label="Next"
              >
                <ChevronRight size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
            {(range.start || range.end) && (
              <button 
                onClick={() => setRange({ start: null, end: null })}
                style={{ color: themeColor }}
                className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold hover:underline px-4 sm:px-5 py-2 sm:py-2.5 bg-white rounded-2xl shadow-sm border border-black/[0.03] transition-all"
                aria-label="Clear selection"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={exportView}
              style={{ color: themeColor }}
              className="hover:text-primary transition-all flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white rounded-2xl shadow-sm border border-black/[0.03] active:scale-95"
              aria-label="Export view"
            >
              <Download size={18} style={{ color: themeColor }} className="sm:w-5 sm:h-5" />
              <span className="hidden md:inline text-[9px] sm:text-[11px] uppercase tracking-[0.2em] font-bold">Export View</span>
            </button>
            <button 
              onClick={() => setIsSearchOverlayOpen(true)}
              className="text-on-surface-variant hover:text-on-surface transition-colors p-2 sm:p-2.5 bg-white rounded-xl shadow-sm border border-black/[0.03]"
              aria-label="Search"
            >
              <Search size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="text-on-surface-variant hover:text-on-surface transition-colors p-2 sm:p-2.5 bg-white rounded-xl shadow-sm border border-black/[0.03] relative"
              aria-label="Notifications"
            >
              <Bell size={18} className="sm:w-5 sm:h-5" />
              {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />}
            </button>
            <div 
              onClick={() => setIsProfileModalOpen(true)}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-outline/20 overflow-hidden rounded-xl sm:rounded-2xl border border-outline/10 shadow-sm cursor-pointer hover:ring-2 transition-all"
              style={{ ringColor: themeColor } as any}
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

        <div ref={exportRef} className="px-4 sm:px-8 lg:px-12 pb-20 max-w-7xl mx-auto w-full">
          {viewMode === 'monthly' ? (
            <>
              {/* Hero Section */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.section 
                  key={monthKey}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    rotateX: { type: "spring", stiffness: 150, damping: 25 },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.4 }
                  }}
                  className="relative w-full h-[180px] sm:h-[250px] lg:h-[400px] bg-outline/10 mb-6 sm:mb-8 lg:mb-16 overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl shadow-black/5"
                  style={{ 
                    transformOrigin: "center top",
                    perspective: "1200px"
                  }}
                >
                  <img 
                    src={monthInfo.heroImage} 
                    alt={monthInfo.heroTitle}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-12 lg:left-12">
                    <span className="text-[7px] sm:text-[8px] lg:text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-1 sm:mb-2 block">
                      {monthInfo.heroSubtitle}
                    </span>
                    <h3 className="serif-italic text-2xl sm:text-3xl lg:text-6xl text-on-surface tracking-tighter">
                      {monthInfo.heroTitle}
                    </h3>
                  </div>
                </motion.section>
              </AnimatePresence>

              {/* Calendar Grid */}
              <section className="bg-[#f3f4f1] p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl shadow-black/5 relative">
                {/* Day Labels */}
                <div className="grid grid-cols-7 mb-1 sm:mb-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="py-1 sm:py-2 text-center">
                      <span className="text-[7px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] text-on-surface-variant font-bold opacity-40">{day}</span>
                    </div>
                  ))}
                </div>

                {/* Grid Cells */}
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div 
                    key={monthKey}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      rotateX: { type: "spring", stiffness: 150, damping: 25 },
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.4 }
                    }}
                    className="grid grid-cols-7 bg-[#f3f4f1] gap-1 sm:gap-2"
                    style={{ 
                      transformOrigin: "center top",
                      perspective: "1200px"
                    }}
                    role="grid"
                    aria-label={`Calendar for ${monthInfo.name} ${monthInfo.year}`}
                  >
                    {days.map((day) => {
                      const isCurrentMonth = isSameMonth(day, currentDate);
                      const isToday = isSameDay(day, startOfToday());
                      const isSelectedStart = range.start && isSameDay(day, range.start);
                      const isSelectedEnd = range.end && isSameDay(day, range.end);
                      const isInRange = isDateInRange(day, range.start, range.end);
                      const holiday = HOLIDAYS[format(day, 'yyyy-MM-dd')];
                      const dayNotes = notes.filter(n => {
                        const start = parseISO(n.date);
                        // Ensure recurring notes only appear on or after their start date
                        const isAfterOrSameDay = isSameDay(day, start) || isAfter(day, start);
                        if (!isAfterOrSameDay) return false;

                        if (n.recurrence === 'weekly') return getDay(start) === getDay(day);
                        if (n.recurrence === 'monthly') return getDate(start) === getDate(day);
                        if (n.endDate) return isWithinInterval(day, { start, end: parseISO(n.endDate) });
                        return isSameDay(start, day);
                      });

                      return (
                        <motion.div 
                          key={day.toString()}
                          onClick={() => handleDateClick(day)}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className={cn(
                            "aspect-square p-0.5 sm:p-2 lg:p-4 flex flex-col justify-between group cursor-pointer transition-all relative overflow-hidden rounded-lg sm:rounded-3xl border border-transparent",
                            !isCurrentMonth ? "bg-surface/30 opacity-30" : "bg-surface hover:bg-white shadow-sm hover:shadow-xl hover:shadow-black/5 hover:border-black/[0.03]",
                            isInRange && "bg-primary/5",
                            (isSelectedStart || isSelectedEnd) && "bg-primary/10"
                          )}
                          role="gridcell"
                          aria-label={format(day, 'MMMM d, yyyy')}
                          aria-selected={isSelectedStart || isSelectedEnd || isInRange}
                        >
                          <div className="flex justify-between items-start z-10">
                            <div className="relative group/holiday">
                              <span className={cn(
                                "serif-italic text-xs sm:text-base lg:text-lg transition-all relative z-10 px-0.5 sm:px-2 py-0.5 sm:py-1",
                                isToday && "font-bold underline decoration-2 underline-offset-4",
                                isToday && !isSelectedStart && !isSelectedEnd && "text-on-surface",
                                (isSelectedStart || isSelectedEnd) && "text-surface font-bold"
                              )}
                              style={isToday && !isSelectedStart && !isSelectedEnd ? { color: themeColor, textDecorationColor: themeColor } : {}}
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
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                              )}
                            </div>
                            {holiday && (
                              <div className="relative group/tooltip">
                                <span style={{ color: themeColor }} className="hidden md:block text-[8px] uppercase tracking-widest font-bold opacity-60 cursor-help">{holiday}</span>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-on-surface text-surface text-[8px] uppercase tracking-widest whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 rounded shadow-lg">
                                  {holiday}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-on-surface" />
                                </div>
                              </div>
                            )}
                          </div>

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
                                {dayNotes.map((note) => (
                                  <div key={note.id} className={cn("w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full", note.endDate ? "w-1 sm:w-2" : "bg-outline")} style={note.endDate ? { backgroundColor: themeColor } : {}} />
                                ))}
                              </div>
                            )}
                            {isSelectedStart && (
                              <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ color: themeColor }} className="text-[5px] sm:text-[6px] lg:text-[7px] uppercase tracking-[0.1em] sm:tracking-[0.2em] font-black flex items-center gap-0.5 sm:gap-1">
                                <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full" style={{ backgroundColor: themeColor }} /> Start
                              </motion.span>
                            )}
                            {isSelectedEnd && (
                              <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ color: themeColor }} className="text-[5px] sm:text-[6px] lg:text-[7px] uppercase tracking-[0.1em] sm:tracking-[0.2em] font-black flex items-center gap-0.5 sm:gap-1">
                                <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full" style={{ backgroundColor: themeColor }} /> End
                              </motion.span>
                            )}
                          </div>

                          {isInRange && (
                            <motion.div layoutId="range-highlight" className={cn("absolute inset-0 pointer-events-none flex items-center", isSelectedStart && !isSelectedEnd ? "left-1/2" : "", isSelectedEnd && !isSelectedStart ? "right-1/2" : "", isSelectedStart && isSelectedEnd ? "hidden" : "")}>
                              <div style={{ backgroundColor: `${themeColor}15`, borderTopColor: `${themeColor}30`, borderBottomColor: `${themeColor}30` }} className="h-6 sm:h-10 lg:h-12 w-full border-y transition-colors duration-300" />
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </section>

              {/* Footer / Notes Section */}
              <footer className="mt-12 sm:mt-20 flex flex-col lg:flex-row justify-between items-start gap-8 sm:gap-12 border-t border-outline/10 pt-8 sm:pt-12">
                <div className="max-w-xl w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                    <h4 className="serif-italic text-2xl sm:text-3xl whitespace-nowrap">{monthInfo.name} Notes</h4>
                    <div className="flex flex-1 items-center gap-4 max-w-md">
                      <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
                        <input type="text" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-black/[0.03] rounded-xl py-2 pl-9 pr-4 text-[11px] focus:ring-0 focus:border-black/10 transition-all shadow-sm" />
                      </div>
                      <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="bg-white border border-black/[0.03] rounded-xl py-2 px-4 text-[11px] focus:ring-0 focus:border-black/10 transition-all shadow-sm appearance-none cursor-pointer pr-8">
                        <option value="all">All Types</option>
                        <option value="editorial">Editorial</option>
                        <option value="reflection">Reflection</option>
                        <option value="memo">Memo</option>
                      </select>
                    </div>
                    <button onClick={() => setIsNoteModalOpen(true)} style={{ color: themeColor }} className="hover:text-on-surface transition-colors p-2 sm:p-3 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-black/[0.03] hover:shadow-md">
                      <Plus size={20} className="sm:w-6 sm:h-6" />
                    </button>
                  </div>
                  
                  <Reorder.Group axis="y" values={currentMonthNotes} onReorder={handleReorder} className="space-y-4 sm:space-y-6">
                    {currentMonthNotes.map(note => (
                      <Reorder.Item value={note} key={note.id} className="group relative p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all cursor-default border border-black/[0.02]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 sm:gap-0">
                          <div className="flex items-center gap-3">
                            <GripVertical size={12} className="text-outline/20 group-hover:text-outline/60 cursor-grab active:cursor-grabbing transition-colors" />
                            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] text-on-surface-variant font-bold opacity-60">
                              {format(parseISO(note.date), 'MMM dd')}{note.endDate && ` — ${format(parseISO(note.endDate), 'MMM dd')}`}
                            </span>
                            {note.isPinned && <Star size={10} style={{ color: themeColor, fill: themeColor }} />}
                            {note.recurrence && note.recurrence !== 'none' && (
                              <div style={{ backgroundColor: `${themeColor}10`, color: themeColor }} className="flex items-center gap-1 text-[7px] sm:text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-full font-bold">
                                <Repeat size={8} /> {note.recurrence}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => togglePin(note.id)} className={cn("text-[9px] sm:text-[10px] uppercase tracking-widest font-bold transition-colors", note.isPinned ? "text-on-surface" : "text-on-surface-variant")} style={note.isPinned ? { color: themeColor } : {}}>
                              {note.isPinned ? 'Unpin' : 'Pin'}
                            </button>
                            <button onClick={() => handleEditNote(note)} style={{ color: themeColor }} className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold hover:underline">Edit</button>
                          </div>
                        </div>
                        <p className="text-lg sm:text-xl text-on-surface leading-relaxed serif-italic">"{note.content}"</p>
                      </Reorder.Item>
                    ))}
                    {currentMonthNotes.length === 0 && <p className="text-sm text-on-surface-variant italic opacity-50">No notes for this month.</p>}
                  </Reorder.Group>
                </div>

                <div className="flex flex-col gap-8 sm:gap-12 lg:w-80 w-full">
                  <div className="bg-white/60 backdrop-blur-xl p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl shadow-black/5 border border-white/40">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl" style={{ backgroundColor: `${themeColor}10` }}>
                        <MessageSquare size={16} style={{ color: themeColor }} />
                      </div>
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold opacity-60">Monthly Memo</span>
                    </div>
                    <p className="text-base sm:text-lg text-on-surface leading-relaxed serif-italic">
                      The transition from winter to spring is a delicate curation of light and texture. Focus on the subtle shifts in the landscape.
                    </p>
                  </div>

                  <div className="flex gap-8 sm:gap-12 justify-center lg:justify-end">
                    <div className="text-right">
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1 sm:mb-2 opacity-50">Events</span>
                      <span className="serif-italic text-4xl sm:text-6xl tracking-tighter">
                        {currentMonthNotes.filter(n => n.type === 'editorial').length.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1 sm:mb-2 opacity-50">Reflections</span>
                      <span className="serif-italic text-4xl sm:text-6xl tracking-tighter">
                        {currentMonthNotes.filter(n => n.type === 'reflection').length.toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              </footer>
            </>
          ) : viewMode === 'yearly' ? (
            <YearlyView 
              year={yearToView} 
              notes={notes} 
              onMonthClick={(monthDate) => {
                setCurrentDate(monthDate);
                setViewMode('monthly');
              }}
              themeColor={themeColor}
            />
          ) : (
            <PinnedNotesView 
              notes={notes} 
              onEdit={handleEditNote} 
              onTogglePin={togglePin}
              themeColor={themeColor}
            />
          )}
        </div>
      </main>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOverlayOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-on-surface/40 backdrop-blur-2xl p-6 sm:p-20"
          >
            <div className="max-w-4xl mx-auto w-full">
              <div className="flex items-center justify-between mb-12">
                <h3 className="serif-italic text-4xl text-surface">Global Search</h3>
                <button 
                  onClick={() => setIsSearchOverlayOpen(false)}
                  className="text-surface/60 hover:text-surface p-2 hover:bg-surface/10 rounded-full transition-all"
                >
                  <X size={32} />
                </button>
              </div>
              
              <div className="relative mb-12">
                <Search size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-surface/40" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search across all years and months..." 
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  className="w-full bg-surface/10 border-none rounded-[2rem] py-8 pl-20 pr-8 text-2xl text-surface placeholder:text-surface/20 focus:ring-2 focus:ring-surface/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                {notes.filter(n => n.content.toLowerCase().includes(globalSearchQuery.toLowerCase())).map(note => (
                  <div 
                    key={`search-${note.id}`}
                    onClick={() => {
                      setCurrentDate(parseISO(note.date));
                      setViewMode('monthly');
                      setIsSearchOverlayOpen(false);
                    }}
                    className="p-6 bg-surface/5 hover:bg-surface/10 rounded-3xl cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-surface/40 font-bold">
                        {format(parseISO(note.date), 'MMMM dd, yyyy')}
                      </span>
                      <ArrowRight size={14} className="text-surface/0 group-hover:text-surface/40 transition-all" />
                    </div>
                    <p className="text-lg text-surface serif-italic">"{note.content}"</p>
                  </div>
                ))}
                {globalSearchQuery && notes.filter(n => n.content.toLowerCase().includes(globalSearchQuery.toLowerCase())).length === 0 && (
                  <p className="text-center text-surface/40 serif-italic text-xl py-12">No matching entries found.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <>
            <div className="fixed inset-0 z-[140]" onClick={() => setIsNotificationsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="fixed top-24 right-8 sm:right-12 z-[150] w-80 bg-surface p-6 rounded-[2rem] shadow-2xl border border-black/5"
              role="dialog"
              aria-label="Notifications Panel"
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="serif-italic text-xl">Notifications</h4>
                {notifications.length > 0 && (
                  <span className="text-[8px] uppercase tracking-widest font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {notifications.length} New
                  </span>
                )}
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.map(notif => (
                  <NotificationItem 
                    key={notif.id}
                    icon={notif.icon} 
                    text={notif.text} 
                    time={notif.time} 
                  />
                ))}
                {notifications.length === 0 && (
                  <p className="text-center py-8 text-[10px] uppercase tracking-widest font-bold opacity-30">No new notifications</p>
                )}
              </div>
              <button 
                onClick={() => setNotifications([])}
                className="w-full mt-6 py-3 text-[9px] uppercase tracking-widest font-bold text-on-surface-variant hover:text-on-surface transition-colors"
                aria-label="Clear all notifications"
              >
                Clear All
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Note Modal */}
      <AnimatePresence>
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsNoteModalOpen(false); setEditingNote(null); setNewNoteContent(''); setIsDatePickerOpen(false); }} className="absolute inset-0 bg-on-surface/10 backdrop-blur-xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-lg bg-surface/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white/20"
              role="dialog"
              aria-modal="true"
              aria-labelledby="note-modal-title"
            >
              <button 
                onClick={() => { setIsNoteModalOpen(false); setEditingNote(null); setNewNoteContent(''); setIsDatePickerOpen(false); }} 
                className="absolute top-8 right-8 text-on-surface-variant hover:text-on-surface p-2 hover:bg-outline/5 rounded-full transition-all"
                aria-label="Close Modal"
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <h3 id="note-modal-title" className="serif-italic text-3xl mb-4">{editingNote ? 'Edit Entry' : 'New Entry'}</h3>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4" role="group" aria-label="Entry Type">
                    <button onClick={() => setNoteType('editorial')} style={noteType === 'editorial' ? { backgroundColor: themeColor } : {}} className={cn("text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded transition-colors", noteType === 'editorial' ? "text-surface" : "bg-outline/5 text-on-surface-variant")} aria-pressed={noteType === 'editorial'}>Editorial</button>
                    <button onClick={() => setNoteType('reflection')} style={noteType === 'reflection' ? { backgroundColor: themeColor } : {}} className={cn("text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded transition-colors", noteType === 'reflection' ? "text-surface" : "bg-outline/5 text-on-surface-variant")} aria-pressed={noteType === 'reflection'}>Reflection</button>
                    <button onClick={() => setNoteType('memo')} style={noteType === 'memo' ? { backgroundColor: themeColor } : {}} className={cn("text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded transition-colors", noteType === 'memo' ? "text-surface" : "bg-outline/5 text-on-surface-variant")} aria-pressed={noteType === 'memo'}>Memo</button>
                  </div>

                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} style={{ color: themeColor }} />
                      <button 
                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold hover:text-on-surface transition-colors"
                        aria-label="Select Date Range"
                      >
                        {editingNote ? (
                          <>{format(parseISO(editingNote.date), 'MMMM dd')}{editingNote.endDate && ` — ${format(parseISO(editingNote.endDate), 'MMMM dd, yyyy')}`}{!editingNote.endDate && `, ${format(parseISO(editingNote.date), 'yyyy')}`}</>
                        ) : (
                          <>{range.start ? format(range.start, 'MMMM dd') : format(startOfToday(), 'MMMM dd')}{range.end && ` — ${format(range.end, 'MMMM dd, yyyy')}`}{!range.end && `, ${format(range.start || startOfToday(), 'yyyy')}`}</>
                        )}
                      </button>
                    </div>
                    {isDatePickerOpen && (
                      <div className="absolute top-full left-0 mt-2 z-50">
                        <DateRangePicker 
                          range={range} 
                          onChange={(newRange) => {
                            setRange(newRange);
                            if (editingNote) {
                              setEditingNote({
                                ...editingNote,
                                date: newRange.start ? newRange.start.toISOString() : editingNote.date,
                                endDate: newRange.end ? newRange.end.toISOString() : undefined
                              });
                            }
                          }} 
                          themeColor={themeColor} 
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2" role="group" aria-label="Recurrence Options">
                      <button onClick={() => setRecurrence(recurrence === 'weekly' ? 'none' : 'weekly')} style={recurrence === 'weekly' ? { backgroundColor: themeColor } : {}} className={cn("flex items-center gap-1 text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded transition-colors", recurrence === 'weekly' ? "text-surface" : "bg-outline/5 text-on-surface-variant")} aria-pressed={recurrence === 'weekly'}><Repeat size={10} /> Weekly</button>
                      <button onClick={() => setRecurrence(recurrence === 'monthly' ? 'none' : 'monthly')} style={recurrence === 'monthly' ? { backgroundColor: themeColor } : {}} className={cn("flex items-center gap-1 text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded transition-colors", recurrence === 'monthly' ? "text-surface" : "bg-outline/5 text-on-surface-variant")} aria-pressed={recurrence === 'monthly'}><Repeat size={10} /> Monthly</button>
                    </div>
                  </div>
                </div>
              </div>

              <textarea 
                autoFocus 
                value={newNoteContent} 
                onChange={(e) => setNewNoteContent(e.target.value)} 
                placeholder="Begin typing..." 
                className="w-full h-48 bg-transparent border-none focus:ring-0 p-0 text-xl serif-italic resize-none placeholder:opacity-30" 
                aria-label="Note Content"
              />

              <div className="mt-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Type size={14} style={{ color: themeColor }} />
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Custom Label</span>
                </div>
                <input 
                  type="text" 
                  value={newNoteLabel} 
                  onChange={(e) => setNewNoteLabel(e.target.value)}
                  placeholder="e.g. Birthday, Meeting, Holiday"
                  className="w-full bg-white border border-black/[0.03] rounded-xl py-3 px-4 text-sm focus:ring-0 focus:border-black/10 transition-all shadow-sm"
                  aria-label="Custom Label"
                />
              </div>

              <div className="mt-4 mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Bell size={14} style={{ color: themeColor }} />
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Reminder</span>
                </div>
                <div className="flex gap-2" role="group" aria-label="Reminder Time">
                  {[15, 30, 60, 1440].map(mins => (
                    <button
                      key={mins}
                      onClick={() => setReminderTime(reminderTime === mins ? null : mins)}
                      style={reminderTime === mins ? { backgroundColor: themeColor } : {}}
                      className={cn(
                        "text-[8px] uppercase tracking-widest font-bold px-3 py-2 rounded-xl border border-black/[0.03] transition-all",
                        reminderTime === mins ? "text-white" : "bg-white text-on-surface-variant hover:bg-outline/5"
                      )}
                      aria-pressed={reminderTime === mins}
                    >
                      {mins < 60 ? `${mins}m` : mins === 1440 ? '1d' : `${mins/60}h`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-50">{editingNote ? (editingNote.endDate ? 'Range Entry' : 'Single Day Entry') : (range.end ? 'Range Entry' : 'Single Day Entry')}</span>
                  {editingNote && (
                    <button 
                      onClick={() => handleDeleteNote(editingNote)}
                      className="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:underline"
                      aria-label="Delete Entry"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <button 
                  onClick={handleAddNote} 
                  disabled={!newNoteContent.trim()} 
                  style={{ backgroundColor: themeColor, boxShadow: `0 10px 20px -5px ${themeColor}40` }} 
                  className="text-surface px-10 py-4 rounded-2xl text-[11px] uppercase tracking-widest font-bold hover:opacity-90 transition-all disabled:opacity-30 active:scale-95"
                  aria-label={editingNote ? 'Update Entry' : 'Save Entry'}
                >
                  {editingNote ? 'Update Entry' : 'Save Entry'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute inset-0 bg-on-surface/20 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-surface p-10 rounded-[2.5rem] shadow-2xl border border-white/20"
              role="dialog"
              aria-modal="true"
              aria-labelledby="profile-modal-title"
            >
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-8 right-8 text-on-surface-variant hover:text-on-surface p-2 hover:bg-outline/5 rounded-full transition-all"
                aria-label="Close Profile Modal"
              >
                <X size={24} />
              </button>

              <h3 id="profile-modal-title" className="serif-italic text-3xl mb-8">Customize Profile</h3>

              <div className="flex flex-col items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl">
                    <img 
                      src={userProfile.photo} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-[2.5rem]">
                    <span className="text-white text-[10px] uppercase tracking-widest font-bold">Change</span>
                    <input 
                      type="text" 
                      className="hidden" 
                      onChange={(e) => setUserProfile({ ...userProfile, photo: e.target.value })}
                    />
                  </label>
                </div>

                <div className="w-full space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">Display Name</label>
                    <input 
                      type="text" 
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                      className="w-full bg-[#f3f4f1] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                      aria-label="Display Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">Photo URL</label>
                    <input 
                      type="text" 
                      value={userProfile.photo}
                      onChange={(e) => setUserProfile({ ...userProfile, photo: e.target.value })}
                      className="w-full bg-[#f3f4f1] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                      aria-label="Photo URL"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  style={{ backgroundColor: themeColor, boxShadow: `0 10px 20px -5px ${themeColor}40` }}
                  className="w-full text-surface py-5 rounded-2xl text-[11px] uppercase tracking-widest font-bold hover:opacity-90 transition-all active:scale-95"
                  aria-label="Save Profile Changes"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {noteToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNoteToDelete(null)}
              className="absolute inset-0 bg-on-surface/20 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-2xl border border-black/5"
            >
              <h3 className="serif-italic text-2xl mb-4">Delete Entry?</h3>
              <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
                Are you sure you want to delete this entry? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setNoteToDelete(null)}
                  className="flex-1 py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold bg-outline/5 hover:bg-outline/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOverlayOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-surface/95 backdrop-blur-xl p-6 sm:p-20"
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <h2 className="serif-italic text-4xl">Search Archive</h2>
                <button onClick={() => setIsSearchOverlayOpen(false)} className="p-2 hover:bg-outline/5 rounded-full transition-all">
                  <X size={32} />
                </button>
              </div>
              <div className="relative mb-12">
                <Search size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search across all months..." 
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  className="w-full bg-white border border-black/[0.05] rounded-[2rem] py-6 pl-16 pr-8 text-2xl serif-italic focus:ring-0 focus:border-black/10 transition-all shadow-xl"
                />
              </div>
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                {notes.filter(n => n.content.toLowerCase().includes(globalSearchQuery.toLowerCase())).map((note, idx) => (
                  <motion.div 
                    key={`search-${note.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                      setCurrentDate(parseISO(note.date));
                      setViewMode('monthly');
                      setIsSearchOverlayOpen(false);
                    }}
                    className="p-6 bg-white rounded-3xl border border-black/[0.02] hover:shadow-lg transition-all cursor-pointer group"
                    role="button"
                    aria-label={`View note from ${format(parseISO(note.date), 'MMMM dd, yyyy')}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">{format(parseISO(note.date), 'MMMM dd, yyyy')}</span>
                      <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-outline/5">{note.type}</span>
                    </div>
                    <p className="text-xl serif-italic group-hover:text-primary transition-colors">"{note.content}"</p>
                  </motion.div>
                ))}
                {globalSearchQuery && notes.filter(n => n.content.toLowerCase().includes(globalSearchQuery.toLowerCase())).length === 0 && (
                  <p className="text-center text-on-surface-variant opacity-50 serif-italic text-xl">No matches found for "{globalSearchQuery}"</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Overlay */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <>
            <div className="fixed inset-0 z-[90]" onClick={() => setIsNotificationsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="fixed top-24 right-12 w-80 bg-white rounded-[2rem] shadow-2xl border border-black/5 z-[100] overflow-hidden"
            >
              <div className="p-6 border-b border-black/5 bg-[#f3f4f1]/50">
                <h3 className="serif-italic text-xl">Recent Activity</h3>
              </div>
              <div className="max-h-96 overflow-y-auto p-4 space-y-2">
                <NotificationItem icon={<Plus size={14} />} text="New entry added to April" time="2 mins ago" />
                <NotificationItem icon={<Star size={14} />} text="Pinned a note in March" time="1 hour ago" />
                <NotificationItem icon={<Download size={14} />} text="Exported March view" time="Yesterday" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProfileModalOpen(false)} className="absolute inset-0 bg-on-surface/20 backdrop-blur-xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white p-10 rounded-[3rem] shadow-2xl border border-white/20"
            >
              <button onClick={() => setIsProfileModalOpen(false)} className="absolute top-8 right-8 text-on-surface-variant hover:text-on-surface p-2 hover:bg-outline/5 rounded-full transition-all">
                <X size={24} />
              </button>
              
              <div className="text-center mb-10">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
                    <img src={userProfile.photo} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-black/5">
                    <Plus size={16} />
                  </div>
                </div>
                <h3 className="serif-italic text-3xl">Curator Profile</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 block">Display Name</label>
                  <input 
                    type="text" 
                    value={userProfile.name} 
                    onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                    className="w-full bg-[#f3f4f1] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 transition-all"
                    style={{ ringColor: themeColor } as any}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 block">Photo URL</label>
                  <input 
                    type="text" 
                    value={userProfile.photo} 
                    onChange={(e) => setUserProfile({ ...userProfile, photo: e.target.value })}
                    className="w-full bg-[#f3f4f1] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 transition-all"
                    style={{ ringColor: themeColor } as any}
                  />
                </div>
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  style={{ backgroundColor: themeColor }}
                  className="w-full py-5 rounded-2xl text-white text-[11px] uppercase tracking-widest font-bold hover:opacity-90 transition-all active:scale-95 mt-4"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-surface/80 backdrop-blur-2xl border border-white/20 flex justify-around items-center py-4 rounded-[2rem] z-50 shadow-2xl shadow-black/10">
        <MobileNavItem 
          icon={<CalendarIcon size={20} />} 
          label="Month" 
          active={viewMode === 'monthly'} 
          themeColor={themeColor} 
          onClick={() => setViewMode('monthly')}
        />
        <MobileNavItem 
          icon={<Archive size={20} />} 
          label="Archive" 
          active={viewMode === 'yearly'} 
          themeColor={themeColor} 
          onClick={() => setViewMode('yearly')}
        />
        <MobileNavItem 
          icon={<PinIcon size={20} />} 
          label="Notes" 
          active={viewMode === 'pinned'} 
          themeColor={themeColor} 
          onClick={() => setViewMode('pinned')}
        />
        <div 
          onClick={() => setIsProfileModalOpen(true)}
          className="w-8 h-8 bg-outline/20 overflow-hidden rounded-xl border border-outline/10 cursor-pointer"
        >
          <img src={userProfile.photo} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
      </nav>
    </div>
  );
}

function PinnedNotesView({ notes, onEdit, onTogglePin, themeColor }: { notes: Note[], onEdit: (note: Note) => void, onTogglePin: (id: string) => void, themeColor: string }) {
  const pinnedNotes = notes.filter(n => n.isPinned);

  return (
    <div className="py-12 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h3 className="serif-italic text-5xl mb-2 tracking-tighter">Pinned Collection</h3>
          <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold opacity-60">Your Curated Highlights</p>
        </div>
        <div className="p-4 rounded-3xl bg-white shadow-sm border border-black/[0.02]">
          <Star size={24} style={{ color: themeColor, fill: themeColor }} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pinnedNotes.map(note => (
          <motion.div 
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative p-8 bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-black/[0.02]"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">
                  {format(parseISO(note.date), 'MMMM dd, yyyy')}
                </span>
                {note.label && (
                  <span style={{ backgroundColor: `${themeColor}10`, color: themeColor }} className="text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded-full">
                    {note.label}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onTogglePin(note.id)} style={{ color: themeColor }} className="text-[10px] uppercase tracking-widest font-bold hover:underline" aria-label={`Unpin note from ${format(parseISO(note.date), 'MMMM dd')}`}>Unpin</button>
                <button onClick={() => onEdit(note)} style={{ color: themeColor }} className="text-[10px] uppercase tracking-widest font-bold hover:underline" aria-label={`Edit note from ${format(parseISO(note.date), 'MMMM dd')}`}>Edit</button>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl text-on-surface leading-relaxed serif-italic">"{note.content}"</p>
          </motion.div>
        ))}
        {pinnedNotes.length === 0 && (
          <div className="text-center py-20 bg-white/40 rounded-[2.5rem] border border-dashed border-outline/20">
            <Star size={48} className="mx-auto mb-4 text-outline/20" />
            <p className="serif-italic text-xl text-on-surface-variant">No pinned notes yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function YearlyView({ year, notes, onMonthClick, themeColor }: { year: number, notes: Note[], onMonthClick: (date: Date) => void, themeColor: string }) {
  const months = eachMonthOfInterval({
    start: startOfYear(new Date(year, 0, 1)),
    end: endOfYear(new Date(year, 0, 1))
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-8">
      {months.map((month) => {
        const monthKey = format(month, 'yyyy-MM');
        const monthInfo = MONTHS_DATA[monthKey];
        const monthNotes = notes.filter(n => isSameMonth(parseISO(n.date), month));

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
                src={monthInfo?.heroImage || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop'} 
                alt={monthInfo?.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="serif-italic text-3xl text-white drop-shadow-lg">{format(month, 'MMMM')}</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">Activity</span>
                <span className="text-xs font-bold" style={{ color: monthInfo?.themeColor || themeColor }}>{monthNotes.length} Entries</span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {monthNotes.slice(0, 5).map(note => (
                  <div 
                    key={note.id} 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: monthInfo?.themeColor || themeColor }} 
                  />
                ))}
                {monthNotes.length > 5 && <span className="text-[8px] font-bold opacity-30">+{monthNotes.length - 5}</span>}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300",
        active 
          ? "bg-white text-on-surface font-bold shadow-md shadow-black/5" 
          : "text-on-surface-variant hover:bg-white/50"
      )}
      aria-current={active ? 'page' : undefined}
      aria-label={label}
      role="menuitem"
    >
      {icon}
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{label}</span>
    </button>
  );
}

function MobileNavItem({ icon, label, active = false, themeColor, onClick }: { icon: React.ReactNode, label: string, active?: boolean, themeColor: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn("flex flex-col items-center gap-1 p-2 rounded-2xl transition-all", !active && "text-on-surface-variant")} 
      style={active ? { color: themeColor, backgroundColor: `${themeColor}10` } : {}}
      aria-current={active ? 'page' : undefined}
      aria-label={label}
    >
      {icon}
      <span className="text-[8px] uppercase tracking-[0.2em] font-bold">{label}</span>
    </button>
  );
}
