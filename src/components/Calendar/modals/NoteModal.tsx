import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CalendarDays, Repeat, Type, Bell } from 'lucide-react';
import { format, parseISO, startOfToday } from 'date-fns';
import { Note, DateRange } from '../../../types';
import { DateRangePicker } from '../DateRangePicker';
import { cn } from '../../../utils';
import { NoteType, RecurrenceType } from '../../../hooks/useCalendar';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingNote: Note | null;
  noteType: NoteType;
  setNoteType: (type: NoteType) => void;
  themeColor: string;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (isOpen: boolean) => void;
  range: DateRange;
  setRange: (range: DateRange) => void;
  setEditingNote: (note: Note | null) => void;
  recurrence: RecurrenceType;
  setRecurrence: (type: RecurrenceType) => void;
  newNoteContent: string;
  setNewNoteContent: (content: string) => void;
  newNoteLabel: string;
  setNewNoteLabel: (label: string) => void;
  reminderTime: number | null;
  setReminderTime: (time: number | null) => void;
  onDeleteNote: (note: Note) => void;
  onSave: () => void;
}

export function NoteModal({
  isOpen,
  onClose,
  editingNote,
  noteType,
  setNoteType,
  themeColor,
  isDatePickerOpen,
  setIsDatePickerOpen,
  range,
  setRange,
  setEditingNote,
  recurrence,
  setRecurrence,
  newNoteContent,
  setNewNoteContent,
  newNoteLabel,
  setNewNoteLabel,
  reminderTime,
  setReminderTime,
  onDeleteNote,
  onSave,
}: NoteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-surface/10 backdrop-blur-xl"
          />
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
              onClick={onClose}
              className="absolute top-8 right-8 text-on-surface-variant hover:text-on-surface p-2 hover:bg-outline/5 rounded-full transition-all"
              aria-label="Close Modal"
            >
              <X size={24} />
            </button>

            <div className="mb-8">
              <h3 id="note-modal-title" className="serif-italic text-3xl mb-4">
                {editingNote ? 'Edit Entry' : 'New Entry'}
              </h3>

              <div className="flex flex-col gap-4">
                <div
                  className="flex items-center gap-4"
                  role="group"
                  aria-label="Entry Type"
                >
                  {(['editorial', 'reflection', 'memo'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setNoteType(type)}
                      style={noteType === type ? { backgroundColor: themeColor } : {}}
                      className={cn(
                        'text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded transition-colors',
                        noteType === type
                          ? 'text-surface'
                          : 'bg-outline/5 text-on-surface-variant'
                      )}
                      aria-pressed={noteType === type}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
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
                        <>
                          {format(parseISO(editingNote.date), 'MMMM dd')}
                          {editingNote.endDate &&
                            ` — ${format(
                              parseISO(editingNote.endDate),
                              'MMMM dd, yyyy'
                            )}`}
                          {!editingNote.endDate &&
                            `, ${format(parseISO(editingNote.date), 'yyyy')}`}
                        </>
                      ) : (
                        <>
                          {range.start
                            ? format(range.start, 'MMMM dd')
                            : format(startOfToday(), 'MMMM dd')}
                          {range.end && ` — ${format(range.end, 'MMMM dd, yyyy')}`}
                          {!range.end &&
                            `, ${format(range.start || startOfToday(), 'yyyy')}`}
                        </>
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
                              date: newRange.start
                                ? newRange.start.toISOString()
                                : editingNote.date,
                              endDate: newRange.end
                                ? newRange.end.toISOString()
                                : undefined,
                            });
                          }
                        }}
                        themeColor={themeColor}
                      />
                    </div>
                  )}
                  <div
                    className="flex items-center gap-2"
                    role="group"
                    aria-label="Recurrence Options"
                  >
                    {(['weekly', 'monthly'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setRecurrence(recurrence === type ? 'none' : type)
                        }
                        style={recurrence === type ? { backgroundColor: themeColor } : {}}
                        className={cn(
                          'flex items-center gap-1 text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded transition-colors',
                          recurrence === type
                            ? 'text-surface'
                            : 'bg-outline/5 text-on-surface-variant'
                        )}
                        aria-pressed={recurrence === type}
                      >
                        <Repeat size={10} /> {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
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
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Custom Label
                </span>
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
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Reminder
                </span>
              </div>
              <div className="flex gap-2" role="group" aria-label="Reminder Time">
                {[15, 30, 60, 1440].map((mins) => (
                  <button
                    key={mins}
                    onClick={() =>
                      setReminderTime(reminderTime === mins ? null : mins)
                    }
                    style={reminderTime === mins ? { backgroundColor: themeColor } : {}}
                    className={cn(
                      'text-[8px] uppercase tracking-widest font-bold px-3 py-2 rounded-xl border border-black/[0.03] transition-all',
                      reminderTime === mins
                        ? 'text-white'
                        : 'bg-white text-on-surface-variant hover:bg-outline/5'
                    )}
                    aria-pressed={reminderTime === mins}
                  >
                    {mins < 60 ? `${mins}m` : mins === 1440 ? '1d' : `${mins / 60}h`}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-50">
                  {editingNote
                    ? editingNote.endDate
                      ? 'Range Entry'
                      : 'Single Day Entry'
                    : range.end
                    ? 'Range Entry'
                    : 'Single Day Entry'}
                </span>
                {editingNote && (
                  <button
                    onClick={() => onDeleteNote(editingNote)}
                    className="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:underline"
                    aria-label="Delete Entry"
                  >
                    Delete
                  </button>
                )}
              </div>
              <button
                onClick={onSave}
                disabled={!newNoteContent.trim()}
                style={{
                  backgroundColor: themeColor,
                  boxShadow: `0 10px 20px -5px ${themeColor}40`,
                }}
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
  );
}
