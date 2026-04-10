import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Book, Target } from 'lucide-react';
import { Subject } from '../../../types';
import { cn } from '../../../utils';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingSubject: Subject | null;
  onSave: (subject: Subject) => void;
  themeColor: string;
}

const PRESET_COLORS = ['#5f5e5e', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function SubjectModal({ isOpen, onClose, editingSubject, onSave, themeColor }: SubjectModalProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [targetAttendance, setTargetAttendance] = useState(75);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  useEffect(() => {
    if (editingSubject) {
      setName(editingSubject.name);
      setCode(editingSubject.code);
      setTargetAttendance(editingSubject.targetAttendance);
      setSelectedColor(editingSubject.themeColor);
    } else {
      setName('');
      setCode('');
      setTargetAttendance(75);
      setSelectedColor(PRESET_COLORS[0]);
    }
  }, [editingSubject, isOpen]);

  const handleSave = () => {
    if (!name.trim()) return;
    const subject: Subject = {
      id: editingSubject ? editingSubject.id : Math.random().toString(36).substr(2, 9),
      name,
      code,
      targetAttendance,
      themeColor: selectedColor,
      records: editingSubject ? editingSubject.records : {},
    };
    onSave(subject);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
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
            className="relative w-full max-w-md bg-surface/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white/20"
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 text-on-surface-variant hover:text-on-surface p-2 hover:bg-outline/5 rounded-full transition-all"
            >
              <X size={24} />
            </button>

            <h3 className="serif-italic text-3xl mb-8">
              {editingSubject ? 'Edit Subject' : 'New Subject'}
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Book size={14} style={{ color: themeColor }} />
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Subject Name
                  </span>
                </div>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Advanced Algorithms"
                  className="w-full bg-white border border-black/[0.03] rounded-xl py-3 px-4 text-sm focus:ring-0 focus:border-black/10 transition-all shadow-sm"
                />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2 block">
                  Course Code (Optional)
                </span>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. CS401"
                  className="w-full bg-white border border-black/[0.03] rounded-xl py-3 px-4 text-sm focus:ring-0 focus:border-black/10 transition-all shadow-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target size={14} style={{ color: themeColor }} />
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      Target Attendance
                    </span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: themeColor }}>
                    {targetAttendance}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={targetAttendance}
                  onChange={(e) => setTargetAttendance(Number(e.target.value))}
                  className="w-full accent-primary"
                  style={{ accentColor: themeColor } as any}
                />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2 block">
                  Theme Color
                </span>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'w-8 h-8 rounded-full transition-transform',
                        selectedColor === color ? 'scale-110 ring-2 ring-offset-2 ring-black/20' : 'hover:scale-105'
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                style={{ backgroundColor: themeColor, boxShadow: `0 10px 20px -5px ${themeColor}40` }}
                className="w-full text-surface py-4 rounded-2xl text-[11px] uppercase tracking-widest font-bold hover:opacity-90 transition-all disabled:opacity-30 active:scale-95"
              >
                {editingSubject ? 'Save Changes' : 'Add Subject'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
