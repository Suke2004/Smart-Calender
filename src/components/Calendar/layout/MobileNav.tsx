import React from 'react';
import { Calendar as CalendarIcon, Archive, Pin as PinIcon } from 'lucide-react';
import { cn } from '../../../utils';
import { ViewMode, UserProfile } from '../../../hooks/useCalendar';

// ─── MobileNavItem ────────────────────────────────────────────────────────────

interface MobileNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  themeColor: string;
  onClick?: () => void;
}

function MobileNavItem({ icon, label, active = false, themeColor, onClick }: MobileNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 p-2 rounded-2xl transition-all',
        !active && 'text-on-surface-variant'
      )}
      style={active ? { color: themeColor, backgroundColor: `${themeColor}10` } : {}}
      aria-current={active ? 'page' : undefined}
      aria-label={label}
    >
      {icon}
      <span className="text-[8px] uppercase tracking-[0.2em] font-bold">{label}</span>
    </button>
  );
}

// ─── MobileNav ────────────────────────────────────────────────────────────────

interface MobileNavProps {
  viewMode: ViewMode;
  themeColor: string;
  userProfile: UserProfile;
  onViewChange: (mode: ViewMode) => void;
  onOpenProfile: () => void;
}

export function MobileNav({ viewMode, themeColor, userProfile, onViewChange, onOpenProfile }: MobileNavProps) {
  return (
    <nav
      className="lg:hidden fixed bottom-6 left-6 right-6 bg-surface/80 backdrop-blur-2xl border border-white/20 flex justify-around items-center py-4 rounded-[2rem] z-50 shadow-2xl shadow-black/10"
      aria-label="Mobile Navigation"
    >
      <MobileNavItem
        icon={<CalendarIcon size={20} />}
        label="Month"
        active={viewMode === 'monthly'}
        themeColor={themeColor}
        onClick={() => onViewChange('monthly')}
      />
      <MobileNavItem
        icon={<Archive size={20} />}
        label="Archive"
        active={viewMode === 'yearly'}
        themeColor={themeColor}
        onClick={() => onViewChange('yearly')}
      />
      <MobileNavItem
        icon={<PinIcon size={20} />}
        label="Notes"
        active={viewMode === 'pinned'}
        themeColor={themeColor}
        onClick={() => onViewChange('pinned')}
      />
      <div
        onClick={onOpenProfile}
        className="w-8 h-8 bg-outline/20 overflow-hidden rounded-xl border border-outline/10 cursor-pointer"
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
    </nav>
  );
}
