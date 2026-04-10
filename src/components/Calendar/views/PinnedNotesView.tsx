import React from 'react';
import { motion } from 'motion/react';
import { format, parseISO } from 'date-fns';
import { Star } from 'lucide-react';
import { Note } from '../../../types';

interface PinnedNotesViewProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onTogglePin: (id: string) => void;
  themeColor: string;
}

export function PinnedNotesView({
  notes,
  onEdit,
  onTogglePin,
  themeColor,
}: PinnedNotesViewProps) {
  const pinnedNotes = notes.filter((n) => n.isPinned);

  return (
    <div className="py-12 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h3 className="serif-italic text-5xl mb-2 tracking-tighter">
            Pinned Collection
          </h3>
          <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold opacity-60">
            Your Curated Highlights
          </p>
        </div>
        <div className="p-4 rounded-3xl bg-white shadow-sm border border-black/[0.02]">
          <Star size={24} style={{ color: themeColor, fill: themeColor }} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pinnedNotes.map((note) => (
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
                  <span
                    style={{ backgroundColor: `${themeColor}10`, color: themeColor }}
                    className="text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded-full"
                  >
                    {note.label}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onTogglePin(note.id)}
                  style={{ color: themeColor }}
                  className="text-[10px] uppercase tracking-widest font-bold hover:underline"
                  aria-label={`Unpin note from ${format(
                    parseISO(note.date),
                    'MMMM dd'
                  )}`}
                >
                  Unpin
                </button>
                <button
                  onClick={() => onEdit(note)}
                  style={{ color: themeColor }}
                  className="text-[10px] uppercase tracking-widest font-bold hover:underline"
                  aria-label={`Edit note from ${format(
                    parseISO(note.date),
                    'MMMM dd'
                  )}`}
                >
                  Edit
                </button>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl text-on-surface leading-relaxed serif-italic">
              "{note.content}"
            </p>
          </motion.div>
        ))}
        {pinnedNotes.length === 0 && (
          <div className="text-center py-20 bg-white/40 rounded-[2.5rem] border border-dashed border-outline/20">
            <Star size={48} className="mx-auto mb-4 text-outline/20" />
            <p className="serif-italic text-xl text-on-surface-variant">
              No pinned notes yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
