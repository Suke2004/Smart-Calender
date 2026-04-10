import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Note } from '../../../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  setQuery: (query: string) => void;
  notes: Note[];
  onResultClick: (date: Date) => void;
}

export function SearchOverlay({
  isOpen,
  onClose,
  query,
  setQuery,
  notes,
  onResultClick,
}: SearchOverlayProps) {
  const filteredNotes = notes.filter((n) =>
    n.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-surface/95 backdrop-blur-xl p-6 sm:p-20"
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="serif-italic text-4xl">Search Archive</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-outline/5 rounded-full transition-all"
                aria-label="Close search"
              >
                <X size={32} />
              </button>
            </div>
            <div className="relative mb-12">
              <Search
                size={24}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40"
              />
              <input
                autoFocus
                type="text"
                placeholder="Search across all months..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white border border-black/[0.05] rounded-[2rem] py-6 pl-16 pr-8 text-2xl serif-italic focus:ring-0 focus:border-black/10 transition-all shadow-xl"
              />
            </div>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
              {filteredNotes.map((note, idx) => (
                <motion.div
                  key={`search-${note.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onResultClick(parseISO(note.date))}
                  className="p-6 bg-white rounded-3xl border border-black/[0.02] hover:shadow-lg transition-all cursor-pointer group"
                  role="button"
                  aria-label={`View note from ${format(
                    parseISO(note.date),
                    'MMMM dd, yyyy'
                  )}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">
                      {format(parseISO(note.date), 'MMMM dd, yyyy')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-outline/5">
                        {note.type}
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0"
                      />
                    </div>
                  </div>
                  <p className="text-xl serif-italic group-hover:text-primary transition-colors">
                    "{note.content}"
                  </p>
                </motion.div>
              ))}
              {query && filteredNotes.length === 0 && (
                <p className="text-center text-on-surface-variant opacity-50 serif-italic text-xl">
                  No matches found for "{query}"
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
