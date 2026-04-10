import React from 'react';
import { Search, Plus, MessageSquare } from 'lucide-react';
import { Reorder } from 'motion/react';
import { Note } from '../../../types';
import { NoteCard } from './NoteCard';
import { FilterType } from '../../../hooks/useCalendar';

interface NotesListProps {
  monthName: string;
  notes: Note[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  onAddNote: () => void;
  onReorder: (notes: Note[]) => void;
  onTogglePin: (id: string) => void;
  onEditNote: (note: Note) => void;
  themeColor: string;
}

export function NotesList({
  monthName,
  notes,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  onAddNote,
  onReorder,
  onTogglePin,
  onEditNote,
  themeColor,
}: NotesListProps) {
  const editorialCount = notes.filter((n) => n.type === 'editorial').length;
  const reflectionCount = notes.filter((n) => n.type === 'reflection').length;

  return (
    <footer className="mt-12 sm:mt-20 flex flex-col lg:flex-row justify-between items-start gap-8 sm:gap-12 border-t border-outline/10 pt-8 sm:pt-12">
      <div className="max-w-xl w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <h4 className="serif-italic text-2xl sm:text-3xl whitespace-nowrap">{monthName} Notes</h4>
          <div className="flex flex-1 items-center gap-4 max-w-md">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40"
              />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-black/[0.03] rounded-xl py-2 pl-9 pr-4 text-[11px] focus:ring-0 focus:border-black/10 transition-all shadow-sm"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className="bg-white border border-black/[0.03] rounded-xl py-2 px-4 text-[11px] focus:ring-0 focus:border-black/10 transition-all shadow-sm appearance-none cursor-pointer pr-8"
            >
              <option value="all">All Types</option>
              <option value="editorial">Editorial</option>
              <option value="reflection">Reflection</option>
              <option value="memo">Memo</option>
            </select>
          </div>
          <button
            onClick={onAddNote}
            style={{ color: themeColor }}
            className="hover:text-on-surface transition-colors p-2 sm:p-3 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-black/[0.03] hover:shadow-md"
            aria-label="Add new note"
          >
            <Plus size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <Reorder.Group
          axis="y"
          values={notes}
          onReorder={onReorder}
          className="space-y-4 sm:space-y-6"
        >
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              themeColor={themeColor}
              onTogglePin={onTogglePin}
              onEdit={onEditNote}
            />
          ))}
          {notes.length === 0 && (
            <p className="text-sm text-on-surface-variant italic opacity-50">
              No notes for this month.
            </p>
          )}
        </Reorder.Group>
      </div>

      <div className="flex flex-col gap-8 sm:gap-12 lg:w-80 w-full">
        <div className="bg-white/60 backdrop-blur-xl p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl shadow-black/5 border border-white/40">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2 rounded-xl"
              style={{ backgroundColor: `${themeColor}10` }}
            >
              <MessageSquare size={16} style={{ color: themeColor }} />
            </div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold opacity-60">
              Monthly Memo
            </span>
          </div>
          <p className="text-base sm:text-lg text-on-surface leading-relaxed serif-italic">
            The transition from winter to spring is a delicate curation of light
            and texture. Focus on the subtle shifts in the landscape.
          </p>
        </div>

        <div className="flex gap-8 sm:gap-12 justify-center lg:justify-end">
          <div className="text-right">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1 sm:mb-2 opacity-50">
              Events
            </span>
            <span className="serif-italic text-4xl sm:text-6xl tracking-tighter">
              {editorialCount.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1 sm:mb-2 opacity-50">
              Reflections
            </span>
            <span className="serif-italic text-4xl sm:text-6xl tracking-tighter">
              {reflectionCount.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
