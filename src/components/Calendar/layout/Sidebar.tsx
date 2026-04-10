import React from 'react';
import { Calendar as CalendarIcon, Archive, Pin as PinIcon, BookOpen } from 'lucide-react';
import { cn } from '../../../utils';
import { ViewMode } from '../../../hooks/useCalendar';

// ─── SidebarItem ─────────────────────────────────────────────────────────────

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, active = false, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300',
        active
          ? 'bg-white text-on-surface font-bold shadow-md shadow-black/5'
          : 'text-on-surface-variant hover:bg-white/50'
      )}
      aria-current={active ? 'page' : undefined}
      aria-label={label}
      role="menuitem"
    >
      {icon}
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{label}</span>
    </button>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

interface SidebarProps {
  viewMode: ViewMode;
  themeColor: string;
  onViewChange: (mode: ViewMode) => void;
  onAddEntry: () => void;
}

export function Sidebar({ viewMode, themeColor, onViewChange, onAddEntry }: SidebarProps) {
  return (
    <aside
      className="hidden lg:flex flex-col w-72 bg-[#f3f4f1] border-r border-outline/10 p-10 sticky top-0 h-screen"
      role="navigation"
      aria-label="Main Sidebar"
    >
      <div className="mb-12">
        <h1 className="serif-italic text-4xl text-on-surface mb-2 tracking-tighter">The Curator</h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold opacity-60">
          Editorial Intelligence
        </p>
      </div>

      <nav className="flex-1 space-y-3" role="menubar">
        <SidebarItem
          icon={<CalendarIcon size={18} />}
          label="Monthly View"
          active={viewMode === 'monthly'}
          onClick={() => onViewChange('monthly')}
        />
        <SidebarItem
          icon={<Archive size={18} />}
          label="Yearly Archive"
          active={viewMode === 'yearly'}
          onClick={() => onViewChange('yearly')}
        />
        <SidebarItem
          icon={<PinIcon size={18} />}
          label="Pinned Notes"
          active={viewMode === 'pinned'}
          onClick={() => onViewChange('pinned')}
        />
        <SidebarItem
          icon={<BookOpen size={18} />}
          label="Academic Ledger"
          active={viewMode === 'academy'}
          onClick={() => onViewChange('academy')}
        />
      </nav>

      <div className="mt-auto">
        <button
          onClick={onAddEntry}
          style={{ backgroundColor: themeColor, boxShadow: `0 10px 25px -5px ${themeColor}40` }}
          className="w-full text-surface py-5 rounded-2xl text-[11px] uppercase tracking-widest font-bold hover:opacity-90 transition-all active:scale-95"
          aria-label="Add New Entry"
        >
          Add Entry
        </button>
      </div>
    </aside>
  );
}
