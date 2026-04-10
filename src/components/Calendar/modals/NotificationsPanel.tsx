import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Notification } from '../../../hooks/useCalendar';

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
        <p className="text-[9px] uppercase tracking-widest font-bold opacity-40">
          {time}
        </p>
      </div>
    </div>
  );
};

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onClearAll: () => void;
}

export function NotificationsPanel({
  isOpen,
  onClose,
  notifications,
  onClearAll,
}: NotificationsPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[140]" onClick={onClose} />
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
              {notifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  icon={notif.icon}
                  text={notif.text}
                  time={notif.time}
                />
              ))}
              {notifications.length === 0 && (
                <p className="text-center py-8 text-[10px] uppercase tracking-widest font-bold opacity-30">
                  No new notifications
                </p>
              )}
            </div>
            <button
              onClick={onClearAll}
              className="w-full mt-6 py-3 text-[9px] uppercase tracking-widest font-bold text-on-surface-variant hover:text-on-surface transition-colors"
              aria-label="Clear all notifications"
            >
              Clear All
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
