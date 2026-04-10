import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar as CalendarIcon, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../utils';

export function GlobalDock() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] pointer-events-none">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="pointer-events-auto bg-surface/80 backdrop-blur-3xl border border-white/20 p-2 rounded-[2rem] shadow-2xl flex gap-2 items-center"
      >
        <DockItem to="/calendar" label="The Curator" icon={<CalendarIcon size={20} />} activeColor="#5f5e5e" />
        <div className="w-[1px] h-8 bg-black/10 mx-1" />
        <DockItem to="/academy" label="The Academy" icon={<BookOpen size={20} />} activeColor="#ec4899" />
      </motion.div>
    </div>
  );
}

function DockItem({ to, label, icon, activeColor }: { to: string, label: string, icon: React.ReactNode, activeColor: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "relative flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300 group",
        isActive ? "bg-white shadow-sm" : "hover:bg-white/50 text-on-surface-variant hover:text-on-surface"
      )}
    >
      {({ isActive }) => (
        <>
          <div style={{ color: isActive ? activeColor : undefined }} className="transition-colors">
            {icon}
          </div>
          <span 
            className={cn(
              "text-[10px] uppercase font-bold tracking-[0.2em] transition-all",
              isActive ? "text-on-surface" : ""
            )}
          >
            {label}
          </span>
          {isActive && (
            <motion.div 
              layoutId="dock-indicator"
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: activeColor }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}
