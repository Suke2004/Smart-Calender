import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Note } from '../../../types';

interface DeleteModalProps {
  note: Note | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ note, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <AnimatePresence>
      {note && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
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
              Are you sure you want to delete this entry? This action cannot be
              undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={onCancel}
                className="flex-1 py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold bg-outline/5 hover:bg-outline/10 transition-colors"
                aria-label="Cancel deletion"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                aria-label="Confirm deletion"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
