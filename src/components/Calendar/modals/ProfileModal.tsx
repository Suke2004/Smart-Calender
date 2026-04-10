import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus } from 'lucide-react';
import { UserProfile } from '../../../hooks/useCalendar';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  themeColor: string;
}

export function ProfileModal({
  isOpen,
  onClose,
  userProfile,
  setUserProfile,
  themeColor,
}: ProfileModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-surface/20 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white p-10 rounded-[3rem] shadow-2xl border border-white/20"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 text-on-surface-variant hover:text-on-surface p-2 hover:bg-outline/5 rounded-full transition-all"
              aria-label="Close Profile Modal"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-10">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={userProfile.photo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-black/5">
                  <Plus size={16} />
                </div>
              </div>
              <h3 className="serif-italic text-3xl">Curator Profile</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 block">
                  Display Name
                </label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, name: e.target.value })
                  }
                  className="w-full bg-[#f3f4f1] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 transition-all"
                  style={{ ringColor: themeColor } as any}
                  aria-label="Display Name"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 block">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={userProfile.photo}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, photo: e.target.value })
                  }
                  className="w-full bg-[#f3f4f1] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 transition-all"
                  style={{ ringColor: themeColor } as any}
                  aria-label="Photo URL"
                />
              </div>
              <button
                onClick={onClose}
                style={{ backgroundColor: themeColor }}
                className="w-full py-5 rounded-2xl text-white text-[11px] uppercase tracking-widest font-bold hover:opacity-90 transition-all active:scale-95 mt-4"
                aria-label="Save Profile Changes"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
