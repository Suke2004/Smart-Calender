import React from 'react';
import { format, parseISO } from 'date-fns';
import { GripVertical, Star, Repeat } from 'lucide-react';
import { Reorder } from 'motion/react';
import { Note } from '../../../types';
import { cn } from '../../../utils';

interface NoteCardProps {
  key?: React.Key;
  note: Note;
  themeColor: string;
  onTogglePin: (id: string) => void;
  onEdit: (note: Note) => void;
}

export function NoteCard({ note, themeColor, onTogglePin, onEdit }: NoteCardProps) {
  return (
    <Reorder.Item
      value={note}
      key={note.id}
      className="group relative p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all cursor-default border border-black/[0.02]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 sm:gap-0">
        {/* Meta: date, pin icon, recurrence badge */}
        <div className="flex items-center gap-3">
          <GripVertical
            size={12}
            className="text-outline/20 group-hover:text-outline/60 cursor-grab active:cursor-grabbing transition-colors"
          />
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] text-on-surface-variant font-bold opacity-60">
            {format(parseISO(note.date), 'MMM dd')}
            {note.endDate && ` — ${format(parseISO(note.endDate), 'MMM dd')}`}
          </span>

          {note.isPinned && (
            <Star size={10} style={{ color: themeColor, fill: themeColor }} />
          )}

          {note.recurrence && note.recurrence !== 'none' && (
            <div
              style={{ backgroundColor: `${themeColor}10`, color: themeColor }}
              className="flex items-center gap-1 text-[7px] sm:text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-full font-bold"
            >
              <Repeat size={8} />
              {note.recurrence}
            </div>
          )}
        </div>

        {/* Actions: Pin / Edit */}
        <div className="flex items-center gap-4 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onTogglePin(note.id)}
            className={cn(
              'text-[9px] sm:text-[10px] uppercase tracking-widest font-bold transition-colors',
              note.isPinned ? 'text-on-surface' : 'text-on-surface-variant',
            )}
            style={note.isPinned ? { color: themeColor } : {}}
            aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            {note.isPinned ? 'Unpin' : 'Pin'}
          </button>

          <button
            onClick={() => onEdit(note)}
            style={{ color: themeColor }}
            className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold hover:underline"
            aria-label="Edit note"
          >
            Edit
          </button>
        </div>
      </div>

      <p className="text-lg sm:text-xl text-on-surface leading-relaxed serif-italic">
        "{note.content}"
      </p>
    </Reorder.Item>
  );
}
